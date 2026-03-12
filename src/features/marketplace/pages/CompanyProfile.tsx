import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Store,
    Stethoscope,
    Heart,
    MapPin,
    Mail,
    Info,
    Navigation,
    Gift
} from "lucide-react";
import { marketplaceService } from "../services/marketplaceService";
import { ProductCard } from "../components/ProductCard";
import { MapView } from "../components/MapView";
import type { Product } from "../types/marketplace";
import { RewardsStore } from "../../dashboard/gamification/components/client/RewardsStore";

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

type TabType = 'products' | 'services' | 'adoptions' | 'rewards';

export const CompanyProfile = () => {
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<Product[]>([]);
    const [adoptions, setAdoptions] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('products');

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

            // Smart tab selection based on content availability
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
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
                <div className="h-[300px] bg-slate-200 dark:bg-slate-800 rounded-3xl mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-4 -mt-24 relative z-10">
                        <div className="w-32 h-32 bg-slate-300 dark:bg-slate-700 rounded-2xl border-4 border-white dark:border-slate-950" />
                        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />
                    </div>
                    <div className="lg:col-span-3 mt-8 lg:mt-0 space-y-6">
                        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <Store className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Empresa no encontrada</h2>
                <p className="text-slate-500 mt-2 mb-6">La empresa que buscas no existe o ha sido eliminada.</p>
                <Link 
                    to="/marketplace" 
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                >
                    Volver al Marketplace
                </Link>
            </div>
        );
    }

    const tabs = [
        { id: 'products', label: 'Productos', icon: Store, count: products.length },
        { id: 'services', label: 'Servicios', icon: Stethoscope, count: services.length },
        { id: 'adoptions', label: 'En Adopción', icon: Heart, count: adoptions.length },
        { id: 'rewards', label: 'Recompensas', icon: Gift, count: null }
    ] as const;

    const renderContent = () => {
        const items = activeTab === 'products' ? products : activeTab === 'services' ? services : adoptions;
        const emptyMessage = activeTab === 'products' ? "No hay productos disponibles en este momento." :
                             activeTab === 'services' ? "No hay servicios disponibles en este momento." : 
                             "No hay mascotas en adopción en este momento.";

        if (activeTab === 'rewards') {
            return <RewardsStore empresaId={company.id} />;
        }

        if (items.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                    <Info className="w-10 h-10 text-slate-400 mb-3" />
                    <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-1">Nada por aquí</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {items.map(item => (
                    <ProductCard key={item.id} product={item} />
                ))}
            </div>
        );
    };

    return (
        <div className="w-full min-h-screen bg-white dark:bg-slate-950 pb-20">
            {/* Banner Section */}
            <div className="relative w-full h-[280px] md:h-[320px] bg-slate-100 dark:bg-slate-900">
                {company.bannerUrl ? (
                    <img
                        src={company.bannerUrl}
                        alt={`Banner de ${company.nombreComercial}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-400" />
                )}
                {/* Subtle gradient overlay to ensure header legibility if moved up */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar / Company Info */}
                    <div className="lg:col-span-4 xl:col-span-3 -mt-20 relative z-10">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            {/* Logo */}
                            <div className="w-28 h-28 bg-white dark:bg-slate-950 rounded-2xl p-1.5 shadow-sm border border-slate-100 dark:border-slate-800 mb-6">
                                {company.logoUrl ? (
                                    <img
                                        src={company.logoUrl}
                                        alt={company.nombreComercial}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center rounded-xl">
                                        <Store className="w-10 h-10 text-slate-400" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="mb-6">
                                <span className="inline-block px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-md mb-3">
                                    {company.tipoServicio}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
                                    {company.nombreComercial}
                                </h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                    {company.descripcion || "Este negocio aún no ha añadido una descripción a su perfil."}
                                </p>
                            </div>

                            {/* Contact Details */}
                            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-sm">
                                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300">
                                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                                    <span className="leading-snug">{company.direccion}, {company.ciudad}</span>
                                </div>
                                {company.emailContacto && (
                                    <span className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors group">
                                        <Mail className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                                        <span className="truncate">{company.emailContacto}</span>
                                    </span>
                                )}
                            </div>

                            {/* Map */}
                            {company.latitud && company.longitud && (
                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60">
                                    <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                                        Ubicación
                                    </h3>
                                    <div className="rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 mb-3 h-32">
                                        <MapView lat={company.latitud} lng={company.longitud} />
                                    </div>
                                    <a
                                        href={`https://www.google.com/maps/dir/?api=1&destination=${company.latitud},${company.longitud}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-xl transition-colors"
                                    >
                                        <Navigation className="w-4 h-4" />
                                        Cómo llegar
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 xl:col-span-9 pt-8 lg:pt-12">
                        
                        {/* Minimalist Tabs */}
                        <div className="flex overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800 mb-8">
                            <div className="flex gap-6 px-1">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.id;
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as TabType)}
                                            className={`
                                                relative flex items-center gap-2 pb-4 text-sm font-medium transition-colors whitespace-nowrap
                                                ${isActive 
                                                    ? 'text-blue-600 dark:text-blue-400' 
                                                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                                                }
                                            `}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                            {tab.label}
                                            <span className={`
                                                px-2 py-0.5 rounded-full text-xs
                                                ${isActive 
                                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                }
                                            `}>
                                                {tab.count}
                                            </span>
                                            
                                            {/* Active Indicator */}
                                            {isActive && (
                                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Content Grid */}
                        <div className="min-h-[400px]">
                            {renderContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};