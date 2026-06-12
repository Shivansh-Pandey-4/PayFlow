import { Router, type Request, type Response } from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import zod from "zod";
import { updateProfileSchema } from "../validation/userSchema.js";
import UserModel from "../model/UserModel.js";


const router = Router();


router.get("/bulk", authMiddleware, async(req: Request, res: Response)=>{
     try {

        const allUsers = await UserModel.find({ _id : {$ne : req.userInfo?.id}}).select("-password -createdAt");

        if(allUsers.length ===0){
            return res.json({
                success : true,
                msg : "users list is empty",
                allUsers
            })
        }

        return res.json({
            success : true,
            msg : "all users found successfully",
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