import { Outlet, Link, createRootRoute, HeadContent, Scripts, useLocation } from "@tanstack/react-router";
import { CartProvider } from "@/components/CartContext";
import { AuthProvider } from "@/components/AuthContext";
import { WishlistProvider } from "@/components/WishlistContext";
import { ExchangeRateProvider } from "@/components/ExchangeRateContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { toastContainer } from "@/components/CustomToast";

import appCss from "../styles.css?url";
import logoImg from "@/assets/logo.jpeg?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground font-display">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "tyson.styles — Boutique Capilar para Rizadas" },
      { name: "description", content: "Te ayudamos a tener una melena sana y con carácter. Productos especializados para cabello rizado y afro." },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: logoImg },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin") || location.pathname.startsWith("/admin-panel") || location.pathname === "/auth" || location.pathname === "/admin-tyson";
  
  return (
    <AuthProvider>
      <WishlistProvider>
        <ExchangeRateProvider>
          <CartProvider>
            {!isAdminRoute && <Header />}
            <main>
              <Outlet />
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <CartDrawer />}
            <a
              href="/admin-panel"
              className="fixed bottom-6 left-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-primary-foreground font-medium shadow-lg hover:bg-primary/90 transition-all"
            >
              ← Panel Admin
            </a>
            {toastContainer()}
          </CartProvider>
        </ExchangeRateProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
