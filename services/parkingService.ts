export async function updateParkingOccupancy(lotId: number, delta: number) {
  try {
    console.log(`🔄 Simulation parking ${lotId}, delta: ${delta}`)
    
    // Essayer l'Edge Function d'abord
    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/updateParkingFromEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          lot_id: lotId,
          delta: delta
        })
      }
    )

    if (response.ok) {
      const result = await response.json()
      console.log('✅ Edge Function success:', result)
      return result
    } else {
      // Fallback: mise à jour directe
      console.log('⚠️ Edge Function failed, using direct update')
      return await updateParkingDirect(lotId, delta)
    }
  } catch (error) {
    console.error('❌ Error in updateParkingOccupancy:', error)
    // Fallback ultime
    return await updateParkingDirect(lotId, delta)
  }
}

// Fallback direct vers Supabase
async function updateParkingDirect(lotId: number, delta: number) {
  try {
    // Récupérer l'état actuel
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

    // Mettre à jour directement
    const { error: updateError } = await supabase
      .from('parking_lots')
      .update({ current_occupancy: newOccupancy })
      .eq('id', lotId)

    if (updateError) throw updateError

    return { success: true, new_occupancy: newOccupancy }
  } catch (error) {
    console.error('Error in direct update:', error)
    throw error
  }
}
