import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, ShoppingCart, Tag, DollarSign, Loader2 } from "lucide-react";
import { fetchCategories, fetchProducts, fetchAllProducts } from "@/lib/products-api";
import { fetchOrders } from "@/lib/orders-api";
import { useExchangeRate } from "@/components/ExchangeRateContext";

export const Route = createFileRoute("/admin-panel/")({
  head: () => ({
    meta: [{ title: "Dashboard — Admin tyson.styles" }],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { rate } = useExchangeRate();
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      fetchAllProducts(),
      fetchCategories(),
      fetchOrders(),
    ])
      .then(([products, categories, orders]) => {
        setStats({
          products: products.length,
          orders: orders.length,
          categories: categories.length,
        });
        setRecentOrders(orders.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Productos",
      value: stats.products,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pedidos",
      value: stats.orders,
      icon: ShoppingCart,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Categorías",
      value: stats.categories,
      icon: Tag,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Tasa Cambio",
      value: `${rate} CUP`,
      icon: DollarSign,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Resumen de tu tienda</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl border border-border p-6"
              >
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h2 className="font-display text-xl font-semibold mb-4">Pedidos Recientes</h2>
            {recentOrders.length === 0 ? (
              <p className="text-muted-foreground">No hay pedidos aún</p>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl">
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("es-CU")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${Number(order.total).toFixed(2)} USD</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "PENDING" ? "bg-yellow-500/20 text-yellow-500" :
                        order.status === "CONFIRMED" ? "bg-blue-500/20 text-blue-500" :
                        order.status === "DELIVERED" ? "bg-green-500/20 text-green-500" :
                        "bg-red-500/20 text-red-500"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}