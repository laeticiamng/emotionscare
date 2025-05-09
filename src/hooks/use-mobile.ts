
import { useEffect, useState } from "react";

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Vérification initiale
    checkIfMobile();

    // Ajout de l'écouteur d'événement
    window.addEventListener("resize", checkIfMobile);

    // Nettoyage de l'écouteur d'événement
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
};
