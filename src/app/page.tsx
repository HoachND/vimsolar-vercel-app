"use client";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Solutions from "@/components/Solutions";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import SavingsCalculator from "@/components/SavingsCalculator";
import Process from "@/components/Process";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Widgets from "@/components/Widgets";

export default function Home() {
  return (
    <I18nProvider>
      <main>
        <Navbar />
        <Hero />
        <Solutions />
        <Benefits />
        <About />
        <Gallery />
        <SavingsCalculator />
        <Process />
        <ContactForm />
        <Footer />
        <Widgets />
      </main>
    </I18nProvider>
  );
}
