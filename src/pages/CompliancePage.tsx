
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, FileText, AlertCircle } from 'lucide-react';
import Layout from '@/components/Layout';

const CompliancePage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Conformité & Bonnes Pratiques</h1>
        
        <Tabs defaultValue="security">
          <TabsList className="mb-6">
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="privacy">Confidentialité</TabsTrigger>
            <TabsTrigger value="compliance">Certifications</TabsTrigger>
            <TabsTrigger value="procedures">Procédures</TabsTrigger>
          </TabsList>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2" size={20} />
                  Mesures de Sécurité
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">Authentification</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Authentification multi-facteur obligatoire pour tous les comptes</li>
                  <li>Support WebAuthn/FIDO2 pour les administrateurs</li>
                  <li>Politique de mot de passe renforcée (min. 12 caractères, complexité, expiration)</li>
                </ul>
                
                <h3 className="font-semibold text-lg">Chiffrement</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>HTTPS/TLS 1.3 avec HSTS préchargé</li>
                  <li>Chiffrement AES-256 au repos des données sensibles</li>
                  <li>Tokenisation des données personnelles identifiables</li>
                </ul>
                
                <h3 className="font-semibold text-lg">Contrôle d'accès</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>RBAC (Role-Based Access Control) très granulaire</li>
                  <li>Principe du moindre privilège</li>
                  <li>Audit trail complet de chaque action</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2" size={20} />
                  Protection des Données
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  EmotionsCare respecte intégralement le Règlement Général sur la Protection des Données (RGPD)
                  et applique les principes de confidentialité dès la conception (Privacy by Design).
                </p>
                
                <h3 className="font-semibold text-lg">Droits des utilisateurs</h3>
                <p>
                  Vous pouvez à tout moment exercer vos droits d'accès, de rectification, de suppression,
                  de portabilité, d'opposition et de limitation du traitement de vos données personnelles.
                </p>
                
                <h3 className="font-semibold text-lg">Délégué à la Protection des Données</h3>
                <p>
                  Pour toute question relative à la protection de vos données, 
                  vous pouvez contacter notre DPO à l'adresse : dpo@emotionscare.com
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="compliance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2" size={20} />
                  Normes & Certifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  EmotionsCare est architecturée selon les principes des normes internationales suivantes :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'ISO 27001', desc: 'Management de la sécurité de l\'information' },
                    { name: 'ISO 27701', desc: 'Management des informations de confidentialité' },
                    { name: 'ISO 22301', desc: 'Continuité d\'activité' },
                    { name: 'ISO 9001', desc: 'Management de la qualité' },
                    { name: 'ISO 20000', desc: 'Management des services informatiques' },
                    { name: 'SOC 2 Type II', desc: 'Contrôles de sécurité, disponibilité et confidentialité' },
                    { name: 'RGPD', desc: 'Protection des données personnelles' },
                    { name: 'NIS', desc: 'Sécurité des réseaux et systèmes d\'information' },
                    { name: 'HIPAA', desc: 'Protection des données de santé' },
                    { name: 'PCI-DSS', desc: 'Sécurité des données de paiement' }
                  ].map((cert) => (
                    <div key={cert.name} className="border rounded p-3">
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">{cert.desc}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="procedures">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2" size={20} />
                  Procédures & Registre
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="font-semibold text-lg">Registre des traitements</h3>
                <p>
                  Conformément à l'article 30 du RGPD, EmotionsCare tient un registre
                  des activités de traitement des données personnelles, régulièrement mis à jour.
                </p>
                
                <h3 className="font-semibold text-lg">Analyse d'impact (DPIA)</h3>
                <p>
                  Des analyses d'impact sur la protection des données sont réalisées
                  pour tout traitement susceptible d'engendrer un risque élevé pour
                  les droits et libertés des personnes concernées.
                </p>
                
                <h3 className="font-semibold text-lg">Procédures de réponse aux incidents</h3>
                <p>
                  EmotionsCare dispose de procédures documentées pour la gestion des
                  incidents de sécurité, incluant la notification aux autorités et
                  aux personnes concernées en cas de violation de données personnelles.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CompliancePage;
