import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: featuredProducts, isLoading } = useListProducts({ featured: true });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[90vh] md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="effimero editorial" 
            className="w-full h-full object-cover opacity-70 scale-105 origin-center"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 tracking-tight leading-none drop-shadow-lg">
            LA BELLEZZA<br/>
            <span className="text-primary italic">DELL'ISTANTE</span>
          </h1>
          <p className="text-white/80 font-light text-sm md:text-lg mb-10 max-w-lg mx-auto tracking-wide leading-relaxed">
            Minimalismo urbano. Linee essenziali e contrasti audaci per l'individuo contemporaneo.
          </p>
          <Link 
            href="/shop" 
            className="inline-block bg-white text-black px-10 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-primary hover:text-white transition-all duration-300"
          >
            Esplora La Collezione
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 px-6 bg-background">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif mb-4">Selezione <span className="italic text-muted-foreground">Editoriale</span></h2>
              <p className="text-muted-foreground font-light max-w-md">I capi più emblematici della stagione, scelti per definire il tuo stile unico.</p>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-xs font-semibold tracking-widest uppercase hover:text-primary transition-colors pb-2 border-b border-border hover:border-primary">
              Vedi Tutto <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-secondary mb-6" />
                  <div className="h-4 bg-secondary w-1/3 mx-auto mb-3" />
                  <div className="h-6 bg-secondary w-2/3 mx-auto" />
                </div>
              ))}
            </div>
          ) : featuredProducts?.length === 0 ? (
            <div className="text-center py-20 border border-border">
              <p className="text-muted-foreground italic font-serif text-xl">Nessun prodotto in evidenza al momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Manifesto Preview */}
      <section className="py-32 px-6 bg-foreground text-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}images/manifesto.png`}
                alt="Manifesto Concept" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 m-4" />
            </div>
            <div className="order-1 md:order-2 space-y-8">
              <h2 className="text-5xl md:text-7xl font-serif leading-none tracking-tight">
                PIÙ DI UN<br/><span className="italic text-primary">BRAND.</span>
              </h2>
              <div className="space-y-6 text-background/70 font-light leading-relaxed max-w-lg">
                <p>
                  effimero. nasce dall'osservazione del tempo. Creiamo capi che durano, con un'estetica che rifiuta l'eccesso per abbracciare l'essenziale.
                </p>
                <p>
                  Ispirati dall'architettura brutalista e dalla precisione del design asiatico, i nostri abiti sono tele in movimento per la città.
                </p>
              </div>
              <Link 
                href="/about" 
                className="inline-block border border-background text-background px-8 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-background hover:text-foreground transition-all duration-300 mt-4"
              >
                Leggi Il Manifesto
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
