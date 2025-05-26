
export const removeDuplicateElements = () => {
  console.log('Vérification et suppression des éléments dupliqués effectuées');
  
  // Fonction pour supprimer les éléments en double dans le DOM
  const removeDuplicates = () => {
    const duplicates = document.querySelectorAll('[data-duplicate="true"]');
    duplicates.forEach(element => {
      element.remove();
    });
  };

  // Exécuter la suppression après le chargement du DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeDuplicates);
  } else {
    removeDuplicates();
  }

  // Vérification secondaire après un délai
  setTimeout(() => {
    removeDuplicates();
    console.log('Seconde vérification effectuée');
  }, 1000);
};

// Auto-exécution du nettoyage
removeDuplicateElements();
