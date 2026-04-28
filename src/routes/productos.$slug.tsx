import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, MessageCircle, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductBySlug, type Product } from "@/lib/products-api";
import { useExchangeRate } from "@/components/ExchangeRateContext";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { ProductReviews } from "@/components/ProductReviews";

export const Route = createFileRoute("/productos/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const { rate } = useExchangeRate();

  useEffect(() => {
    setLoading(true);
    fetchProductBySlug(slug)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="font-display text-2xl">Producto no encontrado</h1>
        <Link to="/productos" className="text-primary hover:text-accent">Volver al catálogo</Link>
      </div>
    );
  }

  const wished = has(product.id);

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link to="/productos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border glow-teal"
          >
            <img src={product.imageUrl ?? "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col justify-center">
            <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight">{product.name}</h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed">{product.description}</p>

            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-4xl font-display font-bold text-gradient-gold">${Number(product.priceUSD || 0).toFixed(2)} USD</span>
              <span className="text-sm text-muted-foreground ml-2">({(Number(product.priceUSD || 0) * rate).toLocaleString('es-CU')} CUP)</span>
              {product.stock > 0 ? (
                <span className="text-xs text-primary">✓ En stock</span>
              ) : (
                <span className="text-xs text-destructive">Agotado</span>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <Button
                onClick={() => addItem(product)}
                disabled={product.stock <= 0}
                className="flex-1 h-12 rounded-full bg-primary text-primary-foreground hover:glow-teal text-base font-semibold gap-2"
              >
                <Plus className="w-4 h-4" /> Añadir al carrito
              </Button>
              <button
                onClick={() => toggle(product.id)}
                aria-label="Favorito"
                className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all ${wished ? "bg-accent text-accent-foreground border-accent" : "bg-card border-border hover:border-accent/50"}`}
              >
                <Heart className={`w-5 h-5 ${wished ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="mt-8 p-5 rounded-2xl bg-card border border-border">
              <p className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" /> ¿Necesitas asesoramiento?
              </p>
              <p className="text-xs text-muted-foreground mb-3">Te ayudamos a elegir el producto perfecto para tu tipo de rizo. Escríbenos por WhatsApp.</p>
              <a
                href="https://wa.me/5358203729?text=Hola%20tyson.styles!%20Me%20interesa%20el%20producto%20..."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366] text-white text-sm font-medium hover:bg-[#20BD5A] transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> Escribir por WhatsApp
              </a>
            </div>
          </motion.div>
        </div>

        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
}
