import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import AccountModel from "../model/AccountModel.js";
import mongoose, { startSession } from "mongoose";
import { addAmountSchema, initialAccountSchema, transferSchema } from "../validation/accountSchema.js";
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


router.post("/create", authMiddleware, async(req: Request<{}, {}, zod.infer<typeof initialAccountSchema>>, res: Response)=>{

    const result = initialAccountSchema.safeParse(req.body);

     try {
        
        const accountExist = await AccountModel.findOne({userId : `${req.userInfo?.id}`});

        if(accountExist){
            return res.json({
                success : true,
                msg : "user already have an account",
                account : accountExist
            })
        }

        const newAccount = await AccountModel.create({userId : `${req.userInfo?.id}`, amount : result.data?.amount || 0});

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


router.patch("/transfer", authMiddleware, async(req: Request<{}, {}, zod.infer<typeof transferSchema>>, res: Response)=>{

    const result = transferSchema.safeParse(req.body);

    if(!result.success){
         return res.status(400).json({
            success : false,
            msg : "invalid credentials provided",
            error : `err: ${result.error.issues[0]?.message}, path: ${result.error.issues[0]?.path.toString()} `
         })
    }

    const session = await AccountModel.startSession();

    try {

        session.startTransaction();
        const {amount, toUserId} = result.data;

        const senderAccountExist = await AccountModel.findOne({userId : `${req.userInfo?.id}`}).session(session);

        if(!senderAccountExist){
            throw new Error("sender account not found");
        }

        if(senderAccountExist.amount < amount){
             throw new Error("insufficient balance");
        }

        const receiverAccountExist = await AccountModel.findOne({userId : toUserId}).session(session);

        if(!receiverAccountExist){
            throw new Error("receiver account not found");
        }

        const updateSenderAccount = await AccountModel.updateOne({userId : senderAccountExist._id}, {$inc : { amount : -amount}}, {session});

        const updateReceiverAccount = await AccountModel.updateOne({userId : receiverAccountExist._id}, {$inc : {amount : amount}}, {session: session});

        await session.commitTransaction();

        return res.json({
            success : true,
            msg : "money transferred successfully"
        })
        
    } catch (error) {
        await session.abortTransaction();
        return res.status(400).json({
            success : false,
            msg : "transaction failed",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
    } finally{
        await session.endSession();
    }

})

export default router;