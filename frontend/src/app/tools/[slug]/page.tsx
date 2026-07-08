"use client";

import { useToolBySlug } from "@/hooks/use-tools";
import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function ToolDetailsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: tool, isLoading } = useToolBySlug(slug);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Skeleton className="h-8 w-24 mb-10" />
        <div className="flex gap-8 mb-12">
          <Skeleton className="w-32 h-32 rounded-3xl shrink-0" />
          <div className="flex-1 pt-2">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h1 className="text-3xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the AI tool you're looking for.</p>
        <Link href="/">
          <Button>Back to Search</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12">
        <ArrowLeft size={16} />
        Back to Advisor
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-8 mb-16"
      >
        <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center text-5xl font-bold text-primary shadow-inner shrink-0">
          {(tool.toolName || tool.name || "AI").charAt(0)}
        </div>
        
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{tool.toolName || tool.name}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <span className="inline-flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              4.9
            </span>
            <span>•</span>
            <span className="capitalize">{tool.category || "AI Assistant"}</span>
            {tool.pricingModel && (
              <>
                <span>•</span>
                <span className="px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                  {tool.pricingModel}
                </span>
              </>
            )}
          </div>
          
          <div className="flex gap-4">
            <Button className="gap-2 rounded-xl h-12 px-8">
              Visit Website
              <ExternalLink size={16} />
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl h-12 glass">
              <ShieldCheck size={16} />
              Save Tool
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel p-8 rounded-3xl border-primary/10"
      >
        <h2 className="text-2xl font-bold mb-4">About this tool</h2>
        <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {tool.description || "No detailed description available for this tool."}
        </p>
      </motion.div>
    </div>
  );
}
