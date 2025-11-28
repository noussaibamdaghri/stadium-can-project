// services/parkingService.ts
import { supabase } from '../lib/supabase'

export interface ParkingLot {
  id: number
  stadium_id: number
  name: string
  capacity: number
  current_occupancy: number
  entrance_name?: string
}

export async function getParkingLots(): Promise<ParkingLot[]> {
  try {
    const { data, error } = await supabase
      .from('parking_lots')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching parking lots:', error)
    throw error
  }
}

export async function updateParkingOccupancy(lotId: number, delta: number) {
  try {
    console.log(`🔄 Mise à jour directe du parking ${lotId} avec delta ${delta}`)
    
    // SOLUTION SIMPLE : Mise à jour directe dans la base
    const { data: current, error: fetchError } = await supabase
      .from('parking_lots')
      .select('current_occupancy, capacity')
      .eq('id', lotId)
      .single()

    if (fetchError) throw fetchError

    const newOccupancy = Math.max(0, Math.min(
      current.current_occupancy + delta,
      current.capacity
    ))

    const { error: updateError } = await supabase
      .from('parking_lots')
      .update({ current_occupancy: newOccupancy })
      .eq('id', lotId)

    if (updateError) throw updateError

    console.log(`✅ Parking ${lotId} mis à jour: ${current.current_occupancy} → ${newOccupancy}`)
    return { success: true, new_occupancy: newOccupancy }
    
  } catch (error) {
    console.error('❌ Error updating parking:', error)
    throw error
  }
}
