import { Header } from "@/components/ui/Header";
import { Hero } from "@/components/ui/Hero";
import { FeatureBento } from "@/components/ui/FeatureBento";
import { InteractiveWalkthrough } from "@/components/ui/InteractiveWalkthrough";
import { Testimonials } from "@/components/ui/Testimonials";
import { FinalCTA } from "@/components/ui/FinalCTA";
import { Footer } from "@/components/ui/Footer";
import { FadeInSection } from "@/components/ui/FadeInSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--lp-bg)", color: "var(--lp-text-1)" }}>
      <Header />

      {/* ─── Hero ─── */}
      <main className="w-full min-h-screen flex items-center justify-center">
        <Hero />
      </main>

      {/* ─── Feature Bento ─── */}
      <FadeInSection className="w-full py-20 md:py-32 flex flex-col items-center" style={{ background: "var(--lp-bg)" }}>
        <div className="w-full">
          <FeatureBento />
        </div>
      </FadeInSection>

      {/* ─── How It Works ─── */}
      <FadeInSection className="w-full py-20 md:py-32" style={{ background: "var(--lp-bg-2)" }}>
        <InteractiveWalkthrough />
      </FadeInSection>

      {/* ─── Testimonials ─── */}
      <FadeInSection className="w-full flex flex-col items-center" style={{ background: "var(--lp-surface)" }}>
        <Testimonials />
      </FadeInSection>

      {/* ─── Final CTA ─── */}
      <FadeInSection className="w-full py-20 md:py-32 flex flex-col items-center" style={{ background: "var(--lp-bg)" }}>
        <div className="w-full py-12 md:py-20">
          <FinalCTA />
        </div>
      </FadeInSection>

      {/* ─── Footer — no FadeInSection so big text is never clipped/faded ─── */}
      <Footer />
    </div>
  );
}
