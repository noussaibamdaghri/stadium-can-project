// app/page.tsx
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col">
      {/* Navigation Header */}
      <nav className="w-full p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🏟️</span>
          </div>
          <span className="text-white text-xl font-bold">CAN 2025</span>
        </div>
        <div className="text-white/80 text-sm">
          Système Intelligent
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          {/* Animated Stadium Icon */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-pulse">
                <span className="text-4xl">⚽</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Guide Intelligent
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-300">
              CAN 2025
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Système de gestion du trafic et des parkings en temps réel. 
            Optimisez votre expérience grâce à l'analyse intelligente des données.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-green-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Parkings Temps Réel</h3>
              <p className="text-gray-400 text-sm">Occupation en direct et recommandations</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-blue-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🚦</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Analyse Trafic</h3>
              <p className="text-gray-400 text-sm">Données trafic et prédictions intelligentes</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-400/50 transition-all duration-300">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Multi-Cloud</h3>
              <p className="text-gray-400 text-sm">Architecture cloud moderne et scalable</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/supporter" 
              className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 transform hover:scale-105 flex items-center space-x-3 min-w-[200px] justify-center"
            >
              <span className="text-xl">👨‍💼</span>
              <span>Espace Supporters</span>
              <div className="absolute -inset-1 rounded-2xl bg-green-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>

            <Link 
              href="/admin" 
              className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-105 flex items-center space-x-3 min-w-[200px] justify-center"
            >
              <span className="text-xl">🔧</span>
              <span>Espace Administrateur</span>
              <div className="absolute -inset-1 rounded-2xl bg-blue-400/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 pt-8 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white">3+</div>
                <div className="text-gray-400 text-sm">Parkings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-gray-400 text-sm">Surveillance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">99%</div>
                <div className="text-gray-400 text-sm">Précision</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">⚡</div>
                <div className="text-gray-400 text-sm">Temps Réel</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full p-6 text-center border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Système CAN 2025 • Architecture Multi-Cloud • 
          <span className="text-green-400 ml-1">🟢 En ligne</span>
        </p>
      </footer>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-10 w-4 h-4 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-6 h-6 bg-green-400 rounded-full opacity-30 animate-pulse delay-75"></div>
      <div className="absolute bottom-1/4 left-20 w-3 h-3 bg-purple-400 rounded-full opacity-40 animate-pulse delay-150"></div>
      <div className="absolute bottom-1/3 right-10 w-5 h-5 bg-yellow-400 rounded-full opacity-25 animate-pulse delay-300"></div>
    </div>
  )
}
