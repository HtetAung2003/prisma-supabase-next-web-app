'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { getbrand } from '@/actions/brands/get-brands';
import { getCategory } from '@/actions/categories/get-categories';
import { createProduct } from '@/actions/products/create-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { EditProduct } from '@/actions/products/update-products';

interface CreateProductFormProps {
  initialState?: any;
}
// set type 
type Brand = { id: number; name: string };
type Category = { id: number; name: string };

type Spec = {
  key: string;
  value: string;
};

type ImagePreview = {
  file: File;
  url: string;
};

type VariantStatus = 'IN_STOCK' | 'PREORDER';
type PurchaseStatus = 'PENDING' | 'PURCHASED';

type Variant = {
  color: string;
  sku: string;
  barcode: string;
  stockQty: number;
  reorderLevel: number;
  maxStock: number;
  reservedQty: number;
  buyPrice: number;
  sellPrice: number;
  status: VariantStatus;
  purchaseStatus: PurchaseStatus;
  specifications: Spec[];
  images: (ImagePreview | null)[];
};

const DEFAULT_IMAGE_SLOTS = [null, null, null, null] as const;

const createEmptyVariant = (): Variant => ({
  color: '',
  sku: '',
  barcode: '',
  stockQty: 1,
  reorderLevel: 0,
  maxStock: 2,
  reservedQty: 0,
  buyPrice: 0,
  sellPrice: 0,
  status: 'IN_STOCK',
  purchaseStatus: 'PENDING',
  specifications: [],
  images: [...DEFAULT_IMAGE_SLOTS],
});

const cloneSpecifications = (specifications: Spec[]) =>
  specifications.map((spec) => ({ ...spec }));

const cloneImages = (images: (ImagePreview | null)[]) =>
  images.map((image) => {
    if (!image) return null;

    return {
      file: image.file,
      url: image.file
        ? URL.createObjectURL(image.file)
        : image.url,
    };
  });

const createCopiedVariant = (variant: Variant): Variant => ({
  ...variant,
  specifications: cloneSpecifications(variant.specifications),
  images: cloneImages(variant.images),
});

const normalizeVariant = (variant: Variant): Variant => {
  const stockQty = Math.max(0, Math.trunc(variant.stockQty || 0));
  const reorderLevel = Math.min(
    Math.max(0, Math.trunc(variant.reorderLevel || 0)),
    Math.max(stockQty - 1, 0)
  );
  const baselineMax = Math.max(stockQty, reorderLevel) + 1;
  const maxStock = Math.max(Math.trunc(variant.maxStock || 0), baselineMax);
  const reservedQty = Math.min(
    Math.max(0, Math.trunc(variant.reservedQty || 0)),
    stockQty
  );

  return {
    ...variant,
    stockQty,
    reorderLevel,
    maxStock,
    reservedQty,
    buyPrice: Math.max(0, variant.buyPrice || 0),
    sellPrice: Math.max(0, variant.sellPrice || 0),
  };
};

const getTotalPrice = (variant: Variant) => variant.maxStock * variant.buyPrice;

const getProfitPrice = (variant: Variant) =>
  variant.sellPrice * variant.maxStock - getTotalPrice(variant);

