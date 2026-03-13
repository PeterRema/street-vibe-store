import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useListProducts, useCreateProduct, useDeleteProduct, useUpdateProduct } from "@workspace/api-client-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Pencil, X, Check, Upload, Power, Calendar, Image, LogOut } from "lucide-react";
import type { Product } from "@workspace/api-client-react";
import AdminLogin from "@/pages/AdminLogin";

interface SiteSettings {
  wipEnabled: boolean;
  wipCountdown?: string | null;
  wipMessage?: string | null;
}

async function fetchSettings(): Promise<SiteSettings> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

async function saveSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const res = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

async function uploadImage(file: File): Promise<{ url: string; filename: string }> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

const productSchema = z.object({
  name: z.string().min(2, "Nome richiesto"),
  description: z.string().min(5, "Descrizione richiesta"),
  category: z.enum(["tshirts", "pants"]),
  imageUrl: z.string().optional().or(z.literal("")),
  sizesString: z.string().min(1, "Taglie richieste"),
  featured: z.boolean().default(false),
});

type ProductForm = z.infer<typeof productSchema>;

type AdminTab = "settings" | "products" | "create" | "edit";

function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState<AdminTab>("settings");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imgPreview, setImgPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const { data: settings, isLoading: loadingSettings } = useQuery({
    queryKey: ["/api/settings"],
    queryFn: fetchSettings,
  });

  const settingsMutation = useMutation({
    mutationFn: saveSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/settings"] }),
  });

  // Products
  const { data: products, isLoading: loadingProducts } = useListProducts();
  const { mutateAsync: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutateAsync: deleteProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct, isPending: isUpdating } = useUpdateProduct();

  // WIP settings local state
  const [wipEnabled, setWipEnabled] = useState<boolean>(settings?.wipEnabled ?? false);
  const [wipCountdown, setWipCountdown] = useState<string>(settings?.wipCountdown ?? "");
  const [wipMessage, setWipMessage] = useState<string>(settings?.wipMessage ?? "");
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync from server when loaded
  const settingsLoaded = useRef(false);
  if (settings && !settingsLoaded.current) {
    settingsLoaded.current = true;
    setWipEnabled(settings.wipEnabled);
    setWipCountdown(settings.wipCountdown ?? "");
    setWipMessage(settings.wipMessage ?? "");
  }

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { category: "tshirts", featured: false, sizesString: "S, M, L, XL" }
  });

  const currentImageUrl = watch("imageUrl");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImg(true);
    try {
      const { url } = await uploadImage(file);
      setValue("imageUrl", url);
      setImgPreview(url);
    } catch {
      alert("Errore durante l'upload. Riprova.");
    } finally {
      setUploadingImg(false);
    }
  };

  const onSubmit = async (data: ProductForm) => {
    const sizes = data.sizesString.split(",").map(s => s.trim()).filter(Boolean);
    const payload = {
      name: data.name,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl || null,
      sizes,
      featured: data.featured,
    };

    if (editingProduct) {
      await updateProduct({ id: editingProduct.id, data: payload });
    } else {
      await createProduct({ data: payload });
    }
    qc.invalidateQueries({ queryKey: ["/api/products"] });
    reset();
    setImgPreview("");
    setEditingProduct(null);
    setActiveTab("products");
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    reset({
      name: p.name,
      description: p.description,
      category: p.category as "tshirts" | "pants",
      imageUrl: p.imageUrl ?? "",
      sizesString: p.sizes.join(", "),
      featured: p.featured,
    });
    setImgPreview(p.imageUrl ?? "");
    setActiveTab("edit");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Eliminare questo prodotto?")) return;
    await deleteProduct({ id });
    qc.invalidateQueries({ queryKey: ["/api/products"] });
  };

  const handleSaveSettings = async () => {
    await settingsMutation.mutateAsync({
      wipEnabled,
      wipCountdown: wipCountdown || null,
      wipMessage: wipMessage || null,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2000);
  };

  const tabs: { id: AdminTab; label: string }[] = [
    { id: "settings", label: "Impostazioni" },
    { id: "products", label: "Prodotti" },
    { id: "create", label: "+ Nuovo" },
  ];

  return (
    <div className="min-h-screen bg-secondary pt-32 pb-24 px-6">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-primary font-semibold mb-2 block">
              Area Riservata
            </span>
            <h1 className="text-4xl font-serif">Pannello Admin</h1>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-muted-foreground pb-0.5"
            >
              Torna al Sito
            </a>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              title="Esci"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Esci
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-border mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setEditingProduct(null); }}
              className={`pb-3 text-xs font-semibold tracking-widest uppercase transition-colors ${
                activeTab === tab.id || (activeTab === "edit" && tab.id === "products")
                  ? "border-b-2 border-primary text-primary -mb-[1px]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
          {activeTab === "edit" && (
            <button className="pb-3 text-xs font-semibold tracking-widest uppercase text-primary border-b-2 border-primary -mb-[1px]">
              Modifica
            </button>
          )}
        </div>

        <div className="bg-background border border-border shadow-sm">

          {/* SETTINGS TAB */}
          {activeTab === "settings" && (
            <div className="p-8 md:p-12 space-y-10">
              {loadingSettings ? (
                <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
              ) : (
                <>
                  {/* WIP Toggle */}
                  <div className="flex items-start justify-between gap-8 pb-10 border-b border-border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Power size={18} className={wipEnabled ? "text-primary" : "text-muted-foreground"} />
                        <h2 className="text-lg font-serif">Modalità Work In Progress</h2>
                      </div>
                      <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-md">
                        Quando attivo, i visitatori vedono una pagina "In arrivo" invece del sito. Solo la pagina admin è sempre accessibile.
                      </p>
                    </div>
                    <button
                      onClick={() => setWipEnabled(!wipEnabled)}
                      className={`relative flex-shrink-0 w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none ${
                        wipEnabled ? "bg-primary" : "bg-border"
                      }`}
                    >
                      <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300 ${
                        wipEnabled ? "translate-x-8" : "translate-x-1"
                      }`} />
                    </button>
                  </div>

                  {/* Countdown */}
                  <div className="pb-10 border-b border-border">
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar size={18} className="text-muted-foreground" />
                      <h2 className="text-lg font-serif">Data di Lancio</h2>
                    </div>
                    <p className="text-sm text-muted-foreground font-light mb-6">
                      Imposta una data per il countdown. Lascia vuoto per non mostrare il timer.
                    </p>
                    <input
                      type="datetime-local"
                      value={wipCountdown ? wipCountdown.slice(0, 16) : ""}
                      onChange={e => setWipCountdown(e.target.value ? new Date(e.target.value).toISOString() : "")}
                      className="border border-border px-4 py-3 bg-background text-foreground focus:outline-none focus:border-foreground text-sm w-full max-w-sm"
                    />
                    {wipCountdown && (
                      <button
                        onClick={() => setWipCountdown("")}
                        className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <X size={12} /> Rimuovi countdown
                      </button>
                    )}
                  </div>

                  {/* WIP Message */}
                  <div className="pb-10 border-b border-border">
                    <h2 className="text-lg font-serif mb-2">Messaggio Personalizzato</h2>
                    <p className="text-sm text-muted-foreground font-light mb-4">
                      Testo visibile sotto il titolo nella pagina WIP.
                    </p>
                    <textarea
                      value={wipMessage}
                      onChange={e => setWipMessage(e.target.value)}
                      rows={3}
                      placeholder="Stiamo preparando qualcosa di straordinario. Presto disponibile."
                      className="w-full border border-border px-4 py-3 bg-background text-foreground focus:outline-none focus:border-foreground text-sm resize-none"
                    />
                  </div>

                  {/* Preview indicator */}
                  {wipEnabled && (
                    <div className="flex items-center gap-3 p-4 border border-primary/30 bg-primary/5">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs tracking-wide text-primary">
                        Modalità WIP attiva — il sito mostra la pagina "In arrivo"
                      </span>
                    </div>
                  )}

                  {/* Save button */}
                  <button
                    onClick={handleSaveSettings}
                    disabled={settingsMutation.isPending}
                    className="flex items-center gap-2 bg-foreground text-background px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-primary transition-colors"
                  >
                    {settingsMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : settingsSaved ? (
                      <><Check size={14} /> Salvato</>
                    ) : (
                      "Salva Impostazioni"
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* PRODUCTS LIST TAB */}
          {activeTab === "products" && (
            <div className="p-8">
              {loadingProducts ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>
              ) : !products?.length ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground italic font-serif text-xl mb-4">Nessun prodotto.</p>
                  <button onClick={() => setActiveTab("create")} className="text-xs tracking-widest uppercase text-primary hover:underline">
                    Aggiungi il primo prodotto
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-border">
                        {["ID", "Foto", "Nome", "Cat.", "Evidenza", ""].map(h => (
                          <th key={h} className="text-[10px] uppercase tracking-widest font-semibold text-muted-foreground pb-4 px-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={p.id} className="border-b border-secondary hover:bg-secondary/50 transition-colors group">
                          <td className="py-4 px-3 font-mono text-muted-foreground text-xs">{p.id}</td>
                          <td className="py-4 px-3">
                            {p.imageUrl ? (
                              <img src={p.imageUrl} alt="" className="w-10 h-14 object-cover bg-secondary" />
                            ) : (
                              <div className="w-10 h-14 bg-secondary flex items-center justify-center">
                                <Image size={14} className="text-muted-foreground" />
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-3 font-serif text-base">{p.name}</td>
                          <td className="py-4 px-3 text-[10px] uppercase tracking-widest text-muted-foreground">
                            {p.category === "tshirts" ? "T-Shirt" : "Pantalone"}
                          </td>
                          <td className="py-4 px-3">
                            <span className={`text-[10px] uppercase tracking-widest font-semibold ${p.featured ? "text-primary" : "text-muted-foreground"}`}>
                              {p.featured ? "Sì" : "No"}
                            </span>
                          </td>
                          <td className="py-4 px-3">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                title="Modifica"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors"
                                title="Elimina"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* CREATE / EDIT FORM */}
          {(activeTab === "create" || activeTab === "edit") && (
            <div className="p-8 md:p-12">
              {activeTab === "edit" && editingProduct && (
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Stai modificando</span>
                    <h2 className="font-serif text-2xl mt-1">{editingProduct.name}</h2>
                  </div>
                  <button
                    onClick={() => { setActiveTab("products"); setEditingProduct(null); reset(); setImgPreview(""); }}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Nome Prodotto</label>
                    <input
                      {...register("name")}
                      className="w-full border-b border-border py-3 bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      placeholder="es. VOID TEE"
                    />
                    {errors.name && <p className="text-primary text-xs mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Descrizione</label>
                    <textarea
                      {...register("description")}
                      rows={3}
                      className="w-full border-b border-border py-3 bg-transparent focus:outline-none focus:border-foreground resize-none transition-colors"
                      placeholder="Descrivi il capo..."
                    />
                    {errors.description && <p className="text-primary text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Categoria</label>
                    <select
                      {...register("category")}
                      className="w-full border-b border-border py-3 bg-transparent focus:outline-none focus:border-foreground transition-colors appearance-none"
                    >
                      <option value="tshirts">T-Shirts & Maglie</option>
                      <option value="pants">Pantaloni</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest font-semibold mb-2 text-muted-foreground">Taglie (separate da virgola)</label>
                    <input
                      {...register("sizesString")}
                      className="w-full border-b border-border py-3 bg-transparent focus:outline-none focus:border-foreground transition-colors"
                      placeholder="XS, S, M, L, XL"
                    />
                    {errors.sizesString && <p className="text-primary text-xs mt-1">{errors.sizesString.message}</p>}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-[10px] uppercase tracking-widest font-semibold mb-4 text-muted-foreground">Foto Prodotto</label>
                  <div className="flex gap-4 items-start">
                    {/* Preview */}
                    <div className="flex-shrink-0 w-28 h-36 border border-border bg-secondary flex items-center justify-center overflow-hidden">
                      {(imgPreview || currentImageUrl) ? (
                        <img src={imgPreview || currentImageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Image size={24} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      {/* Upload file */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImg}
                        className="flex items-center gap-2 border border-border px-4 py-3 text-xs tracking-widest uppercase font-semibold hover:border-foreground hover:text-foreground transition-colors text-muted-foreground w-full justify-center"
                      >
                        {uploadingImg ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                        {uploadingImg ? "Caricamento..." : "Carica dal dispositivo"}
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                      {/* OR URL */}
                      <div className="flex items-center gap-2">
                        <div className="h-[1px] flex-1 bg-border" />
                        <span className="text-[10px] text-muted-foreground">oppure</span>
                        <div className="h-[1px] flex-1 bg-border" />
                      </div>
                      <input
                        {...register("imageUrl")}
                        className="w-full border-b border-border py-2 bg-transparent focus:outline-none focus:border-foreground text-sm transition-colors"
                        placeholder="Incolla URL immagine..."
                        onChange={e => { setValue("imageUrl", e.target.value); setImgPreview(e.target.value); }}
                      />
                    </div>
                  </div>
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    {...register("featured")}
                    className="w-4 h-4 accent-primary"
                  />
                  <label htmlFor="featured" className="text-sm font-medium">
                    Metti in evidenza in Home Page
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating || uploadingImg}
                    className="flex-1 bg-foreground text-background py-4 text-xs tracking-widest uppercase font-semibold hover:bg-primary transition-colors flex items-center justify-center gap-2"
                  >
                    {(isCreating || isUpdating) ? <Loader2 size={14} className="animate-spin" /> : (
                      activeTab === "edit" ? <><Check size={14} /> Salva Modifiche</> : <><Plus size={14} /> Carica Prodotto</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => { reset(); setImgPreview(""); setEditingProduct(null); setActiveTab("products"); }}
                    className="px-6 border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-colors text-xs tracking-widest uppercase"
                  >
                    Annulla
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("effimero_admin_token");
    if (!stored) { setChecking(false); return; }
    fetch("/api/admin/verify", { headers: { "x-admin-token": stored } })
      .then(r => r.json())
      .then(d => {
        if (d.valid) setToken(stored);
        else sessionStorage.removeItem("effimero_admin_token");
      })
      .catch(() => sessionStorage.removeItem("effimero_admin_token"))
      .finally(() => setChecking(false));
  }, []);

  const handleLogout = async () => {
    if (token) {
      await fetch("/api/admin/logout", { method: "POST", headers: { "x-admin-token": token } }).catch(() => {});
    }
    sessionStorage.removeItem("effimero_admin_token");
    setToken(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!token) {
    return <AdminLogin onLogin={setToken} />;
  }

  return <AdminPanel onLogout={handleLogout} />;
}
