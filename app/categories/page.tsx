'use client'
import { useState } from "react";
import { getCategory } from "@/actions/categories/get-categories";
import { useQuery } from "@tanstack/react-query";
import  Navbar  from "../categories/_components/Navbar";
import SimpleList from "../../components/SimpleList";
import Loader from "@/components/ui/Loader";

export default function CategoryList() {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: categories, isLoading, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategory(), // Wrap it in an anonymous function
    });

  
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
        <div className="flex min-h-screen items-center justify-center">
  <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
    <Loader />
  </div>
</div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-destructive">
          Unable to load categories.
        </div>
      ) : (
        <SimpleList items={categories} searchQuery={searchQuery} title="Categories" />
       
      )}
        </>
    
    );
}