import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import QueryProvider from "@/lib/query-provider";
import { CommandPalette } from "@/components/command-palette";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Advisor | Discover The Best AI Tools",
  description: "Intelligently discover, compare, evaluate, and choose the best AI tools based on your exact needs, budget, and workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={cn("h-full", "antialiased", "dark", inter.variable, hanken.variable, "font-sans", geist.variable)}
      >
        <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
          <QueryProvider>
            {children}
            <CommandPalette />
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
