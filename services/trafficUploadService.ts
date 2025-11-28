// services/trafficUploadService.ts
export async function uploadTrafficCSV(file: File): Promise<{ success: boolean; message: string }> {
  try {
    // Vérification du fichier
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      return {
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      };
    }

    // Création du FormData
    const formData = new FormData();
    formData.append('csvFile', file); // Nom important : 'csvFile'

    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/analyzeTrafficCSV',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: formData
      }
    );

    console.log('Status de la réponse:', response.status);
    console.log('Headers:', response.headers);

    if (!response.ok) {
      let errorMessage = `Erreur HTTP: ${response.status}`;
      try {
        const errorData = await response.text();
        errorMessage += ` - ${errorData}`;
      } catch (e) {
        errorMessage += ' - Impossible de lire le message d\'erreur';
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Réponse réussie:', result);
    
    return {
      success: true,
      message: `Fichier "${file.name}" analysé avec succès! Données trafic mises à jour.`
    };
  } catch (error) {
    console.error('Erreur détaillée upload CSV:', error);
    return {
      success: false,
      message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Problème réseau'}`
    };
  }
}