const CreateProductForm = ({initialState} : CreateProductFormProps) => {
  console.log(initialState,"initial state");
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageTarget, setImageTarget] = useState<{
    variantIndex: number;
    imageIndex: number | null;
  } | null>(null);   // to know image index and also variant index
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState(initialState?.name ? initialState.name : "");
  const [description, setDescription] = useState(initialState?.description ? initialState.description : "");
  const [brandId, setBrandId] = useState<number | null>(initialState?.brand ? initialState.brand.id : "");
  const [categoryId, setCategoryId] = useState<number | null>(initialState?.category ? initialState.category.id : "");
  const [variants, setVariants] = useState<Variant[]>(() => {
    // if intial state has data (Edit Mode)
    if (initialState?.variants && initialState.variants.length > 0) {
      return initialState.variants.map((v: any) => ({
        color: v.color || '',
        sku: v.sku || '',
        barcode: v.barcode || '',
        stockQty: v.stockQty ?? 1,
        reorderLevel: v.reorderLevel ?? 0,
        maxStock: v.maxStock ?? 2,
        reservedQty: v.reservedQty ?? 0,
     
        buyPrice: Number(v.buyPrice || 0), 
        sellPrice: Number(v.sellPrice || 0),
        status: v.status || 'IN_STOCK',
        purchaseStatus: v.purchaseStatus || 'PENDING',
        specifications: v.specifications || [],
     
        images: v.images 
          ? [
              ...v.images.map((img: any) => ({ file: null, url: img.imageUrl || img })), 
              ...Array(Math.max(0, 4 - v.images.length)).fill(null)
            ].slice(0, 4)
          : [...DEFAULT_IMAGE_SLOTS],
      }));
    }
    
 
    return [createEmptyVariant()];
  });

  const statusOptions = [
    {
      key: 'in-stock',
      value: 'IN_STOCK' as const,
      title: 'In Stock',
      description: 'For items that are currently available.',
    },
    {
      key: 'preorder',
      value: 'PREORDER' as const,
      title: 'Preorder',
      description: 'For items that are not yet available.',
    },
  ];

  const purchaseStatusOptions = [
    {
      key: 'pending',
      value: 'PENDING' as const,
      title: 'Pending',
      description: 'Waiting for the purchase process to finish.',
    },
    {
      key: 'purchased',
      value: 'PURCHASED' as const,
      title: 'Purchased',
      description: 'Already purchased and ready for inventory tracking.',
    },
  ];

  const specTemplates = {
    Phone: [
      { key: 'RAM', value: '12GB' },
      { key: 'Storage', value: '256GB' },
      { key: 'Battery', value: '5000mAh' },
      { key: 'Main Camera', value: '108MP' },
      { key: 'Front Camera', value: '32MP' },
      { key: 'Processor', value: 'Snapdragon 8 Gen 2' },
    ],
    Laptop: [
      { key: 'RAM', value: '16GB' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Battery', value: '80Wh' },
      { key: 'Processor', value: 'Intel Core i7-12700H' },
      { key: 'Graphics', value: 'NVIDIA GeForce RTX 3060' },
    ],
    'Power Bank': [
      { key: 'Capacity', value: '20000mAh' },
      { key: 'Output', value: '2x USB-A, 1x USB-C' },
      { key: 'Input', value: 'USB-C' },
      { key: 'Charging Speed', value: '18W' },
    ],
    Headphone: [
      { key: 'Type', value: 'Over-Ear' },
      { key: 'Connectivity', value: 'Bluetooth 5.0' },
      { key: 'Battery Life', value: '30 hours' },
      { key: 'Noise Cancellation', value: 'Active' },
    ],
  } as const;

  const imageViewLabels = ['Front view', 'Back view', 'Left view', 'Right view'];

  useEffect(() => {
    const load = async () => {
      const fetchedBrands = await getbrand();
      const fetchedCategories = await getCategory();
      setBrands(fetchedBrands);
      setCategories(fetchedCategories);
    };

    load();
  }, []);
//  to create variant ( empty variant)
  const addVariant = () => {
    setVariants((current) => [...current, createEmptyVariant()]);
  };
//  to create copy variant
  const copyVariant = (index: number) => {
    setVariants((current) => {
      const variantToCopy = current[index];
      return [...current, createCopiedVariant(variantToCopy)];
    });
  };

//  to update variant
  const updateVariant = <K extends keyof Variant>(
    index: number,
    field: K,
    value: Variant[K]
  ) => {
    setVariants((current) =>
      current.map((variant, variantIndex) =>
        variantIndex === index
          ? normalizeVariant({
              ...variant,
              [field]: value,
            })
          : variant
      )
    );
  };
//  add sepcification ( new spec or existing spec)
  const addSpec = (variantIndex: number) => {
    setVariants((current) =>
      current.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              specifications: [...variant.specifications, { key: '', value: '' }],
            }
          : variant
      )
    );
  };
