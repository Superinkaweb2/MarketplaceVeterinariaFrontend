import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Hero } from "../sections/Hero";
import { Segments } from "../sections/Segments";
import { Pricing } from "../sections/Pricing";
import { CTA } from "../sections/CTA";
import { ProfilesInfo } from "./ProfileInfo";
import { Seo } from "../components/Seo";

function Home() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  return (
    <>
      <Seo title="Inicio" description="Huella360 - Plataforma integral de servicios veterinarios. Encuentra productos, servicios y profesionales para el bienestar de tus mascotas." />
      <Hero />
      <Segments />

      <ProfilesInfo />

      <Pricing />
      <CTA />
    </>
  );
}

export default Home;
