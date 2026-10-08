// 1. Liste dynamique de toutes les parties pour les 8 joueurs
const matchsData = [
    {
        id: "match_1",
        joueurId: 2,
        titre: "Winter Series — Guernika (15 février 2026)",
        date: "15/02/2026",
        competition: "Winter Series",
        lieu: "Guernika",
        score: "15/14/5",
        resultat: "Gagnant",
        pelotesJouees: 148,
        pelotesTotales: 284,
        ptsGagnes: 8,
        ptsGagnesTotaux: 18,
        ptsPerdus: 12,
        ptsPerdusTotaux: 16,
        receptionsCoupDroitPct: 18.9,
        aireTotal: 92, airePositif: 89, aireNegatif: 3,
        boteTotal: 13, botePositif: 12, boteNegatif: 1,
        boteCorridoTotal: 37, boteCorridoPositif: 34, boteCorridoNegatif: 3,
        boteProntoTotal: 2, boteProntoPositif: 2, boteProntoNegatif: 0,
        ereboteTotal: 4, erebotePositif: 2, ereboteNegatif: 2,
        pumpa: 0, pumpaPositif: 0, pumpaNegatif: 0,
        frappesClassiquesTotal: 136, frappesClassiquesPos: 134, frappesClassiquesNeg: 2,
        frappesAttaqueTotal: 0, frappesAttaquePos: 0, frappesAttaqueNeg: 0,
        picadaTotal: 1, picadaPos: 1, picadaNeg: 0,
        dejadaTotal: 0, dejadaPos: 0, dejadaNeg: 0,
        txikTxakTotal: 0, txikTxakPos: 0, txikTxakNeg: 0,
        txulaTotal: 0, txulaPos: 0, txulaNeg: 0,
        cortadaTotal: 0, cortadaPos: 0, cortadaNeg: 0,
        gaucheGaucheTotal: 0, gaucheGauchePos: 0, gaucheGaucheNeg: 0,
        gaucheDroiteTotal: 0, gaucheDroitePos: 0, gaucheDroiteNeg: 0,
        deuxMursTotal: 2, deuxMursPos: 1, deuxMursNeg: 1
    },
    // ... l'ensemble des 183 parties de vos 8 joueurs ...
];

// 2. Calcul du cumul global automatique par joueur
function calculerStatsTotales(matchs, joueurIdFilter) {
    const matchsFiltres = joueurIdFilter ? matchs.filter(m => m.joueurId === joueurIdFilter) : matchs;
    const total = {
        matchsJoues: matchsFiltres.length, pelotesJouees: 0, pelotesTotales: 0,
        ptsGagnes: 0, ptsGagnesTotaux: 0, ptsPerdus: 0, ptsPerdusTotaux: 0,
        receptionsCoupDroitPct: 0,
        aireTotal: 0, airePositif: 0, aireNegatif: 0,
        boteTotal: 0, botePositif: 0, boteNegatif: 0,
        boteCorridoTotal: 0, boteCorridoPositif: 0, boteCorridoNegatif: 0,
        boteProntoTotal: 0, boteProntoPositif: 0, boteProntoNegatif: 0,
        ereboteTotal: 0, erebotePositif: 0, ereboteNegatif: 0,
        pumpa: 0, pumpaPositif: 0, pumpaNegatif: 0,
        frappesClassiquesTotal: 0, frappesClassiquesPos: 0, frappesClassiquesNeg: 0,
        frappesAttaqueTotal: 0, frappesAttaquePos: 0, frappesAttaqueNeg: 0,
        picadaTotal: 0, picadaPos: 0, picadaNeg: 0,
        dejadaTotal: 0, dejadaPos: 0, dejadaNeg: 0,
        txikTxakTotal: 0, txikTxakPos: 0, txikTxakNeg: 0,
        txulaTotal: 0, txulaPos: 0, txulaNeg: 0,
        cortadaTotal: 0, cortadaPos: 0, cortadaNeg: 0,
        gaucheGaucheTotal: 0, gaucheGauchePos: 0, gaucheGaucheNeg: 0,
        gaucheDroiteTotal: 0, gaucheDroitePos: 0, gaucheDroiteNeg: 0,
        deuxMursTotal: 0, deuxMursPos: 0, deuxMursNeg: 0
    };

    matchsFiltres.forEach(m => {
        for (let key in total) {
            if (key !== 'matchsJoues' && key !== 'receptionsCoupDroitPct' && typeof m[key] === 'number') {
                total[key] += m[key];
            }
        }
    });

    return total;
}