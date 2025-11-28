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
  try {
    const { data, error } = await supabase
      .from('traffic_history')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Traffic history error:', error)
      // Si la table n'existe pas, retournez des données fictives
      if (error.code === '42P01') {
        return getMockTrafficData()
      }
      throw error
    }

    // Si pas de données, retournez des données fictives
    if (!data || data.length === 0) {
      return getMockTrafficData()
    }

    return data
  } catch (error) {
    console.error('Error in getTrafficHistory:', error)
    return getMockTrafficData()
  }
}

function getMockTrafficData(): TrafficData[] {
  return [
    {
      id: 1,
      stadium_id: 1,
      timestamp: new Date().toISOString(),
      road_segment: 'entrance_north',
      cars_count: 45,
      avg_speed: 35,
      congestion_level: 1
    },
    {
      id: 2,
      stadium_id: 1, 
      timestamp: new Date(Date.now() - 300000).toISOString(),
      road_segment: 'entrance_south',
      cars_count: 78,
      avg_speed: 22,
      congestion_level: 2
    },
    {
      id: 3,
      stadium_id: 1,
      timestamp: new Date(Date.now() - 600000).toISOString(),
      road_segment: 'entrance_east',
      cars_count: 23,
      avg_speed: 40,
      congestion_level: 0
    }
  ]
}
