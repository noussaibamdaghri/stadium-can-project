// services/trafficUploadService.ts

export async function uploadTrafficCSV(file: File): Promise<{ success: boolean; message: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/analyzeTrafficCSV',
      {
        method: 'POST',
        headers: {
          // L'authentification se fait via le header Authorization
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
        },
        body: formData
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      message: `Fichier "${file.name}" analysé avec succès! Données trafic mises à jour.`
    };
  } catch (error) {
    console.error('Erreur upload CSV:', error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    };
  }
}