//  ready-made spec template
  const applySpecTemplate = (
    variantIndex: number,
    template: readonly Spec[]
  ) => {
    setVariants((current) =>
      current.map((variant, index) =>
        index === variantIndex
          ? {
              ...variant,
              specifications: template.map((spec) => ({ ...spec })),
            }
          : variant
      )
    );
  };
// to update spec
  const updateSpec = (
    variantIndex: number,
    specIndex: number,
    field: keyof Spec,
    value: string
  ) => {
    setVariants((current) =>
      current.map((variant, index) => {
        if (index !== variantIndex) return variant;

        return {
          ...variant,
          specifications: variant.specifications.map((spec, currentSpecIndex) =>
            currentSpecIndex === specIndex ? { ...spec, [field]: value } : spec
          ),
        };
      })
    );
  };

  const handleImageFiles = (variantIndex: number, files: FileList | null) => {
    // return it is not choosen photo
    if (!files) return;
    
    setVariants((current) =>
      current.map((variant, index) => {
        if (index !== variantIndex) return variant;
        // change array selected photo
        const selectedFiles = Array.from(files);
     
        // copy photo ( spread operator ) to show preview
        const updatedImages = [...variant.images];
            // defien slots to add photos using for loop ( 4 is 4 slots)
        for (let fileIndex = 0; fileIndex < selectedFiles.length && fileIndex < 4; fileIndex += 1) {
          const file = selectedFiles[fileIndex];
          const slotIndex = updatedImages.findIndex((image) => image === null);

          if (slotIndex === -1) break;

          updatedImages[slotIndex] = { file, url: URL.createObjectURL(file) };
        }
        return {
          ...variant,
          images: updatedImages,
        };
      })
    );
  };

  const replaceVariantImage = (
    variantIndex: number,
    imageIndex: number,
    file: File
  ) => {
    setVariants((current) =>
      current.map((variant, index) => {
        if (index !== variantIndex) return variant;

        const updatedImages = [...variant.images];
        updatedImages[imageIndex] = { file, url: URL.createObjectURL(file) };

        return {
          ...variant,
          images: updatedImages,
        };
      })
    );
  };

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants((current) =>
      current.map((variant, index) => {
        if (index !== variantIndex) return variant;

        const updatedImages = [...variant.images];
        updatedImages[imageIndex] = null;

        return {
          ...variant,
          images: updatedImages,
        };
      })
    );
  };
// add , remove , replace photo ( file picker ) btn
  const openVariantFilePicker = (
    variantIndex: number,
    imageIndex: number | null
  ) => {
    setImageTarget({ variantIndex, imageIndex }); 
    fileInputRef.current?.click();
  };
//  emplty array add photo or data array replace photo function
  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    // photo file
    const files = event.target.files;
    if (!files?.length || !imageTarget) return;
        // imageindex is null add photo
    if (imageTarget.imageIndex === null) {
      handleImageFiles(imageTarget.variantIndex, files);   // variant index and photo file 
    } else {
      //  replace photo  ( variant index and image index and photo file)
      replaceVariantImage(
        imageTarget.variantIndex,
        imageTarget.imageIndex,
        files[0]
      );
    }
    // to reset for next photo
    setImageTarget(null);
    event.target.value = '';
  };

  useEffect(() => {
    // clean up function to remove photo memory  from browser 
    return () => {
      variants.forEach((variant) => {
        variant.images.forEach((image) => {
          if (image) {
            URL.revokeObjectURL(image.url);
          }
        });
      });
    };
  }, [variants]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      const payload = {
        name,
        description,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        variants: variants.map((variant, variantIndex) => ({
          color: variant.color,
         
          stockQty: variant.stockQty,
          reservedQty: variant.reservedQty,
          reorderLevel: variant.reorderLevel,
          maxStock: variant.maxStock,
          buyPrice: variant.buyPrice,
          sellPrice: variant.sellPrice,
          status: variant.status,
          purchaseStatus: variant.purchaseStatus,
          specifications: variant.specifications.filter(
            (spec) => spec.key.trim() || spec.value.trim()
          ),
          images: variant.images
            .filter((image): image is ImagePreview => image !== null)
            .map((image, imageIndex) => {
              const fileKey = `variant-${variantIndex}-image-${imageIndex}`;
              formData.append(fileKey, image.file);
              return { fileKey };
            }),
        })),
      };

      formData.append('payload', JSON.stringify(payload));

      await createProduct(formData);

      alert('Product created successfully');
      setName('');
      setDescription('');
      setBrandId(null);
      setCategoryId(null);
      setVariants([createEmptyVariant()]);
    } catch (error) {
      console.error(error);
      alert('Failed to create product');
    }
  };
