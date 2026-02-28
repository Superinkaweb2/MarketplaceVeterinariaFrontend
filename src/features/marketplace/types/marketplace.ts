export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  padreId?: number;
}

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precioOferta?: number;
  precioActual: number;
  stock: number;
  imagenes: string[];
  categoriaId: number;
  categoriaNombre: string;
  empresaId: number;
  empresaNombre: string;
  mpPublicKey?: string;
  badge?: { text: string; style: 'rx' | 'service' | 'approved' | 'adoption' };
}

export interface MarketplaceFilters {
  q?: string;
  category?: number;
  page?: number;
  size?: number;
  sort?: 'asc' | 'desc';
}