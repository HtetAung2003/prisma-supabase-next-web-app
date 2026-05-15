'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import {
  ProductStatus,
  PurchaseStatus,
} from '@/lib/generated/prisma/client';
import { supabase } from '@/lib/supabase';

type SpecificationInput = {
  key: string;
  value: string;
};

type VariantImageInput = {
  fileKey: string;
};

type VariantInput = {
  color?: string;
  sku?: string;
  barcode?: string;
  stockQty: number;
  reservedQty?: number;
  reorderLevel?: number;
  maxStock?: number;
  buyPrice: number;
  sellPrice: number;
  isPreorder?: boolean;
  status?: ProductStatus;
  purchaseStatus?: PurchaseStatus;
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

const uploadVariantImage = async (file: File, fileKey: string) => {
  const fileName = `${Date.now()}-${fileKey}-${file.name}`;

  const { error } = await supabase.storage
    .from('products')
    .upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from('products')
    .getPublicUrl(fileName);

  return data.publicUrl;
};

export const createProduct = async (formData: FormData) => {
  const rawPayload = formData.get('payload');

  if (typeof rawPayload !== 'string') {
    throw new Error('Product payload is required');
  }

  const {
    name,
    description,
    categoryId,
    brandId,
    variants,
  } = JSON.parse(rawPayload) as CreateProductInput;

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

  const variantsWithUploadedImages = await Promise.all(
    variants.map(async (variant) => {
      const uploadedImages = await Promise.all(
        (variant.images ?? []).map(async (image) => {
          const file = formData.get(image.fileKey);

          if (!(file instanceof File) || file.size === 0) {
            throw new Error('Variant image file is missing');
          }

          const imageUrl = await uploadVariantImage(file, image.fileKey);
          return { imageUrl };
        })
      );

      return {
        ...variant,
        images: uploadedImages,
      };
    })
  );

  await db.product.create({
    data: {
      name: name.trim(),

      description,

      categoryId,

      brandId,

      variants: {
        create: variantsWithUploadedImages.map((variant) => ({
          color: variant.color,
          sku: variant.sku,
          barcode: variant.barcode,
          stockQty: variant.stockQty,
          reservedQty: variant.reservedQty ,
          reorderLevel: variant.reorderLevel,
          maxStock: variant.maxStock,
          buyPrice: variant.buyPrice,
          sellPrice: variant.sellPrice,
          isPreorder: variant.isPreorder ?? false,
          status: variant.status ?? ProductStatus.IN_STOCK,
          purchaseStatus: variant.purchaseStatus ?? PurchaseStatus.PENDING,

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
                  imageUrl: image.imageUrl,
                })),
              }
            : undefined,
        })),
      },
    },
  });

  revalidatePath('/products');
};
