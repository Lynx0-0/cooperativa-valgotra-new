"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ImagePlus, X, Save, ArrowLeft, Trash2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { Project, getAllProjects } from "@/lib/db"

export default function EditProjectGalleryPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [galleryImages, setGalleryImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [projectId, setProjectId] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [tableName, setTableName] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // Ottieni il nome della tabella (debug)
  useEffect(() => {
    const getTableInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
        
        if (error) {
          console.error("Errore nell'accesso alla tabella 'projects':", error);
          // Prova un nome alternativo
          const { data: altData, error: altError } = await supabase
            .from('progetti')
            .select('id')
            .limit(1);
          
          if (!altError) {
            setTableName('progetti');
            console.log("Tabella corretta trovata: 'progetti'");
          } else {
            console.error("Errore nell'accesso alla tabella 'progetti':", altError);
            setTableName('sconosciuta');
          }
        } else {
          setTableName('projects');
          console.log("Tabella corretta trovata: 'projects'");
        }
      } catch (error) {
        console.error("Errore nel controllo della tabella:", error);
      }
    };
    
    getTableInfo();
  }, []);
  
  // Carica il progetto
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Estrai l'ID del progetto dai parametri e assicurati che sia una stringa
        let idParam: string = "";
        
        if (params && params.id) {
          // Gestisci sia il caso in cui id è un array che il caso in cui è una stringa
          if (Array.isArray(params.id)) {
            idParam = params.id[0] || "";
          } else {
            idParam = params.id;
          }
        }
        
        // Verifica che abbiamo effettivamente un ID
        if (!idParam) {
          throw new Error("ID progetto mancante nell'URL");
        }
        
        console.log("Project ID:", idParam);
        setProjectId(idParam);
        
        const projects = await getAllProjects()
        console.log("Projects loaded:", projects.length)
        
        const foundProject = projects.find(p => p.id === idParam)
        console.log("Found project:", foundProject?.title || "Not found")
        
        if (foundProject) {
          setProject(foundProject)
          // Assicurati che gallery_images sia sempre un array
          setGalleryImages(Array.isArray(foundProject.gallery_images) ? foundProject.gallery_images : [])
          console.log("Gallery images loaded:", 
            Array.isArray(foundProject.gallery_images) ? foundProject.gallery_images.length : 'nessuna (non è un array)')
        } else {
          console.error("Progetto non trovato:", idParam)
          setError("Progetto non trovato")
          toast.error("Progetto non trovato")
          setTimeout(() => router.push("/admin/progetti"), 2000)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto";
        console.error("Errore nel caricamento del progetto:", errorMessage);
        setError(`Impossibile caricare il progetto: ${errorMessage}`);
        toast.error(`Impossibile caricare il progetto: ${errorMessage}`);
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProject()
  }, [params, router])
  
  // Aggiunge una nuova immagine alla galleria
  const addImage = () => {
    if (!newImageUrl.trim()) {
      toast.error("Inserisci un URL valido")
      return
    }
    
    setGalleryImages(prev => [...prev, newImageUrl.trim()])
    setNewImageUrl("")
    setIsAddDialogOpen(false)
    toast.success("Immagine aggiunta alla galleria")
  }
  
  // Rimuove un'immagine dalla galleria
  const removeImage = (index: number) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index))
    toast.success("Immagine rimossa dalla galleria")
  }
  
  // Torna alla lista progetti
  const goBackToProjects = () => {
    router.push("/admin/dashboard")
  }
  
  // Salva le modifiche al progetto - NUOVA IMPLEMENTAZIONE DIRETTA CON SUPABASE
  const saveChanges = async () => {
    if (!projectId) {
      console.error("ID progetto non disponibile")
      toast.error("Impossibile salvare: ID progetto mancante")
      return
    }
    
    try {
      setIsSaving(true)
      setError(null)
      setSaveSuccess(false)
      console.log("Saving gallery images for project ID:", projectId)
      console.log("Images to save:", galleryImages)
      
      // Verifica che galleryImages sia un array
      if (!Array.isArray(galleryImages)) {
        console.error("galleryImages non è un array:", galleryImages)
        toast.error("Errore: formato dati non valido")
        return
      }
      
      // Determinare la tabella corretta da usare
      const tableToUse = tableName === 'progetti' ? 'progetti' : 'projects';
      console.log(`Usando tabella: ${tableToUse}`);
      
      // Aggiornamento diretto tramite Supabase client
      const { data, error } = await supabase
        .from(tableToUse)
        .update({ gallery_images: galleryImages })
        .eq('id', projectId)
        .select();
      
      if (error) {
        console.error("Errore Supabase:", error);
        throw new Error(error.message || 'Errore Supabase');
      }
      
      console.log("Update result:", data);
      
      // Mostra un messaggio di successo senza reindirizzamento automatico
      toast.success("Galleria salvata con successo");
      setSaveSuccess(true);
      
      // Non reindirizzare automaticamente
      // setTimeout(() => router.push("/admin/progetti"), 1000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto";
      console.error("Errore nel salvataggio della galleria:", error)
      setError(`Errore nel salvataggio della galleria: ${errorMessage}`)
      toast.error(`Impossibile salvare la galleria: ${errorMessage}`)
    } finally {
      setIsSaving(false)
    }
  }
  
  if (isLoading) {
    return (
      <div className="container py-8 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg">Caricamento progetto...</span>
      </div>
    )
  }
  
  if (error && !project) {
    return (
      <div className="container py-8 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <Button onClick={() => router.push("/admin/progetti")}>
          Torna alla lista progetti
        </Button>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={goBackToProjects}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Torna ai progetti
          </Button>
          <h1 className="text-2xl font-bold">Modifica Galleria: {project?.title || '[Progetto]'}</h1>
          {tableName && <p className="text-sm text-gray-500">Tabella: {tableName}</p>}
        </div>
        
        <Button 
          onClick={saveChanges}
          disabled={isSaving}
          className="bg-green-700 hover:bg-green-800"
        >
          {isSaving ? (
            <>Salvataggio...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salva Galleria
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Errore:</strong> {error}
        </div>
      )}
      
      {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <div>
            <strong>Successo!</strong> La galleria è stata salvata correttamente.
            <div className="mt-2">
              <Button 
                onClick={goBackToProjects} 
                variant="outline" 
                size="sm"
                className="text-green-700 border-green-400 hover:bg-green-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Torna alla lista progetti
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>Galleria Immagini</CardTitle>
          <CardDescription>
            Gestisci le immagini aggiuntive per questo progetto. Queste immagini saranno visualizzate nella galleria
            nella pagina di dettaglio del progetto.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-green-700 hover:bg-green-800"
            >
              <ImagePlus className="mr-2 h-4 w-4" />
              Aggiungi Immagine
            </Button>
          </div>
          
          {galleryImages.length === 0 ? (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <ImagePlus className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">Nessuna immagine nella galleria</p>
              <p className="text-sm text-gray-400">Clicca su "Aggiungi Immagine" per iniziare</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden border bg-gray-50">
                    <Image
                      src={imageUrl}
                      alt={`Immagine ${index + 1}`}
                      className="object-cover w-full h-full"
                      width={300}
                      height={300}
                      unoptimized={true}
                    />
                  </div>
                  
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Rimuovi immagine"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button 
            variant="outline" 
            onClick={goBackToProjects}
            type="button"
          >
            Annulla
          </Button>
          <Button 
            onClick={saveChanges}
            disabled={isSaving}
            className="bg-green-700 hover:bg-green-800"
            type="button"
          >
            {isSaving ? "Salvataggio..." : "Salva Galleria"}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Dialog per aggiungere immagine */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogTitle>Aggiungi Immagine alla Galleria</DialogTitle>
          <DialogDescription>
            Inserisci l'URL dell'immagine che vuoi aggiungere alla galleria del progetto.
          </DialogDescription>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL dell'immagine</Label>
              <Input
                id="imageUrl"
                placeholder="https://esempio.com/immagine.jpg"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
            </div>
            
            {newImageUrl && (
              <div className="pt-2">
                <p className="text-sm text-gray-500 mb-2">Anteprima:</p>
                <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                  <Image 
                    src={newImageUrl} 
                    alt="Anteprima" 
                    className="object-contain w-full h-full" 
                    width={400} 
                    height={300}
                    unoptimized={true}
                  />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsAddDialogOpen(false)}
              type="button"
            >
              Annulla
            </Button>
            <Button 
              onClick={addImage} 
              className="bg-green-700 hover:bg-green-800"
              type="button"
            >
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}