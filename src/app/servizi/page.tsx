import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  TreePine, 
  Scissors, 
  Flower2, 
  TreeDeciduousIcon,
  Shrub,
  Fence,
  Shovel,
  Camera,
  Cpu,
  SprayCan
} from "lucide-react"

// Dati dei servizi aggiornati con le categorie e icone
const serviziData = [
  // Categoria: Cura del Verde
  {
    category: "Cura del Verde",
    services: [
      {
        id: 1,
        title: "Taglio Alberi",
        icon: TreePine,
        description: "Servizio professionale di abbattimento e taglio alberi con tecniche di tree climbing e attrezzature specializzate per garantire sicurezza ed efficienza.",
        longDescription: "Il nostro team di esperti arboricoltori è specializzato nell'abbattimento controllato di alberi di qualsiasi dimensione, anche in contesti difficili o spazi ristretti. Utilizziamo tecniche di tree climbing e disponiamo di attrezzature all'avanguardia per garantire la massima sicurezza ed efficienza. Ogni operazione viene pianificata nei minimi dettagli, prestando particolare attenzione alla salvaguardia delle strutture circostanti e nel rispetto delle normative vigenti."
      },
      {
        id: 2,
        title: "Sfalcio Erba",
        icon: Scissors,
        description: "Servizio di sfalcio erba per aree verdi di ogni dimensione, dal piccolo giardino privato a grandi aree pubbliche o industriali.",
        longDescription: "Offriamo un servizio completo di sfalcio erba per qualsiasi tipologia di area verde: giardini privati, parchi pubblici, aree industriali, bordi stradali e scarpate. Disponiamo di macchinari professionali che ci permettono di intervenire su qualsiasi tipo di terreno, garantendo un risultato impeccabile. La frequenza degli interventi viene pianificata in base alle specificità del terreno e alle esigenze del cliente, con particolare attenzione alla stagionalità e alle condizioni climatiche."
      },
      {
        id: 3,
        title: "Cura Prato",
        icon: Flower2,
        description: "Servizio completo di manutenzione e cura del prato, dalla semina alla concimazione, dall'irrigazione ai trattamenti specifici.",
        longDescription: "Il nostro servizio di cura del prato comprende tutte le operazioni necessarie per mantenerlo sano, rigoglioso e dal colore intenso. Ci occupiamo di semina, concimazione, aerazione, trasemina, irrigazione e trattamenti specifici contro muschio, erbacce e malattie. Sviluppiamo piani di manutenzione personalizzati che tengono conto delle caratteristiche del terreno, dell'esposizione solare, del clima locale e dell'utilizzo del prato. Il nostro obiettivo è garantire un tappeto erboso di qualità che resista nel tempo."
      },
      {
        id: 4,
        title: "Potatura Alberi",
        icon: TreeDeciduousIcon,
        description: "Servizio specializzato di potatura alberi e arbusti con tecniche rispettose della fisiologia delle piante per garantirne salute e longevità.",
        longDescription: "La potatura è un'operazione fondamentale per mantenere la salute e la bellezza degli alberi. Il nostro team di professionisti è formato per intervenire con tecniche rispettose della fisiologia delle piante, contribuendo al loro sviluppo armonico e alla loro longevità. Eseguiamo potature di formazione, di mantenimento, di contenimento e di risanamento, utilizzando attrezzature specifiche e adottando tutte le misure di sicurezza necessarie. Interveniamo su qualsiasi specie arborea, rispettando i tempi biologici e le normative locali."
      },
      {
        id: 5,
        title: "Cura Siepi",
        icon: Shrub,
        description: "Servizio professionale di manutenzione e modellazione di siepi di qualsiasi varietà, dimensione e forma.",
        longDescription: "Le siepi rappresentano elementi fondamentali nel design del giardino, offrendo privacy, protezione e valore estetico. Il nostro servizio di cura delle siepi comprende la potatura di mantenimento o di forma, interventi di ringiovanimento per siepi invecchiate e trattamenti specifici contro parassiti e malattie. Utilizziamo attrezzature professionali che garantiscono tagli netti e precisi, rispettando la naturale crescita della pianta. Siamo in grado di intervenire su ogni varietà di siepe, creando anche forme geometriche o artistiche su richiesta."
      },
      {
        id: 6,
        title: "Giardinaggio Completo",
        icon: SprayCan,
        description: "Servizio completo di giardinaggio e progettazione del verde per privati, aziende e spazi pubblici.",
        longDescription: "Il nostro servizio di giardinaggio comprende tutte le attività necessarie alla creazione e al mantenimento di spazi verdi di qualità. Dalla progettazione iniziale alla realizzazione, dalla manutenzione ordinaria agli interventi straordinari, offriamo soluzioni complete per giardini privati, parchi aziendali e aree pubbliche. Il nostro team è formato da esperti in botanica, design del paesaggio e tecniche di giardinaggio che lavorano insieme per creare ambienti verdi armoniosi, sostenibili e facili da mantenere, in linea con le esigenze estetiche e funzionali del cliente."
      }
    ]
  },
  
  // Categoria: Opere Strutturali
  {
    category: "Opere Strutturali",
    services: [
      {
        id: 7,
        title: "Costruzione Recinti in Palizzata",
        icon: Fence,
        description: "Realizzazione di recinzioni in legno e palizzate per delimitare proprietà, giardini e aree verdi con materiali di qualità e finiture personalizzate.",
        longDescription: "Progettiamo e realizziamo recinzioni in legno e palizzate per delimitare proprietà, giardini, aree verdi e parchi. Utilizziamo legname selezionato, trattato per resistere agli agenti atmosferici e ai parassiti, garantendo durabilità e bellezza nel tempo. Le nostre strutture sono progettate su misura in base alle esigenze del cliente e alle caratteristiche del terreno, con possibilità di personalizzazione nelle finiture, nelle altezze e negli stili. Ci occupiamo di ogni fase del lavoro, dalla progettazione all'installazione, fino ai trattamenti di manutenzione periodica."
      },
      {
        id: 8,
        title: "Scavi con Escavatori",
        icon: Shovel,
        description: "Servizio di scavo e movimentazione terra con escavatori di varie dimensioni per lavori di ogni entità, dal piccolo giardino ai grandi cantieri.",
        longDescription: "Disponiamo di un parco macchine completo di escavatori di varie dimensioni per eseguire lavori di scavo e movimentazione terra di qualsiasi entità. I nostri operatori specializzati sono in grado di intervenire in contesti diversi, dal piccolo giardino privato ai grandi cantieri, garantendo precisione e sicurezza. Eseguiamo scavi per fondazioni, piscine, laghetti, impianti di irrigazione e drenaggio, sistemazioni idrauliche, livellamenti del terreno e preparazione di aree edificabili. Ogni intervento viene pianificato nei minimi dettagli, nel rispetto delle normative ambientali e di sicurezza."
      }
    ]
  },
  
  // Categoria: Servizi Tecnologici
  {
    category: "Servizi Tecnologici",
    services: [
      {
        id: 9,
        title: "Montaggio Telecamere",
        icon: Camera,
        description: "Installazione professionale di sistemi di videosorveglianza per abitazioni private, aziende e spazi pubblici.",
        longDescription: "Offriamo un servizio completo di installazione di sistemi di videosorveglianza per abitazioni private, aziende, negozi e spazi pubblici. I nostri tecnici specializzati si occupano della progettazione del sistema in base alle specifiche esigenze di sicurezza, dell'installazione delle telecamere e dell'impianto elettrico necessario, della configurazione del software di gestione e della formazione all'uso. Utilizziamo apparecchiature di ultima generazione, con possibilità di controllo remoto tramite smartphone e integrazione con sistemi domotici esistenti. Garantiamo assistenza post-vendita e manutenzione periodica per mantenere il sistema sempre efficiente."
      },
      {
        id: 10,
        title: "Installazione Dispositivi Elettronici",
        icon: Cpu,
        description: "Servizio di installazione e configurazione di dispositivi elettronici di vario tipo, dai sistemi di allarme agli impianti domotici.",
        longDescription: "Il nostro team di tecnici specializzati si occupa dell'installazione e configurazione di una vasta gamma di dispositivi elettronici. Dai sistemi di allarme agli impianti domotici, dalle centraline di irrigazione automatizzata ai sensori ambientali, offriamo soluzioni tecnologiche avanzate per migliorare la sicurezza, l'efficienza e il comfort di abitazioni e spazi commerciali. Ogni installazione viene preceduta da un'attenta analisi delle esigenze del cliente e delle caratteristiche strutturali dell'ambiente, per garantire una soluzione personalizzata e perfettamente funzionante. Forniamo inoltre formazione all'uso e assistenza continua anche dopo l'installazione."
      }
    ]
  }
];

