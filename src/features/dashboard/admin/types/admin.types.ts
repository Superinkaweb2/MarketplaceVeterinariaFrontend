export interface Company {
  id: number;
  nombre: string;
  ruc: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  perfilCompleto: boolean;
  createdAt: string;
}

export interface AdminUser {
  id: number;
  email: string;
  nombre: string;
  rol: string;
  activo: boolean;
  createdAt: string;
}

export interface AdminStats {
  totalEmpresas: number;
  totalUsuarios: number;
  totalVeterinarios: number;
  ventasMes: number;
}

export interface Category {
  id: number;
  nombre: string;
  slug: string;
  padreId: number | null;
  padreNombre: string | null;
  iconoUrl: string;
  activo: boolean;
  orden: number;
}

export interface CreateCategoryRequest {
  nombre: string;
  padreId: number | null;
  iconoUrl: string | null;
  activo: boolean;
  orden: number;
}

export interface UpdateCategoryRequest {
  nombre?: string;
  padreId?: number | null;
  iconoUrl?: string | null;
  activo?: boolean;
  orden?: number;
}
