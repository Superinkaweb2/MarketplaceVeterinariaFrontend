export interface TopProducto {
    productoId: number;
    nombreProducto: string;
    cantidadVendida: number;
    totalVendido: number;
}

export interface DashboardMetrics {
    totalVentasMes: number;
    ordenesPendientes: number;
    ordenesPagadasHoy: number;
    clientesActivos: number;
    topProductos: TopProducto[];
}
