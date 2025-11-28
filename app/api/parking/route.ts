// app/api/parking/route.ts
import { NextResponse } from 'next/server'
import { getParkingLots } from '../../../services/parkingService'

export async function GET() {
  try {
    const parkingLots = await getParkingLots()
    
    // Calculer les recommandations avec les BONS noms de colonnes
    const recommendations = parkingLots.map(lot => ({
      id: lot.id,
      name: lot.name,
      occupancy: (lot.current_occupancy / lot.capacity) * 100, // CORRIGÉ: current_occupancy
      freeSpaces: lot.capacity - lot.current_occupancy, // CORRIGÉ: capacity
      recommendation: (lot.current_occupancy / lot.capacity) < 0.7 ? 'RECOMMENDED' : 'AVOID' // CORRIGÉ
    }))

    return NextResponse.json({
      success: true,
      data: parkingLots,
      recommendations,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch parking data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
