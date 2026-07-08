"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchTools, getToolBySlug, searchTools } from "../lib/api";

export function useTools() {
  return useQuery({
    queryKey: ["tools"],
    queryFn: fetchTools,
  });
}

export function useToolBySlug(slug: string) {
  return useQuery({
    queryKey: ["tool", slug],
    queryFn: () => getToolBySlug(slug),
    enabled: !!slug,
  });
}

export function useSearchTools(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => searchTools(query),
    enabled: !!query,
  });
}
