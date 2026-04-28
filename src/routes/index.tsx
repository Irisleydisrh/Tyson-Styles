import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { CurlQuiz } from "@/components/CurlQuiz";
import { fetchCategories, fetchProducts, type Category, type Product } from "@/lib/products-api";
import logoImg from "@/assets/logo.jpeg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "tyson.styles — Boutique Capilar para Rizadas" },
      { name: "description", content: "Te ayudamos a tener una melena sana y con carácter. ✨ Asesorías y productos especializados para cabello rizado." },
      { property: "og:title", content: "tyson.styles — Boutique Capilar para Rizadas" },
      { property: "og:description", content: "Productos capilares especializados para afrorizadas. Domicilio y recogida en local." },
    ],
  }),
  component: HomePage,
});

const testimonials = [
  { name: "María L.", text: "Mis rizos nunca habían estado tan definidos. ¡Los productos son increíbles!", rating: 5 },
  { name: "Daniela R.", text: "La asesoría me cambió la vida. Ahora amo mi cabello natural.", rating: 5 },
  { name: "Carmen S.", text: "Envío rápido y productos de altísima calidad. 100% recomendado.", rating: 5 },
  { name: "Lucía M.", text: "Por fin encontré una tienda que entiende el cabello rizado. ¡Gracias!", rating: 5 },
];

function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const display = featured.length > 0 ? featured : products.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero with parallax */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: heroY }} className="absolute inset-0 bg-gradient-to-b from-background via-background to-secondary/20" />
        <motion.div
          animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-primary/10 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-accent/10 blur-3xl"
        />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <img src={logoImg} alt="tyson.styles" className="w-28 h-28 sm:w-36 sm:h-36 mx-auto rounded-full object-cover shadow-2xl glow-teal mb-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
          >
            Te ayudamos a tener una{" "}
            <span className="text-gradient-teal">melena sana</span>{" "}
            y con{" "}
            <span className="text-gradient-gold">carácter</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto"
          >
            ✨ Asesorías y productos especializados para cabello rizado y afro. Domicilio o recogida en local.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/productos"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:glow-teal transition-all duration-300 hover:scale-105"
            >
              Ver Productos <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/sobre-nosotros"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-border text-foreground/80 font-medium text-base hover:bg-secondary/50 transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-accent" /> Conócenos
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Nuestras <span className="text-gradient-teal">Categorías</span></h2>
            <p className="mt-3 text-muted-foreground">Todo lo que tu cabello necesita</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  to="/productos"
                  search={{ categoria: cat.slug }}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:glow-teal transition-all duration-500 text-center h-full"
                >
                  <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{cat.icon}</span>
                  <span className="font-display text-sm font-semibold">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Curl Quiz */}
      <CurlQuiz />

      {/* Featured Products */}
      <section className="py-20 px-4 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Productos <span className="text-gradient-gold">Destacados</span></h2>
              <p className="mt-2 text-muted-foreground">Los favoritos de nuestras clientas</p>
            </div>
            <Link to="/productos" className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors font-medium">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {display.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/productos" className="inline-flex items-center gap-1 text-sm text-primary font-medium">
              Ver todos los productos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Lo que dicen nuestras <span className="text-gradient-teal">clientas</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:glow-gold transition-all duration-500"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">"{t.text}"</p>
                <p className="mt-3 text-xs font-semibold text-accent">{t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
