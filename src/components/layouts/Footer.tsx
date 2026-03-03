import { Globe, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="w-full bg-white dark:bg-[#0d131b] border-t border-[#e7ecf3] dark:border-slate-800 pt-16 pb-8 px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#0d131b] dark:text-white">
            <img
              src="/LOGO HUELLA360_logo primario.png"
              alt="Logo Huella360"
              className="h-8 w-auto object-contain"
            />
            <span className="text-xl font-bold">Huella360</span>
          </div>
          <p className="text-[#4c6c9a] dark:text-slate-500 text-sm leading-relaxed">
            Empoderando a la comunidad veterinaria con tecnología que conecta corazones y salud.
          </p>
          <div className="flex gap-4 mt-2">
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              <Globe size={20} />
            </a>
            <a
              className="text-slate-400 hover:text-primary transition-colors"
              href="#"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {[
          {
            title: "Plataforma",
            links: [
              { name: "Para Veterinarios", href: "/#veterinarios" },
              { name: "Para Dueños", href: "/#duenos" },
              { name: "Marketplace", href: "/marketplace" },
              { name: "Precios", href: "/#pricing" }
            ],
          },
          {
            title: "Empresa",
            links: [
              { name: "Sobre Nosotros", href: "/sobre-nosotros" },
              { name: "Empleos", href: "/empleos" },
              { name: "Blog", href: "/blog" },
              { name: "Contacto", href: "/contacto" }
            ],
          },
        ].map((section) => (
          <div key={section.title} className="flex flex-col gap-4">
            <h4 className="font-bold text-[#0d131b] dark:text-white">
              {section.title}
            </h4>
            {section.links.map((link) => (
              link.href.startsWith("/#") ? (
                <a
                  key={link.name}
                  className="text-[#4c6c9a] dark:text-slate-400 text-sm hover:text-primary transition-colors"
                  href={link.href}
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  className="text-[#4c6c9a] dark:text-slate-400 text-sm hover:text-primary transition-colors"
                  to={link.href}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
        ))}

        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-[#0d131b] dark:text-white">
            Mantente al Día
          </h4>
          <p className="text-[#4c6c9a] dark:text-slate-400 text-sm">
            Suscríbete a nuestro boletín para recibir las últimas novedades.
          </p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); alert('¡Gracias por suscribirte!'); }}>
            <input
              className="flex-1 rounded-lg border border-[#cfd9e7] dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:border-primary dark:text-white"
              placeholder="Ingresa tu correo"
              type="email"
            />
            <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-bold text-sm hover:bg-blue-700 transition-colors cursor-pointer">
              Unirse
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#e7ecf3] dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-[#4c6c9a] dark:text-slate-500 text-sm">
          © 2026 Huella360. Todos los derechos reservados.
        </p>
        <div className="flex gap-6 text-[#4c6c9a] dark:text-slate-500 text-sm">
          <Link className="hover:text-primary transition-colors" to="/privacidad">
            Política de Privacidad
          </Link>
          <Link className="hover:text-primary transition-colors" to="/terminos">
            Términos de Servicio
          </Link>
        </div>
      </div>
    </footer>
  );
};