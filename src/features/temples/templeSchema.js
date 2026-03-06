import { z } from "zod";

export const templeSchema = z.object({
    name: z.string().min(3, "Temple name required"),
    deity: z.string().min(1, "Deity required"),
    district: z.string().min(1, "District required"),
    description: z.string().optional(),
    history: z.string().optional()
});