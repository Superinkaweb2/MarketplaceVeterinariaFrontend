import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { marketplaceService } from "../services/marketplaceService";
import { useCart } from "../context/CartContext";
import { PostularAdopcionModal } from "../../dashboard/shared/adopciones/components/PostularAdopcionModal";
import type { AdoptionResponse } from "../../dashboard/shared/adopciones/types/adoption.types";
import type { Product } from "../types/marketplace";



export const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [rawAdoption, setRawAdoption] = useState<AdoptionResponse | null>(null);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();


    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                if (id.startsWith("adoption_")) {
                    const actualId = Number(id.replace("adoption_", ""));
                    const data = await marketplaceService.getAdoptionById(actualId);
                    setRawAdoption(data);
                    // Map AdoptionResponse to Product type
                    const mappedProduct: Product = {
                        id: `adoption_${data.id}` as any,
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
                        badge: { text: "Adopción", style: "adoption" }
                    };
                    setProduct(mappedProduct);

                } else {
                    const data = await marketplaceService.getProductById(Number(id));
                    setProduct(data);
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
                            <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                                {product.categoriaNombre}
                            </span>
                            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                                {product.nombre}
                            </h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">
                                    {product.categoriaId === -1 ? "person" : "storefront"}
                                </span>
                                {product.categoriaId === -1 ? "Publicado por:" : "Vendido por:"}{" "}
                                <span className="font-semibold text-slate-700 dark:text-slate-300">
                                    {product.empresaNombre}
                                </span>
                            </p>

                        </div>

                        {product.categoriaId !== -1 && (
                            <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                <div className="flex items-baseline gap-4 mb-2">
                                    <span className="text-4xl font-black text-slate-900 dark:text-white">
                                        ${product.precioActual.toFixed(2)}
                                    </span>
                                    {product.precioOferta && (
                                        <span className="text-xl text-slate-400 line-through font-medium">
                                            ${product.precio.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-500 italic">Precios con impuestos incluidos</p>
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
                            {product.categoriaId === -1 ? (
                                <button
                                    onClick={() => setIsApplyModalOpen(true)}
                                    className="flex-1 bg-orange-500 text-white font-bold py-4 px-8 rounded-2xl hover:bg-orange-600 shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">pets</span>
                                    Solicitar Adopción
                                </button>

                            ) : (
                                <button
                                    onClick={() => addToCart(product)}
                                    className="flex-1 bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="material-symbols-outlined">add_shopping_cart</span>
                                    Añadir al carrito
                                </button>
                            )}
                            <button className="sm:w-16 h-16 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-500 transition-all">
                                <span className="material-symbols-outlined text-2xl">favorite</span>
                            </button>
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
