import type { Metadata } from "next";
import { Inter, Hanken_Grotesk, Geist } from "next/font/google";
import { ClerkProvider, SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import QueryProvider from "@/lib/query-provider";
import { CommandPalette } from "@/components/command-palette";
import "./globals.css";
import "@clerk/ui/themes/shadcn.css";
import { shadcn } from "@clerk/ui/themes";
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
    <html
      lang="en"
      className={cn("h-full", "antialiased", "dark", inter.variable, hanken.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ClerkProvider appearance={{ theme: shadcn }}>
          <QueryProvider>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2">
                  <a href="/" className="font-bold text-lg tracking-tight">AI Advisor</a>
                </div>
                <div className="flex items-center gap-4">
                  <SignedOut>
                    <SignInButton mode="modal" />
                    <SignUpButton mode="modal" />
                  </SignedOut>
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                </div>
              </div>
            </header>
            <main className="flex-1">
              {children}
            </main>
            <CommandPalette />
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
