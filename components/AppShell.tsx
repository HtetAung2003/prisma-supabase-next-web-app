"use client";

import { Sidebar } from "@/components/Sidebar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar>{children}</Sidebar>
    </div>
  );
}
