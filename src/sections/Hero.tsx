import { ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();
  return (
    <section
      aria-label="Sección principal de Huella360"
      className="relative pt-8 pb-10 lg:pt-10 lg:pb-18 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="text-center lg:text-left">

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6 dark:bg-primary/20">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Lanzamiento Próximo
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-secondary dark:text-white mb-6 leading-tight">
              La Plataforma
              <p>Todo en Uno para el</p> 
              <span className="text-primary">Cuidado Animal Moderno</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Optimiza tu práctica veterinaria, gestiona historiales médicos y haz crecer tu negocio con nuestro ecosistema de marketplace integrado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                variant="primary"
                onClick={() => navigate('/register')}
                aria-label="Iniciar Prueba Gratuita"
                className="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-semibold rounded-full text-white bg-secondary hover:bg-opacity-90 shadow-lg shadow-secondary/30 transition-all group"
              >
                <span>Iniciar Prueba Gratuita</span>
                <ArrowRight
                  size={18}
                  aria-hidden="true"
                  className="ml-2 group-hover:translate-x-1 transition-transform"
                />
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-500">
              Únete a las primeras clínicas que están transformando el cuidado animal.
            </p>
          </div>

          <div className="relative lg:h-auto group">

            <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl dark:bg-primary/20 transition-opacity duration-1000 group-hover:opacity-80"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-secondary/10 rounded-full blur-3xl dark:bg-secondary/20 transition-opacity duration-1000 group-hover:opacity-80"></div>

            <img
              alt="Veterinario examinando a un perro"
              className="relative rounded-full shadow-2xl border-4 border-white dark:border-surface-dark z-10 transform rotate-1 group-hover:rotate-0 transition-transform duration-500 w-full object-cover aspect-square"
              src="/hero-huella360.jpg"
              loading="eager"
            />
          </div>
        </div>
      </div>
    </section>
  );
};