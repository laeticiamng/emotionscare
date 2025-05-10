
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Volume2 } from "lucide-react";
import { useMusic } from "@/contexts/MusicContext";
import { useToast } from "@/hooks/use-toast";
import { MusicRecommendationCardProps } from "@/types";

const MusicRecommendationCard: React.FC<MusicRecommendationCardProps> = ({
  emotion,
  intensity = 50,
  standalone = false,
  className = "",
}) => {
  const { loadPlaylistForEmotion, setOpenDrawer } = useMusic();
  const { toast } = useToast();

  const handlePlayMusic = async () => {
    try {
      await loadPlaylistForEmotion(emotion.toLowerCase());
      setOpenDrawer(true);

      toast({
        title: "Musique activée",
        description: `Playlist adaptée à votre humeur "${emotion}" chargée.`,
      });
    } catch (error) {
      console.error("Error loading emotion-based music:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la musique. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Get music type based on emotion
  const getMusicType = () => {
    const emotionToMusic: Record<string, string> = {
      joy: "upbeat",
      happy: "upbeat",
      calm: "ambient",
      relaxed: "ambient",
      anxious: "calming",
      stressed: "calming",
      sad: "gentle",
      melancholic: "gentle",
    };

    return (
      emotionToMusic[emotion.toLowerCase()] ||
      "adaptée"
    );
  };

  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className={`p-4 ${standalone ? "" : "pb-4"}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-3 rounded-full">
              <Volume2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Musicothérapie</h3>
              <p className="text-sm text-muted-foreground">
                Musique {getMusicType()} pour {intensity > 70 ? "réduire" : "accompagner"}{" "}
                {emotion === "neutral" ? "votre humeur" : `votre ${emotion}`}
              </p>
            </div>
          </div>
          <Button onClick={handlePlayMusic}>
            <Play className="h-4 w-4 mr-2" />
            Écouter
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MusicRecommendationCard;
