// app/supporter/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { getParkingLots, ParkingLot } from '../../services/parkingService'
import { getTrafficHistory, TrafficData } from '../../services/trafficService'

export default function SupporterPage() {
  const [parkings, setParkings] = useState<ParkingLot[]>([])
  const [trafficData, setTrafficData] = useState<TrafficData[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [parkingData, trafficData] = await Promise.all([
        getParkingLots(),
        getTrafficHistory()
      ])
      setParkings(parkingData)
      setTrafficData(trafficData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Rafraîchissement automatique toutes les 30 secondes
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getRecommendation = () => {
    if (parkings.length === 0) return null
    
    const bestParking = parkings.reduce((best, current) => {
      const bestPercentage = (best.current_occupied / best.capacity_total) * 100
      const currentPercentage = (current.current_occupied / current.capacity_total) * 100
      return currentPercentage < bestPercentage ? current : best
    })

    const occupancyPercentage = (bestParking.current_occupied / bestParking.capacity_total) * 100
    
    let recommendation = ''
    if (occupancyPercentage < 30) recommendation = '💚 Excellent choix'
    else if (occupancyPercentage < 60) recommendation = '💙 Bon choix'
    else recommendation = '💛 Choix acceptable'

    return {
      parking: bestParking.name,
      freeSpaces: bestParking.capacity_total - bestParking.current_occupied,
      percentage: occupancyPercentage,
      message: recommendation
    }
  }

  const recommendation = getRecommendation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des données en temps réel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🏟️ CAN - Guide Intelligent</h1>
          <p className="text-gray-600">Données mises à jour en temps réel</p>
        </div>

        {/* Recommendation Card */}
        {recommendation && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
            <h2 className="text-2xl font-semibold mb-4">🎯 Recommandation Optimale</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Parking conseillé</p>
                <p className="text-xl font-bold">{recommendation.parking}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Places disponibles</p>
                <p className="text-xl font-bold text-green-600">{recommendation.freeSpaces} places</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Niveau d'occupation</p>
                <p className="text-xl font-bold">{recommendation.percentage.toFixed(1)}%</p>
              </div>
            </div>
            <p className="text-center mt-4 text-lg font-medium">{recommendation.message}</p>
          </div>
        )}

        {/* Parking Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">🅿️ État des Parkings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkings.map((parking) => {
              const percentage = (parking.current_occupied / parking.capacity_total) * 100
              let statusColor = 'bg-green-500'
              let statusText = 'Fluide'
              
              if (percentage > 80) {
                statusColor = 'bg-red-500'
                statusText = 'Saturé'
              } else if (percentage > 60) {
                statusColor = 'bg-yellow-500'
                statusText = 'Modéré'
              }

              return (
                <div key={parking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">{parking.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor} text-white`}>
                      {statusText}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Occupation</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${statusColor} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacité: {parking.capacity_total}</span>
                    <span className="font-medium">
                      Libre: {parking.capacity_total - parking.current_occupied}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Traffic Information */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6">🚦 Analyse du Trafic</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left">Segment</th>
                  <th className="px-4 py-2 text-left">Véhicules/h</th>
                  <th className="px-4 py-2 text-left">Vitesse moy.</th>
                  <th className="px-4 py-2 text-left">Niveau</th>
                </tr>
              </thead>
              <tbody>
                {trafficData.slice(0, 5).map((traffic) => (
                  <tr key={traffic.id} className="border-b">
                    <td className="px-4 py-3">{traffic.road_segment}</td>
                    <td className="px-4 py-3">{traffic.cars_count}</td>
                    <td className="px-4 py-3">{traffic.avg_speed} km/h</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        traffic.congestion_level === 0 ? 'bg-green-100 text-green-800' :
                        traffic.congestion_level === 1 ? 'bg-yellow-100 text-yellow-800' :
                        traffic.congestion_level === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {['Fluide', 'Modéré', 'Dense', 'Saturé'][traffic.congestion_level]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {trafficData.length === 0 && (
            <p className="text-center text-gray-500 py-4">Aucune donnée de trafic disponible</p>
          )}
        </div>

        {/* Last Update */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  )

}

