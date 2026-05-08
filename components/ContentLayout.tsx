'use client';
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const ContentLayout = ({children}: {children: React.ReactNode}) => {
    const [visible , setVisible] =useState(true);
  return (
  <div className="flex h-full p-5 gap-5 bg-background">
            <Sidebar visible={visible} />
            <div className="rounded-[28px] border border-border/70  w-full h-full bg-card">
      <Navbar visible={visible} setVisible={setVisible}/>  
       {children}
            </div>
            </div>
  );
};

export default ContentLayout;