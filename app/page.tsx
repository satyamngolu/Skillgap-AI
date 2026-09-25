import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import HowItWorks from "../components/HowitWorks";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070b1a]">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Footer />
    </main>
  );
}