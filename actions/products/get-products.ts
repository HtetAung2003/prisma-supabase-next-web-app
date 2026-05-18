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
        
       return JSON.parse(JSON.stringify(data));

    } catch (error) {
        console.error("Database Error:", error);
        throw new Error("Failed to fetch product");
    }
}
export const getProductById = async (id : number) => {
  try {
    const data = await db.product.findUnique({
      where: {
        id: id,
      },
      include: {
        variants: {
          include: {
            specifications: true,
            images: true,
          },
        },
        brand: true,
        category: true,
      },
    });

    return data;
    
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product");
  }
};
