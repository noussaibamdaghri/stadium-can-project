// app/admin/page.tsx
'use client'

import { useState, useRef } from 'react'
import { getParkingLots, updateParkingOccupancy, ParkingLot } from '@/services/parkingService'

export default function AdminPage() {
  const [parkings, setParkings] = useState<ParkingLot[]>([])
  const [uploading, setUploading] = useState(false)
  const [simulating, setSimulating] = useState(false)
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

    setUploading(true)
    try {
      // Simuler l'upload - À remplacer par l'appel à l'Edge Function de Person A
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Fichier "${file.name}" uploadé avec succès!`)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      alert('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  const simulateCarEvent = async (lotId: number, delta: number) => {
    setSimulating(true)
    try {
      await updateParkingOccupancy(lotId, delta)
      await loadParkings() // Recharger les données
      alert(`Parking mis à jour: ${delta > 0 ? 'Entrée' : 'Sortie'} de véhicule`)
    } catch (error) {
      alert('Erreur lors de la simulation')
    } finally {
      setSimulating(false)
    }
  }

  const resetParkings = async () => {
    if (!confirm('Réinitialiser tous les parkings à 0?')) return
    
    setSimulating(true)
    try {
      // Implémentez la réinitialisation ici
      alert('Parkings réinitialisés')
      await loadParkings()
    } catch (error) {
      alert('Erreur lors de la réinitialisation')
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Déposez votre fichier CSV de trafic ici</p>
            <p className="text-sm text-gray-500 mb-4">Formats acceptés: .csv</p>
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
              {uploading ? '📤 Upload en cours...' : '📁 Choisir un fichier'}
            </label>
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
              onClick={resetParkings}
              disabled={simulating}
              className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
            >
              🔄 Réinitialiser Tous
            </button>
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
                {((parkings.reduce((total, p) => total + p.current_occupied, 0) / 
                  parkings.reduce((total, p) => total + p.capacity_total, 1)) * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-purple-600">Occupation moyenne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}