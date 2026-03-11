import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ShoppingBag, BarChart3, Loader2 } from "lucide-react";

// Components
import { Header } from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RequiresProfile } from "./components/RequiresProfile";
import { CartProvider } from "./features/marketplace/context/CartContext";
import { CartSidebar } from "./features/marketplace/components/CartSidebar";
import { AuthProvider } from "./features/auth/context/AuthContext";
import { useTheme } from "./hooks/useTheme";

// Lazy Pages
const Home = lazy(() => import("./pages/Home").then(m => ({ default: (m as any).default || (m as any).Home })));
const SobreNosotros = lazy(() => import("./pages/SobreNosotros").then(m => ({ default: (m as any).default || (m as any).SobreNosotros })));
const Empleos = lazy(() => import("./pages/Empleos").then(m => ({ default: (m as any).default || (m as any).Empleos })));
const Blog = lazy(() => import("./pages/Blog").then(m => ({ default: (m as any).default || (m as any).Blog })));
const Contacto = lazy(() => import("./pages/Contacto").then(m => ({ default: (m as any).default || (m as any).Contacto })));
const Privacidad = lazy(() => import("./pages/Privacidad").then(m => ({ default: (m as any).default || (m as any).Privacidad })));
const Terminos = lazy(() => import("./pages/Terminos").then(m => ({ default: (m as any).default || (m as any).Terminos })));

// Feature Pages
const Marketplace = lazy(() => import("./features/marketplace/pages/Marketplace").then(m => ({ default: (m as any).Marketplace || (m as any).default })));
const ProductDetails = lazy(() => import("./features/marketplace/pages/ProductDetails").then(m => ({ default: (m as any).ProductDetails || (m as any).default })));
const CheckoutPage = lazy(() => import("./features/marketplace/pages/CheckoutPage").then(m => ({ default: (m as any).CheckoutPage || (m as any).default })));
const PaymentSuccessPage = lazy(() => import("./features/marketplace/pages/PaymentSuccessPage").then(m => ({ default: (m as any).PaymentSuccessPage || (m as any).default })));
const CompanyProfile = lazy(() => import("./features/marketplace/pages/CompanyProfile").then(m => ({ default: (m as any).CompanyProfile || (m as any).default })));
const CompaniesPage = lazy(() => import("./features/marketplace/pages/CompaniesPage").then(m => ({ default: (m as any).CompaniesPage || (m as any).default })));

// Auth Pages
const Login = lazy(() => import("./features/auth/pages/Login").then(m => ({ default: (m as any).Login || (m as any).default })));
const Register = lazy(() => import("./features/auth/pages/Register").then(m => ({ default: (m as any).Register || (m as any).default })));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPassword").then(m => ({ default: (m as any).default || (m as any).ForgotPassword })));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword").then(m => ({ default: (m as any).default || (m as any).ResetPassword })));
const VerifyEmail = lazy(() => import("./features/auth/pages/VerifyEmail").then(m => ({ default: (m as any).default || (m as any).VerifyEmail })));
const ClienteProfilePage = lazy(() => import("./features/auth/pages/profiles/ClienteProfilePage").then(m => ({ default: (m as any).ClienteProfilePage || (m as any).default })));
const VeterinarioProfilePage = lazy(() => import("./features/auth/pages/profiles/VeterinarioProfilePage").then(m => ({ default: (m as any).VeterinarioProfilePage || (m as any).default })));
const EmpresaProfilePage = lazy(() => import("./features/auth/pages/profiles/EmpresaProfilePage").then(m => ({ default: (m as any).EmpresaProfilePage || (m as any).default })));
const RepartidorProfilePage = lazy(() => import("./features/auth/pages/profiles/RepartidorProfilePage").then(m => ({ default: (m as any).RepartidorProfilePage || (m as any).default })));

