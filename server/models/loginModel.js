



import mongoose from 'mongoose'


//validation in a schema to prevent invalid data being saved to the database.
const loginSchema = new mongoose.Schema({
        password: {
            type:String,
            required: true,
            minlength: 8,
            validate: {
                validator: function(response) {
                    return /[!@#$%^&*(),.?":{}|<>]/.test(response);
                },
                message: "Password must contain at least one special character."
            }
        },

        email: {
            type:String,
            required: true,
            validate: {
                validator: function (response) {
                    return /\S+@\S+\.\S+/.test(response);                
                },
                message: "Please enter a valid email address."
            }
        }
})





const LoginUser = mongoose.model('login', loginSchema, 'login')
export default LoginUser