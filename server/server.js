

import express from 'express';
import dotenv from 'dotenv';
import pkg from 'pg';  // Fix PostgreSQL import issue
const { Client } = pkg;  // Destructure Client from pg
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import jsonWebToken from 'jsonwebtoken';
import cors from 'cors';
import RegisterUser from './models/registerModel.js';
import LoginUser from './models/loginModel.js';
import MongoDBConnection from './configuration/mongodb.js';
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

// Resolve the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


// File paths
const usersJSON_PATH = path.join(__dirname, 'user.json')
const usersCSV_PATH = path.join(__dirname, 'users.csv')


const saveUserToJson = (user) => {
  let users = []
  if(fs.existsSync(usersJSON_PATH)) {
       const jsonFileData = fs.readFileSync(usersJSON_PATH)
       users = JSON.parse(jsonFileData)
  }
  users.push(user)
  fs.writeFileSync(usersJSON_PATH, JSON.stringify(users, null, 2))
}




const saveFileToCsv = (user) => {
       const userData = `${user.username},${user.email}, ${user.password}\n`;
       if(!fs.existsSync(usersCSV_PATH)){
          fs.writeFileSync(usersCSV_PATH, 'Username,Email,Password\n'); // CSV Header
       }
       fs.appendFile(usersCSV_PATH, userData, (err) => {
        if (err) {
            console.error('Error writing to CSV file:', err);
        } else {
            console.log('User successfully added to CSV file.');
        }
    });
}





// Periodically log the JSON user data every 5 seconds
setInterval(() => {
    try {
        if (!fs.existsSync(usersJSON_PATH)) {
            fs.writeFileSync(usersJSON_PATH, JSON.stringify([])); // Ensure the file exists
        }
        const users = JSON.parse(fs.readFileSync(usersJSON_PATH, 'utf8'));
        console.clear(); // Clears the terminal
        console.log("Updated Users List:", users);
    } catch (error) {
        console.error("Error reading users JSON:", error.message);
    }
}, 5000); 




// View JSON Data
let json_users = [];
if (fs.existsSync(usersJSON_PATH)) {
    json_users = JSON.parse(fs.readFileSync(usersJSON_PATH, 'utf8'));
} else {
    fs.writeFileSync(usersJSON_PATH, JSON.stringify([])); // Create an empty JSON file
}
console.log(json_users);





// View CSV Data
fs.readFile(usersCSV_PATH, 'utf8', (err, data) => {
    if (err) console.error(err);
    console.log(data);
});




dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(helmet());

app.use(cors({ 
    origin: 'http://localhost:3000', 
    credentials: true
 }));




const client = new Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
});
client.connect()
.then(() => console.log('PostgreSQL connected successfully'))
    .catch(err => {
        console.error('PostgreSQL connection error:', err.stack); // Print full error stack
        process.exit(1);
    });


    console.log('PostgreSQL Config:', {
        user: process.env.PG_USER,
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        password: process.env.PG_PASSWORD,
        port: process.env.PG_PORT
    });



MongoDBConnection()






app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        console.log('Received Register Request:', req.body);

        // Check MongoDB if the user already exists
          const ExistMongoUser = await RegisterUser.findOne({ $or: [{ username }, { email }] })
          if(ExistMongoUser) {
            console.log('the user already connected to Mongo DB database')
            return res.status(400).json({ message: 'User already exists in MongoDB.'})
          }
          // Check PostgreSQL if the user already exists
         const existPGU_USER =  await client.query('SELECT * FROM user_table WHERE username = $1 OR email = $2', [username, email])
         if(existPGU_USER.rows.length > 0) {
            console.log('the user already in the PostgreSQL database')
            return res.status(400).json({message: 'User already exists in PostgreSQL.'})
         }
         // Hash the password
        const hashPassword = await bcrypt.hash(password, 10);
            
            // Save user to MongoDB
            console.log('now saving the user database')
           const new_pg_user = new RegisterUser({
            username,
            email,
            password: hashPassword
            })
            await new_pg_user.save()
            console.log('user is now saved to Mongo DB database')


            
            // Save user to PostgreSQL
            console.log('💾 Saving user to PostgreSQL...');
            await client.query(`INSERT INTO user_table (username , email, password) VALUES ($1,  $2, $3)`, [username, email, hashPassword])
            console.log('✅ PostgreSQL: User saved successfully.');

            
            // Save user to JSON and CSV files
            const user = {username , email, password: hashPassword}
            saveUserToJson(user)
            saveFileToCsv(user)
            console.log(`${username}: ${email}, ${password}:\n User stored in JSON and CSV successfully.`)

            res.status(200).json({message: 'User registered successfully.' })
    }catch(error){
        console.error(' Error in /register:', error);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }

});





app.use(cookieParser());
app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        console.log(' Received Login Request:', req.body);
        // Check MongoDB beforehand
       const Mongo_User = await LoginUser.findOne({ $or: [{ username}, { email }] })
       if(Mongo_User && await bcrypt.compare(password, Mongo_User.password)) {
         console.log('✅ MongoDB: Login successful.');
         const token = jsonWebToken.sign({ username: Mongo_User.username}, process.env.JWT_SECRET, { expiresIn:  '30d' })

         res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 
         })
         return res.status(200).json({ message: 'Login successful from MongoDB.' });
       }


       // Check PostgreSQL for user (by username or email)
        console.log('Now Checking PostgreSQL for user...')
        const pgUser =  await client.query(`SELECT * FROM user_table WHERE username = $1 OR email = $2`, [ username, email ])
         if(pgUser.rows.length > 0) {
            console.log('User Located In PostgresSQL Database')
            if(await bcrypt.compare(password, pgUser.rows[0].password)) {
                console.log(' PostgreSQL: Password matched. Logging in...')
                const token = jsonWebToken.sign({ username: pgUser.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '30d' });

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 30 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({ message: 'Login successful from PostgreSQL.' });
            }
         }

         console.log(' Invalid credentials.');
         return res.status(400).json({ message: 'Invalid credentials.' });
     }catch(error) {
        console.error(' Error in /login:', error);
        res.status(500).json({ message: 'Server error.' });
    }

  
});







app.get('/user', (req, res) => {
    const token = req.cookies.token;
    if (!token) 
        return res.status(401).json({ message: 'Unauthorized' });

    const decoded = jsonWebToken.verify(token, process.env.JWT_SECRET);
    res.json({ username: decoded.username });
});











app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
}).on('error', (err) => {
    console.error('Server error:', err);
});