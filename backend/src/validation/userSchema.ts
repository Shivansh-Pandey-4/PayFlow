import zod from "zod";
import { signupSchema } from "./authSchema.js";


export const updateProfileSchema = signupSchema.pick({firstName : true, lastName : true}).partial();

