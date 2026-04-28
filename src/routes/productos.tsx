import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { fetchCategories, fetchProducts, type Category, type Product } from "@/lib/products-api";

export const Route = createFileRoute("/productos")({
  head: () => ({
    meta: [
      { title: "Productos — tyson.styles" },
      { name: "description", content: "Catálogo de productos capilares para cabello rizado y afro. Champús, acondicionadores, mascarillas, aceites y más." },
      { property: "og:title", content: "Productos — tyson.styles" },
      { property: "og:description", content: "Productos especializados para rizos. Envío a domicilio y recogida en local." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): { categoria?: string } => {
    const c = typeof search.categoria === "string" ? search.categoria : undefined;
    return c ? { categoria: c } : {};
  },
  component: ProductosPage,
});

function ProductosPage() {
  const { categoria } = Route.useSearch();
  const [active, setActive] = useState(categoria ?? "todos");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchProducts()])
      .then(([c, p]) => { setCategories(c); setProducts(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (categoria) setActive(categoria);
  }, [categoria]);

  const categoryById = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((c) => map.set(c.id, c.slug));
    return map;
  }, [categories]);

  const filtered = useMemo(() => {
    let list = products;
    if (active !== "todos") {
      list = list.filter((p) => categoryById.get(p.categoryId ?? "") === active);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description?.toLowerCase().includes(q) ?? false)
      );
    }
    return list;
  }, [products, active, query, categoryById]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            Nuestros <span className="text-gradient-teal">Productos</span>
          </h1>
          <p className="mt-3 text-muted-foreground">Especializados en cabello rizado y afro</p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-md mx-auto mb-8 relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 h-12 rounded-full bg-card border-border text-base"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          <button
            onClick={() => setActive("todos")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-primary/30 ${active === "todos" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border-border/50"}`}
          >
           Todos
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.slug)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${active === cat.slug ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 border-primary/50" : "bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground border-border/50"}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </motion.div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No encontramos productos con esos criterios</p>
          </div>
        )}
      </div>
    </div>
  );
}
