// services/trafficUploadService.ts
export async function uploadTrafficCSV(file: File): Promise<{ success: boolean; message: string }> {
  try {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      return {
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      };
    }

    // LISEZ BIEN CE CHANGEMENT :
    const formData = new FormData();
    formData.append('file', file); // Peut-être 'file' au lieu de 'csvFile'

    const response = await fetch(
      'https://mkuckawispatsoraztlh.supabase.co/functions/v1/analyzeTrafficCSV',
      {
        method: 'POST',
        headers: {
          // ESSAYEZ AVEC ET SANS CE HEADER :
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          // Peut-être aussi besoin de : 'Content-Type': 'multipart/form-data'
        },
        body: formData
      }
    );

    if (response.status === 401) {
      return {
        success: false,
        message: 'Erreur d\'authentification. Vérifiez la clé Supabase.'
      };
    }

    if (response.status === 413) {
      return {
        success: false,
        message: 'Fichier trop volumineux.'
      };
    }

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        message: `Erreur serveur (${response.status}): ${errorText}`
      };
    }

    const result = await response.json();
    
    return {
      success: true,
      message: `Fichier "${file.name}" uploadé! Analyse en cours...`
    };
  } catch (error) {
    console.error('Erreur upload:', error);
    return {
      success: false,
      message: `Erreur réseau: ${error instanceof Error ? error.message : 'Impossible de se connecter au serveur'}`
    };
  }
}
