import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { toast } from "sonner";
import { fetchExchangeRate, getExchangeRate, subscribeToRateChanges } from "@/lib/exchange-rate";

const WHATSAPP_NUMBER = "5358203729";

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, clearCart, deliveryMethod, setDeliveryMethod } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [rate, setRate] = useState(getExchangeRate());
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Subscribe to exchange rate changes
  useEffect(() => {
    fetchExchangeRate().catch(console.error);
    const unsub = subscribeToRateChanges(setRate);
    return unsub;
  }, []);

  // Calculate total in CUP
  const totalCUP = Math.round(totalPrice * rate);

  // Validate name - only letters and spaces
  const validateName = (value: string) => {
    const clean = value.trim();
    if (!clean) return "El nombre es requerido";
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(clean)) return "Solo se permiten letras";
    return null;
  };

  // Validate Cuban phone - must be 53XXXXXXXX or +53XXXXXXXX or 8 digits
  const validatePhone = (value: string) => {
    const clean = value.replace(/\s/g, "");
    if (!clean) return "El teléfono es requerido";
    // Remove + if present
    const num = clean.startsWith("+") ? clean.slice(1) : clean;
    // Must be 53 + 8 digits, or just 8 digits
    if (!/^(53\d{8}|\d{8})$/.test(num)) return "Debe ser formato cubano (53XXXXXXXX)";
    return null;
  };

  const handleNameChange = (value: string) => {
    // Only allow letters and spaces
    const filtered = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setName(filtered);
    if (errors.name) setErrors({ ...errors, name: validateName(filtered) });
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers, + and leading 53
    const filtered = value.replace(/[^\d\+]/g, "");
    // Limit to +53 or 53 prefix
    if (filtered.startsWith("+53")) {
      setPhone(filtered.slice(0, 13)); // +53 + 8 digits = 13
    } else if (filtered.startsWith("53")) {
      setPhone(filtered.slice(0, 11)); // 53 + 8 digits = 11
    } else if (filtered.match(/^\d+$/)) {
      setPhone(filtered.slice(0, 8)); // Just 8 digits
    } else {
      setPhone(filtered);
    }
    if (errors.phone) setErrors({ ...errors, phone: validatePhone(filtered) });
  };

  const sendWhatsApp = async () => {
    // Validate before submitting
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    
    if (nameError || phoneError) {
      setErrors({ name: nameError, phone: phoneError });
      toast.error("Verifica los datos");
      return;
    }

    if (deliveryMethod === "domicilio" && !address.trim()) {
      toast.error("Indica la dirección de envío");
      return;
    }

setSubmitting(true);
    let orderCode = "";
    try {
      console.log("Creating order with data:", {
        customerName: name.trim(),
        phone: phone.trim(),
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: Number(i.product.priceUSD),
          quantity: i.quantity,
        })),
        total: Number(totalPrice),
        deliveryMethod: deliveryMethod === "domicilio" ? "DOMICILIO" : "RECOGER",
        address: deliveryMethod === "domicilio" ? address.trim() : null,
        notes: notes.trim() || null,
      });
      
      // Save order in DB and get the generated code
      const orderRes = await api.post<{ codigo: string; id: string }>('/api/orders', {
        customerName: name.trim(),
        phone: phone.trim(),
        items: items.map((i) => ({
          id: String(i.product.id),
          name: String(i.product.name),
          price: Number(i.product.priceUSD) || 0,
          quantity: Number(i.quantity) || 1,
        })),
        total: Number(totalPrice) || 0,
        deliveryMethod: deliveryMethod === "domicilio" ? "DOMICILIO" : "RECOGER",
        address: deliveryMethod === "domicilio" ? address.trim() : undefined,
        notes: notes.trim() || undefined,
      });
      
      console.log("Order created:", orderRes);
      orderCode = orderRes?.codigo || "";
    } catch (e: any) {
      console.error("Order error:", e);
      const errorMsg = e?.message || e?.response?.data?.message || "Error desconocido";
      toast.error("Error: " + errorMsg);
    }

    const lines = (
      items.map(
        (i) => `• ${i.product.name} x${i.quantity} — $${((i.product.priceUSD || 0) * i.quantity).toFixed(2)} USD (${Math.round((i.product.priceUSD || 0) * i.quantity * rate).toLocaleString('es-CU')} CUP)`
      )
    );
    // Format phone for WhatsApp - ensure it has the +53 prefix
    let formattedPhone = phone.replace(/\D/g, ""); // Remove all non-digits
    if (!formattedPhone.startsWith("53")) {
      formattedPhone = "53" + formattedPhone;
    }
    const entrega = deliveryMethod === "domicilio"
      ? `📦 Envío a domicilio\n📍 ${address.trim()}`
      : "🏪 Recoger en local (Calle 46 #3012 e/ 30 y 31, Cerro)";
    const notesLine = notes.trim() ? `\n📝 *Notas:* ${notes.trim()}` : "";
    const codeLine = orderCode ? `\n🏷️ *Código:* ${orderCode}` : "";
    
    // Mensaje formateado profesional
    const msg = 
