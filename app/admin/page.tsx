// app/admin/page.tsx
'use client'

import { useState, useRef } from 'react'
import { getParkingLots, updateParkingOccupancy, ParkingLot } from '../../services/parkingService'
import { uploadTrafficCSV } from '../../services/trafficUploadService'

export default function AdminPage() {
  const [parkings, setParkings] = useState<ParkingLot[]>([])
  const [uploading, setUploading] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [uploadResult, setUploadResult] = useState<{success: boolean; message: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadParkings = async () => {
    try {
      const data = await getParkingLots()
      setParkings(data)
    } catch (error) {
      console.error('Error loading parkings:', error)
      alert('Erreur lors du chargement des parkings')
    }
  }

  // Charger les parkings au montage
  useState(() => {
    loadParkings()
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérifier que c'est un CSV
    if (!file.name.toLowerCase().endsWith('.csv')) {
      alert('Veuillez sélectionner un fichier CSV')
      return
    }

    setUploading(true)
    setUploadResult(null)

    try {
      const result = await uploadTrafficCSV(file)
      setUploadResult(result)
      
      if (result.success) {
        // Recharger les données trafic après upload réussi
        setTimeout(() => {
          // Ici vous pourriez recharger les données trafic
          console.log('CSV uploadé avec succès, données mises à jour')
        }, 1000)
      }
    } catch (error) {
      setUploadResult({
        success: false,
        message: 'Erreur technique lors de l\'upload'
      })
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const simulateCarEvent = async (lotId: number, delta: number) => {
    setSimulating(true)
    try {
      await updateParkingOccupancy(lotId, delta)
      await loadParkings()
      alert(`Parking mis à jour: ${delta > 0 ? 'Entrée' : 'Sortie'} de véhicule`)
    } catch (error) {
      alert('Erreur lors de la simulation')
    } finally {
      setSimulating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🔧 Administration CAN</h1>
        <p className="text-gray-600 mb-8">Interface de gestion du stade</p>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">📊 Upload des Données Trafic</h2>
          
          {/* Résultat de l'upload */}
          {uploadResult && (
            <div className={`mb-4 p-4 rounded-lg ${
              uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <p className={uploadResult.success ? 'text-green-800' : 'text-red-800'}>
                {uploadResult.message}
              </p>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Déposez votre fichier CSV de trafic ici</p>
            <p className="text-sm text-gray-500 mb-4">
              Format attendu: CSV avec colonnes timestamp, road_segment, cars_count, avg_speed
            </p>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="file-upload"
            />
            <label 
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${
                uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
              }`}
            >
              {uploading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Upload en cours...
                </>
              ) : (
                '📁 Choisir un fichier CSV'
              )}
            </label>
            
            {/* Informations de débogage */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Endpoint utilisé:</strong><br/>
                <code className="text-xs">https://mkuckawispatsoraztlh.supabase.co/functions/v1/analyzeTrafficCSV</code>
              </p>
            </div>
          </div>
        </div>

        {/* Parking Simulation */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🎮 Simulation Temps Réel</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            {parkings.map((parking) => (
              <div key={parking.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-3">{parking.name}</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Occupation actuelle:</span>
                  <span className="font-medium">{parking.current_occupied}/{parking.capacity_total}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => simulateCarEvent(parking.id, 1)}
                    disabled={simulating || parking.current_occupied >= parking.capacity_total}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    ➕ Entrée
                  </button>
                  <button
                    onClick={() => simulateCarEvent(parking.id, -1)}
                    disabled={simulating || parking.current_occupied <= 0}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    ➖ Sortie
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={loadParkings}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              📊 Actualiser les Données
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">📈 Statistiques Globales</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{parkings.length}</p>
              <p className="text-sm text-blue-600">Parkings gérés</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">
                {parkings.reduce((total, p) => total + p.capacity_total, 0)}
              </p>
              <p className="text-sm text-green-600">Capacité totale</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {parkings.reduce((total, p) => total + p.current_occupied, 0)}
              </p>
              <p className="text-sm text-yellow-600">Véhicules actuels</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">
                {parkings.length > 0 ? 
                  ((parkings.reduce((total, p) => total + p.current_occupied, 0) / 
                    parkings.reduce((total, p) => total + p.capacity_total, 1)) * 100).toFixed(1) 
                  : '0'}%
              </p>
              <p className="text-sm text-purple-600">Occupation moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
const [autoSimulation, setAutoSimulation] = useState(false);

// Simulation automatique des données de trafic
const startAutoSimulation = () => {
  setAutoSimulation(true);
  
  // Générer des données de trafic fictives toutes les 2 minutes
  const interval = setInterval(async () => {
    try {
      // Simuler des données de trafic
      const simulatedData = {
        timestamp: new Date().toISOString(),
        road_segment: ['entrance_north', 'entrance_south', 'entrance_east'][Math.floor(Math.random() * 3)],
        cars_count: Math.floor(Math.random() * 100) + 20,
        avg_speed: Math.floor(Math.random() * 40) + 20,
        congestion_level: Math.floor(Math.random() * 4)
      };
      
      console.log('Données trafic simulées:', simulatedData);
      
      // Ici, vous pourriez envoyer ces données à Supabase
      // via une autre Edge Function de Person A
      
    } catch (error) {
      console.error('Erreur simulation auto:', error);
    }
  }, 120000); // 2 minutes
  
  return () => clearInterval(interval);
};

// Simulation automatique des événements parking (comme Person C)
const startParkingSimulation = () => {
  const parkingInterval = setInterval(async () => {
    if (parkings.length > 0) {
      const randomParking = parkings[Math.floor(Math.random() * parkings.length)];
      const delta = Math.random() > 0.5 ? 1 : -1;
      
      // Vérifier les limites
      if ((delta === 1 && randomParking.current_occupied < randomParking.capacity_total) ||
          (delta === -1 && randomParking.current_occupied > 0)) {
        await simulateCarEvent(randomParking.id, delta);
      }
    }
  }, 10000); // Toutes les 10 secondes
  
  return () => clearInterval(parkingInterval);
};

