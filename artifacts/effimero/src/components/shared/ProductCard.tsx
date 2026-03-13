import { Link } from "wouter";
import type { Product } from "@workspace/api-client-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-6">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center p-8">
            <img 
              src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=800"
              alt="Minimalist placeholder"
              className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
        
        {/* Overlay Button */}
        <div className="absolute bottom-0 left-0 w-full p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
          <div className="w-full bg-background/95 backdrop-blur-sm text-foreground py-4 text-center text-xs tracking-widest uppercase font-medium shadow-xl">
            Richiedi Info
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center text-center space-y-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          {product.category === 'tshirts' ? 'T-Shirt' : 'Pantalone'}
        </span>
        <h3 className="text-xl font-serif leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
      </div>
    </Link>
  );
}
