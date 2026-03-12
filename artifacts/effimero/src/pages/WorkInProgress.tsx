import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface Props {
  countdown?: string | null;
  message?: string | null;
}

export default function WorkInProgress({ countdown, message }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(
    countdown ? calculateTimeLeft(countdown) : null
  );

  useEffect(() => {
    if (!countdown) return;
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(countdown));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Background subtle texture */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/40 via-background to-background pointer-events-none" />

      {/* Red accent line top */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute top-0 left-0 right-0 h-[2px] bg-primary origin-left"
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <img
            src="/logo.png"
            alt="effimero."
            className="h-8 md:h-10 mx-auto object-contain"
          />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="text-5xl md:text-8xl font-serif tracking-tight leading-none mb-6"
        >
          QUALCOSA DI
          <br />
          <span className="italic text-primary">NUOVO</span>
          <br />
          STA ARRIVANDO.
        </motion.h1>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-muted-foreground font-light text-sm md:text-base tracking-wide leading-relaxed mb-16 max-w-md mx-auto"
        >
          {message || "Stiamo preparando qualcosa di straordinario. Presto disponibile."}
        </motion.p>

        {/* Countdown */}
        {timeLeft && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mb-16"
          >
            <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-lg mx-auto">
              {[
                { label: "GIORNI", value: timeLeft.days },
                { label: "ORE", value: timeLeft.hours },
                { label: "MIN", value: timeLeft.minutes },
                { label: "SEC", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="w-full aspect-square border border-border flex items-center justify-center mb-2 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500" />
                    <span className="text-3xl md:text-5xl font-serif tabular-nums leading-none">
                      {pad(value)}
                    </span>
                  </div>
                  <span className="text-[9px] md:text-[10px] tracking-[0.2em] text-muted-foreground font-semibold uppercase">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-16 h-[1px] bg-border mx-auto mb-10"
        />

        {/* Admin link — subtle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
        >
          <a
            href="/admin"
            className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors"
          >
            Admin
          </a>
        </motion.div>
      </motion.div>

      {/* Bottom red accent line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary/30 origin-right"
      />
    </div>
  );
}
