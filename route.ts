// app/api/parking/route.ts
import { NextResponse } from 'next/server'
import { getParkingLots } from '@/services/parkingService'

export async function GET() {
  try {
    const parkingLots = await getParkingLots()
    
    // Calculer les recommandations
    const recommendations = parkingLots.map(lot => ({
      id: lot.id,
      name: lot.name,
      occupancy: (lot.current_occupied / lot.capacity_total) * 100,
      freeSpaces: lot.capacity_total - lot.current_occupied,
      recommendation: (lot.current_occupied / lot.capacity_total) < 0.7 ? 'RECOMMENDED' : 'AVOID'
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