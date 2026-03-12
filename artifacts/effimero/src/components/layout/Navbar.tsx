import { Link, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@assets/ChatGPT_Image_12_mar_2026,_14_57_40_1773323885235.png";

export function Navbar() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "COLLEZIONE" },
    { href: "/about", label: "MANIFESTO" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? "bg-background/95 backdrop-blur-md py-4 shadow-sm" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex-1">
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.2em] font-medium uppercase transition-colors hover:text-primary ${
                    location.startsWith(link.href) ? "text-primary" : "text-foreground/80"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <button 
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <img 
              src={logoImg} 
              alt="effimero." 
              className="h-8 md:h-12 object-contain"
            />
          </Link>

          <div className="flex-1 flex justify-end">
             {/* Future-proofing for search/lang selection, currently keeping it brutally minimal */}
             <div className="hidden md:block text-xs font-serif italic text-muted-foreground">
               milano / tokyo
             </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center"
          >
            <button 
              className="absolute top-6 left-6 text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X size={32} strokeWidth={1} />
            </button>
            <nav className="flex flex-col items-center gap-12">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-serif tracking-widest uppercase hover:text-primary transition-colors"
              >
                Home
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-4xl font-serif tracking-widest uppercase hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
