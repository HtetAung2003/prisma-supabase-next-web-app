'use server';

import db from '@/lib/db';
import { ProductStatus } from '@/lib/generated/prisma/client';

type SpecificationInput = {
  key: string;
  value: string;
};

type VariantImageInput = {
  url: string;
};

type VariantInput = {
  color?: string;

  price: number;

  stockQty: number;

  isPreorder?: boolean;

  status?: ProductStatus;

  specifications?: SpecificationInput[];

  images?: VariantImageInput[];
};

type CreateProductInput = {
  name: string;

  description?: string;

  categoryId: number;

  brandId: number;

  variants: VariantInput[];
};

export const createProduct = async ({
  name,
  description,
  categoryId,
  brandId,
  variants,
}: CreateProductInput) => {
  if (!name.trim()) {
    throw new Error('Product name is required');
  }

  if (!categoryId) {
    throw new Error('Category is required');
  }

  if (!brandId) {
    throw new Error('Brand is required');
  }

  if (!variants.length) {
    throw new Error('At least one variant is required');
  }

  await db.product.create({
    data: {
      name: name.trim(),

      description,

      categoryId,

      brandId,

      variants: {
        create: variants.map((variant) => ({
          color: variant.color,

          price: variant.price,

          stockQty: variant.stockQty,

          isPreorder: variant.isPreorder ?? false,

          status: variant.status ?? ProductStatus.IN_STOCK,

          specifications: variant.specifications?.length
            ? {
                create: variant.specifications.map((spec) => ({
                  key: spec.key,
                  value: spec.value,
                })),
              }
            : undefined,

          images: variant.images?.length
            ? {
                create: variant.images.map((image) => ({
                  url: image.url,
                })),
              }
            : undefined,
        })),
      },
    },
  });
};