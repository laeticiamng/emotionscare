import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const EnhancedCoachAI = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Votre Coach Émotionnel</CardTitle>
        <CardDescription>Recevez des conseils personnalisés basés sur votre état émotionnel.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src="/images/avatars/coach-ai.png" alt="Coach AI" />
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">Coach AI</h3>
            <p className="text-sm text-muted-foreground">Votre assistant émotionnel personnel</p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-md font-medium">Comment vous sentez-vous aujourd'hui ?</h4>
          <p className="text-sm text-muted-foreground">Décrivez vos émotions ou utilisez le scanner pour une analyse plus approfondie.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedCoachAI;
