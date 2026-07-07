import { useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../../auth/context/AuthContext";
import { PostularAdopcionModal } from "../../dashboard/shared/adopciones/components/PostularAdopcionModal";
import { AgendarCitaModal } from "../../dashboard/shared/appointments/AgendarCitaModal";
import { useProductDetails } from "../hooks/useProductDetails";
import type { Product } from "../types/marketplace";

export const ProductDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { product, rawAdoption, loading } = useProductDetails(id);
    const [quantity, setQuantity] = useState(1);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isCitaModalOpen, setIsCitaModalOpen] = useState(false);

    if (loading) return <LoadingSpinner />;
    if (!product) return <ProductNotFound />;

    const isAdoption = product.categoriaId === -1;
    const isService = product.categoriaId === -2;

    const servicioId = isService && typeof product.id === 'string'
        ? Number(product.id.replace('service_', ''))
        : undefined;

    return (
        <main className="container mx-auto px-4 py-8 lg:py-12 bg-slate-50 min-h-screen">
            <Link to="/marketplace" className="inline-flex items-center text-slate-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <span className="material-symbols-outlined mr-2">arrow_back</span>
                Volver al Marketplace
            </Link>

            <div className="flex flex-col lg:flex-row gap-12">
                <ProductGallery imagenes={product.imagenes} nombre={product.nombre} />

                <section className="lg:w-1/2 flex flex-col">
                    <ProductHeader product={product} />
                    {!isAdoption && <ProductPrice product={product} />}
                    <ProductStock stock={product.stock} isAdoption={isAdoption} isService={isService} />
                    <ProductDescription descripcion={product.descripcion} />
                    <SellerCard empresaNombre={product.empresaNombre} empresaTipoServicio={product.empresaTipoServicio} isAdoption={isAdoption} />

                    <div className="mt-auto space-y-4">
                        {!isAdoption && !isService && (
                            <ProductQuantitySelector quantity={quantity} setQuantity={setQuantity} stock={product.stock} />
                        )}

                        <div className="pt-2">
                            <ActionButtons
                                product={product}
                                quantity={quantity}
                                onOpenAdoptionModal={() => setIsApplyModalOpen(true)}
                                onOpenCitaModal={() => setIsCitaModalOpen(true)}
                            />
                        </div>
                    </div>
                </section>
            </div>

            {!isAdoption && <ProductTabs />}

            <PostularAdopcionModal
                isOpen={isApplyModalOpen}
                onClose={() => setIsApplyModalOpen(false)}
                adopcion={rawAdoption}
            />

            {isService && servicioId && product.empresaId && (
                <AgendarCitaModal
                    isOpen={isCitaModalOpen}
                    onClose={() => setIsCitaModalOpen(false)}
                    servicioId={servicioId}
                    empresaId={product.empresaId}
                    servicioNombre={product.nombre}
                />
            )}
        </main>
    );
};

const ProductGallery = ({ imagenes, nombre }: { imagenes?: string[], nombre: string }) => {
    const [mainImage, setMainImage] = useState(imagenes?.[0] || "https://via.placeholder.com/600");

    return (
        <section className="lg:w-1/2 space-y-4">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 aspect-square flex items-center justify-center p-8 relative group">
                <img alt={nombre} className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105" src={mainImage} />
            </div>

            {imagenes && imagenes.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {imagenes.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 transition-all border-2 ${mainImage === img ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-400'}`}
                        >
                            <img alt={`${nombre} ${idx + 1}`} className="w-full h-full object-cover" src={img} />
                        </button>
                    ))}
                </div>
            )}
        </section>
    );
};

const ProductHeader = ({ product }: { product: Product }) => (
    <>
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                {product.categoriaNombre}
            </span>
            <span className="text-xs text-slate-400">SKU: {product.id}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {product.nombre}
        </h1>
    </>
);

const ProductPrice = ({ product }: { product: Product }) => {
    const hasDiscount = product.precio > product.precioActual;
    const discountPercent = hasDiscount ? Math.round(((product.precio - product.precioActual) / product.precio) * 100) : 0;

    return (
        <div className="flex items-end gap-3 mb-6">
            <span className="text-3xl font-bold text-blue-600">
                S/. {product.precioActual.toFixed(2)}
            </span>
            {hasDiscount && (
                <>
                    <span className="text-lg text-slate-400 line-through mb-1 font-medium">
                        S/. {product.precio.toFixed(2)}
                    </span>
                    <span className="ml-2 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                        -{discountPercent}% OFF
                    </span>
                </>
            )}
        </div>
    );
};

