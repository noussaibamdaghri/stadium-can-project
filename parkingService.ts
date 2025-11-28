// services/parkingService.ts
import { supabase } from '@/lib/supabase'

export interface ParkingLot {
  id: number
  stadium_id: number
  name: string
  capacity_total: number
  current_occupied: number
}

export async function getParkingLots(): Promise<ParkingLot[]> {
  const { data, error } = await supabase
    .from('parking_lots')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching parking lots:', error)
    throw new Error('Failed to fetch parking data')
  }

  return data || []
}

export async function updateParkingOccupancy(lotId: number, delta: number) {
  const { data: currentLot } = await supabase
    .from('parking_lots')
    .select('current_occupied')
    .eq('id', lotId)
    .single()

  if (!currentLot) throw new Error('Parking lot not found')

  const newOccupied = Math.max(0, Math.min(
    currentLot.current_occupied + delta,
    // Capacité maximale (vous devrez récupérer capacity_total)
    100 // Temporaire - à remplacer par la vraie capacité
  ))

  const { error } = await supabase
    .from('parking_lots')
    .update({ current_occupied: newOccupied })
    .eq('id', lotId)

  if (error) throw error
}