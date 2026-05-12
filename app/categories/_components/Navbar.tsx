'use client';
import type React from "react";
import CreateCategoryDialog from "@/components/CreateCategoryDialog";
import { Icon } from "@/components/Icon";
import { Input } from "@/components/ui/input";
import { Search } from "@hugeicons/core-free-icons";

interface NavbarProps {
        searchQuery : string;
        setSearchQuery : React.Dispatch<React.SetStateAction<string>>;
    }
const Navbar = ({ searchQuery, setSearchQuery }: NavbarProps) => {
    
  return (
    <div className="flex items-center justify-between">
       <div className="text-white text-3xl">Categories</div> 
        <div className="flex items-center gap-10">
            
        <div className="border border-neutral-700 rounded-md p-1 flex items-center gap-2 px-2">
            <Icon icon={Search} size={18} />
            <Input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none text-white placeholder:text-muted-foreground"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div> 
        <CreateCategoryDialog />
        </div>
      
   
    </div>
  );
};

export default Navbar;