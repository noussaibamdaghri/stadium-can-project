// services/parkingService.ts
import { supabase } from '../lib/supabase'

export interface ParkingLot {
  id: number
  stadium_id: number
  name: string
  capacity: number  // CHANGÉ: capacity_total → capacity
  current_occupancy: number  // CHANGÉ: current_occupied → current_occupancy
  entrance_name?: string
}

export async function getParkingLots(): Promise<ParkingLot[]> {
  try {
    console.log('🔄 Fetching parking data from Supabase...')
    
    const { data, error } = await supabase
      .from('parking_lots')
      .select('*')
      .order('name')

    if (error) {
      console.error('❌ Supabase error:', error)
      throw new Error(`Failed to fetch parking data: ${error.message}`)
    }

    console.log(`✅ Received ${data?.length || 0} parking lots`)
    return data || []
  } catch (error) {
    console.error('❌ Error in getParkingLots:', error)
    throw error
  }
}

export async function updateParkingOccupancy(lotId: number, delta: number) {
  try {
    console.log(`🔄 Updating parking ${lotId} with delta ${delta}`)
    
    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/updateParkingFromEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          lot_id: lotId,  // CHANGÉ: parking_lot_id → lot_id (comme dans l'Edge Function)
          delta: delta,
          timestamp: new Date().toISOString()
        })
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Edge Function error: ${response.status} - ${errorText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('❌ Error in updateParkingOccupancy:', error)
    throw error
  }
}
