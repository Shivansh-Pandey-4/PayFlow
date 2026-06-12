import express from "express";
import dotenv from "dotenv";
import connectDb from "./db/db.js";
import cookieParser from "cookie-parser";

import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";


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


app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.get("/", (req, res)=>{
    return res.json({
        success : true,
        msg : "home route"
    })
})



