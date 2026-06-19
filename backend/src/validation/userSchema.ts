import zod from "zod";
import { signupSchema } from "./authSchema.js";
import { transferSchema } from "./accountSchema.js";


export const updateProfileSchema = signupSchema.pick({firstName : true, lastName : true}).partial();


export const toUserIdSchema = transferSchema.pick({toUserId : true});