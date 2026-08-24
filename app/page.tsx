import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { RecipeBrowser } from "@/components/RecipeBrowser";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <RecipeBrowser />
      <Footer />
    </main>
  );
}
