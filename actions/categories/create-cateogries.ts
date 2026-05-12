'use server';

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export const create = async (formData: FormData) => {

    const name = formData.get("name") as string;
    const photo = formData.get("photo") as File | null;

    console.log(name, photo, "server");

    if (!name || name.trim() === "") {
        return { error: "Category name is required" };
    }

    try {

        let imageUrl: string | null = null;

        // if photo exists
        if (photo && photo.size > 0) {

            // unique filename
            const fileName = `${Date.now()}-${photo.name}`;

            // upload to supabase
            const { error } = await supabase.storage
                .from("categories")
                .upload(fileName, photo);

            if (error) {
                return {
                    error: error.message
                };
            }

            // get public url
            const { data } = supabase.storage
                .from("categories")
                .getPublicUrl(fileName);

            imageUrl = data.publicUrl;
        }

        // save database
        await db.categories.create({
            data: {
                name: name.trim(),
                image: imageUrl,
            },
        });

        revalidatePath("/categories");

        return {
            success: "Category created successfully!"
        };

    } catch (error: any) {

        if (error.code === 'P2002') {
            return {
                error: "This category name already exists."
            };
        }

        console.error("DATABASE_CREATE_ERROR:", error);

        return {
            error: "Something went wrong while creating the category."
        };
    }
};