'use client';
import React, { useState } from 'react';
import Navbar from '../categories/_components/Navbar';
import { getbrand } from '@/actions/brands/get-brands';
import { useQuery } from '@tanstack/react-query';
import SimpleList from '../../components/SimpleList';
import Loader from '@/components/ui/Loader';

const BrandsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { data: brands, isLoading, isError, error } = useQuery({
        queryKey: ["brands"],
        queryFn: () => getbrand(), // Wrap it in an anonymous function
    });

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
       <div className="flex min-h-screen items-center justify-center">
  <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
    <Loader />
  </div>
</div>
      ) : isError ? (
        <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-destructive">
          Unable to load brands.
        </div>
      ) : (
        <SimpleList items={brands} title="Brands" searchQuery={searchQuery} />
      )}
      </>
    );}
export default BrandsPage;