"use client";

import { useState } from "react";
import { useTools, useSearchTools } from "@/hooks/use-tools";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Sparkles, ArrowRight, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  
  const { data: allTools, isLoading: isLoadingAll } = useTools();
  const { data: searchData, isLoading: isLoadingSearch } = useSearchTools(submittedQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const displayedTools = submittedQuery && searchData ? searchData.recommendations : allTools;
  const isLoading = submittedQuery ? isLoadingSearch : isLoadingAll;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-4 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-background to-background z-0" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary mb-6 text-sm font-medium">
            <Sparkles size={16} />
            <span>Discover your next AI superpower</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            The Ultimate AI Tool Advisor
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop searching blindly. Let our intelligent AI engine recommend the exact tools you need for your specific workflow and budget.
          </p>

          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto w-full group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search size={20} />
            </div>
            <Input
              type="text"
              placeholder="E.g., I need a tool for generating marketing videos..."
              className="h-16 pl-12 pr-32 text-lg rounded-2xl glass-panel border-primary/20 focus-visible:ring-primary shadow-xl"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 rounded-xl h-auto px-6 font-semibold"
              disabled={isLoadingSearch}
            >
              Advisor Search
            </Button>
          </form>
        </motion.div>
      </section>

      {/* AI Summary Section (only visible when searching) */}
      {submittedQuery && searchData?.summary && (
        <section className="px-6 md:px-12 py-8 max-w-6xl mx-auto w-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-6 rounded-2xl border-primary/20 flex gap-4 items-start"
          >
            <div className="p-3 bg-primary/10 rounded-full text-primary shrink-0">
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
              <p className="text-muted-foreground leading-relaxed">
                {searchData.summary}
              </p>
            </div>
          </motion.div>
        </section>
      )}

      {/* Tools Grid Section */}
      <section className="flex-1 px-6 md:px-12 py-16 max-w-7xl mx-auto w-full relative z-10">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {submittedQuery ? "Recommended Tools" : "Trending Tools"}
            </h2>
            <p className="text-muted-foreground">
              {submittedQuery ? `Tailored matches for "${submittedQuery}"` : "The most popular AI tools this week."}
            </p>
          </div>
          
          <Link href="/workflow">
            <Button variant="outline" className="gap-2 rounded-full glass hover:bg-primary hover:text-primary-foreground transition-all">
              <Zap size={16} />
              Build a Workflow
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass border-border/50 shadow-sm overflow-hidden h-[300px]">
                <CardHeader>
                  <Skeleton className="h-10 w-10 rounded-xl mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedTools?.map((tool: any, idx: number) => (
              <motion.div
                key={tool.slug || tool.id || idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link href={`/tools/${tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <Card className="glass border-border/50 shadow-sm hover:shadow-lg hover:border-primary/50 transition-all duration-300 h-full flex flex-col group cursor-pointer overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl font-bold text-primary shadow-inner">
                          {(tool.toolName || tool.name || "AI").charAt(0)}
                        </div>
                        {tool.pricingModel && (
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {tool.pricingModel}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                        {tool.toolName || tool.name}
                      </CardTitle>
                      {tool.category && (
                        <CardDescription>{tool.category}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {tool.whyItFits || tool.description}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-4 border-t border-border/50 mt-auto">
                      <div className="flex items-center text-sm font-medium text-primary w-full justify-between">
                        <span>View Details</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
            
            {(!displayedTools || displayedTools.length === 0) && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-xl font-medium mb-2">No tools found</p>
                <p>Try adjusting your search query.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
