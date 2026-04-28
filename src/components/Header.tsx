import { Link } from "@tanstack/react-router";
import { ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/logo.jpeg";

export function Header() {
  const { totalItems, setIsOpen } = useCart();
  const { count: wishCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoImg} alt="tyson.styles" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
          <span className="font-display text-lg sm:text-xl font-bold text-gradient-gold">tyson.styles</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Inicio</Link>
          <Link to="/productos" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Productos</Link>
          <Link to="/sobre-nosotros" className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors" activeProps={{ className: "text-primary" }}>Sobre Nosotros</Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          {wishCount > 0 && (
            <span className="hidden sm:inline-flex relative p-2 rounded-full hover:bg-secondary transition-colors text-accent">
              <Heart className="w-5 h-5 fill-current" />
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{wishCount}</span>
            </span>
          )}

          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 rounded-full hover:bg-secondary transition-colors"
            aria-label="Carrito"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menú">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl"
          >
            <nav className="flex flex-col p-4 gap-4">
              <Link to="/" onClick={() => setMenuOpen(false)} className="text-base font-medium py-2 text-foreground/80 hover:text-primary transition-colors">Inicio</Link>
              <Link to="/productos" onClick={() => setMenuOpen(false)} className="text-base font-medium py-2 text-foreground/80 hover:text-primary transition-colors">Productos</Link>
              <Link to="/sobre-nosotros" onClick={() => setMenuOpen(false)} className="text-base font-medium py-2 text-foreground/80 hover:text-primary transition-colors">Sobre Nosotros</Link>
              {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-base font-medium py-2 text-primary">Panel Admin</Link>}
              {!user && <Link to="/auth" onClick={() => setMenuOpen(false)} className="text-base font-medium py-2 text-foreground/60">Acceso</Link>}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
