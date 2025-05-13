"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail, CheckCircle2, SendIcon } from "lucide-react"
import { toast } from "sonner"
import { saveContactMessage } from "@/lib/db"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    privacy: false
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, privacy: checked }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.privacy) {
      toast.error("Devi accettare la Privacy Policy per inviare il messaggio")
      return
    }
    
    try {
      setIsSubmitting(true)
      
      // Prepara i dati per il salvataggio - con tipi compatibili
      const messageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined, // Usa undefined invece di null
        subject: formData.subject || undefined, // Usa undefined invece di null
        message: formData.message,
        read: false,
        archived: false,
        created_at: new Date().toISOString()
      }
      
      // Salva il messaggio nel database
      await saveContactMessage(messageData)
      
      // Mostra messaggio di successo
      setSubmitSuccess(true)
      
      // Reset del form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        privacy: false
      })
      
      // Mostra toast di conferma
      toast.success("Messaggio inviato con successo!")
      
      // Dopo 8 secondi nascondi il messaggio di successo
      setTimeout(() => {
        setSubmitSuccess(false)
      }, 8000)
      
    } catch (error) {
      console.error("Errore nell'invio del messaggio:", error)
      toast.error("Si è verificato un errore nell'invio del messaggio. Riprova più tardi.")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Se il messaggio è stato inviato con successo, mostra il componente di successo
  if (submitSuccess) {
    return (
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <Card className="p-8 md:p-12 shadow-xl text-center">
              <div className="mx-auto w-20 h-20 flex items-center justify-center bg-green-100 text-green-700 rounded-full mb-6">
                <CheckCircle2 size={40} />
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Messaggio Inviato con Successo!</h2>
              
              <p className="text-gray-600 text-lg mb-6">
                Grazie per averci contattato. Il tuo messaggio è stato ricevuto correttamente.
                <br />
                Ti risponderemo al più presto all&apos;indirizzo email che hai fornito.
              </p>
              
              <Alert className="bg-green-50 border-green-200 mb-8">
                <CheckCircle2 className="h-5 w-5 text-green-700" />
                <AlertTitle className="text-green-700">Conferma invio</AlertTitle>
                <AlertDescription className="text-green-700">
                  Il tuo messaggio è stato consegnato ed è già in coda per essere elaborato dal nostro team.
                </AlertDescription>
              </Alert>
              
              <div className="flex flex-col md:flex-row justify-center gap-4">
                <Button 
                  onClick={() => setSubmitSuccess(false)} 
                  className="bg-green-700 hover:bg-green-800"
                >
                  Invia un altro messaggio
                </Button>
                
                <Button asChild variant="outline">
                  <a href="/">Torna alla homepage</a>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    )
  }
  
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Contattaci</h2>
        <div className="h-1 w-16 bg-yellow-400 mx-auto mb-12"></div>
        
        <div className="max-w-5xl mx-auto">
          {/* Info cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-full mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Indirizzo</h3>
              <p className="text-gray-600">
                LOCALITA&apos; BRAIOLE 46 - 43051 - ALBARETO (PR) <br />
                Valgotra, Italia
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-full mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Telefono</h3>
              <p className="text-gray-600">
                +39 3282705422<br />
                Lun-Sab: 8:00-18:00
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="mx-auto w-12 h-12 flex items-center justify-center bg-green-100 text-green-700 rounded-full mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email</h3>
              <p className="text-gray-600">
                coperativavalgotra54@gmail.com
              </p>
            </Card>
          </div>
          
          {/* Form */}
          <Card className="p-8 shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome e Cognome</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Oggetto</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-6">
                <Label htmlFor="message">Messaggio</Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox 
                  id="privacy" 
                  checked={formData.privacy} 
                  onCheckedChange={handleCheckboxChange} 
                  required 
                  disabled={isSubmitting}
                />
                <Label htmlFor="privacy" className="text-sm">
                  Ho letto e accetto la <a href="/privacy" className="text-green-700 hover:underline">Privacy Policy</a>
                </Label>
              </div>
              
              <div className="text-center">
                <Button 
                  type="submit" 
                  className="bg-green-700 hover:bg-green-800 px-8 py-6 text-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></div>
                      Invio in corso...
                    </>
                  ) : (
                    <>
                      <SendIcon className="mr-2 h-5 w-5" />
                      Invia Messaggio
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </section>
  )
}