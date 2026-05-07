"use client";

import { Navbar } from "@/components/Navbar";

interface ContentLayoutProps {
  children: React.ReactNode;
  onMenuClick: () => void;
}

export function ContentLayout({
  children,
  onMenuClick,
}: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background text-foreground">
      <Navbar onMenuClick={onMenuClick} />
      <main className="flex-1">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[1600px] flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
