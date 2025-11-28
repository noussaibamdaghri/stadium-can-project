// services/trafficService.ts
import { supabase } from '../lib/supabase'

export interface TrafficData {
  id: number
  stadium_id: number
  timestamp: string
  road_segment: string
  cars_count: number
  avg_speed: number
  congestion_level: number
}

export async function getTrafficHistory(): Promise<TrafficData[]> {
  const { data, error } = await supabase
    .from('traffic_history')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching traffic history:', error)
    throw new Error('Failed to fetch traffic data')
  }

  return data || []
}

