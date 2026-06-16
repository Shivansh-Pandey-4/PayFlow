import zod from "zod";

export const signupSchema = zod.object({
    firstName : zod.string().min(3, "minimum 3 characters are required").max(100, "maximum 100 characters are allowed"),

    lastName : zod.string().max(100, "maximum 100 characters are allowed").optional(),

    email : zod.preprocess(val => typeof val === "string" ? val.trim() : val, zod.email()),

    password : zod.string().min(6, "minimum 6 characters are required").max(100, "maximum 100 characters are allowed")
});


export const signinSchema = signupSchema.pick({email : true, password : true});