import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3,
        maxLength : 100,
        trim : true
    },
    lastName : {
        type : String,
        maxLength : 100,
        trim : true
    },
    email : {
        type : String,
        required : true,
        lowercase : true,
        unique : true,
        trim : true,
    },
    password : {
        type : String,
        required : true,
        minLength : 6,
        trim : true
    }
}, {timestamps : true});


const UserModel = mongoose.model("User", userSchema);

export default UserModel;