const ProductStock = ({ stock, isAdoption, isService }: { stock: number, isAdoption: boolean, isService: boolean }) => {
    if (isAdoption || isService) return null;

    const isLowStock = stock > 0 && stock <= 5;
    const isOutOfStock = stock === 0;

    return (
        <div className="flex items-center gap-2 mb-6">
            <div className={`h-2 w-2 rounded-full ${isOutOfStock ? 'bg-red-500' : isLowStock ? 'bg-orange-500' : 'bg-green-500'}`}></div>
            <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-slate-600'}`}>
                {isOutOfStock ? 'Agotado' : isLowStock ? `¡Solo quedan ${stock} unidades!` : `En Stock (${stock} disponibles)`}
            </span>
        </div>
    );
};

const ProductDescription = ({ descripcion }: { descripcion?: string }) => (
    <div className="mb-8 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold text-slate-900 mb-2">Descripción</h3>
        <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
            {descripcion || "No hay descripción disponible para este producto."}
        </p>
    </div>
);

const SellerCard = ({ empresaNombre, empresaTipoServicio, isAdoption }: { empresaNombre: string, empresaTipoServicio?: string, isAdoption: boolean }) => {
    const initials = empresaNombre.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    return (
        <div className="bg-slate-50 rounded-2xl p-4 mb-8 flex items-center gap-4 border border-slate-100">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-500 font-bold border border-slate-200 shadow-sm">
                {initials}
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">
                    {isAdoption ? "Publicado por" : "Vendido por"}
                </p>
                <p className="text-sm font-bold text-slate-700">{empresaNombre}</p>
                {empresaTipoServicio && (
                    <p className="text-[10px] text-slate-500 uppercase">{empresaTipoServicio}</p>
                )}
            </div>
        </div>
    );
};

const ProductQuantitySelector = ({ quantity, setQuantity, stock }: { quantity: number, setQuantity: (q: number | ((prev: number) => number)) => void, stock: number }) => (
    <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-slate-700" htmlFor="quantity">Cantidad</label>
        <div className="flex items-center border border-slate-200 rounded-2xl bg-white">
            <button
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                className="p-3 px-5 hover:bg-slate-50 text-slate-600 rounded-l-2xl font-bold transition-colors"
            >
                −
            </button>
            <input
                id="quantity"
                type="number"
                value={quantity}
                readOnly
                className="w-12 border-none text-center text-sm focus:ring-0 bg-transparent text-slate-900 font-bold"
            />
            <button
                onClick={() => setQuantity(prev => Math.min(stock, prev + 1))}
                className="p-3 px-5 hover:bg-slate-50 text-slate-600 rounded-r-2xl font-bold transition-colors"
            >
                +
            </button>
        </div>
    </div>
);

const ActionButtons = ({ product, quantity, onOpenAdoptionModal, onOpenCitaModal }: {
    product: Product, quantity: number, onOpenAdoptionModal: () => void, onOpenCitaModal: () => void
}) => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const isAdoption = product.categoriaId === -1;
    const isService = product.categoriaId === -2;

    if (isAdoption) {
        return (
            <button onClick={onOpenAdoptionModal} className="w-full bg-orange-500 hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">pets</span> Solicitar Adopción
            </button>
        );
    }

    if (isService) {
        const handleReservar = () => {
            if (!isAuthenticated) return navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
            onOpenCitaModal();
        };
        return (
            <button onClick={handleReservar} className="w-full bg-purple-600 text-white hover:opacity-90 font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">event_available</span>
                Reservar Cita
            </button>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => addToCart(product, quantity)} className="bg-blue-600 hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">add_shopping_cart</span> Al carrito
            </button>
            <button onClick={() => { addToCart(product, quantity); navigate('/marketplace/checkout'); }} className="bg-slate-900 hover:opacity-90 text-white font-bold py-4 rounded-2xl transition-all shadow-md active:scale-95">
                Comprar Ahora
            </button>
        </div>
    );
};

const ProductTabs = () => (
    <section className="mt-16 pt-8 border-t border-slate-100">
        <div className="flex space-x-8 border-b border-slate-100 mb-8 overflow-x-auto scrollbar-hide">
            <button className="pb-4 border-b-2 border-blue-600 text-sm font-bold text-slate-900 whitespace-nowrap">Especificaciones</button>
            <button className="pb-4 border-b-2 border-transparent text-sm font-medium text-slate-400 hover:text-slate-600 whitespace-nowrap">Envíos y Devoluciones</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-sm max-w-4xl">
            <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Disponibilidad</span>
                <span className="font-medium text-slate-900">Envío a domicilio</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-50">
                <span className="text-slate-500">Garantía</span>
                <span className="font-medium text-slate-900">Con el vendedor</span>
            </div>
        </div>
    </section>
);

const ProductNotFound = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Producto no encontrado</h2>
        <Link to="/marketplace" className="text-blue-600 font-medium hover:underline">Volver al Marketplace</Link>
    </div>
);

const LoadingSpinner = () => (
    <div className="w-full max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="text-slate-500">Cargando detalles...</p>
        </div>
    </div>
);
