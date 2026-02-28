import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PawPrint, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Building2, User, Heart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../../components/ui/Button";
import { useRegister } from "../hooks/useRegister";
import { useAuth } from "../context/useAuth";
import { getRedirectByRole } from "../services/authRedirect";

// ─── Schema de validación Paso 1 ──────────────────────────────────────────────
const registerSchema = z
  .object({
    correo: z.string().min(1, "El correo es requerido").email("Ingresa un correo válido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(8, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;
type RoleType = "CLIENTE" | "VETERINARIO" | "EMPRESA";

const ROLES = [
  {
    id: "CLIENTE",
    title: "Soy Dueño de Mascota",
    description: "Para agendar citas, comprar productos médicos y ver historiales.",
    icon: Heart,
    color: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-800",
  },
  {
    id: "VETERINARIO",
    title: "Soy Veterinario(a)",
    description: "Para gestionar historias clínicas, atender consultas y recetar.",
    icon: User,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-800",
  },
  {
    id: "EMPRESA",
    title: "Represento a una Clínica",
    description: "Para gestionar inventario, ventas, equipo médico y panel administrativo.",
    icon: Building2,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    border: "border-indigo-200 dark:border-indigo-800",
  },
] as const;

// ─── Componente ────────────────────────────────────────────────────────────────
export const Register = () => {
  const { register: registerUser } = useRegister();
  const { isAuthenticated, role } = useAuth();
  
  // State
  const [step, setStep] = useState<1 | 2>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Guardamos las credenciales entre los pasos
  const [credentials, setCredentials] = useState<RegisterFormData | null>(null);
  
  // Estado para la mutación final
  const [isSubmittingRole, setIsSubmittingRole] = useState(false);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Si ya está autenticado, redirigir
  if (isAuthenticated && role) {
    return <Navigate to={getRedirectByRole(role)} replace />;
  }

  // Submit del Paso 1
  const onSubmitStep1 = (data: RegisterFormData) => {
    setCredentials(data);
    setStep(2);
  };

  // Submit del Paso 2 (Selección de Rol)
  const onSelectRole = async (selectedRole: RoleType) => {
    if (!credentials) return;
    
    setIsSubmittingRole(true);
    try {
      await registerUser({
        correo: credentials.correo,
        password: credentials.password,
        rol: selectedRole,
      });
    } finally {
      setIsSubmittingRole(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* ── LADO IZQUIERDO: Branding (Igual que el login pero con otro copy) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-end p-16 h-full w-full">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6 text-white">
              <PawPrint size={48} className="text-primary" strokeWidth={2.5} />
              <span className="text-4xl font-bold tracking-tight">VetSaaS</span>
            </div>
            <blockquote className="text-white text-2xl font-medium leading-relaxed max-w-lg italic">
              "Únete a la red veterinaria más avanzada. Una cuenta, un ecosistema completo para ti y tus mascotas."
            </blockquote>
          </div>
        </div>
      </div>

      {/* ── LADO DERECHO: Formulario Multi-Step ── */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-background-dark relative">
        <div className="absolute top-8 right-8 md:top-12 md:right-12">
          {step === 1 ? (
            <Link to="/">
              <Button variant="outline" className="min-w-21 h-10 px-4 text-sm">
                <ArrowLeft size={16} /> Volver
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              className="min-w-21 h-10 px-4 text-sm"
              onClick={() => setStep(1)}
              disabled={isSubmittingRole}
            >
              <ArrowLeft size={16} /> Atrás
            </Button>
          )}
        </div>

        <div className="lg:hidden mb-12">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <PawPrint size={32} className="text-primary" />
            <span className="text-2xl font-bold">VetSaaS</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* ────── PASO 1: CREAR CUENTA ────── */}
          {step === 1 && (
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Crea tu cuenta gratis
                </h1>
                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  Ingresa tus datos para registrarte. Toma menos de un minuto.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmitStep1)} className="mt-10 space-y-6" noValidate>
                <div className="space-y-5">
                  {/* Email */}
                  <div>
                    <label htmlFor="correo" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
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
                        placeholder="ejemplo@correo.com"
                        {...formRegister("correo")}
                        aria-invalid={!!errors.correo}
                        className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                          errors.correo ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                    </div>
                    {errors.correo && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.correo.message}</p>}
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Contraseña
                    </label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                        <Lock size={18} />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...formRegister("password")}
                        aria-invalid={!!errors.password}
                        className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-11 pr-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                          errors.password ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.password && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                      Confirmar Contraseña
                    </label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 pointer-events-none">
                        <Lock size={18} />
                      </div>
                      <input
                        id="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        {...formRegister("confirmPassword")}
                        aria-invalid={!!errors.confirmPassword}
                        className={`block w-full rounded-xl border bg-slate-50 dark:bg-slate-800/50 py-3 pl-11 pr-11 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all ${
                          errors.confirmPassword ? "border-red-400 dark:border-red-500" : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-primary transition-colors"
                      >
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.confirmPassword.message}</p>}
                  </div>
                </div>

                <Button type="submit" variant="primary" className="w-full py-4 text-base font-bold rounded-xl shadow-lg shadow-primary/20">
                  Continuar <ArrowRight size={20} className="ml-2" />
                </Button>
              </form>

              <p className="mt-10 text-center text-sm text-slate-500">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/login" className="font-bold text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </>
          )}

          {/* ────── PASO 2: ELEGIR ROL ────── */}
          {step === 2 && (
            <>
              <div className="text-center lg:text-left">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                  Selecciona tu rol
                </h1>
                <p className="mt-3 text-slate-500 dark:text-slate-400">
                  Cuentanos un poco sobre ti para personalizar tu experiencia en VetSaaS.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                {ROLES.map((roleDef) => (
                  <button
                    key={roleDef.id}
                    onClick={() => onSelectRole(roleDef.id)}
                    disabled={isSubmittingRole}
                    className={`w-full flex items-start p-5 rounded-2xl border bg-white dark:bg-surface-dark transition-all text-left shadow-sm hover:shadow-md hover:border-primary dark:hover:border-primary ${
                      roleDef.border
                    } ${isSubmittingRole ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className={`p-3 rounded-xl ${roleDef.color} shrink-0`}>
                      <roleDef.icon size={26} />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                        {roleDef.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                        {roleDef.description}
                      </p>
                    </div>
                    <div className="self-center ml-4 text-slate-300 dark:text-slate-600">
                      <ArrowRight size={20} />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
