'use server';

import db from "@/lib/db"

export const del = async (id:number) => {
    // Simulate a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Delete the model from the database
    await db.model.delete({ where: { id } });
}