import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, LayoutDashboard, Package, ShoppingCart, LogOut, Tag, DollarSign, Eye } from "lucide-react";
import { toast } from "@/components/CustomToast";
import { Button } from "@/components/ui/button";
import { fetchExchangeRate, updateExchangeRate } from "@/lib/exchange-rate";
import { useExchangeRate } from "@/components/ExchangeRateContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Check if admin is authenticated (SSR-safe)
function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined' || typeof sessionStorage === 'undefined') return false;
  const auth = sessionStorage.getItem("adminAuthenticated");
  const expires = sessionStorage.getItem("adminExpires");
  if (!auth || !expires) return false;
  return Date.now() < parseInt(expires);
}

export const Route = createFileRoute("/admin-panel")({
  beforeLoad: () => {
    if (!isAdminAuthenticated()) {
      throw new Redirect({ href: "/admin-tyson" });
    }
  },
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rate, loading: rateLoading } = useExchangeRate();
  const [saving, setSaving] = useState(false);
  const [rateInput, setRateInput] = useState<number | string>(0);
  const [localError, setLocalError] = useState<string | null>(null);

  // Sync local input when rate from context changes (but only on mount/internal updates)
  useEffect(() => {
    if (rate && Number(rate) > 0) {
      setRateInput(rate);
    }
  }, [rate]);

  const handleRateChange = async () => {
    const newRate = Number(rateInput);
    if (!newRate || newRate <= 0) {
      setLocalError("Ingrese un valor mayor a 0");
      return;
    }
    setLocalError(null);
    setSaving(true);
    try {
      const data = await updateExchangeRate(Number(rateInput));
      toast.success("✅ Tasa actualizada", `1 USD = ${Number(data.rate).toFixed(2)} CUP`);
    } catch (e: unknown) {
      console.error("Rate update error:", e);
      const message = e instanceof Error ? e.message : "Error desconocido";
      toast.error("❌ Error al actualizar", message);
    }
    setSaving(false);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem("adminAuthenticated");
      sessionStorage.removeItem("adminExpires");
    }
    navigate({ to: "/" });
  };

  const links = [
    { to: "/admin-panel", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin-panel/productos", label: "Productos", icon: Package, exact: false },
    { to: "/admin-panel/categorias", label: "Categorías", icon: Tag, exact: false },
    { to: "/admin-panel/pedidos", label: "Pedidos", icon: ShoppingCart, exact: false },
  ] as const;

  if (rateLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-border bg-card/50 backdrop-blur-sm fixed top-20 bottom-0 left-0 p-4">
        <nav className="flex-1 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary/15 text-primary" : "text-foreground/70 hover:bg-secondary/50"}`}
              >
                <Icon className="w-4 h-4" /> {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Exchange Rate Editor */}
        <div className="border-t border-border pt-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Tasa de Cambio</span>
          </div>
          <div className="space-y-2">
            <Input
              type="number"
              value={rateInput}
              onChange={(e) => setRateInput(e.target.value)}
              className="h-9"
              placeholder="Ej: 120"
            />
            {localError && <p className="text-xs text-destructive">{localError}</p>}
            <Button 
              onClick={handleRateChange} 
              disabled={saving}
              size="sm"
              className="w-full"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar"}
            </Button>
          </div>
        </div>

        {/* Ver Tienda button */}
        <div className="border-t border-border pt-4 mt-4">
          <a
            href="http://localhost:3000?from=admin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-primary hover:bg-primary/10 transition-all"
          >
            <Eye className="w-4 h-4" /> Ver Tienda
          </a>
        </div>

        <Button 
          onClick={handleLogout} 
          variant="ghost" 
          className="justify-start gap-2 text-muted-foreground hover:text-destructive mt-2"
        >
          <LogOut className="w-4 h-4" /> Cerrar sesión
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-60 p-4 sm:p-8">
        {/* Mobile nav */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-4 mb-4 -mx-4 px-4">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = l.exact ? location.pathname === l.to : location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium ${isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}
              >
                <Icon className="w-3.5 h-3.5" /> {l.label}
              </Link>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

function Redirect({ href }: { href: string }) {
  window.location.href = href;
  return null;
}