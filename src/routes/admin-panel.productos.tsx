import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Pencil, Trash2, Loader2, ToggleLeft, Eye, EyeOff } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchCategories, fetchAllProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/products-api";
import { useExchangeRate } from "@/components/ExchangeRateContext";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/CustomToast";

export const Route = createFileRoute("/admin-panel/productos")({
  head: () => ({
    meta: [{ title: "Productos — Admin tyson.styles" }],
  }),
  component: AdminProductosPage,
});

function AdminProductosPage() {
  const navigate = useNavigate();
  const { rate } = useExchangeRate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([fetchAllProducts(), fetchCategories()])
      .then(([p, c]) => { setProducts(p); setCategories(c); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description?.toLowerCase().includes(q)
    );
  }, [products, search]);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      // Clean up data before sending
      const productData = {
        name: editing.name,
        slug: editing.slug || undefined,
        description: editing.description || undefined,
        priceUSD: Number(editing.priceUSD) || 0,
        categoryId: editing.categoryId || undefined,
        imageUrl: editing.imageUrl || undefined,
        isActive: editing.isActive ?? true,
        featured: editing.featured ?? false,
      };
      
      if (editing.id) {
        await updateProduct(editing.id, productData);
        toast.success("✅ Producto actualizado", editing.name);
      } else {
        await createProduct(productData);
        toast.success("✅ Producto creado", editing.name);
      }
      const p = await fetchAllProducts();
      setProducts(p);
      setEditing(null);
    } catch (e: any) {
      console.error("Error saving product:", e);
      const msg = e?.message || e?.response?.data?.message || "Verifique los datos del producto";
      toast.error("❌ Error al guardar", String(msg));
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const product = products.find(p => p.id === id);
    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success("🗑️ Producto eliminado", product?.name);
    } catch (e) {
      console.error(e);
      toast.error("❌ No se puede eliminar", "El producto puede tener pedidos asociados");
    }
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const newStatus = !product.isActive;
      await updateProduct(product.id, { isActive: newStatus });
      setProducts(products.map(p => p.id === product.id ? { ...p, isActive: newStatus } : p));
      toast.success(newStatus ? "✅ Producto activado" : "⏸️ Producto desactivado", product.name);
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al cambiar estado");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Productos</h1>
          <p className="text-sm text-muted-foreground">{products.length} productos</p>
        </div>
        <Button onClick={() => setEditing({ name: "", slug: "", description: "", priceUSD: 0, categoryId: "", imageUrl: "", isActive: true })} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Nuevo
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-11 h-11"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(product => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-card rounded-xl border border-border p-4 ${!product.isActive ? "opacity-50" : ""}`}
            >
              <div className="flex items-center gap-4">
                <img src={product.imageUrl || "/placeholder.svg"} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm font-bold">${Number(product.priceUSD || 0).toFixed(2)} USD</span>
                    <span className="text-sm text-muted-foreground">({(Number(product.priceUSD || 0) * rate).toLocaleString('es-CU')} CUP)</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}>
                      {product.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleActive(product)}>
                    {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setEditing(product)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl border border-border p-6 w-full max-w-lg"
          >
            <h2 className="font-display text-xl font-bold mb-4">{editing.id ? "Editar" : "Nuevo"} Producto</h2>
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} />
              </div>
              <div>
                <Label>Descripción</Label>
                <Input value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <Label>Precio (USD)</Label>
                <Input type="number" value={editing.priceUSD} onChange={(e) => setEditing({ ...editing, priceUSD: Number(e.target.value) })} />
              </div>
              <div>
                <Label>URL Imagen</Label>
                <Input value={editing.imageUrl || ""} onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })} />
              </div>
              <div>
                <Label>Categoría</Label>
                <select 
                  value={editing.categoryId || ""} 
                  onChange={(e) => setEditing({ ...editing, categoryId: e.target.value })}
                  className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditing(null)} className="flex-1">Cancelar</Button>
              <Button onClick={handleSave} disabled={saving} className="flex-1">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}