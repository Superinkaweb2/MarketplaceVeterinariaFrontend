import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Header } from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RequiresProfile } from "./components/RequiresProfile";
import Home from "./pages/Home";
import { SobreNosotros } from "./pages/SobreNosotros";
import { Empleos } from "./pages/Empleos";
import { Blog } from "./pages/Blog";
import { Contacto } from "./pages/Contacto";
import { Privacidad } from "./pages/Privacidad";
import { Terminos } from "./pages/Terminos";
import { Marketplace } from "./features/marketplace/pages/Marketplace";
import { ProductDetails } from "./features/marketplace/pages/ProductDetails";
import { CheckoutPage } from "./features/marketplace/pages/CheckoutPage";
import { PaymentSuccessPage } from "./features/marketplace/pages/PaymentSuccessPage";
import { CartProvider } from "./features/marketplace/context/CartContext";
import { CartSidebar } from "./features/marketplace/components/CartSidebar";
import { Login } from "./features/auth/pages/Login";
import { Register } from "./features/auth/pages/Register";
import { ClienteProfilePage } from "./features/auth/pages/profiles/ClienteProfilePage";
import { VeterinarioProfilePage } from "./features/auth/pages/profiles/VeterinarioProfilePage";
import { EmpresaProfilePage } from "./features/auth/pages/profiles/EmpresaProfilePage";
import { useTheme } from "./hooks/useTheme";
import { AuthProvider } from "./features/auth/context/AuthContext";
import Dashboard from "./features/dashboard/admin/pages/Dashboard";
import AdminPortal from "./features/dashboard/admin/pages/AdminPortal";
import DashboardEmpresa from "./features/dashboard/empresa/pages/DashboardEmpresa";
import { DashboardHome } from "./features/dashboard/empresa/components/layouts/DashboardHome";
import { ProductosPage } from "./features/dashboard/empresa/pages/ProductosPage";
import { ServiciosPage } from "./features/dashboard/empresa/pages/ServiciosPage";
import { EquipoPage } from "./features/dashboard/empresa/pages/EquipoPage";
import { FacturacionPage } from "./features/dashboard/empresa/pages/FacturacionPage";
import { MySubscriptionPage } from "./features/dashboard/empresa/pages/MySubscriptionPage";
import { PaymentSuccessPage as PaymentSuccessPageEmpresa } from "./features/dashboard/empresa/pages/PaymentSuccessPage";
import { TalentoPage } from "./features/dashboard/empresa/pages/TalentoPage";
import { PacientesPage as EmpresaPacientesPage } from "./features/dashboard/empresa/pages/PacientesPage";

// Portal Admin
import { EmpresasPage } from "./features/dashboard/admin/pages/EmpresasPage";
import { UsuariosPage } from "./features/dashboard/admin/pages/UsuariosPage";
import { CategoriasPage } from "./features/dashboard/admin/pages/CategoriasPage";
import { SubscriptionAdminPage } from "./features/dashboard/admin/pages/SubscriptionAdminPage";
import { DashboardCliente } from "./features/dashboard/cliente/components/layouts/DashboardCliente";
import { MascotasPage } from "./features/dashboard/cliente/pages/MascotasPage";
import { AdopcionesPage } from "./features/dashboard/shared/adopciones/pages/AdopcionesPage";
import { MisAdopcionesPage } from "./features/dashboard/shared/adopciones/pages/MisAdopcionesPage";
import { EmpresaConfigPage } from "./features/dashboard/empresa/pages/EmpresaConfigPage";
import { OAuthCallbackPage } from "./features/dashboard/empresa/pages/OAuthCallbackPage";
import { ClienteConfigPage } from "./features/dashboard/cliente/pages/ClienteConfigPage";

// Portal Veterinario
import DashboardVeterinario from "./features/dashboard/veterinario/pages/DashboardVeterinario";
import { VetHomePage } from "./features/dashboard/veterinario/pages/VetHomePage";
import { VetServiciosPage } from "./features/dashboard/veterinario/pages/VetServiciosPage";
import { InvitacionesPage } from "./features/dashboard/veterinario/pages/InvitacionesPage";
import { VetConfiguracionPage } from "./features/dashboard/veterinario/pages/VetConfiguracionPage";
import { VetCitasPage } from "./features/dashboard/veterinario/pages/VetCitasPage";
import { VetPacientesPage } from "./features/dashboard/veterinario/pages/VetPacientesPage";


function App() {
  useTheme();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas publicas: Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Formilarios de Perfil (Requieren token del rol, pero perfilCompleto=false) */}
          {/* Ojo: el Admin no tiene formulario de perfil propio, se crea desde BD/Dashboard */}
          <Route element={<ProtectedRoute allowedRoles={["CLIENTE"]} />}>
            <Route path="/register/perfil/cliente" element={<ClienteProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["VETERINARIO"]} />}>
            <Route path="/register/perfil/veterinario" element={<VeterinarioProfilePage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["EMPRESA"]} />}>
            <Route path="/register/perfil/empresa" element={<EmpresaProfilePage />} />
          </Route>

          {/* Rutas protegidas: Admin (Requiere Perfil Completo) */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route element={<RequiresProfile />}>
              <Route path="/portal/admin" element={<AdminPortal />}>
                <Route index element={<Dashboard />} />
                <Route path="empresas" element={<EmpresasPage />} />
                <Route path="usuarios" element={<UsuariosPage />} />
                <Route path="categorias" element={<CategoriasPage />} />
                <Route path="veterinarios" element={<div className="p-8 text-xl text-slate-500 font-medium">Gestión de Veterinarios en Construcción...</div>} />
                <Route path="marketplace" element={<div className="p-8 text-xl text-slate-500 font-medium">Gestión de Marketplace en Construcción...</div>} />
                <Route path="suscripciones" element={<SubscriptionAdminPage />} />
                <Route path="reportes" element={<div className="p-8 text-xl text-slate-500 font-medium">Reportes en Construcción...</div>} />
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
                <Route path="configuracion" element={<ClienteConfigPage />} />
              </Route>
            </Route>
          </Route>

          {/* Rutas públicas con Layout (Header + Footer) */}
          <Route
            path="*"
            element={
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
                        <CartProvider>
                          <Routes>
                            <Route index element={<Marketplace />} />
                            <Route path="product/:id" element={<ProductDetails />} />
                            <Route path="checkout" element={<CheckoutPage />} />
                          </Routes>
                          <CartSidebar />
                        </CartProvider>
                      }
                    />
                    <Route path="/payment/success" element={<PaymentSuccessPage />} />
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
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
