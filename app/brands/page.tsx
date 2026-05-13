'use client';
import React, { useState } from 'react';
import Navbar from '../categories/_components/Navbar';
import { getbrand } from '@/actions/brands/get-brands';
import { useQuery } from '@tanstack/react-query';
import CategoriesList from '../categories/_components/CategoriesList';

const BrandsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: brands, isLoading, isError, error } = useQuery({
        queryKey: ["brands"],
        queryFn: () => getbrand(), // Wrap it in an anonymous function
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {JSON.stringify(error)}</div>;

    return (
        <>  
       <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} title="Brands" entityName="Brand" />
          {/* <ul>
            {brands?.map((brand) => (
                <li key={brand.id}>{brand.name}</li>
            ))}
        </ul> */}
         {isLoading ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Loading brands...
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-destructive">
          Unable to load brands.
        </div>
      ) : (
        <CategoriesList items={brands} title="Brands" searchQuery={searchQuery} />
       
      )}
      </>
    );
}
export default BrandsPage;