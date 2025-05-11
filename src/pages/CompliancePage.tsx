import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Award, FileText, CheckSquare, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CompliancePage: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    requestType: 'access',
    message: ''
  });
  
  const [requestSubmitted, setRequestSubmitted] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, requestType: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simuler l'envoi de la demande
    toast({
      title: "Demande envoyée",
      description: "Votre demande a été enregistrée et sera traitée dans les 30 jours."
    });
    
    setRequestSubmitted(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      requestType: 'access',
      message: ''
    });
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-2">Conformité & Certifications</h1>
      <p className="text-muted-foreground mb-8">
        ÉmotionCare™ s'engage à respecter les plus hauts standards en matière de sécurité, 
        confidentialité et conformité réglementaire.
      </p>

      <Tabs defaultValue="certifications" className="space-y-8">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="gdpr">RGPD</TabsTrigger>
          <TabsTrigger value="request">Demande d'accès / suppression</TabsTrigger>
        </TabsList>
        
        <TabsContent value="certifications">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="mr-2 h-5 w-5 text-blue-600" />
                  ISO 27001
                </CardTitle>
                <CardDescription>
                  Management de la sécurité de l'information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Notre système de management de la sécurité de l'information est conforme à la norme 
                  internationale ISO 27001:2013, garantissant une approche systématique de la gestion des 
                  informations sensibles.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le certificat
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-blue-600" />
                  ISO 27701
                </CardTitle>
                <CardDescription>
                  Management des informations de confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Notre extension du système de management ISO 27001 est conforme à la norme ISO 27701:2019
                  pour la gestion des informations personnelles et la protection de la vie privée.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le certificat
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5 text-blue-600" />
                  SOC 2 Type II
                </CardTitle>
                <CardDescription>
                  Contrôles de sécurité et confidentialité
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Notre audit SOC 2 Type II valide que nos contrôles et processus respectent les
                  principes de confiance sur la sécurité, la disponibilité et la confidentialité.
                </p>
                <Button variant="outline" size="sm" className="mt-4">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le rapport
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckSquare className="mr-2 h-5 w-5 text-blue-600" />
                  Hébergeur de Données de Santé (HDS)
                </CardTitle>
                <CardDescription>
                  Certification pour l'hébergement de données de santé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Notre infrastructure est certifiée HDS, conformément à la réglementation française
                  pour l'hébergement de données de santé à caractère personnel.
                </p>
                <a 
                  href="https://esante.gouv.fr/labels-certifications/hds/liste-des-herbergeurs-certifies" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="mt-4">
                    <FileText className="mr-2 h-4 w-4" />
                    Voir la certification
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Notre approche de la sécurité</CardTitle>
              <CardDescription>
                Une sécurité multicouche pour protéger vos données sensibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sécurité de l'infrastructure</h3>
                  <Separator />
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Chiffrement AES-256 pour toutes les données au repos</li>
                    <li>Chiffrement TLS 1.3 pour toutes les transmissions</li>
                    <li>Surveillance 24/7 avec détection d'intrusion</li>
                    <li>Centres de données redondants avec continuité d'activité</li>
                    <li>Tests de pénétration trimestriels par des tiers</li>
                  </ul>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sécurité des applications</h3>
                  <Separator />
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Authentification multi-facteurs</li>
                    <li>Gestion granulaire des accès basée sur les rôles</li>
                    <li>Sessions sécurisées avec expiration automatique</li>
                    <li>Audit complet des actions utilisateurs</li>
                    <li>Validation des entrées contre les injections</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Programme de sécurité</h3>
                <Separator className="mb-4" />
                <div className="bg-muted/50 p-4 rounded-md">
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li>
                      <span className="font-medium">Audits de sécurité</span>: 
                      Des audits internes mensuels et des revues externes semestrielles
                    </li>
                    <li>
                      <span className="font-medium">Formation</span>: 
                      Formation sécurité obligatoire pour tous les employés
                    </li>
                    <li>
                      <span className="font-medium">Bug Bounty</span>: 
                      Programme de récompense pour la découverte de vulnérabilités
                    </li>
                    <li>
                      <span className="font-medium">Plan de réponse aux incidents</span>: 
                      Procédures détaillées et équipe dédiée pour gérer les incidents de sécurité
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gdpr">
          <Card>
            <CardHeader>
              <CardTitle>Conformité RGPD</CardTitle>
              <CardDescription>
                Comment nous respectons vos droits selon le Règlement Général sur la Protection des Données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Vos droits</h3>
                <Separator className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="font-medium">Droit d'accès</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander une copie de toutes vos données personnelles que nous traitons.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Droit de rectification</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez corriger vos informations personnelles si elles sont inexactes.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Droit à l'effacement</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander la suppression de vos données personnelles.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Droit à la limitation du traitement</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander de restreindre l'utilisation de vos données.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Droit à la portabilité</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez demander vos données dans un format structuré et lisible par machine.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="font-medium">Droit d'opposition</p>
                    <p className="text-sm text-muted-foreground">
                      Vous pouvez vous opposer au traitement de vos données personnelles.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notre engagement</h3>
                <Separator className="mb-4" />
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>
                    Nous ne collectons que les données nécessaires pour fournir nos services
                  </li>
                  <li>
                    Nous ne partageons jamais vos données avec des tiers sans votre consentement explicite
                  </li>
                  <li>
                    Nous avons désigné un Délégué à la Protection des Données (DPO)
                  </li>
                  <li>
                    Nous effectuons des analyses d'impact relatives à la protection des données
                  </li>
                  <li>
                    Nous mettons en œuvre le principe de protection des données dès la conception
                  </li>
                </ul>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-800">
                  Pour exercer vos droits ou pour toute question concernant vos données, veuillez contacter notre Délégué à la 
                  Protection des Données à <strong>dpo@emotioncare.com</strong> ou utiliser le formulaire dans l'onglet 
                  "Demande d'accès / suppression".
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="request">
          <Card>
            <CardHeader>
              <CardTitle>Demande d'accès ou de suppression de données</CardTitle>
              <CardDescription>
                Complétez ce formulaire pour exercer vos droits RGPD
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!requestSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <Input 
                          id="name"
                          name="name"
                          placeholder="Votre nom complet"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <Input 
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre.email@exemple.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="requestType">Type de demande</Label>
                      <Select 
                        value={formData.requestType} 
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type de demande" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="access">Accès à mes données</SelectItem>
                          <SelectItem value="correction">Correction de mes données</SelectItem>
                          <SelectItem value="deletion">Suppression de mes données</SelectItem>
                          <SelectItem value="portability">Portabilité de mes données</SelectItem>
                          <SelectItem value="objection">Opposition au traitement</SelectItem>
                          <SelectItem value="restriction">Limitation du traitement</SelectItem>
                          <SelectItem value="other">Autre demande</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Détails de votre demande</Label>
                      <Textarea 
                        id="message"
                        name="message"
                        placeholder="Veuillez fournir des détails supplémentaires concernant votre demande..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-md text-sm">
                    <p>
                      En soumettant ce formulaire, vous confirmez être la personne concernée par cette demande.
                      Nous traiterons votre demande dans un délai maximum de 30 jours conformément au RGPD.
                      Nous pouvons vous demander une preuve d'identité supplémentaire pour traiter votre demande.
                    </p>
                  </div>
                  
                  <Button type="submit">
                    Soumettre ma demande
                  </Button>
                </form>
              ) : (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="p-3 rounded-full bg-green-100">
                    <CheckSquare className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium">Demande envoyée avec succès</h3>
                  <p className="text-center text-muted-foreground max-w-md">
                    Votre demande a été enregistrée. Notre équipe de protection des données
                    la traitera dans un délai maximum de 30 jours. Vous recevrez une confirmation
                    par email sous 48h.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Numéro de référence: REQ-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
                  </p>
                  <Button 
                    variant="outline" 
                    onClick={() => setRequestSubmitted(false)}
                  >
                    Soumettre une autre demande
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompliancePage;
