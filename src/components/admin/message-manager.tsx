"use client"

import { useState, useEffect } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"
import { it } from "date-fns/locale"
import {
  Inbox,
  Archive,
  Search,
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  CheckCircle2,
  X
} from "lucide-react"
import {
  getAllContactMessages,
  markMessageAsRead,
  archiveMessage,
  ContactMessage
} from "@/lib/db"

export default function MessageManager() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([])
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"inbox" | "archived">("inbox")
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Carica i messaggi
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const data = await getAllContactMessages()
      setMessages(data)
      filterMessages(data, viewMode, searchTerm)
    } catch (error) {
      console.error("Errore nel caricamento dei messaggi:", error)
      toast.error("Impossibile caricare i messaggi")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchMessages()
  }, [])
  
  // Filtra i messaggi in base alla modalità di visualizzazione e al termine di ricerca
  const filterMessages = (
    messageList: ContactMessage[], 
    mode: "inbox" | "archived", 
    term: string
  ) => {
    let filtered = messageList.filter(message => 
      mode === "inbox" ? !message.archived : message.archived
    )
    
    if (term) {
      const termLower = term.toLowerCase()
      filtered = filtered.filter(message =>
        message.name.toLowerCase().includes(termLower) ||
        message.email.toLowerCase().includes(termLower) ||
        (message.subject && message.subject.toLowerCase().includes(termLower)) ||
        message.message.toLowerCase().includes(termLower)
      )
    }
    
    setFilteredMessages(filtered)
  }
  
  useEffect(() => {
    filterMessages(messages, viewMode, searchTerm)
  }, [messages, viewMode, searchTerm])
  
  // Marca un messaggio come letto/non letto
  const handleToggleRead = async (id: string, currentRead: boolean = false) => {
    try {
      await markMessageAsRead(id, !currentRead)
      
      // Aggiorna lo stato locale
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, read: !currentRead } : message
        )
      )
      
      toast.success(currentRead ? "Messaggio marcato come non letto" : "Messaggio marcato come letto")
    } catch (error) {
      console.error("Errore nell'aggiornamento dello stato di lettura:", error)
      toast.error("Impossibile aggiornare lo stato del messaggio")
    }
  }
  
  // Archivia/Ripristina un messaggio
  const handleToggleArchive = async (id: string, currentArchived: boolean = false) => {
    try {
      await archiveMessage(id, !currentArchived)
      
      // Aggiorna lo stato locale
      setMessages(prev => 
        prev.map(message => 
          message.id === id ? { ...message, archived: !currentArchived } : message
        )
      )
      
      if (selectedMessage?.id === id) {
        setSelectedMessage(null)
        setIsDialogOpen(false)
      }
      
      toast.success(currentArchived ? "Messaggio ripristinato" : "Messaggio archiviato")
    } catch (error) {
      console.error("Errore nell'archiviazione del messaggio:", error)
      toast.error("Impossibile archiviare/ripristinare il messaggio")
    }
  }
  
  // Gestisci la selezione multipla
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredMessages.map(message => message.id!))
    } else {
      setSelectedIds([])
    }
  }
  
  const handleSelectMessage = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(itemId => itemId !== id))
    }
  }
  
  const handleBulkMarkAsRead = async () => {
    try {
      // In un'applicazione reale, sarebbe meglio fare una sola chiamata API per tutti gli ID
      for (const id of selectedIds) {
        await markMessageAsRead(id, true)
      }
      
      // Aggiorna lo stato locale
      setMessages(prev => 
        prev.map(message => 
          selectedIds.includes(message.id!) ? { ...message, read: true } : message
        )
      )
      
      setSelectedIds([])
      toast.success("Messaggi selezionati marcati come letti")
    } catch (error) {
      console.error("Errore nell'aggiornamento dei messaggi:", error)
      toast.error("Impossibile aggiornare i messaggi")
    }
  }
  
  const handleBulkArchive = async () => {
    try {
      // In un'applicazione reale, sarebbe meglio fare una sola chiamata API per tutti gli ID
      for (const id of selectedIds) {
        await archiveMessage(id, true)
      }
      
      // Aggiorna lo stato locale
      setMessages(prev => 
        prev.map(message => 
          selectedIds.includes(message.id!) ? { ...message, archived: true } : message
        )
      )
      
      setSelectedIds([])
      toast.success("Messaggi selezionati archiviati")
    } catch (error) {
      console.error("Errore nell'archiviazione dei messaggi:", error)
      toast.error("Impossibile archiviare i messaggi")
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Controlli */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Tabs 
          defaultValue="inbox" 
          onValueChange={(v) => setViewMode(v as "inbox" | "archived")}
          className="w-full md:w-auto"
        >
          <TabsList>
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Inbox size={16} />
              <span>Inbox</span>
            </TabsTrigger>
            <TabsTrigger value="archived" className="flex items-center gap-2">
              <Archive size={16} />
              <span>Archiviati</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Cerca messaggi..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Button
            variant="outline"
            size="icon"
            onClick={fetchMessages}
            title="Aggiorna"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>
      
      {/* Azioni sui messaggi selezionati */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md border">
          <div className="text-sm">
            {selectedIds.length} messaggi selezionati
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleBulkMarkAsRead}
            >
              <MailOpen size={14} />
              <span>Segna come letti</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={handleBulkArchive}
            >
              <Archive size={14} />
              <span>Archivia</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setSelectedIds([])}
            >
              <X size={14} />
              <span>Annulla</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Lista messaggi */}
      <div className="border rounded-md overflow-hidden">
        <div className="p-2 bg-gray-50 border-b flex items-center gap-3">
          <Checkbox
            id="select-all"
            checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
            onCheckedChange={handleSelectAll}
            disabled={filteredMessages.length === 0}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Seleziona tutti
          </label>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700"></div>
            <span className="ml-3">Caricamento messaggi...</span>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Mail className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2">Nessun messaggio trovato</p>
          </div>
        ) : (
          <div>
            {filteredMessages.map((message) => (
              <div 
                key={message.id}
                className={`border-b last:border-0 p-3 cursor-pointer transition-colors hover:bg-gray-50 ${!message.read ? 'bg-blue-50' : ''}`}
                onClick={() => {
                  setSelectedMessage(message)
                  setIsDialogOpen(true)
                  if (!message.read) {
                    handleToggleRead(message.id!, false)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(message.id!)}
                    onCheckedChange={(checked) => {
                      // Previene l'apertura del messaggio quando si clicca sulla checkbox
                      message.id && handleSelectMessage(message.id, checked as boolean)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-medium flex items-center gap-2">
                        {!message.read && (
                          <Badge className="bg-blue-500 h-2 w-2 p-0 rounded-full" />
                        )}
                        {message.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {message.created_at ? format(parseISO(message.created_at), "dd/MM/yyyy HH:mm") : ""}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {message.subject ? (
                        <span className="font-medium">{message.subject}</span>
                      ) : (
                        <span className="italic">Nessun oggetto</span>
                      )}
                      {" - "}
                      <span className="truncate">{message.message.slice(0, 100)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Dialog per visualizzare un messaggio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject || "Nessun oggetto"}</DialogTitle>
                <DialogDescription>
                  Da: {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                  {selectedMessage.created_at && (
                    <> - {format(parseISO(selectedMessage.created_at), "dd MMMM yyyy HH:mm", { locale: it })}</>
                  )}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
                
                {selectedMessage.phone && (
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">Telefono: </span>
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
              </div>
              
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleToggleRead(selectedMessage.id!, Boolean(selectedMessage.read))}
                >
                  {selectedMessage.read ? (
                    <>
                      <Mail size={16} />
                      <span>Segna come non letto</span>
                    </>
                  ) : (
                    <>
                      <MailOpen size={16} />
                      <span>Segna come letto</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleToggleArchive(selectedMessage.id!, Boolean(selectedMessage.archived))}
                >
                  {selectedMessage.archived ? (
                    <>
                      <Inbox size={16} />
                      <span>Ripristina dall&apos;archivio</span>
                    </>
                  ) : (
                    <>
                      <Archive size={16} />
                      <span>Archivia</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
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