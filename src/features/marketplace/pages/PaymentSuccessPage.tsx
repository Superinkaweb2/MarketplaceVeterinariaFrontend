import { Link } from "react-router-dom";

export const PaymentSuccessPage = () => {
    return (
        <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-10 shadow-xl text-center border border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl font-bold">check</span>
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-4">¡Pago Exitoso!</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                    Tu pedido ha sido procesado correctamente. Recibirás un correo electrónico con los detalles y el comprobante de tu compra.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/portal/cliente"
                        className="block w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all"
                    >
                        Ver mis pedidos
                    </Link>
                    <Link
                        to="/marketplace"
                        className="block w-full py-4 text-blue-600 font-bold hover:underline transition-all"
                    >
                        Seguir comprando
                    </Link>
                </div>
            </div>
        </div>
    );
};
