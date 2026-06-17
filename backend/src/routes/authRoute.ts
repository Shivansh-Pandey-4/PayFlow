import express, { type Request, type Response } from "express";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { signinSchema, signupSchema } from "../validation/authSchema.js";
import UserModel from "../model/UserModel.js";


const router = express.Router();

router.post("/signup", async(req: Request<{}, {}, zod.infer<typeof signupSchema>>, res: Response)=>{
    
    const result = signupSchema.safeParse(req.body);
    if(!result.success){
        return res.status(401).json({
            success : false,
            msg : "invalid credentials provided",
            error : `err: ${result.error.issues[0]?.message}, path: ${result.error.issues[0]?.path.toString()}`
        })
    }

    try {
        const {email, password, firstName, lastName} = result.data;
        const userExist = await UserModel.findOne({email});

        if(userExist){
            return res.status(400).json({
                success : false,
                msg : "email already taken"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            firstName : firstName,
            lastName : lastName ? lastName : null,
            email : email,
            password : hashPassword
        });

        return res.json({
            success : true,
            msg : "user signed up successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to sign up",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
    }

});



router.post("/signin", async(req: Request<{}, {}, zod.infer<typeof signinSchema>>, res: Response ) => {

    const result = signinSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            success : false,
            msg : "invalid credentials provided",
            error : `err: ${result.error.issues[0]?.message}, path: ${result.error.issues[0]?.path.toString()}`
        })
    }

    try {
        const {email, password} = result.data;
        const userExist = await UserModel.findOne({email});

        if(!userExist){
            return res.status(400).json({
                success : false,
                msg : "invalid email or password"
            })
        }

        const verifyPassword = await bcrypt.compare(password, userExist.password);

        if(!verifyPassword){
            return res.status(400).json({
                success : false,
                msg : "invalid email or password"
            })
        }

        if(!process.env.JWT_SECRET){
            throw new Error("jwt string not found");
        }

        const token = jwt.sign({id : userExist._id, firstName: userExist.firstName}, process.env.JWT_SECRET, {expiresIn : "1hr"});

        res.cookie("token", token, {httpOnly : true});

        return res.json({
            success : true,
            msg : "user signed in successfully"
        });

    } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to signin",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
    }
});


router.post("/logout", (req: Request, res: Response)=>{
    res.clearCookie("token");

    return res.json({
        success : true,
        msg : "user logged out successfully"
    })

})


export default router;