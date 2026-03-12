import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useListProducts, useCreateProduct, useDeleteProduct } from "@workspace/api-client-react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const productSchema = z.object({
  name: z.string().min(2, "Name required"),
  description: z.string().min(10, "Description required"),
  category: z.enum(["tshirts", "pants"]),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  sizesString: z.string().min(1, "Sizes required (e.g. S, M, L)"),
  featured: z.boolean().default(false),
});

type ProductForm = z.infer<typeof productSchema>;

export default function Admin() {
  const queryClient = useQueryClient();
  const { data: products, isLoading: isLoadingProducts } = useListProducts();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  
  const [activeTab, setActiveTab] = useState<"list" | "create">("list");

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      category: "tshirts",
      featured: false,
      sizesString: "S, M, L, XL"
    }
  });

  const onSubmit = async (data: ProductForm) => {
    try {
      const sizes = data.sizesString.split(",").map(s => s.trim()).filter(Boolean);
      await createProduct({
        data: {
          name: data.name,
          description: data.description,
          category: data.category,
          imageUrl: data.imageUrl || null,
          sizes,
          featured: data.featured
        }
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      reset();
      setActiveTab("list");
    } catch (error) {
      console.error("Failed to create product:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteProduct({ id });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    }
  };

  return (
    <div className="min-h-screen bg-secondary pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-serif mb-2">Pannello Admin</h1>
            <p className="text-muted-foreground font-light">Gestione Catalogo Prodotti</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("list")}
              className={`text-xs font-semibold tracking-widest uppercase pb-1 ${activeTab === 'list' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setActiveTab("create")}
              className={`text-xs font-semibold tracking-widest uppercase pb-1 flex items-center gap-1 ${activeTab === 'create' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
              <Plus size={14} /> Nuovo
            </button>
          </div>
        </div>

        <div className="bg-background border border-border p-8 shadow-sm">
          {activeTab === "create" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Nome Prodotto</label>
                  <input
                    {...register("name")}
                    className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground"
                  />
                  {errors.name && <p className="text-primary text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Descrizione</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground resize-none"
                  />
                  {errors.description && <p className="text-primary text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Categoria</label>
                    <select
                      {...register("category")}
                      className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground"
                    >
                      <option value="tshirts">T-Shirts</option>
                      <option value="pants">Pantaloni</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Taglie (separate da virgola)</label>
                    <input
                      {...register("sizesString")}
                      className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground"
                      placeholder="S, M, L, XL"
                    />
                    {errors.sizesString && <p className="text-primary text-xs mt-1">{errors.sizesString.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest font-semibold mb-2 text-muted-foreground">URL Immagine</label>
                  <input
                    {...register("imageUrl")}
                    className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground"
                    placeholder="https://..."
                  />
                  {errors.imageUrl && <p className="text-primary text-xs mt-1">{errors.imageUrl.message}</p>}
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-foreground">
                    Metti in Evidenza in Home Page
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-foreground text-background py-4 text-xs tracking-widest uppercase font-semibold hover:bg-primary transition-colors flex items-center justify-center"
              >
                {isCreating ? <Loader2 className="animate-spin" size={16} /> : "Carica Prodotto"}
              </button>
            </form>
          ) : (
            <div>
              {isLoadingProducts ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
              ) : products?.length === 0 ? (
                <p className="text-center text-muted-foreground py-20">Nessun prodotto trovato.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4">ID</th>
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4">Immagine</th>
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4">Nome</th>
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4">Categoria</th>
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4">Evidenza</th>
                        <th className="font-semibold uppercase tracking-widest text-[10px] pb-4 px-4 text-right">Azioni</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map(p => (
                        <tr key={p.id} className="border-b border-secondary hover:bg-secondary/50 transition-colors">
                          <td className="py-4 px-4 font-mono text-muted-foreground">{p.id}</td>
                          <td className="py-4 px-4">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt="" className="w-12 h-16 object-cover bg-secondary" />
                            ) : (
                              <div className="w-12 h-16 bg-secondary flex items-center justify-center text-[10px] text-muted-foreground">No Img</div>
                            )}
                          </td>
                          <td className="py-4 px-4 font-serif text-base">{p.name}</td>
                          <td className="py-4 px-4 uppercase tracking-widest text-[10px]">{p.category}</td>
                          <td className="py-4 px-4">{p.featured ? "SÌ" : "NO"}</td>
                          <td className="py-4 px-4 text-right">
                            <button 
                              onClick={() => handleDelete(p.id)}
                              disabled={isDeleting}
                              className="text-muted-foreground hover:text-primary transition-colors p-2"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
