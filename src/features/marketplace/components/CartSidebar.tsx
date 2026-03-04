import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export const CartSidebar = () => {
    const { items, isOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={toggleCart} />

            <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
                <div className="w-screen max-w-md transform transition-all">
                    <div className="flex h-full flex-col bg-white dark:bg-slate-900 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-6 font-bold">
                            <h2 className="text-xl text-slate-900 dark:text-white">Tu Carrito</h2>
                            <button
                                onClick={toggleCart}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-6">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 font-light">shopping_bag</span>
                                    <p className="text-slate-500 italic">Tu carrito está vacío.</p>
                                    <button
                                        onClick={toggleCart}
                                        className="mt-4 text-blue-600 font-medium hover:underline"
                                    >
                                        Continuar comprando
                                    </button>
                                </div>
                            ) : (
                                <ul className="space-y-6">
                                    {items.map((item) => {
                                        const isServiceItem = item.itemType === 'service' || String(item.id).startsWith('service_');
                                        return (
                                            <li key={item.id} className="flex gap-4 group">
                                                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
                                                    <img
                                                        src={item.imagenes?.[0] || 'https://via.placeholder.com/100'}
                                                        alt={item.nombre}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex flex-1 flex-col">
                                                    <div className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
                                                        <h3 className="line-clamp-1">{item.nombre}</h3>
                                                        <p className="ml-4">${(item.precioActual * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                    <p className="mt-1 text-xs text-slate-500 line-clamp-1">{item.empresaNombre}</p>

                                                    <div className="mt-auto flex items-center justify-between text-sm">
                                                        {isServiceItem ? (
                                                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-lg">
                                                                <span className="material-symbols-outlined text-xs">event_available</span>
                                                                1 turno
                                                            </span>
                                                        ) : (
                                                            <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                    className="px-2 py-1 hover:text-blue-600 transition-colors"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="px-2 text-xs font-medium dark:text-gray-300">{item.quantity}</span>
                                                                <button
                                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                    className="px-2 py-1 hover:text-blue-600 transition-colors"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-red-500 hover:text-red-700 font-medium transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>

                        {items.length > 0 && (
                            <div className="border-t border-slate-200 dark:border-slate-800 px-6 py-6 space-y-4">
                                <div className="flex justify-between text-base font-bold text-slate-900 dark:text-white">
                                    <p>Subtotal</p>
                                    <p>${cartTotal.toFixed(2)}</p>
                                </div>
                                <p className="text-xs text-slate-500">Impuestos y envío calculados al finalizar la compra.</p>
                                <button
                                    className="w-full rounded-xl bg-blue-600 px-6 py-3 text-base font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform active:scale-[0.98] text-center"
                                    onClick={() => {
                                        toggleCart();
                                        navigate("/marketplace/checkout");
                                    }}
                                >
                                    Finalizar Compra
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
