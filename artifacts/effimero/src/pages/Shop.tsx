import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/shared/ProductCard";

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = (searchParams.get("category") as any) || "all";
  
  const [activeCategory, setActiveCategory] = useState<"all" | "tshirts" | "pants">(initialCategory);

  const { data: products, isLoading } = useListProducts(
    activeCategory === "all" ? {} : { category: activeCategory }
  );

  const categories = [
    { id: "all", label: "Tutta la Collezione" },
    { id: "tshirts", label: "T-Shirts" },
    { id: "pants", label: "Pantaloni" },
  ] as const;

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif mb-6">Collezione</h1>
          
          <div className="flex flex-wrap justify-center gap-8 mt-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`text-xs tracking-[0.2em] font-medium uppercase pb-2 transition-all duration-300 ${
                  activeCategory === cat.id 
                    ? "border-b-2 border-primary text-primary" 
                    : "border-b border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-16">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-secondary mb-6" />
                <div className="h-4 bg-secondary w-1/3 mx-auto mb-3" />
                <div className="h-6 bg-secondary w-2/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : products?.length === 0 ? (
          <div className="text-center py-32">
            <h3 className="text-2xl font-serif text-muted-foreground mb-4">Nessun capo trovato.</h3>
            <p className="font-light text-muted-foreground">La collezione è in aggiornamento. Torna presto a trovarci.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16 mt-16">
            {products?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
