import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import AccountModel from "../model/AccountModel.js";


const router = Router();

router.get("/balance", authMiddleware, async(req : Request, res: Response)=>{
     try {
        const accountExist  = await AccountModel.findOne({userId : `${req.userInfo?.id}`}).populate("userId", "-password -updatedAt")

        if(!accountExist){
            return res.status(400).json({
                success : false,
                msg : "account not present, create a account",
                account : null
            })
        }

        return res.json({
            success : true,
            msg : "account found successfully",
            account : accountExist,
        })
     } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to get account",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
     }
})


export default router;