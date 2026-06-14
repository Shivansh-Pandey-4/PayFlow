import zod from "zod";

export const addAmountSchema = zod.object({
    amount : zod.number().min(0, "amount should be greater than 0")
})

export const transferSchema = zod.object({
    amount : zod.number().min(0, "amount should be greater than 0"),
    toUserId : zod.string().trim().min(1, "receiver Id not provided").max(100, "receiver Id can be 100 characters long")
})

export const initialAccountSchema = addAmountSchema.pick({amount : true}).partial();