`✨ ¡Hola Irisleydis! Tu pedido está confirmado 🎉

Gracias por confiar en tyson.styles 🧴💕
Estamos muy felices de preparar tu pedido.

📦 *Resumen de tu compra:*
${lines.join("\n")}

💰 *Total:* $${totalPrice.toFixed(2)} USD (${totalCUP.toLocaleString("es-CU")} CUP)
${deliveryMethod === "domicilio" ? "🛵 El domicilio se coordinará contigo en breve." : "🏪 Puedes recoger en nuestro local cuando confirmes."}

${codeLine}
📎 *Rastrea tu pedido:* tyson.styles/rastrear

Pronto nos ponemos en contacto contigo 🤍
— El equipo de *tyson.styles*`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    toast.success("¡Pedido registrado! Continúa en WhatsApp");
    clearCart();
    setIsOpen(false);
    setSubmitting(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h2 className="font-display text-lg font-bold">Tu Carrito</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-secondary transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-3">
                  <ShoppingBag className="w-12 h-12 opacity-30" />
                  <p className="text-sm">Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-3 bg-secondary/50 rounded-xl p-3"
                    >
                      <img src={item.product.imageUrl ?? "/placeholder.svg"} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product.name}</p>
                        <p className="text-sm text-accent font-semibold">${Number(item.product.priceUSD || 0).toFixed(2)} <span className="text-muted-foreground text-xs">({Math.round((item.product.priceUSD || 0) * rate).toLocaleString('es-CU')} CUP)</span></p>
                        <div className="flex items-center gap-2 mt-1">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 rounded-full bg-background flex items-center justify-center hover:bg-primary/20 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeItem(item.product.id)} className="ml-auto p-1 text-destructive/60 hover:text-destructive transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  <div className="space-y-3 pt-2">
                    <div>
                      <Input 
                        placeholder="Tu nombre *" 
                        value={name} 
                        onChange={(e) => handleNameChange(e.target.value)} 
                        className="bg-background/50"
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <Input 
                        placeholder="Teléfono (53XXXXXXXX) *" 
                        value={phone} 
                        onChange={(e) => handlePhoneChange(e.target.value)} 
                        className="bg-background/50"
                      />
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>
                    {deliveryMethod === "domicilio" && (
                      <Input placeholder="Dirección de envío *" value={address} onChange={(e) => setAddress(e.target.value)} className="bg-background/50" />
                    )}
                    <Textarea placeholder="Notas (opcional)" value={notes} onChange={(e) => setNotes(e.target.value)} className="bg-background/50 min-h-[60px]" />
                  </div>
                </>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setDeliveryMethod("recoger")}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${deliveryMethod === "recoger" ? "bg-primary text-primary-foreground glow-teal" : "bg-secondary text-secondary-foreground"}`}
                  >
                    🏪 Recoger
                  </button>
                  <button
                    onClick={() => setDeliveryMethod("domicilio")}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${deliveryMethod === "domicilio" ? "bg-primary text-primary-foreground glow-teal" : "bg-secondary text-secondary-foreground"}`}
                  >
                    📦 Domicilio
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-display font-bold text-gradient-gold">${totalPrice.toFixed(2)} USD</span>
                    <span className="text-sm text-muted-foreground ml-2">({totalCUP.toLocaleString('es-CU')} CUP)</span>
                  </div>
                </div>

                <Button onClick={sendWhatsApp} disabled={submitting} className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-semibold text-base gap-2">
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <MessageCircle className="w-5 h-5" />}
                  {submitting ? "Procesando..." : "Pedir por WhatsApp"}
                </Button>

                <button onClick={clearCart} className="w-full text-xs text-muted-foreground hover:text-destructive transition-colors py-1">
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}