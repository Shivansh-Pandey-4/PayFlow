import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import AccountModel from "../model/AccountModel.js";
import mongoose from "mongoose";
import { addAmountSchema } from "../validation/accountSchema.js";
import zod from "zod";


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


router.post("/create", authMiddleware, async(req: Request, res: Response)=>{
     try {
        
        const accountExist = await AccountModel.findOne({userId : `${req.userInfo?.id}`});

        if(accountExist){
            return res.json({
                success : true,
                msg : "user already have an account",
                account : accountExist
            })
        }

        const newAccount = await AccountModel.create({userId : `${req.userInfo?.id}`});

        return res.json({
            success : true,
            msg : "account created successfully",
            account : newAccount
        })

     } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to create a account",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
     }
})


router.patch("/addMoney/:accountId", authMiddleware, async(req: Request<{accountId ?: string;}, {}, zod.infer<typeof addAmountSchema>>, res: Response)=>{

    const accountId = req.params.accountId;
    const result = addAmountSchema.safeParse(req.body);

    if(!accountId || !accountId.trim()){
        return res.status(400).json({
            success : false,
            msg : "accountId not provided"
        })
    }

    if(!mongoose.isValidObjectId(accountId)){
        return res.status(400).json({
            success : false,
            msg : "invalid accountId provided"
        })
    }

    if(!result.success){
        return res.status(400).json({
            success : false,
            msg : "invalid credentials provided",
            error : `err: ${result.error.issues[0]?.message}, path: ${result.error.issues[0]?.path.toString()} `
        })
    }

    try {
        const accountExist = await AccountModel.findById(accountId);
        const amount = result.data.amount;

        if(!accountExist){
            return res.status(400).json({
                success : false,
                msg : "account not found"
            })
        }

        const updatedAccount = await AccountModel.findOneAndUpdate({_id : accountExist._id}, {$inc : {amount: amount}}, {returnDocument : "after", runValidators: true});

        if(!updatedAccount){
            return res.status(400).json({
                success : false,
                msg : "failed to add money"
            })
        }

        return res.json({
            success : true,
            msg : "money added successfully",
            account : updatedAccount
        })

    } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to add money",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
    }

})


export default router;