import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Store,
    Stethoscope,
    Heart,
    MapPin,
    Phone,
    Mail,
    Globe,
    Info
} from "lucide-react";
import { marketplaceService } from "../services/marketplaceService";
import { ProductCard } from "../components/ProductCard";
import { MapView } from "../components/MapView";
import type { Product } from "../types/marketplace";

interface Company {
    id: number;
    nombreComercial: string;
    descripcion: string;
    tipoServicio: string;
    logoUrl: string;
    bannerUrl: string;
    telefonoContacto: string;
    emailContacto: string;
    direccion: string;
    ciudad: string;
    latitud?: number;
    longitud?: number;
}

export const CompanyProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<Product[]>([]);
    const [adoptions, setAdoptions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'products' | 'services' | 'adoptions'>('products');

    const fetchCompanyData = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const companyId = parseInt(id);
            const [companyData, productsData, adoptionsData, servicesData] = await Promise.all([
                marketplaceService.getCompanyById(companyId),
                marketplaceService.getProductsByCompany(companyId),
                marketplaceService.getAdoptionsByCompany(companyId),
                marketplaceService.searchServices(0, 10, undefined, companyId)
            ]);

            setCompany(companyData);

            setProducts(productsData.content.map((p: any) => ({ ...p, itemType: 'product' })));

            setAdoptions(adoptionsData.content.map((a: any) => ({
                id: `adoption_${a.id}` as any,
                nombre: a.titulo,
                descripcion: a.historia,
                precio: 0,
                precioActual: 0,
                stock: 1,
                imagenes: a.mascotaFotoUrl ? [a.mascotaFotoUrl] : [],
                categoriaId: -1,
                categoriaNombre: "Adopción",
                empresaId: a.publicadoPorId,
                empresaNombre: a.publicadoPorNombre || companyData.nombreComercial,
                badge: { text: "Adopción", style: "adoption" },
                itemType: 'adoption' as any
            })));

            setServices(servicesData.content.map((s: any) => ({
                id: `service_${s.id}`,
                nombre: s.nombre,
                descripcion: s.descripcion,
                precio: s.precio,
                precioActual: s.precio,
                stock: 1,
                imagenes: s.imagenUrl ? [s.imagenUrl] : [],
                categoriaId: -2,
                categoriaNombre: "Servicio",
                empresaId: s.empresaId,
                empresaNombre: s.empresaNombre,
                mpPublicKey: s.mpPublicKey,
                badge: { text: s.modalidad || "Servicio", style: "service" },
                itemType: 'service'
            })));

            // Set initial tab based on availability
            if (productsData.content.length > 0) setActiveTab('products');
            else if (servicesData.content.length > 0) setActiveTab('services');
            else if (adoptionsData.content.length > 0) setActiveTab('adoptions');

        } catch (error) {
            console.error("Error fetching company profile data:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCompanyData();
    }, [fetchCompanyData]);

    if (loading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 py-12 animate-pulse">
                <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8" />
                <div className="flex gap-8">
                    <div className="w-32 h-32 bg-white dark:bg-slate-900 rounded-2xl -mt-20 ml-8 border-4 border-white dark:border-slate-950 shadow-xl" />
                    <div className="flex-1 mt-4">
                        <div className="h-8 bg-slate-200 dark:bg-slate-800 w-1/3 rounded-lg mb-2" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 w-1/4 rounded-md" />
                    </div>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Empresa no encontrada</h2>
                <Link to="/marketplace" className="text-blue-600 hover:underline mt-4 inline-block">Volver al Marketplace</Link>
            </div>
        );
    }

    const renderContent = () => {
        let items: Product[] = [];
        let emptyMessage = "";

        if (activeTab === 'products') {
            items = products;
            emptyMessage = "Esta empresa no tiene productos disponibles.";
        } else if (activeTab === 'services') {
            items = services;
            emptyMessage = "Esta empresa no tiene servicios disponibles.";
        } else if (activeTab === 'adoptions') {
            items = adoptions;
            emptyMessage = "Esta empresa no tiene mascotas en adopción.";
        }

        if (items.length === 0) {
            return (
                <div className="py-20 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800">
                    <Info className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                    <p className="text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items.map(item => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full pb-12">
            {/* Banner & Header */}
            <div className="relative w-full h-80 overflow-hidden">
                {company.bannerUrl ? (
                    <img
                        src={company.bannerUrl}
                        alt={company.nombreComercial}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-700" />
                )}
                <div className="absolute inset-0 bg-black/30" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative -mt-24 z-10 flex flex-col md:flex-row items-end md:items-center gap-6 mb-8">
                    <div className="w-40 h-40 bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-2xl border-4 border-white dark:border-slate-950 overflow-hidden">
                        {company.logoUrl ? (
                            <img
                                src={company.logoUrl}
                                alt={company.nombreComercial}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center rounded-2xl">
                                <Store className="w-16 h-16 text-slate-300 dark:text-slate-700" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left pt-16 md:pt-0">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <h1 className="text-4xl font-extrabold text-white md:text-slate-900 dark:md:text-white drop-shadow-md md:drop-shadow-none">
                                {company.nombreComercial}
                            </h1>
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                                {company.tipoServicio}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-100 md:text-slate-600 dark:md:text-slate-400">
                            <span className="flex items-center gap-1.5 drop-shadow-sm md:drop-shadow-none">
                                <MapPin className="w-4 h-4" />
                                {company.direccion}, {company.ciudad}
                            </span>
                            <span className="hidden md:inline text-slate-300">•</span>
                            <span className="flex items-center gap-1.5 drop-shadow-sm md:drop-shadow-none">
                                <Mail className="w-4 h-4" />
                                {company.emailContacto}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <a
                            href={`tel:${company.telefonoContacto}`}
                            className="px-6 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold rounded-2xl shadow-xl hover:bg-slate-50 transition-colors flex items-center gap-2 border border-slate-100 dark:border-slate-800"
                        >
                            <Phone className="w-4 h-4" />
                            Llamar
                        </a>
                    </div>
                </div>

                {/* Info & Navigation */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-blue-500" />
                                Sobre nosotros
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                {company.descripcion || "Sin descripción disponible."}
                            </p>

                            <div className="mt-8 space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-3 text-slate-500 hover:text-blue-500 transition-colors cursor-pointer group text-sm">
                                    <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                        <Globe className="w-4 h-4" />
                                    </div>
                                    Sitio Web
                                </div>

                                {company.latitud && company.longitud && (
                                    <div className="space-y-4 pt-4">
                                        <MapView lat={company.latitud} lng={company.longitud} />
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${company.latitud},${company.longitud}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                        >
                                            <MapPin className="w-3.5 h-3.5" />
                                            Cómo llegar
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        {/* Tabs */}
                        <div className="flex p-1.5 bg-slate-100/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-2xl w-fit">
                            <button
                                onClick={() => setActiveTab('products')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'products'
                                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Store className="w-4 h-4" />
                                Productos
                                {products.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 rounded-md">
                                        {products.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('services')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'services'
                                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Stethoscope className="w-4 h-4" />
                                Servicios
                                {services.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 rounded-md">
                                        {services.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab('adoptions')}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'adoptions'
                                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                <Heart className="w-4 h-4" />
                                En Adopción
                                {adoptions.length > 0 && (
                                    <span className="ml-1 text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 rounded-md">
                                        {adoptions.length}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Grid Section */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                    {activeTab === 'products' ? 'Nuestros Productos' : activeTab === 'services' ? 'Servicios Destacados' : 'Mascotas buscando un hogar'}
                                </h2>
                                <div className="h-px flex-1 mx-6 bg-slate-200 dark:bg-slate-800 hidden sm:block" />
                            </div>

                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
