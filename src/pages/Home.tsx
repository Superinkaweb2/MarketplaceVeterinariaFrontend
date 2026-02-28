import { Hero } from "../sections/Hero";
import { TrustedBy } from "../sections/TrustedBy";
import { Segments } from "../sections/Segments";
import { Pricing } from "../sections/Pricing";
import { CTA } from "../sections/CTA";

function Home() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <Segments />

      <div className="w-full max-w-7xl px-4 md:px-10 py-20">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-[#0d131b] dark:text-white text-3xl font-bold">
            Marketplace Preview
          </h2>
        </div>
        {/* Aqui va productos o servicios */}
      </div>

      <Pricing />
      <CTA />
    </>
  );
}

export default Home;
