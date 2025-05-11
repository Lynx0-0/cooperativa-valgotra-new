"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock } from "lucide-react"
import { supabase } from '@/lib/supabase'
import { verifyPassword } from '@/lib/password-utils'

// Credenziali temporanee (in un'implementazione reale si userebbero quelle del database)
//const ADMIN_USERNAME = "admin"
//const ADMIN_PASSWORD = "valgotra2025"

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    
    try {
      // Recupera l'utente dal database
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('active', true)
        .single()
      
      if (error || !data) {
        setError("Credenziali non valide")
        setIsLoading(false)
        return
      }
      
      // Verifica la password
      const isValid = await verifyPassword(password, data.password_hash)
      
      if (isValid) {
        // Aggiorna il timestamp dell'ultimo login
        await supabase
          .from('admin_users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', data.id)
        
        // Salva l'ID dell'utente autenticato
        localStorage.setItem("admin_id", data.id)
        localStorage.setItem("admin_authenticated", "true")
        
        toast.success("Login effettuato con successo")
        router.push("/admin/dashboard")
      } else {
        setError("Credenziali non valide")
        setIsLoading(false)
      }
    } catch (error) {
      console.error("Errore durante il login:", error)
      setError("Si è verificato un errore durante il login")
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Area Amministrativa</CardTitle>
            <CardDescription>
              Inserisci le tue credenziali per accedere all'area amministrativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-800 text-sm p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-green-700 hover:bg-green-800"
                disabled={isLoading}
              >
                {isLoading ? "Autenticazione..." : "Accedi"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center text-sm text-gray-600">
            Area riservata agli amministratori di Cooperativa Valgotra
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}