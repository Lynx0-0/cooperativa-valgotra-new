"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Building,
  Tag,
  ArrowLeft,
  MapPin,
  FileText,
  Users
} from "lucide-react"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import { Project, getAllProjects } from "@/lib/db"

export default function ProgettoDettaglioPage() {
  const { id } = useParams()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        const projects = await getAllProjects()
        const foundProject = projects.find(p => p.id === id)
        
        if (foundProject) {
          setProject(foundProject)
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Errore nel caricamento del progetto:", error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProject()
  }, [id])
  
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
  
  // Se il progetto non è stato trovato
  if (notFound && !isLoading) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Progetto non trovato</h1>
        <p className="text-gray-600 mb-8">Il progetto che stai cercando non esiste o è stato rimosso.</p>
        <Button asChild>
          <Link href="/progetti">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna ai progetti
          </Link>
        </Button>
      </div>
    )
  }
  
  // Mostra un loader durante il caricamento
  if (isLoading) {
    return (
      <div className="container py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
        <span className="ml-3 text-lg">Caricamento progetto...</span>
      </div>
    )
  }
  
  return (
    <>
      {/* Intestazione progetto */}
      <section className="bg-green-700 text-white py-12 md:py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <Link 
                href="/progetti" 
                className="inline-flex items-center text-white/80 hover:text-white mb-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna ai progetti
              </Link>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{project?.title}</h1>
              
              <div className="flex flex-wrap gap-3 mt-4">
                {project?.category && (
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0">
                    {project.category}
                  </Badge>
                )}
                {project?.featured && (
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white border-0">
                    Progetto In Evidenza
                  </Badge>
                )}
              </div>
            </div>
            
            {project?.completion_date && formatDate(project.completion_date) && (
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-white/80 text-sm">Completato</p>
                <p className="text-xl font-semibold">{formatDate(project.completion_date)}</p>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Contenuto principale */}
      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Immagine e info di base */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full">
                  {project?.image_url ? (
                    <Image 
                      src={project.image_url} 
                      alt={project.title} 
                      className="object-cover" 
                      fill 
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                      priority
                      unoptimized={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <FileText size={64} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="p-6 md:p-8">
                  <h2 className="text-2xl font-bold mb-4">Descrizione del Progetto</h2>
                  <div className="prose prose-green max-w-none">
                    {project?.description.split('\n').map((paragraph, idx) => (
                      <p key={idx} className="mb-4 text-gray-700">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Galleria immagini aggiuntive - Esempio */}
              {/* Nella realtà, dovresti avere un campo nella tua tabella projects per le immagini aggiuntive */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6">Galleria Immagini</h2>
                <p className="text-gray-500 text-center py-8">
                  Questa è un'area di esempio per mostrare immagini aggiuntive del progetto.
                  Per implementarla, dovrai aggiungere un campo per le immagini multiple nel database.
                </p>
              </div>
            </div>
            
            {/* Sidebar con dettagli */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden p-6 md:p-8 mb-8">
                <h2 className="text-xl font-bold mb-6">Dettagli del Progetto</h2>
                
                <div className="space-y-6">
                  {project?.client && (
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-md mr-4">
                        <Building className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Cliente</h3>
                        <p className="text-gray-600">{project.client}</p>
                      </div>
                    </div>
                  )}
                  
                  {project?.category && (
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-md mr-4">
                        <Tag className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Categoria</h3>
                        <p className="text-gray-600">{project.category}</p>
                      </div>
                    </div>
                  )}
                  
                  {project?.completion_date && formatDate(project.completion_date) && (
                    <div className="flex items-start">
                      <div className="bg-green-100 p-2 rounded-md mr-4">
                        <Calendar className="h-5 w-5 text-green-700" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-700">Data di Completamento</h3>
                        <p className="text-gray-600">{formatDate(project.completion_date)}</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Campi addizionali - da aggiungere nel database se necessari */}
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-md mr-4">
                      <MapPin className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Località</h3>
                      <p className="text-gray-600">Provincia di Lecco</p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Campo di esempio - aggiungi 'location' alla tabella projects per utilizzarlo)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-md mr-4">
                      <Users className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-700">Team</h3>
                      <p className="text-gray-600">5 membri del team coinvolti</p>
                      <p className="text-xs text-gray-500 mt-1">
                        (Campo di esempio - aggiungi 'team_size' alla tabella projects per utilizzarlo)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA Contattaci */}
              <div className="bg-green-50 rounded-lg shadow-md overflow-hidden p-6 md:p-8 border border-green-100">
                <h2 className="text-xl font-bold mb-4">Hai un progetto simile?</h2>
                <p className="text-gray-600 mb-6">
                  Se sei interessato a un progetto simile o hai domande su questo lavoro,
                  non esitare a contattarci. Siamo a tua disposizione.
                </p>
                <Button asChild className="w-full bg-green-700 hover:bg-green-800">
                  <Link href="/prenota-chiamata">
                    Contattaci
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Navigazione progetti correlati */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl font-bold mb-8 text-center">Progetti Correlati</h2>
          
          <div className="text-center py-8">
            <p className="text-gray-500">
              Questa è un'area di esempio per mostrare progetti correlati.
              Implementala aggiungendo la logica per recuperare progetti della stessa categoria.
            </p>
            
            <Button asChild className="mt-6">
              <Link href="/progetti">
                Esplora tutti i progetti
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}