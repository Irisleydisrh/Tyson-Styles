import logoImg from "@/assets/logo.jpeg";
import instagramImg from "@/assets/Instagram.png";
import whatsappImg from "@/assets/Whatsapp.png";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="tyson.styles" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold text-gradient-gold">tyson.styles</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Te ayudamos a tener una melena sana y con carácter. ✨ Asesorías y productos especializados para cabello rizado.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contáctenos</h4>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>📍 Vista Hermosa entre Lombillo y Piñera, Cerro, Habana, Cuba</p>
              <p>🕐 Lun-Sáb: 10:00 - 20:00</p>
              <div className="flex gap-4 mt-3">
                <a 
                  href="https://www.instagram.com/tyson.styles" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <img src={instagramImg} alt="Instagram" className="w-8 h-8" />
                </a>
                <a 
                  href="https://wa.me/5358203729" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-80"
                >
                  <img src={whatsappImg} alt="WhatsApp" className="w-8 h-8" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} tyson.styles. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}