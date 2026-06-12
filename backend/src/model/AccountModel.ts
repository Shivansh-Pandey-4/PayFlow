import mongoose from "mongoose"

const accountSchema = new mongoose.Schema({
    amount : {
        type : Number,
        required : true,
        default : 0,
        min : 0
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        trim : true,
        unique : true,
        ref : "User"
    }
}, {timestamps : true});


const AccountModel = mongoose.model("Account", accountSchema);
export default AccountModel;