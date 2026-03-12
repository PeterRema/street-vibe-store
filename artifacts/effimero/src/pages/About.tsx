export default function About() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-5xl">
        <header className="text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-serif mb-8 tracking-tight">Il Manifesto</h1>
          <div className="h-px w-24 bg-foreground mx-auto"></div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
          <div>
            <h2 className="text-3xl font-serif mb-6">L'Estetica dell'Effimero</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-6 text-lg">
              In un mondo saturo di stimoli visivi e produzione di massa, effimero. si pone come una pausa. Un respiro. La nostra filosofia affonda le radici nella purezza del design asiatico, dove l'assenza parla più forte della presenza.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed text-lg">
              Non produciamo collezioni stagionali dettate dai trend, ma oggetti atemporali. Il nero come fondamento, il bianco come spazio vitale, il rosso come battito cardiaco.
            </p>
          </div>
          <div className="aspect-[4/3] w-full relative">
            <img 
              src={`${import.meta.env.BASE_URL}images/about-editorial.png`}
              alt="Texture detail" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center flex-col-reverse">
          <div className="aspect-[3/4] w-full md:w-4/5 ml-auto relative order-2 md:order-1">
            {/* tokyo street style black and white minimal abstract */}
            <img 
              src="https://images.unsplash.com/photo-1492693429561-1c283eb1b2e8?auto=format&fit=crop&q=80&w=800"
              alt="Urban context" 
              className="w-full h-full object-cover grayscale"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-serif mb-6">Contro la Fast Fashion</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-6 text-lg">
              Perché non mostriamo i prezzi? Perché vogliamo ristabilire una connessione umana. Ogni capo richiede ricerca, tempo, materiali selezionati. 
            </p>
            <p className="text-muted-foreground font-light leading-relaxed text-lg">
              Invitandoti a "Richiedere Info", ti invitiamo a fermarti. A valutare il pezzo per le sue linee e il suo carattere, prima di quantificarlo. Vogliamo parlare con chi sceglie di indossarci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
