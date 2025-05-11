"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { 
  CalendarIcon, 
  MessageSquare, 
  Package, 
  Briefcase, 
  LogOut,
  ShoppingCart 
} from "lucide-react"

import BookingManager from "@/components/admin/booking-manager"
import MessageManager from "@/components/admin/message-manager"
import ProductManager from "@/components/admin/product-manager"
import ProjectManager from "@/components/admin/project-manager"
import OrderManager from "@/components/admin/order-manager"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Verifica l'autenticazione
    const checkAuth = () => {
      console.log("Verifica autenticazione...");
      const authStatus = localStorage.getItem("admin_authenticated");
      console.log("Stato auth:", authStatus);
      const isAuth = authStatus === "true";
      setIsAuthenticated(isAuth);
      setIsLoading(false);
      
      if (!isAuth) {
        console.log("Non autenticato, reindirizzamento...");
        router.push("/admin/login");
      } else {
        console.log("Autenticato correttamente");
      }
    }
    
    checkAuth();
  }, [router]);
  
  const handleLogout = () => {
    localStorage.removeItem("admin_authenticated")
    toast.success("Logout effettuato con successo")
    router.push("/admin/login")
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Caricamento...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return null // Sarà reindirizzato nel useEffect
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-green-700">Amministrazione Cooperativa Valgotra</h1>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="container py-8">
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarIcon size={16} />
              <span>Prenotazioni</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Messaggi</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>Ordini</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package size={16} />
              <span>Prodotti</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Portfolio</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Prenotazioni Chiamate</CardTitle>
                <CardDescription>
                  Visualizza e gestisci le prenotazioni delle chiamate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BookingManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Messaggi</CardTitle>
                <CardDescription>
                  Visualizza e gestisci i messaggi di contatto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MessageManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Ordini</CardTitle>
                <CardDescription>
                  Visualizza e gestisci gli ordini del negozio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OrderManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Prodotti</CardTitle>
                <CardDescription>
                  Aggiungi, modifica o rimuovi prodotti dal negozio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductManager />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestione Portfolio</CardTitle>
                <CardDescription>
                  Aggiungi, modifica o rimuovi i lavori completati
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProjectManager />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="container text-center text-sm text-gray-600">
          &copy; 2025 Cooperativa Valgotra - Area Amministrativa
        </div>
      </footer>
    </div>
  )
}