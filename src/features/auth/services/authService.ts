import { api } from "../../../shared/http/api";
import { jwtDecode } from "jwt-decode";
import type { LoginRequest, LoginResponse, RegisterRequest } from "../types/auth";
import type { ApiResponse } from "../../../shared/types/api";

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await api.post<ApiResponse<LoginResponse & { role?: string; rol?: string }>>("/auth/login", credentials);
    
    const apiData = data.data;

    // Decode JWT to extract the role claim if missing in main payload
    if (apiData?.token) {
      try {
        const decodedToken = jwtDecode<{ role?: string }>(apiData.token);
        if (decodedToken.role) {
          apiData.rol = decodedToken.role;
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }
    
    // Normalize user role removing Spring Security prefix if any
    if (apiData?.role && !apiData.rol) {
      apiData.rol = apiData.role;
    }
    
    if (apiData?.rol) {
      apiData.rol = apiData.rol.replace(/^ROLE_/i, '');
    }
    
    return apiData as LoginResponse;
  },

  register: async (payload: RegisterRequest): Promise<LoginResponse> => {
    const { data } = await api.post<ApiResponse<LoginResponse & { role?: string }>>("/auth/register", payload);
    
    const apiData = data.data;

    // Decode JWT to extract the role claim
    if (apiData?.token) {
      try {
        const decodedToken = jwtDecode<{ role?: string }>(apiData.token);
        if (decodedToken.role) {
          apiData.rol = decodedToken.role;
        }
      } catch (err) {
        console.error("Failed to decode token", err);
      }
    }

    // Normalize user role removing Spring Security prefix if any
    if (apiData?.role && !apiData.rol) {
      apiData.rol = apiData.role;
    }

    if (apiData?.rol) {
      apiData.rol = apiData.rol.replace(/^ROLE_/i, '');
    }
    
    return apiData as LoginResponse;
  },
};
