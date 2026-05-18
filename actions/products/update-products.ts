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
  fileKey?: string; // if new , use this
  url?: string;     // if old , use
  isNew: boolean;   // to check new / old
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

type EditProductInput = {
    id : number,
  name: string;

  description?: string;

  categoryId: number;

  brandId: number;

  variants: VariantInput[];
};

const UpdateProductImage = async (file: File, oldImageUrl?: string) => {
 try {
    // ၁။ တကယ်လို့ ပုံဟောင်း URL ရှိခဲ့ရင် Storage ထဲကနေ အရင်ဖျက်မယ်
    if (oldImageUrl) {
      // URL ထဲကနေ ဖိုင်လမ်းကြောင်း (File Path) ကိုပဲ ဖြတ်ယူတာပါ
      // ဥပမာ - "https://.../storage/v1/object/public/products/variant-1.jpg" -> "variant-1.jpg"
      const oldFilePath = oldImageUrl.split('/products/')[1]; 
      
      if (oldFilePath) {
        await supabase.storage
          .from('products') // သင့်ရဲ့ Bucket နာမည်
          .remove([oldFilePath]);
      }
    }

    // ၂။ ပုံအသစ်ကို နာမည်အသစ် (Unique Name) နဲ့ ဆောက်ပြီး တင်မယ်
    const fileExtension = file.name.split('.').pop();
    const newFilePath = `variant-${Date.now()}.${fileExtension}`; // ဖိုင်နာမည် တူမနေအောင် Date.now() သုံးတာပါ

    const { data, error } = await supabase.storage
      .from('products')
      .upload(newFilePath, file, {
        cacheControl: '3600',
        upsert: false // အသစ်တင်မှာမို့လို့ false ထားပါတယ်
      });

    if (error) throw error;

    // ၃။ ပုံအသစ်ရဲ့ Public URL ကို ယူပြီး Database မှာ သွားသိမ်းဖို့ ပြန်ပေးလိုက်မယ်
    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(newFilePath);

    return publicUrlData.publicUrl; // ဒီ URL ကို Database ထဲ ထည့်သိမ်းရပါမယ်

  } catch (error) {
    console.error('Supabase upload error:', error);
    throw error;
  }
};

export const EditProduct = async (formData: FormData) => {
  const rawPayload = formData.get('payload');

  if (typeof rawPayload !== 'string') {
    throw new Error('Product payload is required');
  }

  const {
    id,
    name,
    description,
    categoryId,
    brandId,
    variants,
  } = JSON.parse(rawPayload) as EditProductInput;
 if (!id) {
    throw new Error('ID is required');
  }
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
          
          // က) တကယ်လို့ ပုံအသစ်ဖြစ်ရင် (isNew: true)
          if (image.isNew && image.fileKey) {
            const file = formData.get(image.fileKey);

            if (!(file instanceof File) || file.size === 0) {
              throw new Error('Variant image file is missing');
            }

            // တကယ်လို့ ပုံအဟောင်း URL ကို သိရင် ဖျက်ဖို့အတွက် လှမ်းပါးရမယ် (ဒီနေရာမှာ image.url ကို ပေးရပါမယ်)
            const imageUrl = await UpdateProductImage(file, image.url);
            return { imageUrl };
          }

          // ခ) ပုံအဟောင်းအတိုင်း ဆက်သုံးရင် (isNew: false)
          return { imageUrl: image.url ?? '' };
        })
      );

      return {
        ...variant,
        images: uploadedImages,
      };
    })
  );

  await db.product.update({
     where: { id },
    data: {
      name: name.trim(),

      description,

      categoryId,

      brandId,

      variants: {
        deleteMany: {},
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
