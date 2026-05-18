"use client";
import { getProductById } from "@/actions/products/get-products";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import CreateProductForm from "../_components/CreateProductForm";

function EditProduct() {
    const params = useParams();

const productId = Number(params.id);
console.log("productId",productId);

const {data:products, isLoading,isError} =useQuery({
  
        queryKey : ["products", productId], 
         queryFn: () => getProductById(productId),
})
console.log(products);

if (isLoading) {
    return <div>Loading product...</div>;
}

if (isError || !products) {
    return <div>Product not found.</div>;
}

    return ( 
  
    <CreateProductForm initialState={products}/>


);

}

export default EditProduct;
