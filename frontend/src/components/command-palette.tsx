"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTools } from "@/hooks/use-tools";
import { Bot, ExternalLink, Workflow } from "lucide-react";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { data: tools } = useTools();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search tools..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
            <Bot className="mr-2 h-4 w-4" />
            <span>AI Advisor Search</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push("/workflow"))}>
            <Workflow className="mr-2 h-4 w-4" />
            <span>Workflow Builder</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Trending Tools">
          {tools?.slice(0, 5).map((tool: any) => (
            <CommandItem
              key={tool.slug || tool.id}
              onSelect={() => runCommand(() => router.push(`/tools/${tool.slug || tool.name.toLowerCase().replace(/\s+/g, '-')}`))}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>{tool.toolName || tool.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
