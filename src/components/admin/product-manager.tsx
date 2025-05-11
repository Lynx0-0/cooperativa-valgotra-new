"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
  ShoppingBag,
  ImageIcon,
  Check
} from "lucide-react"
import { 
  getAllProducts, 
  saveProduct, 
  updateProduct,
  deleteProduct,
  Product 
} from "@/lib/db"

// Categorie di esempio
const PRODUCT_CATEGORIES = [
  "Materiali Riciclati",
  "Prodotti Ecologici",
  "Compost",
  "Attrezzature",
  "Divise da Lavoro",
  "Gadget Aziendali",
  "Altro"
]

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)
  
  const [formData, setFormData] = useState<Product>({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category: "",
    in_stock: true,
    featured: false
  })
  
  // Carica i prodotti
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await getAllProducts()
      setProducts(data)
    } catch (error) {
      console.error("Errore nel caricamento dei prodotti:", error)
      toast.error("Impossibile caricare i prodotti")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Filtra i prodotti
  const filteredProducts = products.filter(product => {
    const matchesCategory = categoryFilter === "all" ? true : product.category === categoryFilter
    const matchesSearch = searchTerm
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      : true
    
    return matchesCategory && matchesSearch
  })
  
  // Gestisci il cambio nel form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    let processedValue: string | number = value

    // Converti il prezzo in numero
    if (name === "price") {
      processedValue = parseFloat(value) || 0
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
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
      name: "",
      description: "",
      price: 0,
      image_url: "",
      category: "",
      in_stock: true,
      featured: false
    })
    setEditProduct(null)
  }
  
  // Apri il dialog per la creazione/modifica
  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditProduct(product)
      setFormData(product)
    } else {
      resetForm()
    }
    setIsDialogOpen(true)
  }
  
  // Apri il dialog per l'eliminazione
  const handleOpenDeleteDialog = (product: Product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }
  
  // Salva o aggiorna un prodotto
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editProduct) {
        // Aggiornamento
        await updateProduct(editProduct.id!, formData)
        
        // Aggiorna lo stato locale
        setProducts(prev => 
          prev.map(product => 
            product.id === editProduct.id ? { ...formData, id: editProduct.id } : product
          )
        )
        
        toast.success("Prodotto aggiornato con successo")
      } else {
        // Creazione
        const result = await saveProduct(formData)
        
        if (result && result.length > 0) {
          // Aggiorna lo stato locale
          setProducts(prev => [...prev, result[0]])
          toast.success("Prodotto creato con successo")
        }
      }
      
      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      console.error("Errore nel salvataggio del prodotto:", error)
      toast.error("Impossibile salvare il prodotto")
    }
  }
  
  // Elimina un prodotto
  const handleDelete = async () => {
    if (!productToDelete) return
    
    try {
      await deleteProduct(productToDelete.id!)
      
      // Aggiorna lo stato locale
      setProducts(prev => prev.filter(product => product.id !== productToDelete.id))
      
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
      
      toast.success("Prodotto eliminato con successo")
    } catch (error) {
      console.error("Errore nell'eliminazione del prodotto:", error)
      toast.error("Impossibile eliminare il prodotto")
    }
  }
  
  // Formatta il prezzo
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)
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
          Nuovo Prodotto
        </Button>
        
        <div className="flex items-center gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              {/* Key fix: Changed empty string to "all" */}
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {PRODUCT_CATEGORIES.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="relative w-full md:w-64">
            <Input
              placeholder="Cerca prodotti..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Lista prodotti */}
      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
          <span className="ml-3">Caricamento prodotti...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-gray-500">
              {searchTerm || categoryFilter !== "all" ? "Nessun prodotto corrisponde ai criteri di ricerca" : "Nessun prodotto trovato. Aggiungi il tuo primo prodotto!"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Prezzo</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>In Evidenza</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      {product.image_url ? (
                        // In un'applicazione reale, qui ci sarebbe un'immagine
                        <div className="h-full w-full bg-gray-200 rounded-md" />
                      ) : (
                        <ImageIcon className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      {product.name}
                      {product.description && (
                        <p className="text-xs text-gray-500 truncate max-w-md">{product.description}</p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {product.category ? (
                    <Badge variant="outline" className="bg-gray-100">
                      {product.category}
                    </Badge>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  {product.in_stock ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Disponibile
                    </Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      Esaurito
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  {product.featured ? (
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
                      onClick={() => handleOpenDialog(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(product)}
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
      
      {/* Dialog per aggiungere/modificare un prodotto */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editProduct ? "Modifica Prodotto" : "Aggiungi Nuovo Prodotto"}
            </DialogTitle>
            <DialogDescription>
              {editProduct 
                ? "Modifica i dettagli del prodotto esistente" 
                : "Inserisci i dettagli per aggiungere un nuovo prodotto al negozio"
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Prodotto *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Prezzo (€) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  value={formData.category || "none"} 
                  onValueChange={(value) => handleSelectChange("category", value === "none" ? "" : value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Key fix: Changed empty string to "none" */}
                    <SelectItem value="none">Nessuna categoria</SelectItem>
                    {PRODUCT_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
            
            <div className="flex flex-col gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in_stock"
                  checked={Boolean(formData.in_stock)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange("in_stock", checked as boolean)
                  }
                />
                <Label htmlFor="in_stock" className="cursor-pointer">
                  Prodotto disponibile in magazzino
                </Label>
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
                  Prodotto in evidenza nella homepage
                </Label>
              </div>
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
                {editProduct ? "Salva Modifiche" : "Aggiungi Prodotto"}
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
              Sei sicuro di voler eliminare il prodotto "{productToDelete?.name}"? Questa azione non può essere annullata.
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
              Elimina Prodotto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}