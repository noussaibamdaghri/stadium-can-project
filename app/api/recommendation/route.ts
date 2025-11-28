// app/api/recommendation/route.ts
import { NextResponse } from 'next/server'
import { getParkingLots } from '../../../services/parkingService'
import { getTrafficStats } from '../../../services/trafficService'

export async function GET() {
  try {
    const [parkings, trafficStats] = await Promise.all([
      getParkingLots(),
      getTrafficStats()
    ])

    // Trouver le parking avec le plus de places libres
    const bestParking = parkings.reduce((best, current) => {
      const bestFree = best.capacity_total - best.current_occupied
      const currentFree = current.capacity_total - current.current_occupied
      return currentFree > bestFree ? current : best
    })

    // Analyser le trafic (simplifié)
    const currentHour = new Date().getHours()
    let trafficAdvice = "Trafic normal"
    let bestTime = "17h45-18h00"
    
    if (trafficStats.length > 0) {
      const latest = trafficStats[0]
      if (latest.avg_congestion > 2) {
        trafficAdvice = "Trafic dense - venir plus tôt"
        bestTime = "17h00-17h30"
      } else if (latest.avg_congestion < 1) {
        trafficAdvice = "Trafic fluide"
        bestTime = "18h00-18h15"
      }
    }

    const recommendation = {
      recommendedParking: bestParking.name,
      optimalTime: bestTime,
      entrance: "Porte Nord", // Basé sur le trafic
      freeSpaces: bestParking.capacity_total - bestParking.current_occupied,
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
