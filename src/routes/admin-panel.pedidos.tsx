import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check, X, Clock, Truck, Package, MessageCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchOrders, updateOrderStatus } from "@/lib/orders-api";
import { useExchangeRate } from "@/components/ExchangeRateContext";
import { toast } from "@/components/CustomToast";

export const Route = createFileRoute("/admin-panel/pedidos")({
  head: () => ({
    meta: [{ title: "Pedidos — Admin tyson.styles" }],
  }),
  component: AdminPedidosPage,
});

const ESTADOS = [
  { value: "PENDING", label: "Pendiente", icon: Clock, color: "yellow" },
  { value: "CONFIRMED", label: "Confirmado", icon: Check, color: "blue" },
  { value: "PREPARING", label: "Preparación", icon: Package, color: "purple" },
  { value: "SENT", label: "Enviado", icon: Truck, color: "orange" },
  { value: "DELIVERED", label: "Entregado", icon: Check, color: "green" },
  { value: "CANCELLED", label: "Cancelado", icon: X, color: "red" },
];

function AdminPedidosPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("all");
  const [search, setSearch] = useState("");
  const { rate } = useExchangeRate();

  const loadOrders = () => {
    setLoading(true);
    fetchOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
    // Auto-refresh cada 30 segundos
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const pedidosFiltrados = orders.filter((o: any) => {
    if (filtro !== "all" && o.status !== filtro) return false;
    if (search) {
      const q = search.toLowerCase();
      return o.customerName?.toLowerCase().includes(q) || 
             o.codigo?.toLowerCase().includes(q) || 
             o.phone?.includes(q);
    }
    return true;
  });

  const handleStatusChange = async (orderId: string, newStatus: string, motivo?: string) => {
    try {
      await updateOrderStatus(orderId, newStatus, motivo);
      loadOrders();
      toast.success(`Estado actualizado`, ESTADOS.find(e => e.value === newStatus)?.label || "");
    } catch (e) {
      console.error(e);
      toast.error("Error al actualizar");
    }
  };

  const notificarCliente = (order: any) => {
    const msgs: Record<string, string> = {
      CONFIRMED: "¡Hola! 👋 Tu pedido fue confirmado. Ya lo estamos organizando.🎉",
      PREPARING: "¡Hola! 👋 Estamos preparando tus productos capilares 🧴",
      SENT: "¡Hola! 👋 Tu pedido está en camino! 🚚 Pronto lo recibirás",
      DELIVERED: "¡Hola! 👋 Tu pedido fue entregado! 🎉 Gracias por tu compra 💛",
      CANCELLED: "Tu pedido fue cancelado. Lamentamos los inconvenientes.",
    };
    
    const itemsMsg = Array.isArray(order.items) 
      ? order.items.map((item: any) => `- ${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)} USD`).join("\n")
      : "";
    
    const total = Number(order.total || 0);
    const totalCUP = Math.round(total * rate);
    
    const msg = 
`📦 *Actualización de pedido ${order.codigo || ''}*

${msgs[order.status] || "Actualización de tu pedido"}

📋 *Resumen:*
${itemsMsg}

💰 *Total:* $${total.toFixed(2)} USD (${totalCUP.toLocaleString("es-CU")} CUP)

📎 *Rastrea tu pedido:* tyson.styles/rastrear

— *tyson.styles* 🧴`;

    const url = `https://wa.me/${order.phone.replace(/\D/g, "")}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const stats = {
    total: orders.length,
    pendiente: orders.filter((o: any) => o.status === "PENDING").length,
    confirmado: orders.filter((o: any) => o.status === "CONFIRMED").length,
    entregado: orders.filter((o: any) => o.status === "DELIVERED").length,
    vendido: orders.filter((o: any) => o.status === "DELIVERED")
      .reduce((acc: number, o: any) => acc + Number(o.total || 0), 0),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Pedidos</h1>
          <p className="text-sm text-muted-foreground">{orders.length} pedidos</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadOrders}>
          <RefreshCw className="w-4 h-4 mr-2" /> Actualizar
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        <div className="bg-card rounded-xl border border-border p-3 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
        <div className="bg-yellow-500/10 rounded-xl border border-yellow-500/30 p-3 text-center">
          <p className="text-2xl font-bold text-yellow-500">{stats.pendiente}</p>
          <p className="text-xs text-muted-foreground">Pendientes</p>
        </div>
        <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-3 text-center">
          <p className="text-2xl font-bold text-blue-500">{stats.confirmado}</p>
          <p className="text-xs text-muted-foreground">Confirmados</p>
        </div>
        <div className="bg-green-500/10 rounded-xl border border-green-500/30 p-3 text-center">
          <p className="text-2xl font-bold text-green-500">{stats.entregado}</p>
          <p className="text-xs text-muted-foreground">Entregados</p>
        </div>
        <div className="bg-primary/10 rounded-xl border border-primary/30 p-3 text-center">
          <p className="text-2xl font-bold text-primary">${stats.vendido.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Vendido USD</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          size="sm"
          variant={filtro === "all" ? "default" : "outline"}
          onClick={() => setFiltro("all")}
        >
          Todos
        </Button>
        {ESTADOS.slice(0, 4).map(e => (
          <Button
            key={e.value}
            size="sm"
            variant={filtro === e.value ? "default" : "outline"}
            onClick={() => setFiltro(e.value)}
            className={filtro === e.value ? e.color === "yellow" ? "bg-yellow-600" : 
                              e.color === "blue" ? "bg-blue-600" :
                              e.color === "purple" ? "bg-purple-600" :
                              e.color === "orange" ? "bg-orange-600" : "" : ""}
          >
            {e.label}
          </Button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Buscar por código, nombre o teléfono..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full h-10 px-4 rounded-xl bg-card border border-border mb-4"
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : pedidosFiltrados.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p>No hay pedidos</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pedidosFiltrados.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  {order.codigo && (
                    <span className="text-sm font-mono bg-primary/10 px-2 py-1 rounded mr-2">
                      {order.codigo}
                    </span>
                  )}
                  <h3 className="font-medium">{order.customerName}</h3>
                  <p className="text-sm text-muted-foreground">{order.phone}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    order.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                    order.status === "CONFIRMED" ? "bg-blue-500/20 text-blue-500" :
                    order.status === "PREPARING" ? "bg-purple-500/20 text-purple-500" :
                    order.status === "SENT" ? "bg-orange-500/20 text-orange-500" :
                    order.status === "DELIVERED" ? "bg-green-500/20 text-green-500" :
                    "bg-red-500/20 text-red-500"
                  }`}>
                    {ESTADOS.find(e => e.value === order.status)?.label || order.status}
                  </span>
                </div>
              </div>

              <div className="bg-secondary/30 rounded-lg p-3 mb-3">
                <p className="text-xs text-muted-foreground mb-2">Productos:</p>
                {Array.isArray(order.items) && order.items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm mb-3">
                <div>
                  <span className={order.deliveryMethod === "DOMICILIO" ? "text-orange-500" : "text-green-500"}>
                    {order.deliveryMethod === "DOMICILIO" ? "📦 Domicilio" : "🏪 Recoger"}
                  </span>
                  {order.address && <p className="text-muted-foreground">{order.address}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${Number(order.total).toFixed(2)} USD</p>
                  <p className="text-xs text-muted-foreground">
                    ({(Number(order.total) * rate).toLocaleString("es-CU")} CUP)
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-CU")}
                  </p>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 border-t border-border pt-3">
                {order.status === "PENDING" && (
                  <>
                    <Button size="sm" onClick={() => handleStatusChange(order.id, "CONFIRMED")}>
                      Confirmar
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => {
                      const motivo = prompt("Motivo de cancelación:");
                      if (motivo) handleStatusChange(order.id, "CANCELLED", motivo);
                    }}>
                      Cancelar
                    </Button>
                  </>
                )}
                {order.status === "CONFIRMED" && (
                  <Button size="sm" onClick={() => handleStatusChange(order.id, "PREPARING")}>
                    En Preparación
                  </Button>
                )}
                {order.status === "PREPARING" && (
                  <Button size="sm" onClick={() => handleStatusChange(order.id, "SENT")}>
                    Marcar Enviado
                  </Button>
                )}
                {order.status === "SENT" && (
                  <Button size="sm" onClick={() => handleStatusChange(order.id, "DELIVERED")}>
                    Marcar Entregado
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => notificarCliente(order)}>
                  <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}