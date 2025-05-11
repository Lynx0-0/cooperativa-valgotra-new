"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChevronLeft, 
  ChevronRight,
  TreePine, 
  Flower2, 
  TreeDeciduousIcon,
  Fence,
  Shovel,
  Camera
} from "lucide-react"

// Dati dei servizi con icone
const servicesData = [
  {
    id: 1,
    title: "Taglio Alberi",
    icon: TreePine,
    description: "Servizio professionale di abbattimento e taglio alberi con tecniche di tree climbing e attrezzature specializzate."
  },
  {
    id: 2,
    title: "Cura del Prato",
    icon: Flower2,
    description: "Servizio completo di manutenzione e cura del prato, dalla semina alla concimazione, dall'irrigazione ai trattamenti specifici."
  },
  {
    id: 3,
    title: "Potatura Alberi",
    icon: TreeDeciduousIcon,
    description: "Servizio specializzato di potatura alberi e arbusti con tecniche rispettose della fisiologia delle piante."
  },
  {
    id: 4,
    title: "Costruzione Recinti in Palizzata",
    icon: Fence,
    description: "Realizzazione di recinzioni in legno e palizzate per delimitare proprietà, giardini e aree verdi."
  },
  {
    id: 5,
    title: "Scavi",
    icon: Shovel,
    description: "Servizio di scavo e movimentazione terra con escavatori di varie dimensioni per lavori di ogni entità."
  },
  {
    id: 6,
    title: "Montaggio Telecamere",
    icon: Camera,
    description: "Installazione professionale di sistemi di videosorveglianza per abitazioni private, aziende e spazi pubblici."
  }
]

export default function Services() {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  const totalPages = Math.ceil(servicesData.length / itemsPerPage)
  
  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }
  
  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }
  
  // Ottieni i servizi correnti da mostrare
  const currentServices = servicesData.slice(
    currentPage * itemsPerPage, 
    (currentPage + 1) * itemsPerPage
  )
  
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">I Nostri Servizi</h2>
        <div className="h-1 w-16 bg-yellow-400 mx-auto mb-12"></div>
        
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {currentServices.map((service) => {
              const Icon = service.icon;
              
              return (
                <Card key={service.id} className="border-none shadow-lg transition-transform hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex items-center justify-center pt-8">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                      <Icon size={40} className="text-green-700" />
                    </div>
                  </div>
                  
                  <CardHeader className="pt-6 text-center">
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </CardContent>
                  
                  <CardFooter className="justify-center pb-6">
                    <Button asChild variant="outline" className="border-green-700 text-green-700 hover:bg-green-50">
                      <Link href={`/servizi/${service.id}`}>Scopri di più</Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {/* Controlli del carosello */}
          <div className="flex justify-center mt-8 gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevPage}
              className="rounded-full"
              aria-label="Pagina precedente"
            >
              <ChevronLeft />
            </Button>
            
            <div className="flex gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-3 w-3 rounded-full cursor-pointer transition-colors ${
                    i === currentPage ? "bg-green-700" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentPage(i)}
                  role="button"
                  aria-label={`Pagina ${i + 1}`}
                  tabIndex={0}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextPage}
              className="rounded-full"
              aria-label="Pagina successiva"
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-10">
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/servizi">Tutti i Servizi</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}