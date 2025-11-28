// app/test/page.tsx - Page de test rapide
'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TestPage() {
  const [status, setStatus] = useState('Testing...')

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Test table parking_lots
        const { data: parkingData, error: parkingError } = await supabase
          .from('parking_lots')
          .select('*')
        
        if (parkingError) {
          setStatus(`PARKING ERROR: ${parkingError.message}`)
          return
        }

        // Test table traffic_history  
        const { data: trafficData, error: trafficError } = await supabase
          .from('traffic_history')
          .select('*')

        if (trafficError) {
          setStatus(`TRAFFIC ERROR: ${trafficError.message}`)
          return
        }

        setStatus(`✅ SUCCESS! Parking: ${parkingData?.length || 0} rows, Traffic: ${trafficData?.length || 0} rows`)
      } catch (error) {
        setStatus(`❌ CONNECTION ERROR: ${error}`)
      }
    }

    testConnection()
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Supabase Connection</h1>
      <div className="p-4 bg-gray-100 rounded">
        <code>{status}</code>
      </div>
    </div>
  )
}
