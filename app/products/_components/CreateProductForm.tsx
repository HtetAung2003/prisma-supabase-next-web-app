'use client';

import React, { useEffect, useState } from 'react';
import { getbrand } from '@/actions/brands/get-brands';
import { getCategory } from '@/actions/categories/get-categories';

import { log } from 'node:console';
import { createProduct } from '@/actions/products/create-products';

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
    <div className=" bg-slate-950 text-white p-6">

      <h1 className="text-2xl font-bold mb-6">Create Product</h1>

      {/* PRODUCT INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-3 bg-slate-900 p-5 rounded-xl">

          <input
            placeholder="Product Name"
            className="w-full p-2 bg-slate-800 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="w-full p-2 bg-slate-800 rounded"
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option>Select Category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            className="w-full p-2 bg-slate-800 rounded"
            onChange={(e) => setBrandId(Number(e.target.value))}
          >
            <option>Select Brand</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>

        </div>

        {/* VARIANTS */}
        <div className="flex flex-rows space-y-4">

          {variants.map((v, i) => (
            <div key={i} className=" bg-slate-900 p-4 rounded-xl space-y-2">

              <input
                placeholder="Color"
                className="w-full p-2 bg-slate-800 rounded"
                value={v.color}
                onChange={(e) =>
                  updateVariant(i, 'color', e.target.value)
                }
              />

              <input
                placeholder="Price"
                type="number"
                className="w-full p-2 bg-slate-800 rounded"
                value={v.price}
                onChange={(e) =>
                  updateVariant(i, 'price', Number(e.target.value))
                }
              />

              <input
                placeholder="Stock"
                type="number"
                className="w-full p-2 bg-slate-800 rounded"
                value={v.stockQty}
                onChange={(e) =>
                  updateVariant(i, 'stockQty', Number(e.target.value))
                }
              />

              {/* SPECS */}
              <div className="space-y-2">
                {v.specifications.map((s, si) => (
                  <div key={si} className="flex gap-2">
                    <input
                      placeholder="Key (RAM)"
                      className="w-1/2 p-2 bg-slate-800 rounded"
                      value={s.key}
                      onChange={(e) =>
                        updateSpec(i, si, 'key', e.target.value)
                      }
                    />

                    <input
                      placeholder="Value (12GB)"
                      className="w-1/2 p-2 bg-slate-800 rounded"
                      value={s.value}
                      onChange={(e) =>
                        updateSpec(i, si, 'value', e.target.value)
                      }
                    />
                  </div>
                ))}

                <button
                  onClick={() => addSpec(i)}
                  className="text-sm text-indigo-400"
                >
                  + Add Specification
                </button>
              </div>

            </div>
          ))}

          <button
            onClick={addVariant}
            className="w-full border border-white/20 p-2 rounded"
          >
            + Add Variant
          </button>

        </div>
      </div>

      {/* SUBMIT */}
      <div className="mt-6 flex justify-end">
        <button className="bg-green-600 px-6 py-2 rounded" onClick={handleSubmit}>
          Create Product
        </button>
      </div>

    </div>
  );
};

export default CreateProductForm;