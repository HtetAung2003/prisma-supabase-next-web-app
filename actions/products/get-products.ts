'use server'

import { db } from "@/lib/db";

export const getProduct = async () => {
    try {
        const data = await db.product.findMany({
            include : {
                brand: true,
                category: true,
                variants: true
            }
        });
        console.log("data", data);
        
        return data;

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch product");
    }
}