// @/app/actions/getCategory.ts (Better to keep actions in a separate file)
'use server'

import { db } from "@/lib/db";

export const getCategory = async () => {
    try {
        const data = await db.categories.findMany();
        console.log("data", data);
        
        return data;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch categories");
    }
}