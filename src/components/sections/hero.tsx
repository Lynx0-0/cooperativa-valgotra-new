import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative py-24 md:py-32">
      {/* Overlay con immagine di background */}
      <div 
        className="absolute inset-0 bg-black/50 z-0"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay"
        }}
      />
      
      <div className="container relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
          Benvenuti alla Cooperativa Valgotra
        </h1>
        <p className="text-lg md:text-xl text-white max-w-3xl mx-auto mb-8">
          Dal 1974 serviamo la comunità con passione, innovazione e rispetto per l&apos;ambiente.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="bg-green-700 hover:bg-green-800 text-white text-lg py-6 px-8">
            <Link href="/servizi">I Nostri Servizi</Link>
          </Button>
          <Button asChild variant="outline" className="text-black border-white hover:bg-white/50 text-lg py-6 px-8">
            <Link href="/prenota-chiamata">Contattaci</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}