import { notFound } from "next/navigation";

export default function ToolDetailPage({ params }: { params: { slug: string } }) {
  if (!params.slug) return notFound();
  
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="font-heading text-3xl font-bold mb-6">Tool: {params.slug}</h1>
      <div className="glass-panel p-6 rounded-2xl">
        <p className="text-foreground/70">Tool details and AI analysis will go here.</p>
      </div>
    </div>
  );
}
