import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Cta() {
  return (
    <section className="py-12 md:py-16 bg-green-700 text-white">
      <div className="container text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Prenota una chiamata con un nostro esperto
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
          Hai bisogno di maggiori informazioni o vuoi discutere di un progetto 
          specifico? Prenota una chiamata con uno dei nostri esperti.
        </p>
        <Button asChild variant="outline" className="bg-white text-green-700 hover:bg-gray-100 border-white px-8 py-6 text-lg">
          <Link href="/prenota-chiamata">Prenota Ora</Link>
        </Button>
      </div>
    </section>
  )
}