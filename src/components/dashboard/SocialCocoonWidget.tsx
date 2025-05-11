
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SocialCocoonWidgetProps {
  collapsed: boolean;
  onToggle: () => void;
  userId: string;
}

const SocialCocoonWidget: React.FC<SocialCocoonWidgetProps> = ({
  collapsed,
  onToggle,
  userId
}) => {
  if (collapsed) {
    return (
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Communauté
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Communauté
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <ChevronUp className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <h4 className="font-medium mb-3">Groupe de soutien actif</h4>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex -space-x-2">
                <Avatar className="border-2 border-background">
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>ST</AvatarFallback>
                </Avatar>
                <Avatar className="border-2 border-background">
                  <AvatarFallback>RK</AvatarFallback>
                </Avatar>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted border-2 border-background text-xs">
                  +4
                </div>
              </div>
              <div className="text-sm font-medium">Méditation du soir</div>
            </div>
            <Button variant="outline" className="w-full">Rejoindre</Button>
          </div>
          
          <div>
            <h4 className="font-medium mb-3">Publications récentes</h4>
            <Card className="p-3 mb-2">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Sophie M.</div>
                  <p className="text-xs text-muted-foreground">
                    Je pratique la méditation depuis 3 semaines et je me sens beaucoup plus calme...
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">Il y a 2h • 5 réactions</div>
                </div>
              </div>
            </Card>
            <Card className="p-3">
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback>TR</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">Thomas R.</div>
                  <p className="text-xs text-muted-foreground">
                    Quelqu'un a-t-il essayé l'exercice de respiration 4-7-8 ? Ça fonctionne vraiment...
                  </p>
                  <div className="text-xs text-muted-foreground mt-1">Il y a 5h • 8 réactions</div>
                </div>
              </div>
            </Card>
          </div>
          
          <Button className="w-full">Explorer la communauté</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialCocoonWidget;