// Admin Pages
const AdminPortal = lazy(() => import("./features/dashboard/admin/pages/AdminPortal").then(m => ({ default: (m as any).default || (m as any).AdminPortal })));
const Dashboard = lazy(() => import("./features/dashboard/admin/pages/Dashboard").then(m => ({ default: (m as any).default || (m as any).Dashboard })));
const EmpresasPage = lazy(() => import("./features/dashboard/admin/pages/EmpresasPage").then(m => ({ default: (m as any).EmpresasPage || (m as any).default })));
const UsuariosPage = lazy(() => import("./features/dashboard/admin/pages/UsuariosPage").then(m => ({ default: (m as any).UsuariosPage || (m as any).default })));
const CategoriasPage = lazy(() => import("./features/dashboard/admin/pages/CategoriasPage").then(m => ({ default: (m as any).CategoriasPage || (m as any).default })));
const VeterinariosPage = lazy(() => import("./features/dashboard/admin/pages/VeterinariosPage").then(m => ({ default: (m as any).VeterinariosPage || (m as any).default })));
const SubscriptionAdminPage = lazy(() => import("./features/dashboard/admin/pages/SubscriptionAdminPage").then(m => ({ default: (m as any).SubscriptionAdminPage || (m as any).default })));
const AdminComingSoon = lazy(() => import("./features/dashboard/admin/components/AdminComingSoon").then(m => ({ default: (m as any).AdminComingSoon || (m as any).default })));

// Empresa Pages
const DashboardEmpresa = lazy(() => import("./features/dashboard/empresa/pages/DashboardEmpresa").then(m => ({ default: (m as any).default || (m as any).DashboardEmpresa })));
const DashboardHome = lazy(() => import("./features/dashboard/empresa/components/layouts/DashboardHome").then(m => ({ default: (m as any).DashboardHome || (m as any).default })));
const ServiciosPage = lazy(() => import("./features/dashboard/empresa/pages/ServiciosPage").then(m => ({ default: (m as any).ServiciosPage || (m as any).default })));
const ProductosPage = lazy(() => import("./features/dashboard/empresa/pages/ProductosPage").then(m => ({ default: (m as any).ProductosPage || (m as any).default })));
const EquipoPage = lazy(() => import("./features/dashboard/empresa/pages/EquipoPage").then(m => ({ default: (m as any).EquipoPage || (m as any).default })));
const MySubscriptionPage = lazy(() => import("./features/dashboard/empresa/pages/MySubscriptionPage").then(m => ({ default: (m as any).MySubscriptionPage || (m as any).default })));
const FacturacionPage = lazy(() => import("./features/dashboard/empresa/pages/FacturacionPage").then(m => ({ default: (m as any).FacturacionPage || (m as any).default })));
const TalentoPage = lazy(() => import("./features/dashboard/empresa/pages/TalentoPage").then(m => ({ default: (m as any).TalentoPage || (m as any).default })));
const EmpresaPacientesPage = lazy(() => import("./features/dashboard/empresa/pages/PacientesPage").then(m => ({ default: (m as any).PacientesPage || (m as any).default })));
const EmpresaCitasPage = lazy(() => import("./features/dashboard/empresa/pages/EmpresaCitasPage").then(m => ({ default: (m as any).EmpresaCitasPage || (m as any).default })));
const EmpresaConfigPage = lazy(() => import("./features/dashboard/empresa/pages/EmpresaConfigPage").then(m => ({ default: (m as any).EmpresaConfigPage || (m as any).default })));
const OAuthCallbackPage = lazy(() => import("./features/dashboard/empresa/pages/OAuthCallbackPage").then(m => ({ default: (m as any).OAuthCallbackPage || (m as any).default })));
const PaymentSuccessPageEmpresa = lazy(() => import("./features/dashboard/empresa/pages/PaymentSuccessPage").then(m => ({ default: (m as any).PaymentSuccessPage || (m as any).default })));

// Cliente Pages
const DashboardCliente = lazy(() => import("./features/dashboard/cliente/components/layouts/DashboardCliente").then(m => ({ default: (m as any).DashboardCliente || (m as any).default })));
const MascotasPage = lazy(() => import("./features/dashboard/cliente/pages/MascotasPage").then(m => ({ default: (m as any).MascotasPage || (m as any).default })));
const MisCompras = lazy(() => import("./features/dashboard/cliente/components/MisCompras").then(m => ({ default: (m as any).MisCompras || (m as any).default })));
const TrackingPage = lazy(() => import("./features/dashboard/cliente/pages/TrackingPage").then(m => ({ default: (m as any).TrackingPage || (m as any).default })));
const ClienteConfigPage = lazy(() => import("./features/dashboard/cliente/pages/ClienteConfigPage").then(m => ({ default: (m as any).ClienteConfigPage || (m as any).default })));
const ClienteMisServiciosPage = lazy(() => import("./features/dashboard/cliente/pages/MisServiciosPage").then(m => ({ default: (m as any).MisServiciosPage || (m as any).default })));
const MisCitasPage = lazy(() => import("./features/dashboard/cliente/pages/MisCitasPage").then(m => ({ default: (m as any).MisCitasPage || (m as any).default })));
const MisSolicitudesPage = lazy(() => import("./features/dashboard/cliente/pages/MisSolicitudesPage").then(m => ({ default: (m as any).MisSolicitudesPage || (m as any).default })));

