// app/api/traffic/route.ts
import { NextResponse } from 'next/server'
import { getTrafficHistory } from '../../../services/trafficService'

export async function GET() {
  try {
    const trafficData = await getTrafficHistory()
    return NextResponse.json(trafficData)
  } catch (error) {
    console.error('Error in traffic API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch traffic data' },
      { status: 500 }
    )
  }
}

