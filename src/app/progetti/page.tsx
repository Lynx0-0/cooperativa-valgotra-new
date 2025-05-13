"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Building,
  Tag,
  ArrowRight
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import { getAllProjects, Project } from "@/lib/db"

export default function ProgettiPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  
  // Caricamento dei progetti
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await getAllProjects()
        setProjects(data)
        
        // Filtra i progetti in evidenza
        const featured = data.filter(project => project.featured)
        setFeaturedProjects(featured)
      } catch (error) {
        console.error("Errore nel caricamento dei progetti:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [])
  
  // Navigazione del carosello
  const nextSlide = () => {
    setCurrentSlide(prev => 
      prev === featuredProjects.length - 1 ? 0 : prev + 1
    )
  }
  
  const prevSlide = () => {
    setCurrentSlide(prev => 
      prev === 0 ? featuredProjects.length - 1 : prev - 1
    )
  }
  
  // Filtra progetti per categoria
  const filteredProjects = categoryFilter 
    ? projects.filter(project => project.category === categoryFilter)
    : projects
  
  // Estrai categorie uniche per il filtro
  const categories = Array.from(
    new Set(projects.map(project => project.category).filter(Boolean))
  ) as string[]
  
  // Formatta la data
  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    
    try {
      const date = parseISO(dateString)
      return format(date, "MMMM yyyy", { locale: it })
    } catch {
      return null
    }
  }
  
  return (
    <>
      {/* Header della pagina */}
      <section className="bg-green-700 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">I Nostri Lavori</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Scopri i progetti che abbiamo realizzato con passione e professionalità.
            Ogni progetto racconta la nostra storia di impegno verso la comunità e l&apos;ambiente.
          </p>
        </div>
      </section>
      
      {/* Carosello progetti in evidenza */}
      {featuredProjects.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-2">Progetti in Evidenza</h2>
            <div className="h-1 w-16 bg-yellow-400 mx-auto mb-10"></div>
            
            <div className="relative">
              <div className="overflow-hidden rounded-lg shadow-xl">
                <div 
                  className="transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <div className="flex">
                    {featuredProjects.map((project) => (
                      <div key={project.id} className="min-w-full">
                        <div className="grid md:grid-cols-2 h-full">
                          <div className="h-64 md:h-96 bg-gray-200 relative overflow-hidden">
                            {project.image_url ? (
                              <Image 
                                src={project.image_url} 
                                alt={project.title}
                                className="w-full h-full object-cover"
                                width={800}
                                height={600}
                                unoptimized={true}
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <span className="text-gray-400 text-lg">Immagine Progetto</span>
                              </div>
                            )}
                            
                            {project.category && (
                              <Badge className="absolute top-4 left-4 bg-green-700 text-white border-0">
                                {project.category}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">{project.title}</h3>
                            
                            <div className="flex flex-col gap-3 mb-6">
                              {project.client && (
                                <div className="flex items-center text-gray-600">
                                  <Building size={18} className="mr-2 text-green-700" />
                                  <span>{project.client}</span>
                                </div>
                              )}
                              
                              {project.completion_date && formatDate(project.completion_date) && (
                                <div className="flex items-center text-gray-600">
                                  <Calendar size={18} className="mr-2 text-green-700" />
                                  <span>Completato nel {formatDate(project.completion_date)}</span>
                                </div>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-6">
                              {project.description}
                            </p>
                            
                            <div className="mt-auto">
                              <Button asChild className="bg-green-700 hover:bg-green-800">
                                <Link href={`/progetti/${project.id}`}>
                                  Maggiori Dettagli
                                  <ArrowRight size={16} className="ml-2" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Controlli del carosello */}
              {featuredProjects.length > 1 && (
                <>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={prevSlide}
                    className="absolute top-1/2 -left-4 transform -translate-y-1/2 rounded-full bg-white shadow-md z-10"
                  >
                    <ChevronLeft size={24} />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={nextSlide}
                    className="absolute top-1/2 -right-4 transform -translate-y-1/2 rounded-full bg-white shadow-md z-10"
                  >
                    <ChevronRight size={24} />
                  </Button>
                  
                  <div className="flex justify-center mt-6 gap-3">
                    {featuredProjects.map((_, idx) => (
                      <button
                        key={idx}
                        className={`h-3 w-3 rounded-full transition-colors ${
                          idx === currentSlide ? "bg-green-700" : "bg-gray-300"
                        }`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Vai alla slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
      
      {/* Filtri per categoria */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center mr-2">
              <Tag size={16} className="mr-1 text-green-700" />
              <span className="font-medium">Filtra per categoria:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant={categoryFilter === null ? "default" : "outline"} 
                size="sm"
                onClick={() => setCategoryFilter(null)}
                className={categoryFilter === null ? "bg-green-700 hover:bg-green-800" : ""}
              >
                Tutti
              </Button>
              
              {categories.map((category) => (
                <Button 
                  key={category} 
                  variant={categoryFilter === category ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setCategoryFilter(category as string)}
                  className={categoryFilter === category ? "bg-green-700 hover:bg-green-800" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Griglia di tutti i progetti */}
      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
              <span className="ml-3 text-lg">Caricamento progetti...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">
                {categoryFilter ? "Nessun progetto trovato per questa categoria." : "Nessun progetto disponibile."}
              </p>
              {categoryFilter && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setCategoryFilter(null)}
                >
                  Mostra tutti i progetti
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all">
                  <div className="h-56 relative overflow-hidden">
                    {project.image_url ? (
                      <Image 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        width={500}
                        height={300}
                        unoptimized={true}
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-200">
                        <span className="text-gray-400 text-lg">Immagine Progetto</span>
                      </div>
                    )}
                    
                    {project.category && (
                      <Badge className="absolute top-3 left-3 bg-green-700 text-white border-0">
                        {project.category}
                      </Badge>
                    )}
                    
                    {project.featured && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500 text-white border-0">
                        In Evidenza
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-6 bg-white">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                      {project.client && (
                        <div className="flex items-center">
                          <Building size={14} className="mr-1" />
                          <span>{project.client}</span>
                        </div>
                      )}
                      
                      {project.completion_date && formatDate(project.completion_date) && (
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span>{formatDate(project.completion_date)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <Button asChild variant="outline" className="w-full mt-4">
                      <Link href={`/progetti/${project.id}`}>
                        Scopri di più
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Hai un progetto da realizzare?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            La nostra esperienza è a tua disposizione. Contattaci per discutere le tue esigenze
            e trovare insieme la soluzione migliore per il tuo progetto.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/prenota-chiamata">Contattaci</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}