import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Package, Check, Clock, Truck, XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchOrders } from "@/lib/orders-api";
import { useExchangeRate } from "@/components/ExchangeRateContext";

export const Route = createFileRoute("/rastrear")({
  head: () => ({
    meta: [
      { title: "Rastrear Pedido — tyson.styles" },
      { name: "description", content: "Rastrea tu pedido en tyson.styles" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { codigo?: string } => {
    const c = typeof search.codigo === "string" ? search.codigo : undefined;
    return c ? { codigo: c } : {};
  },
  component: RastrearPage,
});

function RastrearPage() {
  const { codigo } = Route.useSearch();
  const [codigoInput, setCodigoInput] = useState(codigo || "");
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { rate } = useExchangeRate();

  const buscarPedido = async () => {
    if (!codigoInput.trim()) {
      setError("Ingresa el código de tu pedido");
      return;
    }
    
    setLoading(true);
    setError("");
    setOrder(null);
    
    try {
      const orders = await fetchOrders();
      // Buscar por código generado o por nombre/teléfono
      const found = orders.find((o: any) => 
        o.codigo?.toLowerCase() === codigoInput.trim().toLowerCase() ||
        o.customerName?.toLowerCase().includes(codigoInput.trim().toLowerCase()) ||
        o.phone?.includes(codigoInput.trim())
      );
      
      if (found) {
        setOrder(found);
      } else {
        setError("No encontramos ese pedido. Verifica el código o intenta con tu nombre.");
      }
    } catch (e) {
      setError("Error al buscar. Intenta más tarde.");
    }
    setLoading(false);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { icon: Clock, label: "Pendiente", color: "text-yellow-500", bg: "bg-yellow-500/20", msg: "Tu pedido está siendo procesado" };
      case "CONFIRMED":
        return { icon: CheckCircle2, label: "Confirmado", color: "text-blue-500", bg: "bg-blue-500/20", msg: "¡Hemos confirmado tu pedido!" };
      case "PREPARING":
        return { icon: Package, label: "En Preparación", color: "text-purple-500", bg: "bg-purple-500/20", msg: "Estamos preparando tus productos" };
      case "SENT":
        return { icon: Truck, label: "Enviado", color: "text-orange-500", bg: "bg-orange-500/20", msg: "Tu pedido está en camino" };
      case "DELIVERED":
        return { icon: Check, label: "Entregado", color: "text-green-500", bg: "bg-green-500/20", msg: "¡Pedido entregado! Gracias por tu compra 💛" };
      case "CANCELLED":
        return { icon: XCircle, label: "Cancelado", color: "text-red-500", bg: "bg-red-500/20", msg: "Tu pedido fue cancelado" };
      default:
        return { icon: Clock, label: status, color: "text-gray-500", bg: "bg-gray-500/20", msg: "" };
    }
  };

  // Calcular progreso según estado
  const getProgressStep = (status: string) => {
    const steps: Record<string, number> = {
      PENDING: 0,
      CONFIRMED: 1,
      PREPARING: 2,
      SENT: 3,
      DELIVERED: 4,
    };
    return steps[status] ?? 0;
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="font-display text-3xl sm:text-4xl font-bold">
            Rastrear <span className="text-gradient-teal">Pedido</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Ingresa el código que te dimos al hacer el pedido
          </p>
        </motion.div>

        {/* Buscador */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-8"
        >
          <Input
            placeholder="Código del pedido (ej: CAP-XXXXX)"
            value={codigoInput}
            onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && buscarPedido()}
            className="h-12 text-lg text-center tracking-widest"
          />
          <Button onClick={buscarPedido} disabled={loading} className="h-12 px-6">
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-center"
          >
            <AlertCircle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive">{error}</p>
          </motion.div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border p-6"
          >
            {/* Cliente */}
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">Pedido de</p>
              <h2 className="font-display text-xl font-bold">{order.customerName}</h2>
              <p className="text-primary">{order.phone}</p>
            </div>

            {/* Barra de progreso */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                {["PENDING", "CONFIRMED", "PREPARING", "SENT", "DELIVERED"].map((status, i) => {
                  const info = getStatusInfo(status);
                  const isActive = getProgressStep(order.status) >= i;
                  const isCurrent = order.status === status;
                  const Icon = info.icon;
                  
                  return (
                    <div key={status} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isActive ? `${info.bg} ${info.color}` : "bg-secondary text-muted-foreground"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-xs mt-1 ${isCurrent ? "font-bold" : "text-muted-foreground"}`}>
                        {status === "PREPARING" ? "Preparación" : status === "SENT" ? "Enviado" : info.label}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="h-1 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(getProgressStep(order.status) / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Estado actual */}
            <div className={`text-center p-4 rounded-xl ${getStatusInfo(order.status).bg} mb-6`}>
              <p className={`font-bold ${getStatusInfo(order.status).color}`}>
                {getStatusInfo(order.status).msg}
              </p>
            </div>

            {/* Productos */}
            <div className="border-t border-border pt-4 mb-4">
              <p className="text-sm text-muted-foreground mb-3">Productos:</p>
              <div className="space-y-2">
                {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between">
                    <span>{item.name} x{item.quantity}</span>
                    <span className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)} USD
                      <span className="text-muted-foreground text-sm ml-1">
                        ({(item.price * item.quantity * rate).toLocaleString("es-CU")} CUP)
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total y entrega */}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-muted-foreground">Método:</span>
                <span>{order.deliveryMethod === "DOMICILIO" ? "📦 Domicilio" : "🏪 Recoger"}</span>
              </div>
              {order.address && (
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span>{order.address}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span className="text-gradient-gold">
                  ${Number(order.total).toFixed(2)} USD
                  <span className="text-sm font-normal ml-1">
                    ({(Number(order.total) * rate).toLocaleString("es-CU")} CUP)
                  </span>
                </span>
              </div>
            </div>

            {/* Fecha */}
            <div className="text-center mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Pedido el {new Date(order.createdAt).toLocaleDateString("es-CU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={`https://wa.me/5358203729?text=Hola,%20quiero%20información%20sobre%20mi%20pedido`}
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-4"
            >
              <Button className="w-full bg-[#25D366] hover:bg-[#20BD5A]">
                Consultar por WhatsApp
              </Button>
            </a>
          </motion.div>
        )}

        {/* Ayuda */}
        {!order && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mt-8 text-muted-foreground"
          >
            <p className="text-sm">
              ¿No tienes código? 
              <a href="https://wa.me/5358203729" className="text-primary underline ml-1">
                Escríbenos por WhatsApp
              </a>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}