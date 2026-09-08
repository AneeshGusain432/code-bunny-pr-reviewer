"use client"

import Navbar from "@/components/ui/navbar";
import { Hero } from "@/components/ui/hero";
import  ProductShowcase  from "@/components/ui/product-showcase";
import { ReviewIntelligence } from "@/components/ui/review-intelligence";
import { GitHubAutomation } from "@/components/ui/github-automation";
import { ProductPreview } from "@/components/ui/product-preview";
import { Pricing } from "@/components/ui/pricing";
import { FinalCTA } from "@/components/ui/final-cta";
import { Footer } from "@/components/ui/footer";
import CodeFlowHero from "@/components/ui/code-flow-hero";


export default function Home() {
  return (
    <div className="flex min-h-svh flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CodeFlowHero/>
        <ProductShowcase/>
        <ReviewIntelligence/>
        <GitHubAutomation/>
        <ProductPreview/>
        <Pricing/>
        <FinalCTA/>
        <Footer/>
      </main>
    </div>
  );
}
