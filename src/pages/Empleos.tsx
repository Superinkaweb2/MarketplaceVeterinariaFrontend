export const Empleos = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#0d131b] dark:text-white">Empleos</h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Únete a nuestro equipo y ayuda a construir el futuro del bienestar animal.
            </p>
            <div className="bg-white dark:bg-[#1a2c2b] p-8 rounded-xl shadow-soft border border-slate-100 dark:border-slate-800">
                <h3 className="text-xl font-bold text-[#0d131b] dark:text-white mb-2">Actualmente no hay vacantes</h3>
                <p className="text-slate-500">Pronto abriremos nuevas posiciones. Envía tu CV a talentos@huella360.com</p>
            </div>
        </div>
    );
};
