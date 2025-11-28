// services/trafficUploadService.ts
export async function uploadTrafficCSV(file: File): Promise<{ success: boolean; message: string }> {
  try {
    if (!file || !file.name.toLowerCase().endsWith('.csv')) {
      return {
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      };
    }

    const formData = new FormData();
    formData.append('file', file);

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

    if (response.ok) {
      return {
        success: true,
        message: `Fichier "${file.name}" uploadé et analysé avec succès!`
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        message: `Erreur lors de l'upload: ${response.status} - ${errorText}`
      };
    }
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: `Erreur réseau: ${error instanceof Error ? error.message : 'Impossible de se connecter'}`
    };
  }
}
