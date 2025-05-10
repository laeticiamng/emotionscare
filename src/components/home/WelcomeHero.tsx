
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserMode } from "@/contexts/UserModeContext";

interface WelcomeHeroProps {
  userName?: string;
  timeOfDay?: "morning" | "afternoon" | "evening";
  onMoodSelect?: () => void;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userName,
  timeOfDay = "morning",
  onMoodSelect,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { userMode } = useUserMode();

  const getTimeOfDayMessage = () => {
    switch (timeOfDay) {
      case "morning":
        return "Bon matin";
      case "afternoon":
        return "Bon après-midi";
      case "evening":
        return "Bonne soirée";
      default:
        return "Bienvenue";
    }
  };

  const getGreeting = () => {
    if (userName) {
      return `${getTimeOfDayMessage()}, ${userName} !`;
    }

    if (isAuthenticated) {
      return `${getTimeOfDayMessage()} !`;
    }

    return "Bienvenue sur EmotionsCare";
  };

  const getTagline = () => {
    if (isAuthenticated) {
      if (userMode === 'b2b-admin') {
        return "Découvrez l'état émotionnel global de votre équipe";
      } else if (userMode === 'b2b-collaborator') {
        return "Suivez votre bien-être émotionnel professionnel";
      } else {
        return "Comment vous sentez-vous aujourd'hui ?";
      }
    }

    return "Votre partenaire pour le bien-être émotionnel";
  };

  return (
    <div className="relative z-10 text-center md:text-left">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
        {getGreeting()}
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
        {getTagline()}
      </p>

      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        {isAuthenticated ? (
          <>
            <Button
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="shadow-md"
            >
              {userMode === 'b2b-admin' 
                ? "Voir le tableau de bord RH"
                : "Accéder à mon espace"
              }
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onMoodSelect}
              className="flex items-center gap-2"
            >
              Comment je me sens ? 
              <span role="img" aria-label="mood">
                🤔
              </span>
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              onClick={() => navigate("/login")}
              className="shadow-md"
            >
              Se connecter
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/register")}
            >
              Créer un compte
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeHero;