// Shared / Other
const AdopcionesPage = lazy(() => import("./features/dashboard/shared/adopciones/pages/AdopcionesPage").then(m => ({ default: (m as any).AdopcionesPage || (m as any).default })));
const MisAdopcionesPage = lazy(() => import("./features/dashboard/shared/adopciones/pages/MisAdopcionesPage").then(m => ({ default: (m as any).MisAdopcionesPage || (m as any).default })));

// Veterinario Pages
const DashboardVeterinario = lazy(() => import("./features/dashboard/veterinario/pages/DashboardVeterinario").then(m => ({ default: (m as any).default || (m as any).DashboardVeterinario })));
const VetHomePage = lazy(() => import("./features/dashboard/veterinario/pages/VetHomePage").then(m => ({ default: (m as any).VetHomePage || (m as any).default })));
const VetServiciosPage = lazy(() => import("./features/dashboard/veterinario/pages/VetServiciosPage").then(m => ({ default: (m as any).VetServiciosPage || (m as any).default })));
const InvitacionesPage = lazy(() => import("./features/dashboard/veterinario/pages/InvitacionesPage").then(m => ({ default: (m as any).InvitacionesPage || (m as any).default })));
const VetConfiguracionPage = lazy(() => import("./features/dashboard/veterinario/pages/VetConfiguracionPage").then(m => ({ default: (m as any).VetConfiguracionPage || (m as any).default })));
const VetCitasPage = lazy(() => import("./features/dashboard/veterinario/pages/VetCitasPage").then(m => ({ default: (m as any).VetCitasPage || (m as any).default })));
const VetPacientesPage = lazy(() => import("./features/dashboard/veterinario/pages/VetPacientesPage").then(m => ({ default: (m as any).VetPacientesPage || (m as any).default })));

// Repartidor Pages
const RepartidorDashboard = lazy(() => import("./features/dashboard/repartidor/components/RepartidorDashboard").then(m => ({ default: (m as any).RepartidorDashboard || (m as any).default })));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <Loader2 className="w-10 h-10 animate-spin text-primary-600" />
    <p className="text-slate-500 animate-pulse font-medium">Cargando...</p>
  </div>
);

