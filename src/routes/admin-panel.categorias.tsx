import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categories-api";
import { toast } from "@/components/CustomToast";

export const Route = createFileRoute("/admin-panel/categorias")({
  head: () => ({
    meta: [{ title: "Categorías — Admin tyson.styles" }],
  }),
  component: AdminCategoriasPage,
});

function AdminCategoriasPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (editing.id) {
        await updateCategory(editing.id, editing);
        toast.success("✅ Categoría actualizada", editing.name);
      } else {
        await createCategory(editing);
        toast.success("✅ Categoría creada", editing.name);
      }
      const c = await fetchCategories();
      setCategories(c);
      setEditing(null);
    } catch (e) {
      console.error(e);
      toast.error("❌ Error al guardar", "Verifique los datos de la categoría");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const category = categories.find(c => c.id === id);
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
      toast.success("🗑️ Categoría eliminada", category?.name);
    } catch (e) {
      console.error(e);
      toast.error("❌ No se puede eliminar", "La categoría tiene productos asociados");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold">Categorías</h1>
          <p className="text-sm text-muted-foreground">{categories.length} categorías</p>
        </div>
        <Button onClick={() => setEditing({ name: "", slug: "", icon: "", sortOrder: categories.length + 1 })} className="rounded-full">
          <Plus className="w-4 h-4 mr-2" /> Nueva
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map(category => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-xl border border-border p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">{category.icon}</span>
                <div>
                  <h3 className="font-medium">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">/{category.slug}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={() => setEditing(category)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)} className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
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
            className="bg-card rounded-2xl border border-border p-6 w-full max-w-md"
          >
            <h2 className="font-display text-xl font-bold mb-4">{editing.id ? "Editar" : "Nueva"} Categoría</h2>
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
                <Label>Icono (emoji)</Label>
                <Input value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} placeholder="🧴" />
              </div>
              <div>
                <Label>Orden</Label>
                <Input type="number" value={editing.sortOrder} onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) })} />
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