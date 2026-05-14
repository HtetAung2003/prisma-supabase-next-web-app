'use client';

import React, { useEffect, useState } from 'react';
import { getbrand } from '@/actions/brands/get-brands';
import { getCategory } from '@/actions/categories/get-categories';

import { log } from 'node:console';
import { createProduct } from '@/actions/products/create-products';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

type Brand = { id: number; name: string };
type Category = { id: number; name: string };

type Spec = {
  key: string;
  value: string;
};

type Variant = {
  color: string;
  price: number;
  stockQty: number;
  specifications: Spec[];
};

const CreateProductForm = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const [variants, setVariants] = useState<Variant[]>([
    {
      color: '',
      price: 0,
      stockQty: 0,
      specifications: [],
    },
  ]);
  const status = [
    {
      key: "in-stock",
      value: 'InStock',
      title: 'InStock',
      description: 'For items that are currently available.',
    },
    {
      key: "preorder",
      value: 'Preorder',
      title: 'Preorder',
      description: 'For items that are not yet available.',
    },

  ]
  useEffect(() => {
    const load = async () => {
      const brands = await getbrand();
      const categories = await getCategory();
      setBrands(brands);
      setCategories(categories);
    };

    load();
  }, []);
  console.log(brands, categories);
  // ADD VARIANT
  const addVariant = () => {
    setVariants([
      ...variants,
      {
        color: '',
        price: 0,
        stockQty: 0,
        specifications: [],
      },
    ]);
  };

  // UPDATE VARIANT
  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  };

  // ADD SPEC
  const addSpec = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].specifications.push({
      key: '',
      value: '',
    });
    setVariants(updated);
  };

  // UPDATE SPEC
  const updateSpec = (
    vIndex: number,
    sIndex: number,
    field: keyof Spec,
    value: string
  ) => {
    const updated = [...variants];
    updated[vIndex].specifications[sIndex][field] = value;
    setVariants(updated);
  };
  const handleSubmit = async () => {
    try {
      console.log("Submitting product with data:", {
        name,
        categoryId,
        brandId,
        variants,
      });
      await createProduct({
        name,
        categoryId: Number(categoryId),
        brandId: Number(brandId),
        variants,
      });

      alert('Product created successfully');

      // reset form
      setName('');
      setBrandId(null);
      setCategoryId(null);
      setVariants([
        {
          color: '',
          price: 0,
          stockQty: 0,
          specifications: [],
        },
      ]);
    } catch (error) {
      console.error(error);
      alert('Failed to create product');
    }
  };
  return (
    <div className="space-y-6 overflow-y-auto no-scrollbar pt-2 h-full">
      {/* two-column layout */}
      <div className="grid  grid-cols-2 w-full  gap-4  text-white  ">
        {/* first layout */}
        <div className=' border-2  border-solid p-3 rounded-lg '>
          <div className='text-xl font-bold mb-10 text-foreground'>General Info</div>
          <div className='flex flex-col gap-y-5'>
            <div className=' font-medium text-muted-foreground 
'>Product Name <Input className="w-full h-10 mt-4" /></div>
            <div className=' font-medium text-muted-foreground 
'> description
              <Textarea /></div>

          </div>

        </div>
        {/* second layout */}
        <div className=' border-2   border-solid p-3 rounded-lg '>
          <div className='text-xl font-bold mb-10 text-foreground'>Classification</div>
          {/* cate and brand */}
          <div className='flex flex-col gap-y-5'>
            {/* category */}
            <div className=' font-medium text-muted-foreground 
'>Category

              <Select>
                <SelectTrigger className="w-full h-12 py-5 mt-4">
                  <SelectValue placeholder={
                    categories.find((c) => c.id === categoryId)?.name || 'Select Category'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((c) => (
                      <SelectItem
                        key={c.id}
                        onClick={() => setCategoryId(c.id)}
                        value={c.name}
                        className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 data-[state=checked]:bg-accent"
                      >
                        {c.name}
                      </SelectItem>
                    ))}


                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* brand */}
            <div className=' font-medium text-muted-foreground 
'> Brand
              <Select>
                <SelectTrigger className="w-full h-12 py-5 mt-4">
                  <SelectValue placeholder={
                    brands.find((b) => b.id === brandId)?.name || 'Select Brand'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {brands.map((b) => (
                      <SelectItem
                        key={b.id}
                        onClick={() => setBrandId(b.id)}
                        value={b.name}
                        className="cursor-pointer gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent/50 data-[state=checked]:bg-accent"
                      >
                        {b.name}
                      </SelectItem>
                    ))}


                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

          </div>

        </div>

      </div>
   
      {/* variants and one-col layout */}
      <div className=' border-2 w-full   border-solid p-3 rounded-lg '>
        <div className='flex  items-center justify-between mb-10 text-foreground'>
          <div>
            <h1 className="mb-4 text-xl font-bold tracking-tight text-heading">Product Variants</h1>
            <p className="mb-6 text-lg font-normal text-body lg:text-xl text-muted-foreground">Manage different versions, colors, and storage capacities for this product.</p>
          </div>
          <div><Button size="lg">+ Add Variant</Button></div>
        </div>
        <Card className="relative w-1/4 pt-0">
          <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
          <img
            src="https://avatar.vercel.sh/shadcn1"
            alt="Event cover"
            className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
          />
          <CardHeader>
            <CardAction>
              {/* <Badge variant="secondary">Featured</Badge> */}
            </CardAction>
            <CardTitle>Design systems meetup</CardTitle>
            <CardDescription className='flex flex-col gap-y-5'>
              <div className=' items-center gap-x-2   text-muted-foreground 
'>Color *
                <Input className="w-full h-9 " />
              </div>
              <div className='flex items-center gap-x-2   text-muted-foreground 
'>
  <div>Stock *
                <Input className="w-full h-9 " /></div>
                <div>
                 low level Stock
                <Input className="w-full h-9 " />
                </div>
              </div>
              <div className='flex items-center gap-x-2   text-muted-foreground 
'><div>  Buy Price*
                <Input className="w-full h-9 " /></div>
                <div>
                  Selling Price *
                <Input className="w-full h-9 " />
                </div>
              </div>
       
                <div className=' font-bold mb-2 text-foreground'>Choose your status *</div>
        <RadioGroup defaultValue="plus" className="grid gap-3 max-w-sm">
          {status.map((plan) => (
            <label
              key={plan.value}
              htmlFor={`${plan.value}-plan`}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10  p-3 text-left"
            >
              <div>
                <div className="text-sm font-semibold text-white">{plan.title}</div>
                <p className="text-sm text-slate-400">{plan.description}</p>
              </div>
              <RadioGroupItem value={plan.value} id={`${plan.value}-plan`} />
            </label>
          ))}
        </RadioGroup>
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full">View Event</Button>
          </CardFooter>
        </Card>



      </div>
      <div>
        sdjfjsajfsdjfoij
      </div>
    </div>

  );
};

export default CreateProductForm;