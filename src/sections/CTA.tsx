import { Button } from "../components/ui/Button";

export const CTA = () => {
  return (
    <section
      aria-labelledby="cta-heading"
      className="w-full max-w-240 px-4 py-24 text-center mx-auto"
    >
      <h2
        id="cta-heading"
        className="text-[#0d131b] dark:text-white text-3xl md:text-5xl font-black mb-6 tracking-tight"
      >
        ¿Listo para modernizar tu clínica veterinaria?
      </h2>
      <p className="text-[#4c6c9a] dark:text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
        Únete a miles de veterinarios y dueños de mascotas que ya usan VetSaaS
        para conectar, atender y hacer crecer su negocio.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          aria-label="Comenzar gratis con VetSaaS"
          className="px-8 py-4 h-auto text-lg shadow-blue-500/30"
        >
          Comenzar gratis
        </Button>
        <Button
          variant="outline"
          aria-label="Contactar con el equipo de ventas de VetSaaS"
          className="px-8 py-4 h-auto text-lg border-slate-200 dark:border-slate-700"
        >
          Hablar con ventas
        </Button>
      </div>
    </section>
  );
};
