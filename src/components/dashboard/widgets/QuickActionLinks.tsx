
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PenLine, Scan, Music, HeadphonesIcon, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

interface QuickActionLinksProps {
  actions?: QuickAction[];
  isB2B?: boolean;
}

const QuickActionLinks: React.FC<QuickActionLinksProps> = ({ 
  actions,
  isB2B = false 
}) => {
  // Default actions if none provided
  const defaultActions: QuickAction[] = isB2B ? [
    {
      title: "Journal",
      description: "Notez vos pensées et émotions professionnelles",
      icon: <PenLine className="h-5 w-5" />,
      to: "/b2b/user/journal"
    },
    {
      title: "Scan émotionnel",
      description: "Évaluez votre bien-être au travail",
      icon: <Scan className="h-5 w-5" />,
      to: "/b2b/user/scan"
    },
    {
      title: "Musique focus",
      description: "Améliorez votre concentration",
      icon: <Music className="h-5 w-5" />,
      to: "/b2b/user/music"
    },
    {
      title: "Session VR",
      description: "Courte pause immersive",
      icon: <HeadphonesIcon className="h-5 w-5" />,
      to: "/b2b/user/vr"
    }
  ] : [
    {
      title: "Journal",
      description: "Notez vos pensées et émotions",
      icon: <PenLine className="h-5 w-5" />,
      to: "/journal"
    },
    {
      title: "Scan émotionnel",
      description: "Comment vous sentez-vous aujourd'hui ?",
      icon: <Scan className="h-5 w-5" />,
      to: "/scan"
    },
    {
      title: "Musique",
      description: "Découvrez des musiques adaptées à vos émotions",
      icon: <Music className="h-5 w-5" />,
      to: "/music"
    },
    {
      title: "Coaching",
      description: "Accédez à vos programmes personnalisés",
      icon: <BookOpen className="h-5 w-5" />,
      to: "/coach"
    }
  ];
  
  const displayActions = actions || defaultActions;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          {displayActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex flex-col items-center justify-center py-3 px-2 text-center space-y-2"
              asChild
            >
              <Link to={action.to}>
                <div className="p-2 rounded-full bg-muted">
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-medium">{action.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {action.description}
                  </p>
                </div>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActionLinks;
