"use client"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between py-4">
        <Link href="/" className="flex items-center">
          <div className="flex items-center">
            <div 
              className="h-10 w-10 bg-contain bg-no-repeat bg-center mr-3"
              style={{ backgroundImage: "url('/images/logo.png')" }}
            ></div>
            <span className="text-green-700 font-bold">Coop. Valgotra</span>
          </div>
        </Link>
        
        {/* Menu per dispositivi mobili */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
        
        {/* Menu per desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/" className="text-gray-700 hover:text-green-700 font-medium">
            Home
          </Link>
          <Link href="/servizi" className="text-gray-700 hover:text-green-700 font-medium">
            Servizi
          </Link>
          <Link href="/progetti" className="text-gray-700 hover:text-green-700 font-medium">
            Lavori
          </Link>
          <Link href="/negozio" className="text-gray-700 hover:text-green-700 font-medium">
            Negozio
          </Link>
          <Button asChild className="bg-green-700 hover:bg-green-800">
            <Link href="/prenota-chiamata">Prenota Chiamata</Link>
          </Button>
        </div>
        
        {/* Menu mobile aperto */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white shadow-md md:hidden z-50">
            <div className="flex flex-col p-4 space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-700 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/servizi"
                className="text-gray-700 hover:text-green-700 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Servizi
              </Link>
              <Link
                href="/progetti"
                className="text-gray-700 hover:text-green-700 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Lavori
              </Link>
              <Link
                href="/negozio"
                className="text-gray-700 hover:text-green-700 font-medium py-2"
                onClick={() => setIsOpen(false)}
              >
                Negozio
              </Link>
              <Button asChild className="bg-green-700 hover:bg-green-800 w-full">
                <Link
                  href="/prenota-chiamata"
                  onClick={() => setIsOpen(false)}
                >
                  Prenota Chiamata
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}