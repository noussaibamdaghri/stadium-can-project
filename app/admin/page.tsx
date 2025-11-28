// app/admin/page.tsx - Seulement les parties modifiées

// app/admin/page.tsx
// REMPLACEZ la section des statistiques par ceci :

{/* Statistics */}
<div className="bg-white rounded-xl shadow-lg p-6">
  <h2 className="text-2xl font-semibold mb-6">📈 Statistiques Globales</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="bg-blue-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-blue-600">{parkings.length}</p>
      <p className="text-sm text-blue-600">Parkings gérés</p>
    </div>
    <div className="bg-green-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-green-600">
        {parkings.reduce((total, p) => total + p.capacity, 0)}
      </p>
      <p className="text-sm text-green-600">Capacité totale</p>
    </div>
    <div className="bg-yellow-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-yellow-600">
        {parkings.reduce((total, p) => total + p.current_occupancy, 0)}
      </p>
      <p className="text-sm text-yellow-600">Véhicules actuels</p>
    </div>
    <div className="bg-purple-50 rounded-lg p-4 text-center">
      <p className="text-2xl font-bold text-purple-600">
        {parkings.length > 0 ? 
          ((parkings.reduce((total, p) => total + p.current_occupancy, 0) / 
            parkings.reduce((total, p) => total + p.capacity, 1)) * 100).toFixed(1) 
          : '0'}%
      </p>
      <p className="text-sm text-purple-600">Occupation moyenne</p>
    </div>
  </div>
</div>

// ... dans l'affichage des parkings :
<div className="flex justify-between items-center mb-2">
  <span className="text-sm text-gray-600">Occupation actuelle:</span>
  <span className="font-medium">{parking.current_occupancy}/{parking.capacity}</span>  {/* CORRIGÉ */}
</div>

// ... dans les boutons de simulation :
<button
  onClick={() => simulateCarEvent(parking.id, 1)}
  disabled={simulating || parking.current_occupancy >= parking.capacity}  {/* CORRIGÉ */}
  className="flex-1 bg-green-500 text-white py-2 px-3 rounded text-sm hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  ➕ Entrée
</button>
<button
  onClick={() => simulateCarEvent(parking.id, -1)}
  disabled={simulating || parking.current_occupancy <= 0}  {/* CORRIGÉ */}
  className="flex-1 bg-red-500 text-white py-2 px-3 rounded text-sm hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
>
  ➖ Sortie
</button>

