
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserMode } from "@/contexts/UserModeContext";
import { motion } from "framer-motion";
import { useStorytelling } from "@/providers/StorytellingProvider";
import { useSoundscape } from "@/providers/SoundscapeProvider";
import { useBranding } from "@/contexts/BrandingContext";

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
  const { emotionalTone, colors } = useBranding();
  const { playFunctionalSound } = useSoundscape();
  const { stories, showStory } = useStorytelling();

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

  // Play welcome sound when component mounts
  useEffect(() => {
    playFunctionalSound('transition');
  }, []);

  const handleNavigate = (path: string) => {
    playFunctionalSound('click');
    navigate(path);
  };

  const handleShowStory = () => {
    // Find an unseen story to show
    const unseenStory = stories.find(story => !story.seen);
    if (unseenStory) {
      playFunctionalSound('notification');
      showStory(unseenStory.id);
    } else if (stories.length > 0) {
      // If all stories are seen, show the first one
      playFunctionalSound('notification');
      showStory(stories[0].id);
    }
  };

  return (
    <div className="relative z-10 text-center md:text-left">
      <motion.h1 
        className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-gradient">{getGreeting()}</span>
      </motion.h1>
      
      <motion.p 
        className="text-xl md:text-2xl mb-8 text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {getTagline()}
      </motion.p>

      <motion.div 
        className="flex flex-wrap gap-4 justify-center md:justify-start"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {isAuthenticated ? (
          <>
            <Button
              size="lg"
              onClick={() => handleNavigate("/dashboard")}
              className="shadow-md hover-lift"
              style={{ backgroundColor: colors.primary }}
            >
              {userMode === 'b2b-admin' 
                ? "Voir le tableau de bord RH"
                : "Accéder à mon espace"
              }
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={onMoodSelect || handleShowStory}
              className="flex items-center gap-2 hover-lift"
            >
              {onMoodSelect ? "Comment je me sens ?" : "Découvrir nos actualités"} 
              <span role="img" aria-label="mood">
                {onMoodSelect ? "🤔" : "✨"}
              </span>
            </Button>
          </>
        ) : (
          <>
            <Button
              size="lg"
              onClick={() => handleNavigate("/login")}
              className="shadow-md hover-lift"
              style={{ backgroundColor: colors.primary }}
            >
              Se connecter
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleNavigate("/register")}
              className="hover-lift"
            >
              Créer un compte
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default WelcomeHero;
