import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h5 className="font-bold text-xl mb-4">Cooperativa Valgotra</h5>
            <p className="text-gray-300 mb-4">
              Dal 1974 serviamo la comunità con passione e rispetto per l'ambiente.
            </p>
          </div>
          
          <div>
            <h5 className="font-bold uppercase mb-4">Collegamenti Rapidi</h5>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/servizi" className="text-gray-300 hover:text-white">Servizi</Link></li>
              <li><Link href="/negozio" className="text-gray-300 hover:text-white">Negozio</Link></li>
              <li><Link href="/contatti" className="text-gray-300 hover:text-white">Contatti</Link></li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-bold uppercase mb-4">Contatti</h5>
            <address className="text-gray-300 not-italic">
              <p>LOCALITA' BRAIOLE 46 - 43051 - ALBARETO (PR) </p>
              <p>Valgotra, Italia</p>
              <p>Tel: +39 3282705422</p>
              <p>Email: coperativavalgotra54@gmail.com</p>
            </address>
          </div>
          
          <div>
            <h5 className="font-bold uppercase mb-4">Area Riservata</h5>
            <Link href="/admin/login" className="bg-transparent border border-white text-white hover:bg-white hover:text-gray-800 px-4 py-2 rounded">
              Admin Login
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Cooperativa Valgotra. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}