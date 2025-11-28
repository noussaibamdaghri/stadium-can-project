// app/supporter/page.tsx - SEULEMENT les parties modifiées
'use client'

import { useState, useEffect } from 'react'
import { getParkingLots, ParkingLot } from '../../services/parkingService'
import { getTrafficHistory, TrafficData } from '../../services/trafficService'

// ... le reste du code reste le même jusqu'à ...

  const getRecommendation = () => {
    if (parkings.length === 0) return null
    
    const bestParking = parkings.reduce((best, current) => {
      // CORRECTION: utilisation des bons noms de colonnes
      const bestPercentage = (best.current_occupancy / best.capacity) * 100
      const currentPercentage = (current.current_occupancy / current.capacity) * 100
      return currentPercentage < bestPercentage ? current : best
    })

    const occupancyPercentage = (bestParking.current_occupancy / bestParking.capacity) * 100
    
    let recommendation = ''
    if (occupancyPercentage < 30) recommendation = '💚 Excellent choix'
    else if (occupancyPercentage < 60) recommendation = '💙 Bon choix'
    else recommendation = '💛 Choix acceptable'

    return {
      parking: bestParking.name,
      freeSpaces: bestParking.capacity - bestParking.current_occupancy, // CORRIGÉ
      percentage: occupancyPercentage,
      message: recommendation
    }
  }

// ... dans le rendu des parkings, corriger aussi :
{parkings.map((parking) => {
  const percentage = (parking.current_occupancy / parking.capacity) * 100  // CORRIGÉ
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
        <span className="text-gray-600">Capacité: {parking.capacity}</span>  {/* CORRIGÉ */}
        <span className="font-medium">
          Libre: {parking.capacity - parking.current_occupancy}  {/* CORRIGÉ */}
        </span>
      </div>
    </div>
  )
})}

// ... et dans le tableau du trafic :
{trafficData.slice(0, 5).map((traffic) => (
  <tr key={traffic.id} className="border-b">
    <td className="px-4 py-3">{traffic.gate}</td>  {/* CHANGÉ: road_segment → gate */}
    <td className="px-4 py-3">{traffic.vehicles_in}</td>  {/* CHANGÉ: cars_count → vehicles_in */}
    <td className="px-4 py-3">{traffic.avg_speed_kmh} km/h</td>  {/* CHANGÉ: avg_speed → avg_speed_kmh */}
    <td className="px-4 py-3">
      <span className={`px-2 py-1 rounded-full text-xs ${
        // Calcul simplifié du niveau de congestion basé sur vehicles_in
        traffic.vehicles_in < 30 ? 'bg-green-100 text-green-800' :
        traffic.vehicles_in < 60 ? 'bg-yellow-100 text-yellow-800' :
        traffic.vehicles_in < 100 ? 'bg-orange-100 text-orange-800' :
        'bg-red-100 text-red-800'
      }`}>
        {traffic.vehicles_in < 30 ? 'Fluide' :
         traffic.vehicles_in < 60 ? 'Modéré' :
         traffic.vehicles_in < 100 ? 'Dense' : 'Saturé'}
      </span>
    </td>
  </tr>
))}