function App() {
  useTheme();

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Rutas publicas: Auth */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<ResetPassword />} />
            <Route path="/auth/verify-email" element={<VerifyEmail />} />

            {/* Formilarios de Perfil (Requieren token del rol, pero perfilCompleto=false) */}
            <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
              <Route path="/register/perfil/cliente" element={<ClienteProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["VETERINARIO"]} />}>
              <Route path="/register/perfil/veterinario" element={<VeterinarioProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["EMPRESA"]} />}>
              <Route path="/register/perfil/empresa" element={<EmpresaProfilePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["REPARTIDOR"]} />}>
              <Route path="/register/perfil/repartidor" element={<RepartidorProfilePage />} />
            </Route>

            {/* Rutas protegidas: Admin (Requiere Perfil Completo) */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route element={<RequiresProfile />}>
                <Route path="/portal/admin" element={<AdminPortal />}>
                  <Route index element={<Dashboard />} />
                  <Route path="empresas" element={<EmpresasPage />} />
                  <Route path="usuarios" element={<UsuariosPage />} />
                  <Route path="categorias" element={<CategoriasPage />} />
                  <Route path="veterinarios" element={<VeterinariosPage />} />
                  <Route path="marketplace" element={<AdminComingSoon {...({ title: "Marketplace", description: "Control global de productos, servicios y transacciones.", icon: ShoppingBag } as any)} />} />
                  <Route path="suscripciones" element={<SubscriptionAdminPage />} />
                  <Route path="reportes" element={<AdminComingSoon {...({ title: "Reportes", description: "Análisis avanzado de datos e inteligencia de negocio.", icon: BarChart3 } as any)} />} />
                </Route>
              </Route>
            </Route>

            {/* Rutas protegidas: Empresa (Requiere Perfil Completo) */}
            <Route element={<ProtectedRoute allowedRoles={["EMPRESA"]} />}>
              <Route element={<RequiresProfile />}>
                <Route path="/portal/empresa" element={<DashboardEmpresa />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="servicios" element={<ServiciosPage />} />
                  <Route path="productos" element={<ProductosPage />} />
                  <Route path="equipo" element={<EquipoPage />} />
                  <Route path="suscripcion" element={<MySubscriptionPage />} />
                  <Route path="facturacion" element={<FacturacionPage />} />
                  <Route path="adopciones" element={<AdopcionesPage />} />
                  <Route path="mis-adopciones" element={<MisAdopcionesPage />} />
                  <Route path="configuracion" element={<EmpresaConfigPage />} />
                  <Route path="talento" element={<TalentoPage />} />
                  <Route path="pacientes" element={<EmpresaPacientesPage />} />
                  <Route path="citas" element={<EmpresaCitasPage />} />
                  <Route path="oauth/mercadopago" element={<OAuthCallbackPage />} />
                  <Route path="pago-exitoso" element={<PaymentSuccessPageEmpresa />} />
                </Route>
              </Route>
            </Route>

            {/* Rutas protegidas: Veterinario (Requiere Perfil Completo) */}
            <Route element={<ProtectedRoute allowedRoles={["VETERINARIO"]} />}>
              <Route element={<RequiresProfile />}>
                <Route path="/portal/veterinario" element={<DashboardVeterinario />}>
                  <Route index element={<VetHomePage />} />
                  <Route path="citas" element={<VetCitasPage />} />
                  <Route path="pacientes" element={<VetPacientesPage />} />
                  <Route path="servicios" element={<VetServiciosPage />} />
                  <Route path="invitaciones" element={<InvitacionesPage />} />
                  <Route path="configuracion" element={<VetConfiguracionPage />} />
                </Route>
              </Route>
            </Route>

            {/* Rutas protegidas: CLIENTE (Requiere Perfil Completo) */}
            <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
              <Route element={<RequiresProfile />}>
                <Route path="/portal/cliente" element={<DashboardCliente />}>
                  <Route index element={<MascotasPage />} />
                  <Route path="mascotas" element={<MascotasPage />} />
                  <Route path="adopciones" element={<AdopcionesPage />} />
                  <Route path="mis-adopciones" element={<MisAdopcionesPage />} />
                  <Route path="mis-solicitudes" element={<MisSolicitudesPage />} />
                  <Route path="servicios" element={<ClienteMisServiciosPage />} />
                  <Route path="citas" element={<MisCitasPage />} />
                  <Route path="configuracion" element={<ClienteConfigPage />} />
                  <Route path="compras" element={<MisCompras />} />
                  <Route path="tracking/:ordenId" element={<TrackingPage />} />
                </Route>
              </Route>
            </Route>

            {/* Rutas protegidas: REPARTIDOR */}
            <Route element={<ProtectedRoute allowedRoles={["REPARTIDOR"]} />}>
              <Route element={<RequiresProfile />}>
                <Route path="/portal/repartidor" element={<RepartidorDashboard />} />
              </Route>
            </Route>

            {/* Rutas públicas con Layout (Header + Footer) */}
            <Route
              path="*"
              element={
                <CartProvider>
                  <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark">
                    <Header />
                    <main className="flex-1 flex flex-col items-center w-full">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/home" element={<Navigate to="/" replace />} />
                        <Route path="/sobre-nosotros" element={<SobreNosotros />} />
                        <Route path="/empleos" element={<Empleos />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/contacto" element={<Contacto />} />
                        <Route path="/privacidad" element={<Privacidad />} />
                        <Route path="/terminos" element={<Terminos />} />

                        <Route
                          path="/marketplace/*"
                          element={
                            <Routes>
                              <Route index element={<Marketplace />} />
                              <Route path="product/:id" element={<ProductDetails />} />
                              <Route path="checkout" element={<CheckoutPage />} />
                              <Route path="success" element={<PaymentSuccessPage />} />
                            </Routes>
                          }
                        />

                        <Route path="/empresas" element={<CompaniesPage />} />
                        <Route path="/empresa/:id" element={<CompanyProfile />} />

                        <Route
                          path="*"
                          element={
                            <div className="p-20 text-center text-slate-500 dark:text-slate-400">
                              404 — Página no encontrada
                            </div>
                          }
                        />
                      </Routes>
                    </main>
                    <Footer />
                    <CartSidebar />
                  </div>
                </CartProvider>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
