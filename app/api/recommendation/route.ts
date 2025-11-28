// app/api/recommendation/route.ts
import { NextResponse } from 'next/server'
import { getParkingLots } from '../../../services/parkingService'
import { getTrafficHistory } from '../../../services/trafficService' // CHANGÉ: getTrafficStats → getTrafficHistory

export async function GET() {
  try {
    const [parkings, trafficHistory] = await Promise.all([
      getParkingLots(),
      getTrafficHistory()
    ])

    // Trouver le parking avec le plus de places libres
    const bestParking = parkings.reduce((best, current) => {
      const bestFree = best.capacity - best.current_occupancy
      const currentFree = current.capacity - current.current_occupancy
      return currentFree > bestFree ? current : best
    })

    // Analyser le trafic basé sur l'historique
    let trafficAdvice = "Trafic normal"
    let bestTime = "17h45-18h00"
    
    if (trafficHistory.length > 0) {
      const recentTraffic = trafficHistory.slice(0, 3)
      const totalVehicles = recentTraffic.reduce((sum, record) => sum + record.vehicles_in, 0)
      
      if (totalVehicles > 200) {
        trafficAdvice = "Trafic dense - venir plus tôt"
        bestTime = "17h00-17h30"
      } else if (totalVehicles < 80) {
        trafficAdvice = "Trafic fluide"
        bestTime = "18h00-18h15"
      }
    }

    const recommendation = {
      recommendedParking: bestParking.name,
      optimalTime: bestTime,
      entrance: bestParking.entrance_name || "Porte Nord",
      freeSpaces: bestParking.capacity - bestParking.current_occupancy,
      trafficStatus: trafficAdvice,
      confidence: "high",
      lastUpdated: new Date().toISOString()
    }

    return NextResponse.json(recommendation)
  } catch (error) {
    console.error('Error in recommendation API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch recommendation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
