'use client';

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Table, TableHeader } from "@/components/ui/table";
import { Filter, FilterAddFreeIcons, Plus, Search01FreeIcons } from "@hugeicons/core-free-icons";

import { ColumnDef } from "@tanstack/react-table"
import { ProductTable } from "./view-product/page";
// import { columns } from "./view-product/_components/columns";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/actions/products/get-products";
import { getColumns } from "./view-product/_components/columns";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ProductHeader from "./view-product/_components/productlistheader";


const ProductPage = () => {
const [page, setPage] = useState(1)

const [sortBy, setSortBy] = useState("createdAt")
const [brandId, setBrandId] = useState<number | null>(null)
const [categoryId, setCategoryId] = useState<number | null>(null)
const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
const limit = 5
const { data, isLoading, isError } = useQuery({
  queryKey: ["products", page, sortBy, sortOrder],
  queryFn: () => getProduct(page, limit, sortBy, sortOrder),
})
const router = useRouter()
// values pass to columns.tsx to handle sorting and navigation on edit
const columns = getColumns(
  (field) => {
    setSortBy(field)
    setSortOrder((p) => (p === "asc" ? "desc" : "asc"))
  },
  sortBy,
  sortOrder,
  (id) => {
    router.push(`/products/${id}`)
  }
)
    return(
        <>
        <div className="my-3">  <ProductHeader brandId={brandId} setBrandId={setBrandId} categoryId={categoryId} setCategoryId={setCategoryId} /></div>
 
   
<ProductTable
        columns={columns}
        data={data?.data ?? []}
        pageCount={data?.pagination?.totalPages ?? 0}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
      />     
         </>
    )
}
export default ProductPage;