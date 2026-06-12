import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import zod from "zod";
import { updateProfileSchema } from "../validation/userSchema.js";
import UserModel from "../model/UserModel.js";


const router = Router();


router.get("/bulk", authMiddleware, async(req: Request<{}, {}, {}, {page ?: string; limit ?: string}>, res: Response)=>{

     const page = req.query.page;
     const limit = req.query.limit;

     const parsedPage = Math.max(Number(page) || 1, 1);
     const parsedLimit = Math.min(parseInt(limit || "5"), 5);

     const skip = (parsedPage - 1)*parsedLimit;


     try {

        const allUsers = await UserModel.find({ _id : {$ne : req.userInfo?.id}}).sort({createdAt : -1}).skip(skip).limit(parsedLimit).select("-password");

        const totalDocument = await UserModel.countDocuments({_id : { $ne : req.userInfo?.id} });


        if(allUsers.length ===0){
            return res.json({
                success : true,
                msg : "users list is empty",
                page : parsedPage,
                totalPage : Math.ceil(totalDocument/parsedLimit),
                limit : parsedLimit,
                allUsers
            })
        }

        return res.json({
            success : true,
            msg : "all users found successfully",
            page : parsedPage,
            totalPage : Math.ceil(totalDocument/parsedLimit),
            limit : parsedLimit,
            allUsers
        })

     } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to find users",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })        
     }
})


router.patch("/update", authMiddleware, async(req: Request<{}, {}, zod.infer<typeof updateProfileSchema>>, res: Response)=>{

    const result = updateProfileSchema.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({
            success : false,
            msg : "invalid credentials provided",
            error : result.error.issues[0]
        })
    }

    try {
        const data = result.data;
        const allowedFields = ["firstName", "lastName"] as const;
        const updateFields: Partial<Record<typeof allowedFields[number] , string>> = {};

        if(data.firstName !== undefined) updateFields.firstName = data.firstName;
        if(data.lastName !== undefined) updateFields.lastName = data.lastName;
        

        if(Object.keys(updateFields).length === 0){
            return res.status(400).json({
                success : false,
                msg : "no valid property to update"
            })
        }

        const updatedProfile = await UserModel.findByIdAndUpdate({_id : req.userInfo?.id},   { $set: updateFields }, {returnDocument : "after", runValidators : true});

        if(!updatedProfile){
            return res.status(400).json({
                success: false,
                msg : "failed to update user profile"
            })
        }

        return res.json({
            success : true,
            msg : "user profile updated successfully",
            updatedProfile
        })


    } catch (error) {
        return res.status(500).json({
            success : false,
            msg : "failed to update profile",
            error : error instanceof Error ? error.message : "unknown error occurred"
        })
    }


})


export default router;