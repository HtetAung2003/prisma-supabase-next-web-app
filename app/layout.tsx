import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import QueryProvider from "@/lib/query-provider";
import { ThemeProvider } from "@/lib/theme-provider";
import { AppShell } from "@/components/AppShell";

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
      className={cn("h-full", "antialiased", "font-sans")}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider>
          <QueryProvider>
            <AppShell>{children}</AppShell>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
