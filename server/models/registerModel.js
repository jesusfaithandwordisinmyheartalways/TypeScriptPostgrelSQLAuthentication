



import mongoose from 'mongoose'



const registerSchema = mongoose.Schema({
    username: {
        type:String,
        required: true,
        minlength: 3
    },
    password: {
        type:String,
        required: true,
        minlength: 8,
        validate: {
            validator: function(response) {
                return /[!@#$%^&*(),.?":{}|<>]/.test(response);
            },
            message: 'Password must contain at least one special character & eight characters'
        }
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function(response) {
                return /\S+@\S+\.\S+/.test(response);
            },
             message: "Please enter a valid email address."
        }
    }



})


const RegisterUser = mongoose.model('register', registerSchema, 'register')
export default RegisterUser