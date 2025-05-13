"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { ShoppingCart, Search, Tag, Package2, Plus, Minus, X } from "lucide-react"
import { getAllProducts, Product, saveOrder, OrderItem } from "@/lib/db"
import { Label } from "@radix-ui/react-label"

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

// Tipo per gli elementi del carrello
type CartItem = {
  product: Product;
  quantity: number;
}

export default function NegozioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Stato per carrello e checkout
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    notes: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Riferimento per scorrere verso la cima della pagina
  const topRef = useRef<HTMLDivElement>(null)
  
  // Carica tutti i prodotti
  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const data = await getAllProducts()
      // Filtra solo i prodotti in stock per il display pubblico
      const availableProducts = data.filter(product => product.in_stock)
      setProducts(availableProducts)
      filterProducts(availableProducts, categoryFilter, searchTerm)
    } catch (error) {
      console.error("Errore nel caricamento dei prodotti:", error)
      toast.error("Impossibile caricare i prodotti. Riprova più tardi.")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProducts()
  }, [])
  
  // Filtra i prodotti in base a categoria e termine di ricerca
  const filterProducts = (
    productList: Product[],
    category: string,
    search: string
  ) => {
    let filtered = [...productList]
    
    // Applica filtro categoria
    if (category !== "all") {
      filtered = filtered.filter(product => product.category === category)
    }
    
    // Applica filtro ricerca
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        product => 
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower))
      )
    }
    
    setFilteredProducts(filtered)
  }
  
  // Aggiorna i filtri quando cambiano i valori
  useEffect(() => {
    filterProducts(products, categoryFilter, searchTerm)
  }, [products, categoryFilter, searchTerm])
  
  // Formatta il prezzo in euro
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(price)
  }
  
  // Gestisce il cambio del termine di ricerca
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  // Aggiunge un prodotto al carrello
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      // Controlla se il prodotto è già nel carrello
      const existingItem = prevCart.find(item => item.product.id === product.id)
      
      if (existingItem) {
        // Incrementa la quantità se già presente
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        )
      } else {
        // Aggiungi nuovo prodotto al carrello
        return [...prevCart, { product, quantity: 1 }]
      }
    })
    
    toast.success(`${product.name} aggiunto al carrello`)
    setIsCartOpen(true)
  }
  
  // Rimuove un prodotto dal carrello
  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId))
  }
  
  // Aggiorna la quantità di un prodotto nel carrello
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCart(prevCart => 
      prevCart.map(item => 
        item.product.id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    )
  }
  
  // Calcola il totale del carrello
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0)
  }
  
  // Gestisce il cambio nei campi del form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  // Gestisce l'invio dell'ordine
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cart.length === 0) {
      toast.error("Il carrello è vuoto")
      return
    }
    
    // Verifica che tutti i prodotti abbiano un ID valido
    const invalidItems = cart.filter(item => !item.product.id)
    if (invalidItems.length > 0) {
      toast.error("Alcuni prodotti nel carrello non sono validi")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Prepara gli elementi dell'ordine con ID validi
      const orderItems: OrderItem[] = cart
        .filter(item => item.product.id) // Filtra solo item con ID
        .map(item => ({
          product_id: item.product.id!, // L'esclamativo dice a TypeScript che siamo sicuri che l'ID esiste
          product_name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        }))
      
      // Prepara i dati dell'ordine
      const orderData = {
        customer: formData,
        items: orderItems,
        total: calculateTotal(),
        status: 'pending' as const, // usare 'as const' per il tipo corretto
        created_at: new Date().toISOString()
      }
      
      // Salva l'ordine nel database
      await saveOrder(orderData)
      
      // Reset dopo l'invio completato
      setCart([])
      setIsCheckoutOpen(false)
      setFormData({
        name: "",
        surname: "",
        phone: "",
        email: "",
        notes: ""
      })
      
      toast.success("Ordine inviato con successo! Verrai contattato presto per confermare i dettagli.")
    } catch (error) {
      console.error("Errore nell'invio dell'ordine:", error)
      toast.error("Impossibile inviare l'ordine. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Procedi al checkout
  const proceedToCheckout = () => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }
  
  // Torna al carrello dal checkout
  const backToCart = () => {
    setIsCheckoutOpen(false)
    setIsCartOpen(true)
  }
  
  // Scorrimento verso l'alto quando si apre il carrello
  useEffect(() => {
    if (isCartOpen && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [isCartOpen])
  
  return (
    <>
      <div ref={topRef}></div>
      {/* Header della pagina */}
      <section className="bg-green-700 text-white py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-6">Il Nostro Negozio</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            Qui troverai tutti i nostri prodotti.
          </p>
        </div>
      </section>
      
      {/* Sezione principale del negozio */}
      <section className="py-16">
        <div className="container">
          {/* Controlli di filtro e ricerca */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Tutte le categorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tutte le categorie</SelectItem>
                  {PRODUCT_CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  className="pl-10"
                  placeholder="Cerca prodotti..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'prodotto' : 'prodotti'} trovati
              </div>
              
              <Button
                variant="outline"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart size={20} />
                <span className="ml-2">Carrello</span>
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-green-700 text-white">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {/* Visualizzazione prodotti */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
              <span className="ml-3 text-lg">Caricamento prodotti...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <Package2 className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Nessun prodotto trovato</h3>
              <p className="text-gray-500 mb-6">
                {categoryFilter !== "all" || searchTerm
                  ? "Nessun prodotto corrisponde ai criteri di ricerca."
                  : "Non ci sono ancora prodotti disponibili nel negozio."}
              </p>
              {(categoryFilter !== "all" || searchTerm) && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setCategoryFilter("all")
                    setSearchTerm("")
                  }}
                >
                  Rimuovi filtri
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Package2 size={60} />
                      </div>
                    )}
                    
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-yellow-500 text-white border-0">
                        In evidenza
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <p className="font-bold text-lg text-green-700">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                    
                    {product.category && (
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Tag size={14} className="mr-1" />
                        <span>{product.category}</span>
                      </div>
                    )}
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <CardDescription className="text-sm text-gray-600 line-clamp-4">
                      {product.description || "Nessuna descrizione disponibile."}
                    </CardDescription>
                  </CardContent>
                  
                  <CardFooter className="mt-auto">
                    <Button
                      className="w-full bg-green-700 hover:bg-green-800"
                      onClick={() => addToCart(product)}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Aggiungi al carrello
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-12 bg-gray-50">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Hai bisogno di aiuto con i nostri prodotti?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Se hai domande sui nostri prodotti o hai bisogno di un consiglio personalizzato,
            non esitare a contattarci. Il nostro team è a tua disposizione.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild className="bg-green-700 hover:bg-green-800">
              <Link href="/prenota-chiamata">Contattaci</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Dialog del carrello */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Il tuo carrello</DialogTitle>
            <DialogDescription>
              Rivedi i prodotti nel tuo carrello prima di procedere all&apos;ordine.
            </DialogDescription>
          </DialogHeader>
          
          {cart.length === 0 ? (
            <div className="py-6 text-center">
              <Package2 className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">Il tuo carrello è vuoto.</p>
            </div>
          ) : (
            <div className="py-4">
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                        {item.product.image_url ? (
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <Package2 size={24} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        <p className="text-sm text-gray-500">{formatPrice(item.product.price)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex items-center mr-4">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id!, Math.max(1, item.quantity - 1))}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="mx-2 w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id!, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => removeFromCart(item.product.id!)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 border-t mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-semibold">Totale</span>
                  <span className="font-bold text-lg">{formatPrice(calculateTotal())}</span>
                </div>
                
                <Button
                  className="w-full bg-green-700 hover:bg-green-800"
                  onClick={proceedToCheckout}
                >
                  Procedi all&apos;ordine
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Dialog del checkout */}
      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Completa il tuo ordine</DialogTitle>
            <DialogDescription>
              Inserisci i tuoi dati per completare l&apos;ordine. Ti contatteremo per confermare i dettagli.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitOrder} className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Il tuo nome"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="surname">Cognome *</Label>
                <Input
                  id="surname"
                  name="surname"
                  placeholder="Il tuo cognome"
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Telefono *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Il tuo numero di telefono"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="La tua email (opzionale)"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Note o richieste particolari</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Eventuali note o richieste (opzionale)"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Totale ordine</span>
                <span className="font-bold text-lg">{formatPrice(calculateTotal())}</span>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full bg-green-700 hover:bg-green-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Invio in corso..." : "Invia ordine"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={backToCart}
                  disabled={isSubmitting}
                >
                  Torna al carrello
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}