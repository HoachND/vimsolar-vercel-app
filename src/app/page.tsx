"use client";
import { I18nProvider } from "@/context/I18nContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Benefits from "@/components/Benefits";
import Solutions from "@/components/Solutions";
import Partners from "@/components/Partners";
import EscoSolution from "@/components/EscoSolution";
import StrategicPartners from "@/components/StrategicPartners";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
import SavingsCalculator from "@/components/SavingsCalculator";
import PartnerProgram from "@/components/PartnerProgram";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
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
        <Partners />
        <StrategicPartners />
        <Benefits />
        <EscoSolution />
        <About />
        <Gallery />
        <SavingsCalculator />
        <PartnerProgram />
        <Process />
        <Faq />
        <ContactForm />
        <Footer />
        <Widgets />
      </main>
    </I18nProvider>
  );
}
