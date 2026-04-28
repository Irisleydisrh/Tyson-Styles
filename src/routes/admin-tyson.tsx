import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Simple password check (no hashing for speed)
const ADMIN_PASSWORD = "Admin2026";

export const Route = createFileRoute("/admin-tyson")({
  head: () => ({
    meta: [{ title: "Admin — tyson.styles" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple check - no async needed
    if (password === ADMIN_PASSWORD) {
      // Store session in sessionStorage (SSR-safe check)
      if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem("adminAuthenticated", "true");
        sessionStorage.setItem("adminExpires", String(Date.now() + 3600000)); // 1 hour
      }
      navigate({ to: "/admin-panel" });
    } else {
      setError("Contraseña incorrecta");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card rounded-3xl border border-border p-8 glow-teal"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Acceso Administración</h1>
          <p className="text-sm text-muted-foreground mt-1">Ingresa la contraseña</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-11" 
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary hover:glow-teal text-base font-semibold">
            {loading ? "Verificando..." : "Entrar"}
            {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            ← Volver a la tienda
          </a>
        </div>
      </motion.div>
    </div>
  );
}