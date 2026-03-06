import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { marketplaceService } from "../services/marketplaceService";
import { useState, useMemo } from "react";
import { useAuth } from "../../auth/context/useAuth";

export const CheckoutPage = () => {
    const { items, cartTotal } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Detect sandbox mode from the first item's mpPublicKey
    const isSandboxMode = useMemo(() => {
        if (items.length === 0) return false;
        const firstKey = items[0]?.mpPublicKey;
        return firstKey ? firstKey.startsWith('TEST-') : false;
    }, [items]);

    // Group items by company since backend orders are per company
    const groupedItems = items.reduce((acc, item) => {
        const empresaId = item.empresaId;
        if (!acc[empresaId]) {
            acc[empresaId] = {
                empresaNombre: item.empresaNombre,
                items: []
            };
        }
        acc[empresaId].items.push(item);
        return acc;
    }, {} as Record<number, { empresaNombre: string; items: any[] }>);

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            navigate("/login?redirect=/marketplace/checkout");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const empresaIds = Object.keys(groupedItems).map(Number);

            if (empresaIds.length > 1) {
                setError("Por ahora solo puedes comprar a una empresa a la vez. Por favor, deja solo productos de una misma veterinaria en tu carrito.");
                setLoading(false);
                return;
            }

            const empresaId = empresaIds[0];
            const group = groupedItems[empresaId];

            // Get Public Key from any item (they all belong to the same company)
            const mpPublicKey = group.items[0]?.mpPublicKey;

            if (!mpPublicKey) {
                setError("Esta veterinaria no tiene configurada su pasarela de pagos. Por favor, contacta con soporte.");
                setLoading(false);
                return;
            }

            const orderItems = group.items.map((item: any) => {
                const isService = item.itemType === 'service' || String(item.id).startsWith('service_');
                const numericId = typeof item.id === 'string'
                    ? Number(item.id.split('_').pop())
                    : item.id;

                return {
                    productoId: isService ? null : numericId,
                    servicioId: isService ? numericId : null,
                    cantidad: item.quantity
                };
            });

            // 1. Create Order
            const isFirstItemService = group.items[0]?.itemType === 'service' || String(group.items[0]?.id).startsWith('service_');

            const orderId = await marketplaceService.createOrder({
                empresaId: !isFirstItemService ? empresaId : null,
                veterinarioId: isFirstItemService ? empresaId : null,
                items: orderItems
            });

            // 2. Get Payment Preference
            const { initPoint, sandboxInitPoint } = await marketplaceService.getPaymentLink(orderId);

            // 3. Redirect to Mercado Pago.
            // IMPORTANT: sandboxInitPoint only works when the seller has TEST-type credentials.
            // If the seller used real OAuth (APP_USR- token), we must use initPoint always.
            // We detect TEST credentials by the public key prefix.
            const isSandboxCredentials = mpPublicKey.startsWith("TEST-");
            window.location.href = isSandboxCredentials ? sandboxInitPoint : initPoint;

            // Note: Cart will be cleared when the user returns to the success page.

        } catch (err: any) {
            console.error("Checkout error:", err);
            setError(err.response?.data?.message || "Ocurrió un error al procesar tu pedido. Inténtalo de nuevo.");
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <span className="material-symbols-outlined text-6xl text-slate-300 mb-4">shopping_cart</span>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Tu carrito está vacío</h2>
                <Link to="/marketplace" className="text-blue-600 font-medium hover:underline">
                    Ir a comprar algo
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-6">Confirmar Pedido</h1>

                {/* Sandbox Banner */}
                {isSandboxMode && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-amber-500 text-xl mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
                            <div>
                                <p className="text-sm font-bold text-amber-800 dark:text-amber-300">Modo Sandbox (Pruebas)</p>
                                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                                    Estás en entorno de pruebas. Para completar el pago:
                                </p>
                                <ul className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 space-y-1 list-disc list-inside">
                                    <li>Inicia sesión en MercadoPago con tu <strong>cuenta de comprador de prueba</strong> (no tu correo real)</li>
                                    <li>Usa las <a href="https://www.mercadopago.com.pe/developers/es/docs/your-integrations/test/cards" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-amber-900">tarjetas de prueba oficiales</a></li>
                                    <li>Mastercard: <code className="bg-amber-100 dark:bg-amber-900/40 px-1 rounded">5031 7557 3453 0604</code></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Resumen */}
                    <div className="lg:col-span-2 space-y-6">
                        {Object.entries(groupedItems).map(([empresaId, group]) => (
                            <div key={empresaId} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h2 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">storefront</span>
                                    Veterinaria: {group.empresaNombre}
                                </h2>
                                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {group.items.map((item) => (
                                        <div key={item.id} className="py-4 flex gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden shrink-0">
                                                <img src={item.imagenes?.[0]} alt={item.nombre} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-slate-900 dark:text-white font-medium">{item.nombre}</h3>
                                                <p className="text-sm text-slate-500">Cantidad: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-slate-900 dark:text-white font-bold">S/{(item.precioActual * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pago */}
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 sticky top-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Resumen de Pago</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Subtotal</span>
                                    <span>S/{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Envío</span>
                                    <span className="text-green-500 font-medium">Gratis</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xl font-black text-slate-900 dark:text-white">
                                    <span>Total</span>
                                    <span>S/{cartTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-900/30">
                                    {error}
                                </div>
                            )}

                            {!isAuthenticated && (
                                <p className="text-xs text-center text-slate-500 mb-4">
                                    Debes <Link to="/login" className="text-blue-600 font-bold hover:underline">Iniciar Sesión</Link> para completar el pedido.
                                </p>
                            )}

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white transition-all transform flex items-center justify-center gap-3 ${loading
                                    ? "bg-slate-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 active:scale-95"
                                    }`}
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined">payments</span>
                                        Pagar con MercadoPago
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-4 grayscale opacity-50">
                                <img src="https://logotipousa.com/wp-content/uploads/2021/11/mercadopago-logo.png" alt="Mercado Pago" className="h-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
