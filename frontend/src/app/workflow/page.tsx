export default function WorkflowBuilderPage() {
  return (
    <div className="h-screen w-full bg-background flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="glass absolute top-0 w-full z-10 px-6 py-4 border-b border-white/5 flex justify-between items-center">
        <h1 className="font-heading text-xl font-bold">AI Workflow Builder</h1>
        <div className="flex gap-4">
          <button className="px-4 py-2 rounded-lg bg-surface border border-white/10 text-sm">Save Template</button>
          <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">Run Workflow</button>
        </div>
      </header>

      {/* Canvas Area Mockup */}
      <div className="flex-1 w-full h-full pt-20 pb-4 px-4 flex items-center justify-center pattern-grid-lg text-white/5">
        <p className="text-foreground/50 text-lg font-medium">Infinite Canvas Canvas Area</p>
      </div>
    </div>
  );
}
