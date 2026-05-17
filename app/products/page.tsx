'use client';

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Table, TableHeader } from "@/components/ui/table";
import { Filter, FilterAddFreeIcons, Plus } from "@hugeicons/core-free-icons";

import { ColumnDef } from "@tanstack/react-table"
import { ProductTable } from "./view-product/page";
import { columns } from "./view-product/_components/columns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/actions/products/get-products";

const page = () => {

const { data : products , isLoading , isError , error} = useQuery({
    queryKey: ["products"],
    queryFn : () => getProduct(),
})
    return(
        <>
      <div className="flex  justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Product Inventory</h1>
           <h5 className="text-xl font-semibold"> Manage your products and stocks .</h5>
        </div>
        <div className="flex gap-10">
            <Button variant='outline' size="lg"  className='rounded-lg px-6 py-5 shadow-sm hover:brightness-110 transition-all duration-200 active:scale-[0.98] border border-outline-variant'>
                <Icon icon={FilterAddFreeIcons} className="mr-3"/>
                Filter</Button>
            <Button variant="default" size="lg"  className='rounded-lg px-6 py-5 shadow-sm hover:brightness-110 transition-all duration-200 active:scale-[0.98] border border-outline-variant'><Icon icon={Plus} className="mr-3"/> Add product</Button>
        </div>
        
      </div>
   
  <ProductTable columns={columns} data={products} isLoading={isLoading}/>
        </>
    )
}
export default page;