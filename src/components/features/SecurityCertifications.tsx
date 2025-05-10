
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, FileText, Check } from 'lucide-react';

const SecurityCertifications: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Certifications et sécurité
        </CardTitle>
        <CardDescription>
          EmotionsCare respecte les normes les plus strictes en matière de protection des données.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-2">RGPD</Badge>
            <h3 className="text-center font-medium mb-2">Conforme RGPD</h3>
            <p className="text-xs text-center text-muted-foreground mb-4">
              Protection complète des données personnelles selon la réglementation européenne.
            </p>
            <div className="mt-auto">
              <Button variant="ghost" size="sm">En savoir plus</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-2">ISO 27001</Badge>
            <h3 className="text-center font-medium mb-2">Certifié ISO 27001</h3>
            <p className="text-xs text-center text-muted-foreground mb-4">
              Système de gestion de la sécurité de l'information certifié.
            </p>
            <div className="mt-auto">
              <Button variant="ghost" size="sm">Voir certification</Button>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-4 border rounded-lg">
            <Badge variant="outline" className="bg-primary/10 text-primary mb-2">HIPAA</Badge>
            <h3 className="text-center font-medium mb-2">Compatible HIPAA</h3>
            <p className="text-xs text-center text-muted-foreground mb-4">
              Conforme aux exigences de protection des données de santé.
            </p>
            <div className="mt-auto">
              <Button variant="ghost" size="sm">Détails</Button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-3">
          <h3 className="font-medium">Notre engagement de sécurité</h3>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Chiffrement de bout en bout</span> - Vos données émotionnelles sont chiffrées en permanence.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Authentification à deux facteurs</span> - Sécurité renforcée pour protéger votre compte.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Audits de sécurité réguliers</span> - Protection continue contre les vulnérabilités.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-sm">
                <span className="font-medium">Contrôle total de vos données</span> - Vous décidez quelles données partager et avec qui.
              </span>
            </li>
          </ul>
        </div>
        
        <div className="flex items-center justify-between mt-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-3">
            <Lock className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-medium">Centre de confidentialité</h4>
              <p className="text-sm text-muted-foreground">Consultez notre politique de confidentialité complète</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-1">
            <FileText className="h-4 w-4" />
            Accéder
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityCertifications;
