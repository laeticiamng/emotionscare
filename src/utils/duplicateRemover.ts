
// Système de nettoyage des doublons
const cleanupDuplicates = () => {
  // Vérification et suppression des éléments dupliqués
  const duplicatedElements = document.querySelectorAll('[data-duplicate-check]');
  duplicatedElements.forEach((element, index) => {
    if (index > 0) {
      element.remove();
    }
  });
  
  console.info('Vérification et suppression des éléments dupliqués effectuées');
  
  // Seconde vérification
  setTimeout(() => {
    const remainingDuplicates = document.querySelectorAll('[data-duplicate-check]');
    if (remainingDuplicates.length > 1) {
      for (let i = 1; i < remainingDuplicates.length; i++) {
        remainingDuplicates[i].remove();
      }
    }
    console.info('Seconde vérification effectuée');
  }, 100);
};

// Exécution au chargement
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupDuplicates);
  } else {
    cleanupDuplicates();
  }
}

export default cleanupDuplicates;
