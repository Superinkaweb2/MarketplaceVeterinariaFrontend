import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-5">
              <img
                src="/LOGO HUELLA360_logo primario.png"
                alt="Huella360 Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-xs leading-relaxed">
              Construyendo la infraestructura digital para el cuidado moderno de
              las mascotas en Latinoamérica.
            </p>
            <div className="flex items-center border border-slate-200 rounded-full p-1 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all max-w-xs">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 py-2 outline-none placeholder:text-slate-400"
                placeholder="Tu correo electrónico"
                type="email"
              />
              <button className="bg-text-primary text-white p-2 rounded-full hover:bg-primary transition-colors">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm mb-4">Plataforma</h4>
            <ul className="space-y-2.5">
              {["Para Dueños", "Software Veterinario", "Marketplace B2B", "Precios"].map((item) => (
                <li key={item}>
                  <a className="text-text-secondary text-sm hover:text-primary transition-colors" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm mb-4">Empresa</h4>
            <ul className="space-y-2.5">
              {["Sobre Nosotros", "Blog", "Carreras", "Contacto"].map((item) => (
                <li key={item}>
                  <a className="text-text-secondary text-sm hover:text-primary transition-colors" href="#">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary text-sm mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {[
                { name: "Privacidad", to: "/privacidad" },
                { name: "Términos de Servicio", to: "/terminos" },
                { name: "Política de Cookies", to: "/cookies" },
                { name: "Libro de Reclamaciones", to: "/libro-reclamaciones" },
              ].map((item) => (
                <li key={item.name}>
                  <Link className="text-text-secondary text-sm hover:text-primary transition-colors" to={item.to}>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-text-secondary">
            © 2026 Huella360 Inc. Todos los derechos reservados.
          </p>
          <div className="flex gap-3">
            {["Twitter", "Instagram", "LinkedIn"].map((social) => (
              <a
                key={social}
                className="text-slate-400 hover:text-primary transition-colors"
                href="#"
                aria-label={social}
              >
                <span className="sr-only">{social}</span>
                <div className="w-5 h-5 bg-current rounded opacity-40" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
