import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Lock } from "lucide-react";

interface Props {
  onLogin: (token: string) => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Password non corretta.");
        setLoading(false);
        return;
      }

      const { token } = await res.json();
      sessionStorage.setItem("effimero_admin_token", token);
      onLogin(token);
    } catch {
      setError("Errore di connessione. Riprova.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-primary origin-left"
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-14">
          <img src="/logo.png" alt="effimero." className="h-8 mx-auto object-contain mb-8" />
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Lock size={14} strokeWidth={1.5} />
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">Area Riservata</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] uppercase tracking-widest font-semibold mb-3 text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              placeholder="••••••••"
              autoFocus
              className="w-full border-b border-border py-3 bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors text-lg tracking-widest"
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-primary text-xs mt-3 tracking-wide"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Accedi"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-[10px] tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Torna al sito
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary/30 origin-right"
      />
    </div>
  );
}
