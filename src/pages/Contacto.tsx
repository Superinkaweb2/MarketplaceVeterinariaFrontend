import { Mail, MessageSquare, Send } from "lucide-react";

export const Contacto = () => {
  return (
    <div className="bg-[#f6f8f8] dark:bg-[#12201f] min-h-screen transition-colors duration-300">
      {/* 1. Hero Section de Contacto */}
      <section className="max-w-7xl mx-auto px-4 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#2D3E82] dark:text-white tracking-tight">
          Estamos aquí para <span className="text-[#1ea59c]">ayudarte</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Ya seas un veterinario buscando optimizar su clínica o un dueño de mascota con dudas, 
          nuestro equipo de Huella360 está listo para escucharte.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* 2. Columna de Información (Izquierda) */}
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#2D3E82] dark:text-white">Canales directos</h2>
              
              {/* Tarjeta Email */}
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-[#1a2c2b] rounded-xl shadow-soft border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-[#1ea59c]/10 rounded-lg flex items-center justify-center text-[#1ea59c] shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0d131b] dark:text-white">Ventas y Soporte</h3>
                  <a href="mailto:ventas@huella360.com" className="text-[#1ea59c] hover:underline font-medium">
                    ventas@huella360.com
                  </a>
                  <p className="text-sm text-slate-500 mt-1">Respuesta en menos de 24h.</p>
                </div>
              </div>

              {/* Tarjeta WhatsApp/Chat */}
              <div className="flex items-start gap-4 p-6 bg-white dark:bg-[#1a2c2b] rounded-xl shadow-soft border border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 bg-[#2D3E82]/10 rounded-lg flex items-center justify-center text-[#2D3E82] shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-[#0d131b] dark:text-white">Chat en vivo</h3>
                  <p className="text-slate-600 dark:text-slate-400">Lunes a Viernes</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Formulario de Contacto (Derecha) */}
          <div className="lg:col-span-2">
            <form className="bg-white dark:bg-[#1a2c2b] p-8 md:p-10 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D3E82] dark:text-slate-300">Nombre completo</label>
                  <input 
                    type="text" 
                    placeholder="Ej. Juan Pérez"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#12201f] focus:ring-2 focus:ring-[#1ea59c] outline-none transition-all dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#2D3E82] dark:text-slate-300">Correo electrónico</label>
                  <input 
                    type="email" 
                    placeholder="juan@ejemplo.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#12201f] focus:ring-2 focus:ring-[#1ea59c] outline-none transition-all dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D3E82] dark:text-slate-300">¿En qué perfil estás interesado?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#12201f] focus:ring-2 focus:ring-[#1ea59c] outline-none transition-all dark:text-white appearance-none">
                  <option>Dueño de Mascota</option>
                  <option>Veterinario / Clínica</option>
                  <option>Negocio / Proveedor</option>
                  <option>Otro</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#2D3E82] dark:text-slate-300">Tu mensaje</label>
                <textarea 
                  rows={4}
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#12201f] focus:ring-2 focus:ring-[#1ea59c] outline-none transition-all dark:text-white resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full md:w-max px-10 py-4 bg-[#1ea59c] hover:bg-[#198f87] text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-[#1ea59c]/20"
              >
                Enviar mensaje
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
};