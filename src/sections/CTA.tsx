import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();
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
        Únete a miles de veterinarios y dueños de mascotas que ya usan Huella360
        para conectar, atender y hacer crecer su negocio.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          onClick={() => navigate('/register')}
          aria-label="Iniciar Prueba Gratuita"
          className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-secondary hover:bg-opacity-90 shadow-lg shadow-secondary/30 transition-all group"
        >
          Comenzar gratis
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate('/contacto')}
          aria-label="Contactar con el equipo de ventas de Huella360"
          className="px-8 py-4 h-auto text-lg border-slate-200 dark:border-slate-700"
        >
          Hablar con ventas
        </Button>
      </div>
    </section>
  );
};