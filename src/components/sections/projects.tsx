"use client"
import Image from "next/image";
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getAllProjects, Project } from "@/lib/db"
import { Badge } from "@/components/ui/badge"
import { Calendar, Building } from "lucide-react"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"

type ProjectsProps = {
  filterCategory?: string | null;
  excludeProjectId?: string;
}

export default function Projects({ filterCategory, excludeProjectId }: ProjectsProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Caricamento dei progetti in evidenza
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const data = await getAllProjects()
        
        // Filtra i progetti basati sui parametri opzionali
        let filtered = data;
        
        // Se è specificata una categoria, filtra per quella categoria
        if (filterCategory) {
          filtered = filtered.filter(project => project.category === filterCategory);
        }
        
        // Se è specificato un ID da escludere, rimuovilo
        if (excludeProjectId) {
          filtered = filtered.filter(project => project.id !== excludeProjectId);
        }
        
        // Dai priorità ai progetti in evidenza
        const featured = filtered.filter(project => project.featured);
        
        // Se non ci sono progetti in evidenza con la categoria specificata,
        // usa progetti normali di quella categoria (massimo 3)
        const projectsToShow = featured.length > 0 
          ? featured.slice(0, 3) 
          : filtered.slice(0, 3);
        
        setFeaturedProjects(projectsToShow)
      } catch (error) {
        console.error("Errore nel caricamento dei progetti:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProjects()
  }, [filterCategory, excludeProjectId])
  
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
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          <span className="ml-3 text-lg">Caricamento progetti...</span>
        </div>
      ) : featuredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500 mb-6">
            Nessun progetto correlato disponibile.
          </p>
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/progetti">Esplora tutti i nostri progetti</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg shadow-lg">
              {/* Immagine del progetto */}
              <div className="h-64 relative overflow-hidden">
                {project.image_url ? (
                  // Soluzione con unoptimized=true per evitare problemi di ottimizzazione
                  <Image
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    width={500}
                    height={300}
                    unoptimized={true}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-200">
                    <span className="text-gray-400 text-lg">Immagine Progetto</span>
                  </div>
                )}
                
                {/* Badge categoria */}
                {project.category && (
                  <Badge className="absolute top-3 left-3 bg-green-700 text-white border-0">
                    {project.category}
                  </Badge>
                )}
                
                {/* Overlay con informazioni */}
                <div className="absolute inset-0 bg-green-700/90 flex items-center justify-center p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold mb-3">{project.title}</h3>
                    
                    <div className="flex flex-col items-center gap-2 mb-4">
                      {project.client && (
                        <div className="flex items-center text-white/80">
                          <Building size={16} className="mr-1" />
                          <span>{project.client}</span>
                        </div>
                      )}
                      
                      {project.completion_date && formatDate(project.completion_date) && (
                        <div className="flex items-center text-white/80">
                          <Calendar size={16} className="mr-1" />
                          <span>{formatDate(project.completion_date)}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="mb-4 line-clamp-3">{project.description}</p>
                    
                    <Button asChild variant="outline" size="sm" className="border-white text-white hover:bg-white/20">
                      <Link href={`/progetti/${project.id}`}>Scopri di più</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="text-center mt-10">
        <Button asChild className="bg-green-700 hover:bg-green-800">
          <Link href="/progetti">Tutti i Progetti</Link>
        </Button>
      </div>
    </>
  )
}