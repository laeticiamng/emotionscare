// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Trash2 } from 'lucide-react';

export const PrivacyNote: React.FC = () => {
  return (
    <Card className="bg-muted/30 border-muted">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          
          <div className="space-y-2 text-sm">
            <h4 className="font-medium text-foreground">
              Respect de votre vie privée
            </h4>
            
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Eye className="w-3 h-3 mt-1 flex-shrink-0" />
                <span>L'image n'est pas stockée par défaut</span>
              </div>
              
              <div className="flex items-start gap-2">
                <Trash2 className="w-3 h-3 mt-1 flex-shrink-0" />
                <span>Les données sont supprimées après analyse</span>
              </div>
              
              <div className="flex items-start gap-2">
                <Shield className="w-3 h-3 mt-1 flex-shrink-0" />
                <span>Seul le résultat d'émotion est conservé (si vous le souhaitez)</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground italic">
              Aucune caméra n'est activée en permanence. 
              La capture se fait uniquement à votre demande.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};