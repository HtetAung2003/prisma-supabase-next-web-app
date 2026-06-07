'use server'

import { db } from "@/lib/db";

export const getProduct = async (
    page: number = 1,
    limit: number = 5,
    sortBy: string = "createdAt",
    sortOrder: "asc" | "desc" = "desc",
    search: string | null = null,
    categoryId : number | null,
    brandId : number | null
) => {
  try {
    const skip = (page - 1) * limit;

    const whereClause = {
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),

      ...(categoryId && {
        categoryId: categoryId,
      }),

      ...(brandId && {
        brandId: brandId,
      }),
    };

    const [products, totalProducts] = await Promise.all([
      db.product.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          brand: true,
          category: true,
          variants: true,
        },
      }),
      db.product.count({
        where: whereClause,
      }),
    ]);

    return {
      data: JSON.parse(JSON.stringify(products)),
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        limit,
      },
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch product");
  }
};
export const getProductById = async (id: number) => {
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
