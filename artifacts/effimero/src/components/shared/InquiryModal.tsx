import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCreateInquiry } from "@workspace/api-client-react";
import type { ListProductsResponseItem as Product } from "@workspace/api-client-react";

const inquirySchema = z.object({
  name: z.string().min(2, "Il nome è richiesto"),
  email: z.string().email("Inserisci un'email valida"),
  size: z.string().min(1, "Seleziona una taglia"),
  message: z.string().optional(),
});

type InquiryForm = z.infer<typeof inquirySchema>;

interface InquiryModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export function InquiryModal({ product, isOpen, onClose }: InquiryModalProps) {
  const { mutateAsync: createInquiry, isPending } = useCreateInquiry();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InquiryForm>({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmit = async (data: InquiryForm) => {
    try {
      await createInquiry({
        data: {
          productId: product.id,
          name: data.name,
          email: data.email,
          size: data.size,
          message: data.message,
        },
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        reset();
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-lg bg-background p-8 md:p-12 shadow-2xl border border-border"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} strokeWidth={1} />
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center text-primary">
                  <Check size={32} strokeWidth={1} />
                </div>
                <h3 className="text-2xl font-serif">Richiesta Inviata</h3>
                <p className="text-muted-foreground font-light">
                  Il nostro team ti contatterà a breve con i dettagli per {product.name}.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <span className="text-xs tracking-widest text-primary uppercase font-semibold mb-2 block">
                    Richiedi Info
                  </span>
                  <h2 className="text-3xl font-serif mb-2">{product.name}</h2>
                  <p className="text-muted-foreground font-light text-sm">
                    Compila il modulo per ricevere dettagli, disponibilità e completare l'acquisto.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <input
                        {...register("name")}
                        placeholder="Nome Completo"
                        className="w-full border-b border-border py-3 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors rounded-none"
                      />
                      {errors.name && <span className="text-primary text-xs mt-1 block">{errors.name.message}</span>}
                    </div>

                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className="w-full border-b border-border py-3 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors rounded-none"
                      />
                      {errors.email && <span className="text-primary text-xs mt-1 block">{errors.email.message}</span>}
                    </div>

                    <div>
                      <select
                        {...register("size")}
                        className="w-full border-b border-border py-3 bg-transparent text-foreground focus:outline-none focus:border-foreground transition-colors rounded-none appearance-none"
                        defaultValue=""
                      >
                        <option value="" disabled className="text-muted-foreground">Seleziona Taglia</option>
                        {product.sizes.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      {errors.size && <span className="text-primary text-xs mt-1 block">{errors.size.message}</span>}
                    </div>

                    <div>
                      <textarea
                        {...register("message")}
                        placeholder="Messaggio (Opzionale)"
                        rows={3}
                        className="w-full border-b border-border py-3 bg-transparent placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors resize-none rounded-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-foreground text-background py-4 text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary transition-colors flex items-center justify-center"
                  >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : "Invia Richiesta"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
