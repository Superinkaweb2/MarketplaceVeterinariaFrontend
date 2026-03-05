import { useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../../components/ui/Button";
import { useLogin } from "../hooks/useLogin";
import { useAuth } from "../context/useAuth";
import { getRedirectByRole } from "../services/authRedirect";

// ─── Schema de validación ──────────────────────────────────────────────────────
const loginSchema = z.object({
  correo: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo válido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ─── Componente ────────────────────────────────────────────────────────────────
export const Login = () => {
  const { login: loginUser } = useLogin();
  const { isAuthenticated, role, perfilCompleto } = useAuth();
  const [searchParams] = useSearchParams();
  const nextUrl = searchParams.get("next") || undefined;
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Si ya está autenticado, redirigir al ?next si existe, o al portal por rol
  if (isAuthenticated && role) {
    if (perfilCompleto) {
      return <Navigate to={nextUrl || getRedirectByRole(role)} replace />;
    } else {
      return <Navigate to={`/register/perfil/${role.toLowerCase()}`} replace />;
    }
  }

  const onSubmit = (data: LoginFormData) => {
    loginUser(data.correo, data.password, nextUrl);
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* ── LADO IZQUIERDO: Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-16 h-full w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 text-white">
              <img
                src="/LOGO HUELLA360_logo primario.png"
                alt="Logo Huella360"
                className="h-12 w-auto object-contain"
              />
              <span className="text-4xl font-bold tracking-tight">Huella360</span>
            </div>
            <blockquote className="text-white text-2xl font-medium leading-relaxed max-w-lg italic">
              "El ecosistema más eficiente para profesionales modernos del
              cuidado animal. Optimiza tu clínica hoy mismo."
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO: Formulario ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-background-dark relative">
        {/* Botón volver */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          <Link to="/">
            <Button variant="outline" className="min-w-21 h-10 px-4 text-sm">
              <ArrowLeft size={16} />
              Volver al inicio
            </Button>
          </Link>
        </div>

        {/* Logo móvil */}
        <div className="lg:hidden mb-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <img
              src="/LOGO HUELLA360_logo primario.png"
              alt="Logo Huella360"
              className="h-8 w-auto object-contain"
            />
            <span className="text-2xl font-bold">Huella360</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Bienvenido de nuevo
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              Ingresa tus credenciales para acceder a tu panel de control.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-6" noValidate>
            <div className="space-y-5">
              {/* ── Email ── */}
              <div>
                <label
                  htmlFor="correo"
                  className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Email
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    <Mail size={18} />
                  </div>
                  <input
                    id="correo"
                    type="email"
                    autoComplete="email"
                    placeholder="doctor@clinica.com"
                    {...register("correo")}
                    aria-invalid={!!errors.correo}
                    className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${errors.correo
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                      }`}
                  />
                </div>
                {errors.correo && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errors.correo.message}
                  </p>
                )}
              </div>

              {/* ── Password ── */}
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
                  >
                    Contraseña
                  </label>
                  <Link
                    to="/auth/forgot-password"
                    className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-11 pr-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${errors.password
                      ? "border-red-400 dark:border-red-500"
                      : "border-slate-200 dark:border-slate-700"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400" role="alert">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              variant="primary"
              className="w-full py-4 text-base font-bold rounded-xl shadow-lg shadow-primary/20"
            >
              {isSubmitting ? "Validando..." : "Iniciar Sesión"}
            </Button>
          </form>

          {/* Separador */}
          <div className="relative mt-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-sm font-medium">
              <span className="bg-white dark:bg-background-dark px-4 text-slate-500">
                O continuar con
              </span>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-slate-500">
            ¿No tienes una cuenta?{" "}
            <Link to="/register" className="font-bold text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};