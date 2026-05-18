'use server';

import db from "@/lib/db";

export const getbrand = async () => {
    try {
        const data = await db.brand.findMany();
        return data;
    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch brand");
    }
}