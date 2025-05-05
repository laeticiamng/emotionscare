
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import SecurityFooter from '@/components/SecurityFooter';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

const CompliancePage = () => {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      requestType: "access",
      requestDetails: "",
    },
  });
  
  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    toast({
      title: "Demande envoyée",
      description: "Votre demande a été enregistrée. Nous reviendrons vers vous sous 30 jours.",
    });
    setFormSubmitted(true);
  };

  return (
    <div className="container py-8 px-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Conformité & Certifications</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-blue-600" />
              Sécurité des Données
            </CardTitle>
            <CardDescription>
              Protection et confidentialité maximales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Chiffrement de bout en bout</p>
                <p className="text-sm text-muted-foreground">Toutes les données sont chiffrées en transit et au repos</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Certification HDS</p>
                <p className="text-sm text-muted-foreground">Hébergement des Données de Santé conforme</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium">Authentification multifactorielle</p>
                <p className="text-sm text-muted-foreground">Protection avancée des accès utilisateurs</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <a 
                href="#" 
                className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Voir le certificat HDS
              </a>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-emerald-600" />
              Conformité Réglementaire
            </CardTitle>
            <CardDescription>
              Respect des normes et régulations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
              <div>
                <p className="font-medium">RGPD compliant</p>
                <p className="text-sm text-muted-foreground">Traitement des données conforme au RGPD</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
              <div>
                <p className="font-medium">ISO 45003</p>
                <p className="text-sm text-muted-foreground">Santé psychologique au travail</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-emerald-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
              <div>
                <p className="font-medium">Conservation des données</p>
                <p className="text-sm text-muted-foreground">Politique de rétention stricte et conformité CNIL</p>
              </div>
            </div>
            
            <div className="mt-4 flex justify-center">
              <a 
                href="#" 
                className="inline-block bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Politique de confidentialité
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow-md mb-12">
        <CardHeader>
          <CardTitle>Demande d'accès ou de suppression de données</CardTitle>
          <CardDescription>
            Conformément au RGPD, vous pouvez demander l'accès ou la suppression de vos données personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formSubmitted ? (
            <div className="text-center p-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Demande enregistrée</h3>
              <p className="text-muted-foreground">
                Nous avons bien reçu votre demande. Notre équipe la traitera dans un délai maximum de 30 jours.
                Un email de confirmation vous a été envoyé.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setFormSubmitted(false)}
              >
                Nouvelle demande
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  rules={{ required: "Votre nom est requis" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom complet</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  rules={{ 
                    required: "Votre email est requis",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email invalide"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requestType"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Type de demande</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="access" id="access" />
                            <Label htmlFor="access">Accès à mes données</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="deletion" id="deletion" />
                            <Label htmlFor="deletion">Suppression de mes données</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="rectification" id="rectification" />
                            <Label htmlFor="rectification">Rectification de mes données</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Autre demande</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requestDetails"
                  rules={{ required: "Veuillez préciser votre demande" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Détails de votre demande</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Veuillez préciser votre demande..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Précisez ici toute information utile pour traiter votre demande.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end">
                  <Button type="submit">Soumettre ma demande</Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
      
      <div className="text-center mb-8">
        <p className="text-muted-foreground italic">
          ÉmotionCare™ ne remplace pas un avis médical ou psychologique.
        </p>
      </div>
    </div>
  );
};

export default CompliancePage;
