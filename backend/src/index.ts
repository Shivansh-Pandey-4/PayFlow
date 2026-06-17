import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import accountRoute from  "./routes/accountRoute.js";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 4000;

connectDb().then(()=>{

    app.listen(PORT, ()=>{
        console.log(`app started listening on ${PORT}`);
    })

}).catch((err)=>{
    console.log("failed to connect db " + err);
    process.exit(1);
})

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/account", accountRoute);

app.get("/", (req, res)=>{
    return res.json({
        success : true,
        msg : "home route"
    })
})



