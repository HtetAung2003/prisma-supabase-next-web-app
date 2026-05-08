'use server';

import db from "@/lib/db";

export const create = async ( name : string ) => {
    if (!name) {
        throw new Error("Model name is required");
    }
    await db.model.create({
        data : {
            name
        },
    })
};