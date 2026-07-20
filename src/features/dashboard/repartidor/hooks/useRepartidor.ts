import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { repartidorService } from "../services/repartidorService";
import type { RepartidorResponseDTO, DeliveryResponseDTO, DeliveryStatus } from "../types/delivery";

export const useRepartidor = () => {
    const [perfil, setPerfil] = useState<RepartidorResponseDTO | null>(null);
    const [deliveryActivo, setDeliveryActivo] = useState<DeliveryResponseDTO | null>(null);
    const [historial, setHistorial] = useState<DeliveryResponseDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const cargarDatos = useCallback(async () => {
        setLoading(true);
        try {
            const [perfilRes, deliveryRes, historialRes] = await Promise.all([
                repartidorService.getPerfil().catch(err => {
                    if (err.response?.status === 404) {
                        console.warn("⚠️ Perfil de repartidor no encontrado (404). Posible error de ruta en backend o perfil no creado.");
                    }
                    throw err;
                }),
                repartidorService.getDeliveryActivo().catch(() => ({ data: { data: null } as any })),
                repartidorService.getHistorial().catch(() => ({ data: { data: [] } as any }))
            ]);
            setPerfil(perfilRes.data.data);
            setDeliveryActivo(deliveryRes.data?.data || null);
            setHistorial(historialRes.data?.data || []);
        } catch (error) {
            console.error("Error cargando datos del repartidor", error);
            Swal.fire("Error", "No se pudo cargar la información", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const toggleDisponibilidad = async (nuevoEstado: boolean) => {
        try {
            await repartidorService.cambiarDisponibilidad(nuevoEstado);
            setPerfil((prev) => prev ? { ...prev, estadoActual: nuevoEstado ? 'DISPONIBLE' : 'OFFLINE' } : null);
            Swal.fire("Actualizado", `Ahora estás ${nuevoEstado ? 'Disponible' : 'Desconectado'}`, "success");
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo cambiar la disponibilidad", "error");
        }
    };

    const avanzarEstado = async (deliveryId: number, nuevoEstado: DeliveryStatus) => {
        try {
            const res = await repartidorService.cambiarEstado(deliveryId, nuevoEstado);
            setDeliveryActivo(res.data.data);
            Swal.fire("Estado actualizado", `El pedido ahora está: ${nuevoEstado}`, "success");
        } catch (error: any) {
            Swal.fire("Error", error.response?.data?.message || "No se pudo actualizar el estado", "error");
        }
    };

    const entregarConOTP = async (deliveryId: number, codigo: string) => {
        try {
            await repartidorService.confirmarOTP(deliveryId, codigo);
            Swal.fire("¡Entregado!", "El pedido ha sido completado exitosamente", "success");
            setDeliveryActivo(null);
            cargarDatos();
        } catch (error: any) {
            Swal.fire("Código inválido", error.response?.data?.message || "El código no coincide", "error");
        }
    };

    return {
        perfil,
        deliveryActivo,
        historial,
        loading,
        toggleDisponibilidad,
        avanzarEstado,
        entregarConOTP,
        recargarDatos: cargarDatos
    };
};