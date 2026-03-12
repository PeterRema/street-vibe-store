import { Link } from "wouter";
import logoImg from "@assets/ChatGPT_Image_12_mar_2026,_14_57_40_1773323885235.png";

export function Footer() {
  return (
    <footer className="bg-foreground text-background pt-24 pb-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-6 mb-24">
          <div className="col-span-1 md:col-span-5">
            <img 
              src={logoImg} 
              alt="effimero." 
              className="h-10 object-contain invert brightness-0 mb-6"
            />
            <p className="text-muted text-sm max-w-sm leading-relaxed font-light">
              L'arte di catturare il momento. Abbigliamento streetwear che fonde l'estetica minimalista giapponese e coreana con l'audacia metropolitana contemporanea.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-3 md:col-start-7">
            <h4 className="text-xs tracking-[0.2em] font-medium uppercase mb-6 text-muted-foreground">Esplora</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Tutta la Collezione</Link></li>
              <li><Link href="/shop?category=tshirts" className="hover:text-primary transition-colors">T-Shirts</Link></li>
              <li><Link href="/shop?category=pants" className="hover:text-primary transition-colors">Pantaloni</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Manifesto</Link></li>
            </ul>
          </div>

          <div className="col-span-1 md:col-span-3">
            <h4 className="text-xs tracking-[0.2em] font-medium uppercase mb-6 text-muted-foreground">Azienda</h4>
            <ul className="space-y-4 font-light text-sm">
              <li><Link href="/admin" className="hover:text-primary transition-colors text-muted-foreground/50">Admin Area</Link></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contatti</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Termini e Condizioni</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground tracking-wider uppercase">
            © {new Date().getFullYear()} effimero. Tutti i diritti riservati.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground uppercase tracking-widest">
            <a href="#" className="hover:text-background transition-colors">Instagram</a>
            <a href="#" className="hover:text-background transition-colors">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
