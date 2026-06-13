import zod from "zod";

export const addAmountSchema = zod.object({
    amount : zod.number().min(0, "amount should be greater than 0")
})