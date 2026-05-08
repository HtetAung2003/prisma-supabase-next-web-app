import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/lib/query-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import ContentLayout from "@/components/ContentLayout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Pulse OS",
  description: "Operations dashboard for products, orders, and team activity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    className="h-full"
    >
      <body className={` font-sans antialiased bg-background `}>
        <ThemeProvider>
          <Toaster />
          <QueryProvider>
            <div className="h-full overflow-hidden">
                 <ContentLayout>
            {children}
         </ContentLayout> 
            </div>
     
        
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
