//import Image from "next/image"
import { Leaf, Users } from "lucide-react"

export default function About() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            {/* Sostituire con immagine reale */}
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-lg">Immagine Chi Siamo</span>
            </div>
          </div>
          
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Chi Siamo</h2>
            <p className="text-gray-600 mb-4">
              Cooperativa Valgotra è nata con l&apos;obiettivo di fornire servizi di qualità nel rispetto 
              dell&apos;ambiente e delle persone. Da oltre 51 anni, lavoriamo con passione e dedizione 
              per migliorare la qualità della vita nella nostra comunità.
            </p>
            <p className="text-gray-600 mb-8">
              La nostra missione è quella di creare valore condiviso attraverso l&apos;innovazione, 
              la sostenibilità e l&apos;impegno sociale. Crediamo fermamente nel potere della cooperazione 
              e nella forza del lavoro di squadra.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="rounded-full bg-green-700 p-3 text-white mr-4">
                  <Leaf size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">Sostenibilità</h5>
                  <p className="text-gray-500 text-sm">Rispettiamo l&apos;ambiente</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="rounded-full bg-green-700 p-3 text-white mr-4">
                  <Users size={24} />
                </div>
                <div>
                  <h5 className="font-bold text-lg mb-1">Comunità</h5>
                  <p className="text-gray-500 text-sm">Supportiamo il territorio</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}