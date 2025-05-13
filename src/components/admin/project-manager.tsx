"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Card, 
  CardContent 
} from "@/components/ui/card"
import { toast } from "sonner"
import { 
  PlusCircle, 
  Pencil, 
  X, 
  Briefcase,
  ImageIcon,
  Calendar
} from "lucide-react"
import { 
  getAllProjects, 
  saveProject, 
  updateProject,
  deleteProject,
  Project 
} from "@/lib/db"

// Categorie di progetto di esempio
const PROJECT_CATEGORIES = [
  "Sfalcio",
  "Alberi",
  "Edilizia",
  "Scavi",
  "Pulizia",
  "Trasporti",
  "Manutenzioe",
  "Aree verdi",
  "Siepi",
  "Altro"
]

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [editProject, setEditProject] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  
  const [formData, setFormData] = useState<Project>({
    title: "",
    description: "",
    image_url: "",
    completion_date: "",
    client: "",
    category: "",
    featured: false
  })
  
  // Carica i progetti
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAllProjects()
      setProjects(data)
    } catch (error) {
      console.error("Errore nel caricamento dei progetti:", error)
      toast.error("Impossibile caricare i progetti")
    } finally {
      setIsLoading(false)
    }
  }, [])
  
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])
  
  // Filtra i progetti
  const filteredProjects = projects.filter(project => {
    const matchesCategory = categoryFilter ? project.category === categoryFilter : true
    const matchesSearch = searchTerm
      ? project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.client && project.client.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    
    return matchesCategory && matchesSearch
  })
  
  // Gestisci il cambio nel form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  // Resetta il form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      completion_date: "",
      client: "",
      category: "",
      featured: false
    })
    setEditProject(null)
  }
  
  // Apri il dialog per la creazione/modifica
  const handleOpenDialog = (project?: Project) => {
    if (project) {
      setEditProject(project)
      setFormData(project)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }
  
  // Apri il dialog per l'eliminazione
  const handleOpenDeleteDialog = (project: Project) => {
    setProjectToDelete(project)
    setIsDeleteDialogOpen(true)
  }
  
  // Salva o aggiorna un progetto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editProject) {
        // Aggiornamento
        await updateProject(editProject.id!, formData)
        
        // Aggiorna lo stato locale
        setProjects(prev => 
          prev.map(project => 
            project.id === editProject.id ? { ...formData, id: editProject.id } : project
          )
        )
        
        toast.success("Progetto aggiornato con successo")
      } else {
        // Creazione
        const result = await saveProject(formData)
        
        if (result && result.length > 0) {
          // Aggiorna lo stato locale
          setProjects(prev => [...prev, result[0]])
          toast.success("Progetto creato con successo")
        }
      }
      
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Errore nel salvataggio del progetto:", error)
      toast.error("Impossibile salvare il progetto")
    }
  }
  
  // Elimina un progetto
  const handleDelete = async () => {
    if (!projectToDelete) return
    
    try {
      await deleteProject(projectToDelete.id!)
      
      // Aggiorna lo stato locale
      setProjects(prev => prev.filter(project => project.id !== projectToDelete.id))
      
      setIsDeleteDialogOpen(false)
      setProjectToDelete(null)
      
      toast.success("Progetto eliminato con successo")
    } catch (error) {
      console.error("Errore nell'eliminazione del progetto:", error)
      toast.error("Impossibile eliminare il progetto")
    }
  }
  
  // Formatta la data
  const formatDate = (dateString?: string) => {
    if (!dateString) return "-"
    
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat('it-IT').format(date)
    } catch {
      return dateString // Fallback
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Controlli */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-green-700 hover:bg-green-800"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuovo Progetto
        </Button>
        
        <div className="flex items-center gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nome">Tutte le categorie</SelectItem>
              {PROJECT_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Cerca progetti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Lista progetti */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
          <span className="ml-3">Caricamento progetti...</span>
        </div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">
              {searchTerm || categoryFilter ? "Nessun progetto corrisponde ai criteri di ricerca" : "Nessun progetto trovato. Aggiungi il tuo primo progetto!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titolo</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data Completamento</TableHead>
              <TableHead>In Evidenza</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      {project.image_url ? (
                        // In un'applicazione reale, qui ci sarebbe un'immagine
                        <div className="h-full w-full bg-gray-200 rounded-md" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      {project.title}
                      <p className="text-xs text-gray-500 truncate max-w-md">
                        {project.description.slice(0, 100)}
                        {project.description.length > 100 ? "..." : ""}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {project.category ? (
                    <Badge variant="outline" className="bg-gray-100">
                      {project.category}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>
                  {project.client || <span className="text-gray-400 text-sm">-</span>}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {formatDate(project.completion_date)}
                  </div>
                </TableCell>
                <TableCell>
                  {project.featured ? (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      In Evidenza
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDialog(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(project)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      
      {/* Dialog per aggiungere/modificare un progetto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editProject ? "Modifica Progetto" : "Aggiungi Nuovo Progetto"}
            </DialogTitle>
            <DialogDescription>
              {editProject 
                ? "Modifica i dettagli del progetto esistente" 
                : "Inserisci i dettagli per aggiungere un nuovo progetto al portfolio"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titolo Progetto *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  name="client"
                  value={formData.client || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category || ""} 
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">Nessuna categoria</SelectItem>
                    {PROJECT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="completion_date">Data di Completamento</Label>
              <Input
                id="completion_date"
                name="completion_date"
                type="date"
                value={formData.completion_date || ""}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image_url">URL Immagine</Label>
              <Input
                id="image_url"
                name="image_url"
                value={formData.image_url || ""}
                onChange={handleInputChange}
                placeholder="https://esempio.com/immagine.jpg"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={Boolean(formData.featured)}
                onCheckedChange={(checked) => 
                  handleCheckboxChange("featured", checked as boolean)
                }
              />
              <Label htmlFor="featured" className="cursor-pointer">
                Progetto in evidenza nella homepage
              </Label>
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Annulla
              </Button>
              <Button type="submit" className="bg-green-700 hover:bg-green-800">
                {editProject ? "Salva Modifiche" : "Aggiungi Progetto"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Dialog per confermare eliminazione */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Conferma Eliminazione</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare il progetto &quot;{projectToDelete?.title}&quot;? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleDelete} 
              variant="destructive"
            >
              Elimina Progetto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}