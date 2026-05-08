'use server'

import { db } from "@/lib/db";

export const update = async ({id,name} : {id:number; name:string}) => {
    // Simulate a delay for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Update the model in the database
    await db.model.update({
        where: { id },
        data: { name },
    });
}