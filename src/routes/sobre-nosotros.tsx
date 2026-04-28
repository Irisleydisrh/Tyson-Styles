import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Sparkles, Users, MessageCircle } from "lucide-react";
import logoImg from "@/assets/logo.jpeg";

export const Route = createFileRoute("/sobre-nosotros")({
  head: () => ({
    meta: [
      { title: "Sobre Nosotros — tyson.styles" },
      { name: "description", content: "Conoce la historia de tyson.styles, tu boutique de confianza para el cuidado del cabello rizado." },
      { property: "og:title", content: "Sobre Nosotros — tyson.styles" },
      { property: "og:description", content: "Asesorías y productos especializados para cabello rizado y afro." },
    ],
  }),
  component: SobreNosotrosPage,
});

const values = [
  { icon: Heart, title: "Pasión por los rizos", description: "Amamos el cabello natural y trabajamos para que cada rizo brille con todo su esplendor." },
  { icon: Sparkles, title: "Productos de calidad", description: "Seleccionamos cuidadosamente cada producto para garantizar los mejores resultados." },
  { icon: Users, title: "Comunidad", description: "Creamos un espacio seguro donde celebrar la belleza del cabello rizado y afro." },
  { icon: MessageCircle, title: "Asesoría personalizada", description: "Te acompañamos en cada paso de tu viaje capilar con recomendaciones a tu medida." },
];

function SobreNosotrosPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <img src={logoImg} alt="tyson.styles" className="w-24 h-24 mx-auto rounded-full object-cover shadow-xl glow-gold mb-6" />
          <h1 className="font-display text-4xl sm:text-5xl font-bold">
            Sobre <span className="text-gradient-gold">Nosotros</span>
          </h1>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-3xl p-8 sm:p-12 mb-16"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-6 text-gradient-teal">Nuestra Historia</h2>
          <div className="space-y-4 text-foreground/80 leading-relaxed">
            <p>
              <strong className="text-foreground">tyson.styles</strong> nació de la pasión por el cabello natural y la convicción de que cada persona merece productos que realmente funcionen para su tipo de rizo.
            </p>
            <p>
              Después de años buscando productos adecuados y no encontrar lo que necesitábamos, decidimos crear un espacio especializado donde cada clienta encuentra exactamente lo que su cabello necesita.
            </p>
            <p>
              Hoy somos más que una tienda: somos una comunidad de personas que celebran sus rizos, comparten consejos y se apoyan mutuamente en su viaje capilar. ✨
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10">Nuestros <span className="text-gradient-gold">Valores</span></h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:glow-teal transition-all duration-500 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <v.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20 rounded-3xl p-8 sm:p-12 text-center"
        >
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-4">¿Necesitas una asesoría personalizada?</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Cuéntanos sobre tu cabello y te ayudamos a encontrar la rutina perfecta para tus rizos.
          </p>
          <a
            href="https://wa.me/5358203729?text=Hola%20tyson.styles!%20Me%20gustaría%20una%20asesoría%20personalizada%20para%20mis%20rizos%20✨"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-5 h-5" /> Pedir Asesoría por WhatsApp
          </a>
        </motion.div>
      </div>
    </div>
  );
}
