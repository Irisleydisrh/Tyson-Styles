import { motion } from "framer-motion";
import { Plus, Heart } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products-api";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { useExchangeRate } from "./ExchangeRateContext";

// Format price in CUP
function formatCUP(value: number): string {
  return `${value.toLocaleString('es-CU')} CUP`;
}

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const { rate: exchangeRate } = useExchangeRate();

  // Calculate price in CUP
  const priceUSD = Number(product.priceUSD) || 0;
  const priceCUP = priceUSD * exchangeRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:glow-teal transition-all duration-500"
    >
      <Link
        to="/productos/$slug"
        params={{ slug: product.slug }}
        className="block relative overflow-hidden aspect-square"
      >
        <img
          src={product.imageUrl ?? "/placeholder.svg"}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </Link>

      <button
        onClick={(e) => { e.preventDefault(); toggle(product.id); }}
        aria-label={wished ? "Quitar de favoritos" : "Añadir a favoritos"}
        className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 ${wished ? "bg-accent text-accent-foreground" : "bg-background/60 text-foreground/60 hover:text-accent"}`}
      >
        <Heart className={`w-4 h-4 ${wished ? "fill-current" : ""}`} />
      </button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => addItem(product)}
        aria-label="Añadir al carrito"
        className="absolute bottom-[7rem] right-3 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 shadow-lg z-10"
      >
        <Plus className="w-5 h-5" />
      </motion.button>

      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1 line-clamp-1">{product.description}</p>
        <h3 className="font-display font-semibold text-sm text-foreground leading-tight line-clamp-2">{product.name}</h3>
        
        {/* Double price display - USD and CUP */}
        <div className="flex flex-col items-start mt-2">
          <span className="text-lg font-bold text-gradient-gold">${priceUSD.toFixed(2)} USD</span>
          <span className="text-sm text-muted-foreground">{formatCUP(priceCUP)}</span>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={() => addItem(product)}
            className="text-xs font-medium text-primary hover:text-accent transition-colors"
          >
            + Añadir
          </button>
        </div>
      </div>
    </motion.div>
  );
}