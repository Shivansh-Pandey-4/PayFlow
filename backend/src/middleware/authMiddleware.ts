import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { MyJwtPayload } from "../types/jwt.js";


function authMiddleware(req: Request, res: Response, next: NextFunction){
     const token = req.cookies?.token;
     if(!token || !token.trim()){
        return res.status(400).json({
            success : false,
            msg : "token not found"
        })
     }

     try {
        if(!process.env.JWT_SECRET){
            throw new Error("jwt string not found");
        }        

        const decode = jwt.verify(token, process.env.JWT_SECRET) as MyJwtPayload;

        if(!decode.id || typeof decode.firstName!== "string" || !decode.firstName.trim()){
            return res.status(400).json({
                success : false,
                msg : "invalid token provided"
            })
        }

        req.userInfo = {
            id : decode.id,
            firstName : decode.firstName
        }

        return next();

     } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return res.status(400).json({
                success : false,
                msg : "token is expired",
                error : error.message
            })
        }        

        if(error instanceof jwt.JsonWebTokenError){
            return res.status(400).json({
                success : false,
                msg : "token is invalid",
                error : error.message
            })
        }

        return res.status(500).json({
            success : false,
            msg : "failed to authenticate",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })

     }
}


export default authMiddleware;