'use server'

import db from "@/lib/db"

export const get = async() => {
    return await db.model.findMany();
}