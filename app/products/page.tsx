'use client';
import React, { useState } from 'react';
import Navbar from '../categories/_components/Navbar';

const page = () => {

    const [ searchQuery, setSearchQuery ] = useState("");
    return(
        <>
            <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} title="Products" entityName="Product" />
             <div className="rounded-lg border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          Product creation form coming soon...
        </div>
        </>
    )
}
export default page;