export default function ServiziPage() {
  return (
    <>
      {/* Header della pagina */}
      <section className="bg-green-700 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">I Nostri Servizi</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Scopri la gamma completa di servizi che offriamo per la comunità e l&apos;ambiente.
            Qualità, professionalità e sostenibilità sono i nostri valori fondamentali.
          </p>
        </div>
      </section>
      
      {/* Categorie di servizi */}
      {serviziData.map((categoria, index) => (
        <section key={index} className={`py-16 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}`}>
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-4">{categoria.category}</h2>
            <div className="h-1 w-16 bg-yellow-400 mx-auto mb-12"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categoria.services.map((service) => {
                const Icon = service.icon;
                
                return (
                  <Card key={service.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="flex items-center justify-center pt-8">
                      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                        <Icon size={48} className="text-green-700" />
                      </div>
                    </div>
                    
                    <CardHeader className="pt-6 text-center">
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 text-center">
                        {service.description}
                      </p>
                    </CardContent>
                    
                    <CardFooter className="justify-center pb-8">
                      <Button asChild className="bg-green-700 hover:bg-green-800">
                        <Link href={`/servizi/${service.id}`}>Maggiori Dettagli</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      ))}
      
      {/* Sezione FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-4">Domande Frequenti</h2>
          <div className="h-1 w-16 bg-yellow-400 mx-auto mb-12"></div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Come posso richiedere un preventivo?</h3>
              <p className="text-gray-600">
                Puoi richiedere un preventivo gratuito compilando il modulo nella sezione contatti, 
                chiamandoci al numero +39 3282705422 o inviando una email a coperativavalgotra54@gmail.com. 
                Ti risponderemo entro 24 ore lavorative.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">I vostri servizi sono disponibili anche per privati?</h3>
              <p className="text-gray-600">
                Sì, la maggior parte dei nostri servizi è disponibile sia per aziende che per privati. 
                Offriamo soluzioni personalizzate per qualsiasi esigenza, dai piccoli interventi in giardini 
                privati ai grandi progetti per spazi pubblici o aziendali.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Quali zone coprite con i vostri servizi?</h3>
              <p className="text-gray-600">
                Operiamo principalmente nella provincia di Parma e nelle zone limitrofe, ma alcuni.
                Contattaci per verificare la disponibilità nella tua zona.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Operate anche in periodi invernali o di maltempo?</h3>
              <p className="text-gray-600">
                Molti dei nostri servizi, specialmente quelli legati alla cura del verde, seguono 
                la stagionalità e le condizioni meteorologiche. Tuttavia, servizi come l&apos;installazione 
                di dispositivi elettronici, la progettazione e alcuni lavori strutturali possono essere 
                eseguiti durante tutto l&apos;anno. Contattateci per verificare la disponibilità specifica.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-green-700 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-6">Sei interessato ai nostri servizi?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Contattaci oggi stesso per discutere delle tue esigenze e scoprire come possiamo aiutarti.
            Offriamo soluzioni personalizzate e preventivi gratuiti.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="outline" className="bg-white text-green-700 hover:bg-gray-100 border-white">
              <Link href="/contatti">Contattaci</Link>
            </Button>
            <Button asChild className="bg-transparent border-white hover:bg-white/10">
              <Link href="/prenota-chiamata">Prenota una Chiamata</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}