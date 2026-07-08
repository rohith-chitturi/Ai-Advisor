"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Workflow } from "lucide-react";

export default function WorkflowBuilder() {
  const [goal, setGoal] = useState("");
  const [workflow, setWorkflow] = useState<any[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!goal) return;
    setIsGenerating(true);
    // Mock generation delay
    setTimeout(() => {
      setWorkflow([
        { step: 1, role: "Ideation", tool: "ChatGPT (GPT-4)", desc: "Brainstorm core concepts and outlines." },
        { step: 2, role: "Writing", tool: "Jasper AI", desc: "Draft long-form copy based on the outline." },
        { step: 3, role: "Visuals", tool: "Midjourney", desc: "Generate custom header images for the content." }
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-6">
          <Workflow size={32} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">AI Workflow Builder</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe your ultimate goal, and our AI will architect the perfect stack of tools to get it done efficiently.
        </p>
      </div>

      <div className="glass-panel p-2 rounded-2xl max-w-3xl mx-auto flex mb-16 relative z-20">
        <Input 
          className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-lg h-14 pl-4"
          placeholder="E.g., I want to automate my weekly newsletter creation..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <Button 
          className="h-14 px-8 rounded-xl font-semibold gap-2"
          onClick={handleGenerate}
          disabled={isGenerating || !goal}
        >
          {isGenerating ? "Architecting..." : "Build Workflow"}
          <Sparkles size={18} />
        </Button>
      </div>

      {isGenerating && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Bot size={48} className="animate-bounce mb-4 text-primary" />
          <p className="text-lg font-medium animate-pulse">Analyzing optimal AI stacks for your goal...</p>
        </div>
      )}

      {workflow && !isGenerating && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-3xl mx-auto relative z-10"
        >
          {workflow.map((item, i) => (
            <div key={item.step} className="flex gap-6 items-start">
              <div className="flex flex-col items-center mt-2">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg z-10 shadow-lg">
                  {item.step}
                </div>
                {i !== workflow.length - 1 && (
                  <div className="w-0.5 h-24 bg-gradient-to-b from-primary/50 to-transparent -my-2 -z-10" />
                )}
              </div>
              
              <Card className="flex-1 glass p-6 border-primary/20 hover:border-primary/50 transition-colors">
                <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-2 uppercase tracking-wider">
                  <ArrowRight size={14} />
                  {item.role}
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.tool}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </Card>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
