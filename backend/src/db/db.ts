import mongoose from "mongoose";


async function connectDb(){
        if(!process.env.MONGO_URL){
            throw new Error("db connection string not found");
        }

        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to db successfully");
}

export default connectDb;
