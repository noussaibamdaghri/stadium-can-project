// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">🏟️ Système CAN</h1>
        <p className="text-gray-600 mb-8">Gestion du trafic et des parkings en temps réel</p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/supporter" 
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            👨‍💼 Espace Supporters
          </Link>
          <Link 
            href="/admin" 
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            🔧 Espace Administrateur
          </Link>
        </div>
      </div>
    </div>
  )
}
