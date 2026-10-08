// Fonction pour convertir une date du type "15/02/2026" vers un format comparable ou standard
function normaliserDate(dateStr) {
    if (!dateStr) return "";
    // Si la date est déjà au format "15 Feb 2026", on peut l'uniformiser, 
    // ou alors ajuster selon la façon dont vous stockez vos dates.
    return dateStr.trim();
}

// Fonction principale pour fusionner les tableaux
function obtenirMatchsEnrichis() {
    // Vérification que les tableaux existent (provenant de vos fichiers inclus)
    const listeMatchs = typeof matchsData !== 'undefined' ? matchsData : [];
    const listeStats = typeof statsData !== 'undefined' ? statsData : [];

    return listeMatchs.map(match => {
        // On cherche la statistique correspondante en comparant le lieu et la date
        const statsAssociees = listeStats.find(stat => {
            const mêmeLieu = stat.lieu && match.lieu && stat.lieu.toLowerCase() === match.lieu.toLowerCase();
            // Comparaison souple sur la date ou le titre si nécessaire
            const mêmeDate = stat.date === match.date || (stat.titre && stat.titre.includes(match.date));
            return mêmeLieu && mêmeDate;
        });

        return {
            ...match,
            stats: statsAssociees || null // Ajoute les stats détaillées si elles existent, sinon null
        };
    });
}