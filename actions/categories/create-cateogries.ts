'use server';

import { db } from "@/lib/db"; 
import { revalidatePath } from "next/cache";

export const create = async (formData : FormData) => {
   
    const name = formData.get("name") as string;
    const photo = formData.get("photo") as File | null;
    console.log(name , photo ,"server");
    
    if (!name || name.trim() === "") {
        return { error: "Category name is required" };
    }

    try {
       
        await db.categories.create({
            data: {
                name: name.trim(),
                image: photo ? URL.createObjectURL(photo) : null,
            },
        });

        revalidatePath("/categories"); 

        return { success: "Category created successfully!" };

    } catch (error: any) {

        if (error.code === 'P2002') {
            return { error: "This category name already exists." };
        }

        console.error("DATABASE_CREATE_ERROR:", error);
        return { error: "Something went wrong while creating the category." };
    }
};