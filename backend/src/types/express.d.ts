import { Express } from "express";


declare global{
    namespace Express {
        interface Request {
            userInfo ?: {
                id : number;
                firstName : string;
            }
        }
    }
}