const handleEdit = async () => {
  try {
    const formData = new FormData();
    const payload = {
      id: initialState?.id, 
      name,
      description,
      categoryId: Number(categoryId),
      brandId: Number(brandId),
      variants: variants.map((variant, variantIndex) => ({
        id: (variant as any).id || undefined, 
        color: variant.color,
        sku: variant.sku,
        barcode: variant.barcode,
        stockQty: variant.stockQty,
        reservedQty: variant.reservedQty,
        reorderLevel: variant.reorderLevel,
        maxStock: variant.maxStock,
        buyPrice: variant.buyPrice,
        sellPrice: variant.sellPrice,
        status: variant.status,
        purchaseStatus: variant.purchaseStatus,
        specifications: variant.specifications.filter(
          (spec) => spec.key.trim() || spec.value.trim()
        ),
       
        images: variant.images
          .filter((image): image is ImagePreview => image !== null)
          .map((image, imageIndex) => {
           
            if (image.file) {
              const fileKey = `variant-${variantIndex}-image-${imageIndex}`;
              formData.append(fileKey, image.file); 
              return { isNew: true, fileKey };
            }
            
         
            return { isNew: false, url: image.url }; 
          }),
      })),
    };

    formData.append('payload', JSON.stringify(payload));
    await EditProduct(formData);

    alert('Product updated successfully');
  } catch (error) {
    console.error(error);
    alert('Failed to update product');
  }
};
  return (
    <div className="h-full space-y-6 overflow-y-auto pt-2 no-scrollbar">
      <div className="grid w-full grid-cols-2 gap-4 text-white">
        <div className="rounded-lg border-2 border-solid p-3">
          <div className="mb-10 text-xl font-bold text-foreground">
            General Info
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="font-medium text-muted-foreground">
              Product Name
              <Input
                className="mt-4 h-10 w-full"
                value={name}
                onChange={(event) => setName(initialState?.name ? initialState.name : event.target.value)}
              />
            </div>
            <div className="font-medium text-muted-foreground">
              Description
              <Textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border-2 border-solid p-3">
          <div className="mb-10 text-xl font-bold text-foreground">
            Classification
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="font-medium text-muted-foreground">
              Category
              <Select
                value={categoryId ? String(categoryId) : undefined}
                onValueChange={(value) => setCategoryId(Number(value))}
              >
                <SelectTrigger className="mt-4 h-12 w-full py-5">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                        className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 data-[state=checked]:bg-accent"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="font-medium text-muted-foreground">
              Brand
              <Select
                value={brandId ? String(brandId) : undefined}
                onValueChange={(value) => setBrandId(Number(value))}
              >
                <SelectTrigger className="mt-4 h-12 w-full py-5">
                  <SelectValue placeholder="Select Brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {brands.map((brand) => (
                      <SelectItem
                        key={brand.id}
                        value={String(brand.id)}
                        className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 data-[state=checked]:bg-accent"
                      >
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full rounded-lg border-2 border-solid p-3">
        <div className="mb-10 flex items-center justify-between text-foreground">
          <div>
            <h1 className="mb-4 text-xl font-bold tracking-tight text-heading">
              Product Variants
            </h1>
            <p className="mb-6 text-lg font-normal text-body text-muted-foreground lg:text-xl">
              Manage different versions, colors, and storage capacities for this
              product.
            </p>
          </div>
          <div>
            <Button size="lg" type="button" onClick={addVariant}>
              + Add Variant
            </Button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          multiple={imageTarget?.imageIndex === null}
          onChange={handleFileInputChange}
        />

        <div className="space-y-5">
          {variants.map((variant, index) => {
            const totalPrice = getTotalPrice(variant);
            const profitPrice = getProfitPrice(variant);

            return (
              <Card key={index} className="relative overflow-hidden pt-0">
                <div className="space-y-3 p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {imageViewLabels.map((label, slotIndex) => {
                      const image = variant.images[slotIndex];

                      return (
                        <div
                          key={slotIndex}
                          className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950"
                        >
                          {image ? (
                            <>
                              <Image
                                src={image.url}
                                alt={`${label} for variant ${index + 1}`}
                                width={640}
                                height={320}
                                unoptimized
                                className="h-40 w-full object-cover transition duration-200 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition duration-200 group-hover:opacity-100">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-white">
                                  {label}
                                </span>
                                <div className="flex justify-between gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    type="button"
                                    onClick={() =>
                                      openVariantFilePicker(index, slotIndex)
                                    }
                                  >
                                    Replace
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    type="button"
                                    onClick={() =>
                                      removeVariantImage(index, slotIndex)
                                    }
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </>
                          ) : (
                            <button
                              type="button"
                              className="flex h-40 w-full flex-col items-center justify-center gap-2 rounded-3xl border border-dashed border-white/20 bg-white/5 px-3 text-sm text-muted-foreground hover:border-white/30"
                              onClick={() =>
                                openVariantFilePicker(index, slotIndex)
                              }
                            >
                              <span className="text-[11px] uppercase tracking-[0.3em] text-white/75">
                                {label}
                              </span>
                              <span className="text-white">Upload</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm text-muted-foreground">
                      {
                        variant.images.filter((image) => image !== null).length
                      }{' '}
                      / 4 photos
                    </span>
                    {variant.images.some((image) => image === null) && (
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        onClick={() => openVariantFilePicker(index, null)}
                      >
                        Add photo
                      </Button>
                    )}
                  </div>
                </div>

                <CardHeader>
                  <CardAction />
                  <CardTitle>{`Variant ${index + 1}`}</CardTitle>

                  <CardDescription className="flex flex-col gap-y-5">
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      <div className="min-w-[180px] flex-1">
                        Color *
                        <Input
                          className="h-9 w-full"
                          value={variant.color}
                          onChange={(event) =>
                            updateVariant(index, 'color', event.target.value)
                          }
                        />
                      </div>
                      <div className="min-w-[180px] flex-1">
                        Sku
                        <Input
                          className="h-9 w-full"
                          value={variant.sku}
                          onChange={(event) =>
                            updateVariant(index, 'sku', event.target.value)
                          }
                        />
                      </div>
                      <div className="min-w-[180px] flex-1">
                        Bar Code
                        <Input
                          className="h-9 w-full"
                          value={variant.barcode}
                          onChange={(event) =>
                            updateVariant(index, 'barcode', event.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-start gap-2 text-muted-foreground">
                      <div className="min-w-[170px] flex-1">
                        Stock *
                        <Input
                          type="number"
                          min={1}
                          className="h-9 w-full"
                          value={variant.stockQty}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'stockQty',
                              Number(event.target.value)
                            )
                          }
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Stock must stay greater than low stock.
                        </p>
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Low Stock
                        <Input
                          type="number"
                          min={0}
                          max={Math.max(variant.stockQty - 1, 0)}
                          className="h-9 w-full"
                          value={variant.reorderLevel}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'reorderLevel',
                              Number(event.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Total Stock (Max Stock)
                        <Input
                          type="number"
                          min={Math.max(
                            variant.stockQty,
                            variant.reorderLevel
                          ) + 1}
                          className="h-9 w-full"
                          value={variant.maxStock}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'maxStock',
                              Number(event.target.value)
                            )
                          }
                        />
                        <p className="mt-1 text-xs text-muted-foreground">
                          Max stock always stays greater than stock and low stock.
                        </p>
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Reserved Qty
                        <Input
                          type="number"
                          min={0}
                          max={variant.stockQty}
                          className="h-9 w-full"
                          value={variant.reservedQty}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'reservedQty',
                              Number(event.target.value)
                            )
                          }
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-start gap-2 text-muted-foreground">
                      <div className="min-w-[170px] flex-1">
                        Buy Price *
                        <Input
                          type="number"
                          min={0}
                          className="h-9 w-full"
                          value={variant.buyPrice}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'buyPrice',
                              Number(event.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Selling Price *
                        <Input
                          type="number"
                          min={0}
                          className="h-9 w-full"
                          value={variant.sellPrice}
                          onChange={(event) =>
                            updateVariant(
                              index,
                              'sellPrice',
                              Number(event.target.value)
                            )
                          }
                        />
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Total Price *
                        <Input
                          className="h-9 w-full"
                          value={totalPrice}
                          readOnly
                        />
                      </div>
                      <div className="min-w-[170px] flex-1">
                        Profit Price *
                        <Input
                          className="h-9 w-full"
                          value={profitPrice}
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(specTemplates).map(
                          ([templateName, template]) => (
                            <Button
                              className="mr-0"
                              key={templateName}
                              variant="outline"
                              size="sm"
                              type="button"
                              onClick={() =>
                                applySpecTemplate(index, template)
                              }
                            >
                              {templateName}
                            </Button>
                          )
                        )}
                      </div>

                      {variant.specifications.map((spec, specIndex) => (
                        <div key={specIndex} className="flex gap-2">
                          <Input
                            placeholder="Custom Key"
                            className="h-9 w-full"
                            value={spec.key}
                            onChange={(event) =>
                              updateSpec(
                                index,
                                specIndex,
                                'key',
                                event.target.value
                              )
                            }
                          />

                          <Input
                            placeholder="Custom Value"
                            className="h-9 w-full"
                            value={spec.value}
                            onChange={(event) =>
                              updateSpec(
                                index,
                                specIndex,
                                'value',
                                event.target.value
                              )
                            }
                          />
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-fit px-0 text-sm text-indigo-400 hover:text-indigo-300"
                        onClick={() => addSpec(index)}
                      >
                        + Add Specification
                      </Button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <RadioGroup
                        value={variant.status}
                        onValueChange={(value) =>
                          updateVariant(index, 'status', value as VariantStatus)
                        }
                        className="grid max-w-sm gap-3"
                      >
                        <div className="mb-2 font-bold text-foreground">
                          Product status *
                        </div>
                        {statusOptions.map((option) => (
                          <label
                            key={`${option.key}-${index}`}
                            htmlFor={`${option.key}-${index}`}
                            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 p-3 text-left"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {option.title}
                              </div>
                              <p className="text-sm text-slate-400">
                                {option.description}
                              </p>
                            </div>
                            <RadioGroupItem
                              value={option.value}
                              id={`${option.key}-${index}`}
                            />
                          </label>
                        ))}
                      </RadioGroup>

                      <RadioGroup
                        value={variant.purchaseStatus}
                        onValueChange={(value) =>
                          updateVariant(
                            index,
                            'purchaseStatus',
                            value as PurchaseStatus
                          )
                        }
                        className="grid max-w-sm gap-3"
                      >
                        <div className="mb-2 font-bold text-foreground">
                          Purchase status *
                        </div>
                        {purchaseStatusOptions.map((option) => (
                          <label
                            key={`${option.key}-${index}`}
                            htmlFor={`${option.key}-${index}-purchase`}
                            className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 p-3 text-left"
                          >
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {option.title}
                              </div>
                              <p className="text-sm text-slate-400">
                                {option.description}
                              </p>
                            </div>
                            <RadioGroupItem
                              value={option.value}
                              id={`${option.key}-${index}-purchase`}
                            />
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardFooter className="flex flex-wrap justify-between gap-3">
                  <Button type="button" variant="outline" onClick={() => copyVariant(index)}>
                    Copy This Variant
                  </Button>
                 
                </CardFooter>
              </Card>
             
            );
          })}
          {
            initialState?.name ? (
             <Button type="button" onClick={handleEdit}>
                    Edit Product
                  </Button> 
            )

                  :
                  (
                 <Button type="button" onClick={handleSubmit}>
                    Save Product
                  </Button> 
                  )
          }
            
        </div>
      </div>
    </div>
  );
};

export default CreateProductForm;
