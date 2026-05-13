'use client'
import { useState } from "react";
import { getCategory } from "@/actions/categories/get-categories";
import { useQuery } from "@tanstack/react-query";
import  Navbar  from "../categories/_components/Navbar";
import CategoriesList from "./_components/CategoriesList";

export default function CategoryList() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategory(), // Wrap it in an anonymous function
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <>  

       <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} title="Categories" entityName="Category" />
          {/* <ul>
            {categories?.map((cat) => (
                <li key={cat.id}>{cat.name}</li>
            ))}
        </ul> */}
         {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Loading categories...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-destructive">
          Unable to load categories.
        </div>
      ) : (
        <CategoriesList items={categories} searchQuery={searchQuery} title="Categories" />
       
      )}
        </>
    
    );
}