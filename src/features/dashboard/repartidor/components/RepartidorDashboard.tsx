import React, { useState, useEffect } from 'react';
import { useRepartidor } from '../hooks/useRepartidor';
import { useGeolocation } from '../hooks/useGeolocation';
import { useStompClient } from '../hooks/useStompClient';
import Swal from 'sweetalert2';
import { repartidorService } from '../services/repartidorService';
import { MapPin, Store, Navigation, CheckCircle, Package, AlertCircle, Power, User, Map, Bike, Car, Truck, ShoppingBag } from 'lucide-react';
import type { DeliveryResponseDTO } from '../types/delivery';

export const RepartidorDashboard: React.FC = () => {
    const { perfil, deliveryActivo, loading, toggleDisponibilidad, avanzarEstado, entregarConOTP, recargarDatos } = useRepartidor();
    const [otp, setOtp] = useState<string>("");
    const [disponibles, setDisponibles] = useState<DeliveryResponseDTO[]>([]);
    const [aceptandoId, setAceptandoId] = useState<number | null>(null);

    const isDisponible = perfil?.estadoActual === 'DISPONIBLE';
    const isOcupado = perfil?.estadoActual === 'OCUPADO' || deliveryActivo !== null;

    // Cargar pedidos iniciales
    useEffect(() => {
        if (isDisponible && !deliveryActivo) {
            repartidorService.getPedidosDisponibles()
                .then(res => setDisponibles(res.data))
                .catch(err => console.error("Error cargando disponibles:", err));
        }
    }, [isDisponible, deliveryActivo]);

    const { isConnected, sendLocation, stompClient } = useStompClient({
        repartidorId: perfil?.idRepartidor,
        onNewOrder: (pedido) => {
            // Este es para asignación directa (si se usara), pero ahora usamos el pool
            console.log("Pedido asignado directamente:", pedido);
            recargarDatos();
        }
    });

    // Suscripción al Pool de Pedidos vía WebSocket
    useEffect(() => {
        if (stompClient && isConnected && isDisponible) {
            const sub = stompClient.subscribe('/topic/pedidos-disponibles', (msg) => {
                const nuevo = JSON.parse(msg.body) as DeliveryResponseDTO;
                setDisponibles(prev => [nuevo, ...prev]);
                
                // Notificación sutil (Toast)
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                Toast.fire({
                    icon: 'info',
                    title: '¡Nuevo pedido disponible en el pool!'
                });
            });

            const subUpdate = stompClient.subscribe('/topic/pedidos-pool-update', (msg) => {
                const idEliminar = parseInt(msg.body);
                setDisponibles(prev => prev.filter(d => d.idDelivery !== idEliminar));
            });

            return () => {
                sub.unsubscribe();
                subUpdate.unsubscribe();
            };
        }
    }, [stompClient, isConnected, isDisponible]);

    const handleAceptarPedido = async (deliveryId: number) => {
        try {
            setAceptandoId(deliveryId);
            await repartidorService.aceptarPedido(deliveryId);
            setDisponibles(prev => prev.filter(d => d.idDelivery !== deliveryId));
            Swal.fire({
                title: '¡Pedido Aceptado!',
                text: 'El pedido ha sido asignado a ti correctamente.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
            recargarDatos();
        } catch (err: any) {
            Swal.fire('Error', err.response?.data?.message || 'No se pudo aceptar el pedido', 'error');
        } finally {
            setAceptandoId(null);
        }
    };

    const handleLocationUpdate = (lat: number, lng: number) => {
        if (deliveryActivo && isConnected) {
             sendLocation(lat, lng, deliveryActivo.idDelivery);
        } else {
             repartidorService.actualizarUbicacion(lat, lng).catch(console.error);
        }
    };

    const { location, error: gpsError } = useGeolocation(isDisponible || isOcupado, handleLocationUpdate);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!perfil) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Error de Perfil</h2>
                <p className="text-gray-500 mt-2">No se pudo cargar tu información. Intenta recargar la página.</p>
            </div>
        );
    }

    // Helper para ícono de vehículo
    const VehicleIcon = () => {
        if (!perfil.tipoVehiculo) return <Bike className="w-5 h-5" />;
        const type = perfil.tipoVehiculo.toLowerCase();
        if (type.includes('auto') || type.includes('carro')) return <Car className="w-5 h-5" />;
        if (type.includes('camioneta') || type.includes('furgon')) return <Truck className="w-5 h-5" />;
        return <Bike className="w-5 h-5" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 pb-20">
            {/* Cabecera / Header Premium */}
            <div className="bg-white/80 backdrop-blur-xl border-b border-white shadow-sm sticky top-0 z-50">
                <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            {perfil.fotoPerfil ? (
                                <img src={perfil.fotoPerfil} alt="Perfil" className="w-14 h-14 rounded-full object-cover shadow-md border-2 border-white" />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center shadow-md border-2 border-white text-blue-600">
                                    <User className="w-6 h-6" />
                                </div>
                            )}
                            {/* Indicador de Estado (Circulo verde radiante) */}
                            <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${isDisponible || isOcupado ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-400'}`}></div>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 tracking-tight leading-tight">Hola, {perfil.nombres}</h1>
                            <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500 font-medium bg-gray-100/80 px-2 py-0.5 rounded-full w-max">
                                <VehicleIcon /> <span>{perfil.placaVehiculo}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 mt-6 space-y-6">
                
                {/* Control de Disponibilidad */}
                <div className="bg-white/70 backdrop-blur-lg p-5 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-800">
                                {isDisponible ? 'Estás conectado y visible' : isOcupado ? 'Estás en un viaje activo' : 'Estás desconectado'}
                            </h3>
                            <p className="text-xs text-gray-500 mt-1">
                                {isConnected ? '⚡ Conectado a Tracking WS' : '⏳ Esperando conexión...'}
                            </p>
                            {location && (
                                <p className="text-[10px] text-blue-500 mt-1 flex items-center gap-1 font-mono bg-blue-50 w-max px-2 py-0.5 rounded-full">
                                    <Map className="w-3 h-3" /> {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                                </p>
                            )}
                        </div>
                        <button 
                            onClick={() => toggleDisponibilidad(!isDisponible)}
                            disabled={isOcupado}
                            className={`relative flex items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 shadow-lg ${
                                isOcupado ? 'bg-gray-300 cursor-not-allowed opacity-50' : 
                                isDisponible ? 'bg-gradient-to-tr from-red-500 to-red-400 hover:shadow-red-500/40 text-white' : 'bg-gradient-to-tr from-green-500 to-green-400 hover:shadow-green-500/40 text-white'
                            }`}
                        >
                            <Power className="w-6 h-6" />
                        </button>
                    </div>
                    {gpsError && (
                        <div className="mt-4 flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-xs font-semibold border border-red-100">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{gpsError}</span>
                        </div>
                    )}
                </div>

                {/* Área de Delivery */}
                {!deliveryActivo ? (
                    <div className="space-y-4">
                        {isDisponible ? (
                            <>
                                <div className="flex items-center gap-2 px-2">
                                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-bold text-gray-800">Pedidos Disponibles ({disponibles.length})</h3>
                                </div>
                                
                                {disponibles.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center p-10 bg-white/40 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200 min-h-[200px]">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                                            <div className="bg-blue-100 p-4 rounded-full text-blue-600 relative z-10">
                                                <MapPin className="w-8 h-8 animate-bounce" />
                                            </div>
                                        </div>
                                        <h3 className="mt-6 text-sm font-bold text-gray-600">Buscando pedidos...</h3>
                                        <p className="text-[10px] text-gray-400 text-center mt-1">Te avisaremos cuando haya algo cerca.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {disponibles.map(pedido => (
                                            <div key={pedido.idDelivery} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                                        <Package className="w-5 h-5" />
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400 font-bold">GANANCIA</p>
                                                        <p className="text-lg font-black text-blue-600">S/ {pedido.costoDelivery.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2 mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <Store className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                        <p className="text-xs text-gray-700 font-medium line-clamp-1">{pedido.origenDireccion}</p>
                                                    </div>
                                                    <div className="flex items-start gap-2">
                                                        <Navigation className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                                        <p className="text-xs text-gray-700 font-medium line-clamp-1">{pedido.destinoDireccion}</p>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleAceptarPedido(pedido.idDelivery)}
                                                    disabled={aceptandoId === pedido.idDelivery}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition-all active:scale-95 disabled:bg-gray-300 flex items-center justify-center gap-2"
                                                >
                                                    {aceptandoId === pedido.idDelivery ? (
                                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    ) : 'ACEPTAR PEDIDO'}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-10 bg-white/40 backdrop-blur-md rounded-3xl border-2 border-dashed border-gray-200 min-h-[300px]">
                                <div className="bg-gray-100 p-4 rounded-full text-gray-400">
                                    <Power className="w-8 h-8" />
                                </div>
                                <h3 className="mt-6 text-lg font-bold text-gray-800">Desconectado</h3>
                                <p className="text-sm text-gray-500 text-center mt-2">Ponte en línea para ver los pedidos disponibles en tu zona.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-gradient-to-b from-blue-600 to-blue-800 p-1 rounded-3xl shadow-xl shadow-blue-900/20 relative overflow-hidden">
                        {/* Decoración de fondo */}
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                        <div className="bg-white rounded-[22px] p-6 relative z-10">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800">Viaje en curso</h3>
                                </div>
                                <div className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-black uppercase tracking-wider rounded-lg border border-blue-100">
                                    {deliveryActivo.estado.replace('_', ' ')}
                                </div>
                            </div>
                            
                            {/* Ruta vertical */}
                            <div className="relative pl-6 space-y-8 mb-8 before:absolute before:inset-y-2 before:left-[11px] before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-200">
                                <div className="relative">
                                    <div className="absolute -left-6 bg-white p-0.5 rounded-full border-2 border-blue-500 text-blue-500">
                                        <Store className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Punto de Recojo</p>
                                    <p className="text-sm font-bold text-gray-800 mt-1 leading-snug">{deliveryActivo.origenDireccion}</p>
                                </div>
                                <div className="relative border-t border-dashed border-gray-100 pt-6">
                                    <div className="absolute -left-6 top-6 bg-white p-0.5 rounded-full border-2 border-gray-300 text-gray-400">
                                        <Navigation className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Punto de Entrega</p>
                                    <p className="text-sm font-bold text-gray-800 mt-1 leading-snug">{deliveryActivo.destinoDireccion}</p>
                                </div>
                            </div>

                            {/* Botones de Acción */}
                            <div className="pt-2">
                                {deliveryActivo.estado === 'REPARTIDOR_ASIGNADO' && (
                                    <button onClick={() => avanzarEstado(deliveryActivo.idDelivery, 'EN_TIENDA')} className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 text-lg">
                                        <Store className="w-5 h-5" /> Ya llegué a la tienda
                                    </button>
                                )}
                                {deliveryActivo.estado === 'EN_TIENDA' && (
                                    <button onClick={() => avanzarEstado(deliveryActivo.idDelivery, 'RECOGIDO')} className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 text-lg">
                                        <Package className="w-5 h-5" /> Ya tengo el producto
                                    </button>
                                )}
                                {deliveryActivo.estado === 'RECOGIDO' && (
                                    <button onClick={() => avanzarEstado(deliveryActivo.idDelivery, 'EN_CAMINO')} className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 flex justify-center items-center gap-2 text-lg">
                                        <Navigation className="w-5 h-5" /> Iniciar viaje al cliente
                                    </button>
                                )}
                                
                                {(deliveryActivo.estado === 'EN_CAMINO' || deliveryActivo.estado === 'CERCA') && (
                                    <div className="mt-2 bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                                        <div className="flex items-center gap-2 mb-4 justify-center text-gray-700">
                                            <CheckCircle className="w-5 h-5 text-green-500" />
                                            <p className="text-sm font-bold">Confirmar PIN de entrega</p>
                                        </div>
                                        <input 
                                            type="text" 
                                            placeholder="• • • •" 
                                            className="w-full text-center text-3xl tracking-[0.75em] font-mono font-bold text-gray-800 bg-white border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl py-3 outline-none transition-all placeholder:text-gray-300"
                                            value={otp}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/[^0-9]/g, '');
                                                if (val.length <= 4) setOtp(val);
                                            }}
                                            maxLength={4}
                                        />
                                        <button 
                                            onClick={() => {
                                                entregarConOTP(deliveryActivo.idDelivery, otp);
                                                setOtp('');
                                            }} 
                                            className="mt-4 w-full bg-green-500 hover:bg-green-600 active:scale-[0.98] transition-all text-white font-bold py-4 rounded-xl shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:shadow-none flex justify-center items-center text-lg"
                                            disabled={otp.length !== 4}
                                        >
                                            Entregar Pedido
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};