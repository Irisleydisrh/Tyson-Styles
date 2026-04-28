import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2, Send } from "lucide-react";
import { fetchReviews, createReview, type Review } from "@/lib/reviews-api";
import { useAuth } from "./AuthContext";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews(productId)
      .then(setReviews)
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      await createReview({
        productId: productId,
        authorName: name.trim(),
        rating,
        comment: comment.trim(),
      });
      toast.success("¡Gracias! Tu reseña será publicada tras revisión.");
      setName("");
      setComment("");
      setRating(5);
    } catch {
      toast.error("Error al enviar la reseña");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <section className="mt-16 max-w-3xl mx-auto">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="font-display text-2xl font-bold">Reseñas</h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
              ))}
            </div>
            <span className="text-muted-foreground">{avgRating.toFixed(1)} · {reviews.length} reseña{reviews.length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">Aún no hay reseñas. ¡Sé la primera!</p>
      ) : (
        <div className="space-y-4 mb-10">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card border border-border rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-sm text-foreground">{r.authorName}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className={`w-3.5 h-3.5 ${j < r.rating ? "fill-accent text-accent" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
              </div>
              {r.comment && <p className="text-sm text-foreground/80 leading-relaxed">{r.comment}</p>}
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6">
        <h3 className="font-display text-lg font-semibold mb-4">Deja tu reseña</h3>
        {!user ? (
          <p className="text-sm text-muted-foreground">
            <Link to="/auth" className="text-primary hover:text-accent">Inicia sesión</Link> para dejar una reseña.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Tu nombre</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={50}
                className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Valoración</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} estrellas`}
                  >
                    <Star className={`w-6 h-6 transition-colors ${n <= rating ? "fill-accent text-accent" : "text-muted-foreground/40"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Comentario</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                maxLength={500}
                className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:glow-teal transition-all disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Enviar reseña
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
