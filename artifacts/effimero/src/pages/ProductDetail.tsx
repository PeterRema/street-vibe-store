import { useParams } from "wouter";
import { useState } from "react";
import { useGetProduct } from "@workspace/api-client-react";
import { InquiryModal } from "@/components/shared/InquiryModal";
import { ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: product, isLoading, error } = useGetProduct(id);
  const [modalOpen, setModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 px-6 flex justify-center items-center">
        <div className="animate-pulse flex space-x-4 w-full max-w-6xl">
          <div className="flex-1 bg-secondary aspect-[3/4]" />
          <div className="flex-1 space-y-6 py-12">
            <div className="h-10 bg-secondary w-1/2" />
            <div className="h-4 bg-secondary w-1/4" />
            <div className="h-32 bg-secondary w-full" />
            <div className="h-12 bg-secondary w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <h2 className="text-4xl font-serif mb-4">Prodotto non trovato</h2>
        <a href="/shop" className="text-sm uppercase tracking-widest text-primary hover:underline border-b border-primary pb-1">Torna alla Collezione</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 md:pt-32 pb-24">
      <div className="container mx-auto px-6">
        <a href="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-12 transition-colors">
          <ArrowLeft size={16} strokeWidth={1.5} /> Torna indietro
        </a>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24">
          {/* Image Section */}
          <div className="md:col-span-7">
            <div className="sticky top-32">
              <div className="aspect-[3/4] w-full bg-secondary">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 bg-secondary">
                    {/* fashion editorial placeholder concrete stairs */}
                    <img 
                      src="https://pixabay.com/get/gbfab53e03ae90b7d14da694a5371460140ccc58e1e661955a7b1aab6c7b31e33d4e97c5911a1f190db5690537bcac0d6bc2e8acec5db71fd323de535de4dcec9_1280.jpg"
                      alt="Placeholder"
                      className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="md:col-span-5 pt-12 md:pt-24 pb-32">
            <div className="sticky top-40 space-y-10">
              <div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4 block">
                  {product.category === 'tshirts' ? 'T-Shirt' : 'Pantalone'}
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-none tracking-tight text-foreground mb-6">
                  {product.name}
                </h1>
                <p className="text-foreground/80 font-light leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>

              <div className="py-8 border-y border-border">
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-foreground">Taglie Disponibili</h3>
                <div className="flex flex-wrap gap-4">
                  {product.sizes.map((size) => (
                    <span 
                      key={size}
                      className="w-12 h-12 flex items-center justify-center border border-border text-sm font-medium text-muted-foreground"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-full bg-foreground text-background py-5 text-sm tracking-[0.2em] uppercase font-semibold hover:bg-primary transition-colors"
                >
                  Richiedi Info
                </button>
                <p className="text-xs text-center text-muted-foreground font-light px-4">
                  I nostri capi sono prodotti in quantità limitata. Richiedi informazioni per conoscere disponibilità e prezzo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InquiryModal 
        product={product} 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </div>
  );
}
