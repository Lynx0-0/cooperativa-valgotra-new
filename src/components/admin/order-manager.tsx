"use client"

import { useState, useEffect, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import {
  ShoppingCart,
  RefreshCw,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  X,
  Package,
  Calendar
} from "lucide-react"
import {
  getAllOrders,
  updateOrderStatus,
  Order
} from "@/lib/db"

const ORDER_STATUS = [
  { value: "pending", label: "In attesa", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "confirmed", label: "Confermato", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "completed", label: "Completato", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "cancelled", label: "Annullato", color: "bg-red-100 text-red-800 border-red-200" }
]

type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function OrderManager() {
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Filtra gli ordini in base allo stato
  const filterOrders = useCallback((orderList: Order[], status: string) => {
    if (status === "all") {
      setFilteredOrders(orderList)
    } else {
      setFilteredOrders(orderList.filter(order => order.status === status))
    }
  }, [])
  
  // Carica tutti gli ordini
  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getAllOrders()
      setOrders(data)
      filterOrders(data, statusFilter)
    } catch (error) {
      console.error("Errore nel caricamento degli ordini:", error)
      toast.error("Impossibile caricare gli ordini. Riprova più tardi.")
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, filterOrders])
  
  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])
  
  useEffect(() => {
    filterOrders(orders, statusFilter)
  }, [orders, statusFilter, filterOrders])
  
  // Formatta la data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "dd MMMM yyyy, HH:mm", { locale: it })
    } catch {
      return dateString
    }
  }
  
  // Formatta il prezzo
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(price)
  }
  
  // Ottieni l'etichetta dello stato
  const getStatusLabel = (status: string) => {
    const statusItem = ORDER_STATUS.find(item => item.value === status)
    return statusItem ? statusItem.label : status
  }
  
  // Ottieni la classe di colore per lo stato
  const getStatusColor = (status: string) => {
    const statusItem = ORDER_STATUS.find(item => item.value === status)
    return statusItem ? statusItem.color : "bg-gray-100 text-gray-800 border-gray-200"
  }
  
  // Aggiorna lo stato di un ordine
  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await updateOrderStatus(id, status)
      
      // Aggiorna lo stato locale
      setOrders(prev => 
        prev.map(order => 
          order.id === id ? { ...order, status } : order
        )
      )
      
      if (selectedOrder?.id === id) {
        setSelectedOrder({ ...selectedOrder, status })
      }
      
      toast.success(`Stato dell'ordine aggiornato a "${getStatusLabel(status)}"`)
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error)
      toast.error("Impossibile aggiornare lo stato dell'ordine")
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Controlli */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tutti gli stati" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              {ORDER_STATUS.map(status => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchOrders}
            className="flex items-center gap-1"
            title="Aggiorna"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Aggiorna</span>
          </Button>
        </div>
        
        <div className="text-sm text-gray-500">
          {filteredOrders.length} {filteredOrders.length === 1 ? 'ordine' : 'ordini'} trovati
        </div>
      </div>
      
      {/* Lista ordini */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
            <span className="ml-3">Caricamento ordini...</span>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">
                {statusFilter !== "all" ? "Nessun ordine corrisponde ai criteri di ricerca" : "Nessun ordine trovato"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Ordine</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Totale</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    #{order.id?.substring(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{order.customer.name} {order.customer.surname}</span>
                      <span className="text-xs text-gray-500">{order.customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{formatDate(order.created_at)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsDialogOpen(true)
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      {order.status === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleUpdateStatus(order.id!, "confirmed")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {order.status === "confirmed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-700"
                          onClick={() => handleUpdateStatus(order.id!, "completed")}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {(order.status === "pending" || order.status === "confirmed") && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleUpdateStatus(order.id!, "cancelled")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Dialog per visualizzare i dettagli dell'ordine */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Dettagli Ordine #{selectedOrder.id?.substring(0, 8)}
                </DialogTitle>
                <DialogDescription>
                  Ordine effettuato il {formatDate(selectedOrder.created_at)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-6">
                {/* Informazioni cliente */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Informazioni Cliente
                  </h3>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p><strong>Nome:</strong> {selectedOrder.customer.name} {selectedOrder.customer.surname}</p>
                    <p className="flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3 text-gray-500" />
                      {selectedOrder.customer.phone}
                    </p>
                    {selectedOrder.customer.email && (
                      <p className="flex items-center gap-1 mt-1">
                        <Mail className="h-3 w-3 text-gray-500" />
                        {selectedOrder.customer.email}
                      </p>
                    )}
                    {selectedOrder.customer.notes && (
                      <div className="mt-2 border-t pt-2">
                        <p className="text-sm text-gray-500"><strong>Note:</strong></p>
                        <p className="text-sm">{selectedOrder.customer.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Prodotti ordinati */}
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Prodotti Ordinati
                  </h3>
                  
                  <div className="bg-gray-50 p-3 rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Prodotto</TableHead>
                          <TableHead className="text-right">Qtà</TableHead>
                          <TableHead className="text-right">Prezzo</TableHead>
                          <TableHead className="text-right">Totale</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product_name}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                            <TableCell className="text-right">
                              {formatPrice(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t font-medium">
                      <span>Totale Ordine</span>
                      <span className="text-lg">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Stato ordine */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Stato Ordine</h3>
                  
                  <Select 
                    value={selectedOrder.status} 
                    onValueChange={(value) => handleUpdateStatus(selectedOrder.id!, value as OrderStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Chiudi
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}