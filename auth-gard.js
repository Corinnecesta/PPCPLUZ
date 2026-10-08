document.addEventListener("DOMContentLoaded", () => {
    const userRole = localStorage.getItem('cesta_user_role'); // 'admin', 'entraineur' ou 'joueur'
    const userEmail = localStorage.getItem('cesta_user_email');

    // Optionnel : Si vous souhaitez bloquer complètement l'accès à certaines pages aux personnes non connectées
    // (Décommentez la ligne ci-dessous si besoin)
    // if (!userEmail && window.location.pathname.indexOf('login.html') === -1) { window.location.href = 'login.html'; }

    // Sélection de tous les éléments réservés aux modifications/ajouts
    const restrictedElements = document.querySelectorAll('.admin-entraineur-only');

    if (userRole === 'joueur' || !userRole) {
        // Mode lecture seule pour les joueurs (ou non connectés)
        restrictedElements.forEach(el => {
            el.style.display = 'none';
        });
    } else {
        // Mode édition pour Admin et Entraîneur
        restrictedElements.forEach(el => {
            el.style.display = ''; // Laisse le CSS d'origine s'appliquer (block, flex, etc.)
        });
    }
});