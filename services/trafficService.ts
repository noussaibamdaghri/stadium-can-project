// services/trafficService.ts
import { supabase } from '../lib/supabase'

export interface TrafficData {
  id: number
  stadium_id: number
  ts: string  // CHANGÉ: timestamp → ts
  gate: string  // CHANGÉ: road_segment → gate
  vehicles_in: number  // CHANGÉ: cars_count → vehicles_in
  vehicles_out: number
  avg_speed_kmh: number  // CHANGÉ: avg_speed → avg_speed_kmh
}

export async function getTrafficHistory(): Promise<TrafficData[]> {
  try {
    const { data, error } = await supabase
      .from('traffic_history')
      .select('*')
      .order('ts', { ascending: false })  // CHANGÉ: timestamp → ts
      .limit(50)

    if (error) {
      console.error('Error fetching traffic history:', error)
      throw new Error(`Failed to fetch traffic data: ${error.message}`)
    }

    return data || []
  } catch (error) {
    console.error('Error in getTrafficHistory:', error)
    throw error
  }
}

// AJOUTEZ cette nouvelle fonction
export async function getTrafficStats() {
  try {
    const { data, error } = await supabase
      .from('traffic_stats')
      .select('*')
      .order('bucket_start', { ascending: false })
      .limit(10)

    if (error) {
      console.error('Error fetching traffic stats:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTrafficStats:', error)
    return []
  }
}

