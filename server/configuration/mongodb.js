





import mongoose from 'mongoose'


// MongoDB Connection
const MongoDBConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};


export default MongoDBConnection 