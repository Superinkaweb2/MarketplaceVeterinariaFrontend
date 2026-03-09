import { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { marketplaceService } from "../services/marketplaceService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../auth/context/AuthContext";
import { PostularAdopcionModal } from "../../dashboard/shared/adopciones/components/PostularAdopcionModal";
import type { AdoptionResponse } from "../../dashboard/shared/adopciones/types/adoption.types";
import type { Product } from "../types/marketplace";



export const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [rawAdoption, setRawAdoption] = useState<AdoptionResponse | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, items } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleReservar = () => {
        if (!isAuthenticated) {
            navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
            return;
        }
        if (product) addToCart(product, 1); // Services always 1
    };

    const isService = product?.categoriaId === -2;
    const isAdoption = product?.categoriaId === -1;

    // Check if this service is already in cart (services can only be reserved once)
    const isServiceInCart = isService && items.some(item => item.id === product?.id);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                if (id.startsWith("adoption_")) {
                    const actualId = Number(id.replace("adoption_", ""));
                    const data = await marketplaceService.getAdoptionById(actualId);
                    setRawAdoption(data);
                    const mappedProduct: Product = {
                        id: `adoption_${data.id}`,
                        nombre: data.titulo,
                        descripcion: data.historia,
                        precio: 0,
                        precioActual: 0,
                        stock: 1,
                        imagenes: data.mascotaFotoUrl ? [data.mascotaFotoUrl] : [],
                        categoriaId: -1,
                        categoriaNombre: "Adopción",
                        empresaId: data.publicadoPorId,
                        empresaNombre: data.publicadoPorNombre || "Dueño Particular",
                        empresaTipoServicio: data.publicadoPorTipoServicio,
                        badge: { text: "Adopción", style: "adoption" },
                        itemType: 'product'
                    };
                    setProduct(mappedProduct);

                } else if (id.startsWith("service_")) {
                    const actualId = Number(id.replace("service_", ""));
                    const data = await marketplaceService.getServiceById(actualId);
                    const mappedProduct: Product = {
                        id: `service_${data.id}`,
                        nombre: data.nombre,
                        descripcion: data.descripcion || "Sin descripción disponible.",
                        precio: data.precio,
                        precioActual: data.precio,
                        stock: 1,
                        imagenes: data.imagenUrl ? [data.imagenUrl] : [],
                        categoriaId: -2,
                        categoriaNombre: "Cita Médica",
                        empresaId: data.veterinarioId || data.empresaId,
                        empresaNombre: data.veterinarioId
                            ? `${data.veterinarioNombres} ${data.veterinarioApellidos}`
                            : (data.empresaNombre || "Veterinario"),
                        empresaTipoServicio: data.empresaTipoServicio || data.veterinarioEspecialidad,
                        mpPublicKey: data.mpPublicKey,
                        badge: { text: data.modalidad || "Servicio", style: "service" },
                        itemType: 'service'
                    };
                    setProduct(mappedProduct);

                } else {
                    const data = await marketplaceService.getProductById(Number(id));
                    setProduct({ ...data, itemType: 'product' });
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);


    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-20 flex justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
                    <p className="text-slate-500">Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Producto no encontrado</h2>
                <Link to="/marketplace" className="text-blue-600 font-medium hover:underline">
                    Volver al Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link
                    to="/marketplace"
                    className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition-colors group"
                >
                    <span className="material-symbols-outlined mr-2 group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Volver al Marketplace
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    {/* Imagenes */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                            <img
                                src={product.imagenes?.[0] || "https://via.placeholder.com/600"}
                                alt={product.nombre}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {product.imagenes && product.imagenes.length > 1 && (
                            <div className="grid grid-cols-4 gap-4">
                                {product.imagenes.slice(1, 5).map((img, i) => (
                                    <div key={i} className="aspect-square bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                                        <img src={img} alt={`${product.nombre} ${i + 2}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 uppercase tracking-wider ${isService
                                ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                : isAdoption
                                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400"
                                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                                }`}>
                                {product.categoriaNombre}
                            </span>
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                                {product.nombre}
                            </h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">
                                    {isAdoption ? "person" : "storefront"}
                                </span>
                                {isAdoption ? "Publicado por:" : isService ? "Ofrecido por:" : "Vendido por:"}{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {product.empresaNombre}
                                </span>
                                {product.empresaTipoServicio && (
                                    <span className="ml-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs border border-slate-200 dark:border-slate-700">
                                        {product.empresaTipoServicio}
                                    </span>
                                )}
                            </p>
                        </div>

                        {!isAdoption && (
                            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className={`text-4xl font-black ${isService ? "text-purple-700 dark:text-purple-400" : "text-slate-900 dark:text-white"}`}>
                                        S/.{product.precioActual.toFixed(2)}
                                    </span>
                                    {product.precioOferta && (
                                        <span className="text-xl text-slate-400 line-through font-medium">
                                            S/. {product.precio.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {isService ? (
                                    <p className="text-sm text-purple-600 dark:text-purple-400 font-medium flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">info</span>
                                        Los servicios se reservan por turno único
                                    </p>
                                ) : (
                                    <p className="text-sm text-slate-500 italic">Precios con impuestos incluidos</p>
                                )}
                            </div>
                        )}

                        {!isAdoption && !isService && (
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 uppercase tracking-wider">Cantidad</h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200 dark:border-slate-700">
                                        <button
                                            onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                            className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all font-bold text-xl"
                                        >
                                            −
                                        </button>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (!isNaN(val)) {
                                                    setQuantity(Math.max(1, Math.min(val, product.stock)));
                                                }
                                            }}
                                            className="w-12 text-center bg-transparent font-black text-lg text-slate-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                        />
                                        <button
                                            onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                            className="w-12 h-12 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all font-bold text-xl"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {product.stock} disponibles
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined">description</span>
                                Descripción
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
                                {product.descripcion || "No hay descripción disponible para este producto."}
                            </p>
                        </div>

                        <div className="mt-auto flex flex-col sm:flex-row gap-4">
                            {isAdoption ? (
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="flex-1 bg-orange-500 text-white font-bold py-4 px-8 rounded-2xl hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">pets</span>
                                    Solicitar Adopción
                                </button>
                            ) : isService ? (
                                <button
                                    onClick={handleReservar}
                                    disabled={isServiceInCart}
                                    className={`flex-1 font-bold py-4 px-8 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isServiceInCart
                                        ? "bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed shadow-none"
                                        : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20"
                                        }`}
                                >
                                    <span className="material-symbols-outlined">
                                        {isServiceInCart ? "check_circle" : !isAuthenticated ? "login" : "event_available"}
                                    </span>
                                    {isServiceInCart ? "Servicio ya reservado" : !isAuthenticated ? "Iniciar sesión para reservar" : "Reservar Turno"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => addToCart(product, quantity)}
                                    className="flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Añadir al carrito
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PostularAdopcionModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                adopcion={rawAdoption}
            />
        </div>
    );
};
