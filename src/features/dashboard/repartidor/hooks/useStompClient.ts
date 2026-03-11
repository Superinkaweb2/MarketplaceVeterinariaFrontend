import { useState, useEffect, useCallback } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { DeliveryResponseDTO } from '../types/delivery';

const STOMP_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

interface UseStompClientProps {
    repartidorId?: number;
    // Callback que se ejecuta cuando llega un nuevo pedido a la cola
    onNewOrder?: (pedido: DeliveryResponseDTO) => void;
}

export const useStompClient = ({ repartidorId, onNewOrder }: UseStompClientProps) => {
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        // No conectar si no hay un repartidor logueado
        if (!repartidorId) return;

        // Recuperar el token del localStorage (al igual que Axios)
        const token = localStorage.getItem("token");

        const client = new Client({
            // Se usa webSocketFactory en lugar de brokerURL porque usamos SockJS
            webSocketFactory: () => new SockJS(`${STOMP_URL}/ws`),
            
            // Pasar el JWT para que el Backend (ChannelInterceptor) lo valide
            connectHeaders: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            
            // Logs en consola útiles para depuración
            debug: (str) => {
                console.log('[STOMP]', str);
            },
            
            // Auto-reconexión si el server se cae o hay pérdida de red
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = (frame) => {
            console.log('✅ Conectado a STOMP WebSocket:', frame);
            setIsConnected(true);

            // 1. Suscripción a la cola de alertas de nuevos pedidos
            // El backend AsignacionService envía a través de wsTemplate.convertAndSendToUser(repartidorId, "/queue/pedidos", ...)
            client.subscribe('/user/queue/pedidos', (message: IMessage) => {
                if (message.body) {
                    const pedido = JSON.parse(message.body);
                    console.log('🔔 Nuevo pedido recibido via WS:', pedido);
                    if (onNewOrder) {
                        onNewOrder(pedido);
                    }
                }
            });
        };

        client.onStompError = (frame) => {
            console.error('❌ STOMP Error:', frame.headers['message']);
            console.error('Detalles:', frame.body);
        };

        client.onWebSocketClose = () => {
            console.log('🔌 WebSocket Desconectado');
            setIsConnected(false);
        };

        // Iniciar la conexión
        client.activate();
        setStompClient(client);

        // Limpieza: desconectar al desmontar el componente o cambiar el ID
        return () => {
            client.deactivate();
            setStompClient(null);
            setIsConnected(false);
        };
    }, [repartidorId]);

    // 2. Función optimizada para enviar ubicación (GPS) sin usar Axios
    const sendLocation = useCallback((lat: number, lng: number, deliveryId: number) => {
        if (stompClient && stompClient.connected) {
            // Ajusta este destination endpoint según tu @MessageMapping en Spring Boot.
            // Ejemplo: /app/tracking/{deliveryId}/ubicacion
            stompClient.publish({
                destination: `/app/tracking/${deliveryId}/ubicacion`,
                body: JSON.stringify({
                    repartidorId,
                    lat,
                    lng,
                    timestamp: new Date().toISOString()
                }),
            });
        } else {
            console.warn('⚠️ No hay conexión STOMP, no se pudo enviar la ubicación');
        }
    }, [stompClient, repartidorId]);

    return { isConnected, sendLocation, stompClient };
};
