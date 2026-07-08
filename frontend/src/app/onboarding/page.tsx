export default function OnboardingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-screen bg-background">
      <h1 className="font-heading text-4xl text-foreground font-bold mb-4">Welcome to AI Advisor</h1>
      <p className="text-foreground/70 mb-8 max-w-md">Let's personalize your experience to find the absolute best AI tools for your specific workflow.</p>
      <button className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors">
        Get Started
      </button>
    </div>
  );
}
