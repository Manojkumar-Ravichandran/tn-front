import { z } from "zod";

export const templeSchema = z.object({
    name: z.string().min(3, "Temple name must be at least 3 characters"),
    deity: z.string().min(1, "Please select a deity"),
    district: z.string().min(1, "Please select a district"),
    festivals: z.array(z.string()).optional(),
    description: z.string().min(10, "Description must be at least 10 characters"),
    history: z.string().optional(),
    latitude: z.string().refine((v) => !isNaN(parseFloat(v)), "Must be a valid latitude number"),
    longitude: z.string().refine((v) => !isNaN(parseFloat(v)), "Must be a valid longitude number"),
});