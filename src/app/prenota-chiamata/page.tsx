"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner" // Importa toast da sonner invece che da shadcn/ui
import { Loader2 } from "lucide-react"
import { saveCallBooking, getBookedTimeSlots } from "@/lib/db"
import { format, isToday, addDays, isBefore } from "date-fns"
import { it } from "date-fns/locale"

// Fasce orarie disponibili
const TIME_SLOTS = [
  "09:00 - 10:00",
  "10:00 - 11:00",
  "11:00 - 12:00",
  "14:00 - 15:00",
  "15:00 - 16:00",
  "16:00 - 17:00",
]

export default function PrenotaChiamataPage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [timeSlot, setTimeSlot] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    phone: "",
    email: "",
    notes: ""
  })

  // Funzione per verificare se una data è disabilitata (weekend o passata)
  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Disabilita date passate e weekend
    const day = date.getDay()
    return isBefore(date, today) || day === 0 || day === 6
  }

  // Carica gli slot orari occupati quando viene selezionata una data
  const handleDateSelect = async (selectedDate: Date | undefined) => {
    // Se la data è undefined, esci dalla funzione
    if (!selectedDate) return
    
    setDate(selectedDate)
    
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      const bookedTimeSlots = await getBookedTimeSlots(formattedDate)
      setBookedSlots(bookedTimeSlots)
      setIsDialogOpen(true)
    } catch (error) {
      console.error("Errore nel caricamento degli slot orari:", error)
      toast.error("Impossibile caricare gli slot orari disponibili. Riprova più tardi.")
    }
  }

  // Gestisce il cambio nei campi del form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Gestisce l'invio della prenotazione
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date || !timeSlot) {
      toast.error("Seleziona una data e una fascia oraria")
      return
    }
    
    setIsLoading(true)
    
    try {
      const booking = {
        ...formData,
        date: format(date, "yyyy-MM-dd"),
        time_slot: timeSlot,
      }
      
      await saveCallBooking(booking)
      
      setIsLoading(false)
      setIsDialogOpen(false)
      
      toast.success(
        `Prenotazione completata! La tua chiamata è stata prenotata per il ${format(date, "dd MMMM yyyy", { locale: it })} dalle ${timeSlot}.`
      )
      
      // Reset del form
      setDate(undefined)
      setTimeSlot("")
      setFormData({
        name: "",
        surname: "",
        phone: "",
        email: "",
        notes: ""
      })
      
    } catch (error) {
      setIsLoading(false)
      console.error("Errore nella prenotazione:", error)
      toast.error("Impossibile completare la prenotazione. Riprova più tardi.")
    }
  }

  // Resto del componente...

  return (
    <>
      <section className="bg-green-700 text-white py-16">
        <div className="container">
          <h1 className="text-3xl md:text-5xl font-bold text-center">Prenota la tua chiamata</h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-center mt-4">
            Seleziona una data nel calendario per prenotare una chiamata con un nostro esperto.
            Ti ricontatteremo nella fascia oraria che preferisci.
          </p>
        </div>
      </section>
      
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="bg-white p-4 md:p-8 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-8">
              {/* Calendario */}
              <div className="md:col-span-7 lg:col-span-4 xl:col-span-5">
                <h2 className="text-2xl font-bold mb-6">Seleziona una data</h2>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    className="rounded-md border shadow p-4"
                    locale={it}
                  />
                </div>
              </div>
              
              {/* Informazioni */}
              <div className="md:col-span-7 lg:col-span-3 xl:col-span-2">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Informazioni utili</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-700 rounded-full p-1 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span>Le chiamate sono disponibili dal lunedì al sabato</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-700 rounded-full p-1 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span>La chiamata sara effettuata da un nostro esperto</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-700 rounded-full p-1 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span>Offriamo la massima disponibilita</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-100 text-green-700 rounded-full p-1 mr-2 flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </span>
                      <span>In caso di imprevisti, puoi prenotare una nuova chiamata</span>
                    </li>
                  </ul>
                  
                  <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                    <p className="text-amber-800 text-sm">
                      <strong>Nota:</strong> Seleziona una data nel calendario per visualizzare le fasce orarie disponibili e compilare il modulo di prenotazione.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Dialog per la selezione dell'orario e i dati personali */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Completa la tua prenotazione</DialogTitle>
            <DialogDescription>
              {date && (
                <span>
                  Hai selezionato il giorno {format(date, "dd MMMM yyyy", { locale: it })}.
                  Inserisci i tuoi dati e scegli una fascia oraria.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
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
                  value={formData.surname}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email (facoltativa)</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <Label>Fascia oraria preferita *</Label>
                <p className="text-sm text-gray-500 mb-2">Scegli un orario per la chiamata</p>
              </div>
              
              <RadioGroup value={timeSlot} onValueChange={setTimeSlot} className="grid grid-cols-2 sm:grid-cols-3 gap-2">
  {TIME_SLOTS.map((slot) => {
    const isBooked = bookedSlots.includes(slot);
    return (
      <div key={slot} className="relative">
        <RadioGroupItem
          value={slot}
          id={`slot-${slot}`}
          disabled={isBooked}
          className="peer sr-only"
        />
        <Label
          htmlFor={`slot-${slot}`}
          className={`flex py-2 px-3 justify-center items-center rounded-md text-sm border ${
            isBooked
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              : timeSlot === slot
                ? "border-green-700 bg-green-50 text-green-700 font-bold ring-2 ring-green-700"
                : "border-gray-200 hover:bg-gray-100 peer-checked:border-green-700 peer-checked:bg-green-50 peer-checked:text-green-700 cursor-pointer"
          }`}
        >
          {slot}
          {isBooked && <span className="ml-1 text-xs">(occupato)</span>}
        </Label>
      </div>
    );
  })}
</RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Note (facoltative)</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Aggiungi informazioni aggiuntive se necessario"
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={!timeSlot || isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Prenotazione in corso...
                  </>
                ) : (
                  "Conferma prenotazione"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}