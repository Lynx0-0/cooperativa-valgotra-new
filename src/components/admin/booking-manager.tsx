"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
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
import { toast } from "sonner"
import { format, isToday, isAfter, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  MessageSquare,
  Check,
  X,
  CalendarDays,
  ArrowUpDown,
  RefreshCw
} from "lucide-react"
import {
  getAllBookings,
  updateBookingStatus,
  CallBooking
} from "@/lib/db"

const BOOKING_STATUS = [
  { value: "pending", label: "In attesa", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "confirmed", label: "Confermata", color: "bg-green-100 text-green-800 border-green-200" },
  { value: "completed", label: "Completata", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "cancelled", label: "Annullata", color: "bg-red-100 text-red-800 border-red-200" }
]

// Tipo per gli stati di prenotazione validi
type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export default function BookingManager() {
  const [bookings, setBookings] = useState<CallBooking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<CallBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<CallBooking | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  
  // Carica le prenotazioni
  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const data = await getAllBookings()
      setBookings(data)
      filterBookings(data, statusFilter)
    } catch (error) {
      console.error("Errore nel caricamento delle prenotazioni:", error)
      toast.error("Impossibile caricare le prenotazioni")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchBookings()
  }, [])
  
  // Filtra le prenotazioni
  const filterBookings = (
    bookingList: CallBooking[], 
    statusFilterValue: string
  ) => {
    let filtered = [...bookingList] // Crea una copia per non mutare l'originale
    
    // Applica filtro per stato
    if (statusFilterValue !== "all") {
      filtered = filtered.filter(booking => booking.status === statusFilterValue)
    }
    
    // Applica ordinamento
    filtered.sort((a, b) => {
      try {
        const dateA = new Date(`${a.date}T${a.time_slot.split(' - ')[0]}`)
        const dateB = new Date(`${b.date}T${b.time_slot.split(' - ')[0]}`)
        
        return sortDirection === "asc" 
          ? dateA.getTime() - dateB.getTime() 
          : dateB.getTime() - dateA.getTime()
      } catch {
        return 0
      }
    })
    
    setFilteredBookings(filtered)
  }
  
  useEffect(() => {
    filterBookings(bookings, statusFilter)
  }, [bookings, statusFilter, sortDirection])
  
  // Aggiorna lo stato di una prenotazione
  const handleUpdateStatus = async (id: string, status: BookingStatus) => {
    try {
      await updateBookingStatus(id, status)
      
      // Aggiorna lo stato locale
      setBookings(prev => 
        prev.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      )
      
      if (selectedBooking?.id === id) {
        setSelectedBooking({ ...selectedBooking, status })
      }
      
      toast.success(`Stato della prenotazione aggiornato a "${getStatusLabel(status)}"`)
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato:", error)
      toast.error("Impossibile aggiornare lo stato della prenotazione")
    }
  }
  
  // Ottieni l'etichetta dello stato
  const getStatusLabel = (status: string) => {
    const statusItem = BOOKING_STATUS.find(item => item.value === status)
    return statusItem ? statusItem.label : status
  }
  
  // Ottieni la classe di colore per lo stato
  const getStatusColor = (status: string) => {
    const statusItem = BOOKING_STATUS.find(item => item.value === status)
    return statusItem ? statusItem.color : "bg-gray-100 text-gray-800 border-gray-200"
  }
  
  // Formatta la data
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return format(date, "dd MMMM yyyy", { locale: it })
    } catch {
      return dateString
    }
  }
  
  // Verifica se una prenotazione è per oggi
  const isBookingToday = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return isToday(date)
    } catch {
      return false
    }
  }
  
  // Verifica se una prenotazione è futura
  const isBookingFuture = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      return isAfter(date, new Date())
    } catch {
      return false
    }
  }
  
  // Cambia la direzione di ordinamento
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc")
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
              {BOOKING_STATUS.map(status => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchBookings}
            className="flex items-center gap-1"
            title="Aggiorna"
          >
            <RefreshCw size={16} />
            <span className="hidden md:inline">Aggiorna</span>
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortDirection}
          className="flex items-center gap-1"
        >
          <ArrowUpDown size={14} />
          <span>Ordina {sortDirection === "asc" ? "crescente" : "decrescente"}</span>
        </Button>
      </div>
      
      {/* Lista prenotazioni */}
      <div>
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
            <span className="ml-3">Caricamento prenotazioni...</span>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarDays className="mx-auto h-12 w-12 text-gray-300" />
              <p className="mt-2 text-gray-500">
                {statusFilter !== "all" ? "Nessuna prenotazione corrisponde ai criteri di ricerca" : "Nessuna prenotazione trovata"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data e Ora</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Contatti</TableHead>
                <TableHead className="text-right">Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id} className={isBookingToday(booking.date) ? "bg-yellow-50" : ""}>
                  <TableCell className="font-medium">
                    {booking.name} {booking.surname}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <div>{formatDate(booking.date)}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {booking.time_slot}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status || "pending")}>
                      {getStatusLabel(booking.status || "pending")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-gray-400" />
                        {booking.phone}
                      </div>
                      {booking.email && (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          {booking.email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedBooking(booking)
                          setIsDialogOpen(true)
                        }}
                      >
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {isBookingFuture(booking.date) && (
                        <Button
                          variant={booking.status === "confirmed" ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleUpdateStatus(booking.id!, booking.status === "confirmed" ? "pending" : "confirmed")}
                          className={booking.status === "confirmed" ? "" : "bg-green-700 hover:bg-green-800"}
                        >
                          {booking.status === "confirmed" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
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
      
      {/* Dialog per visualizzare dettagli */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Dettagli Prenotazione</DialogTitle>
                <DialogDescription>
                  Prenotazione di {selectedBooking.name} {selectedBooking.surname} per il giorno {formatDate(selectedBooking.date)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Contatto</h4>
                      <p className="text-sm text-gray-600">{selectedBooking.name} {selectedBooking.surname}</p>
                      <p className="text-sm text-gray-600">
                        Tel: {selectedBooking.phone}
                        {selectedBooking.email && <><br />Email: {selectedBooking.email}</>}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Appuntamento</h4>
                      <p className="text-sm text-gray-600">
                        {formatDate(selectedBooking.date)}<br />
                        Orario: {selectedBooking.time_slot}
                      </p>
                    </div>
                  </div>
                  
                  {selectedBooking.notes && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Note</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedBooking.notes}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start gap-2">
                    <div className="h-5 w-5 flex justify-center items-center mt-0.5">
                      <div className={`h-3 w-3 rounded-full ${
                        selectedBooking.status === "confirmed" ? "bg-green-500" :
                        selectedBooking.status === "completed" ? "bg-blue-500" :
                        selectedBooking.status === "cancelled" ? "bg-red-500" :
                        "bg-yellow-500"
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="font-medium">Stato</h4>
                      <div className="mt-1">
                        <Select 
                          value={selectedBooking.status || "pending"} 
                          onValueChange={(value) => handleUpdateStatus(selectedBooking.id!, value as BookingStatus)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleziona stato" />
                          </SelectTrigger>
                          <SelectContent>
                            {BOOKING_STATUS.map(status => (
                              <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
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