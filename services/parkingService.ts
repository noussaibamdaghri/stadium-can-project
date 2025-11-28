// services/parkingService.ts
import { supabase } from '../lib/supabase'

export interface ParkingLot {
  id: number
  stadium_id: number
  name: string
  capacity_total: number
  current_occupied: number
}

export async function getParkingLots(): Promise<ParkingLot[]> {
  try {
    const { data, error } = await supabase
      .from('parking_lots')
      .select('*')
      .order('name')

    if (error) {
      console.error('Error fetching parking lots:', error)
      throw new Error(`Failed to fetch parking data: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getParkingLots:', error)
    throw error
  }
}

// Utilise l'Edge Function de Person A
export async function updateParkingOccupancy(lotId: number, delta: number) {
  try {
    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/updateParkingFromEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          parking_lot_id: lotId,
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
    console.error('Error updating parking:', error)
    throw error
  }
}
