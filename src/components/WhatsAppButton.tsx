import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "5358203729";

export function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20tyson.styles!%20Me%20gustaría%20hacer%20una%20consulta%20✨`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0.4)", "0 0 0 15px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
