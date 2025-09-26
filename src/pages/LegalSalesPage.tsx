import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const LegalSalesPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-6" data-testid="page-root">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>
          </Link>
        </div>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Conditions Générales de Vente
            </h1>
          </div>
          <p className="text-muted-foreground">
            Dernière mise à jour : 15 janvier 2024
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informations légales</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none space-y-6">
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 1 - Objet</h2>
              <p>
                Les présentes conditions générales de vente (CGV) régissent les relations contractuelles 
                entre EmotionsCare et ses clients dans le cadre de la vente de services de bien-être 
                numérique et de santé mentale.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 2 - Services proposés</h2>
              <p>EmotionsCare propose les services suivants :</p>
              <ul className="list-disc ml-6 space-y-2">
                <li>Plateforme de scan émotionnel et analyse comportementale</li>
                <li>Sessions de musicothérapie personnalisées</li>
                <li>Coaching IA pour le bien-être mental</li>
                <li>Expériences de réalité virtuelle thérapeutiques</li>
                <li>Journal personnel et outils de réflexion</li>
                <li>Solutions B2B pour entreprises</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 3 - Tarifs et modalités de paiement</h2>
              <div className="space-y-4">
                <h3 className="text-xl font-medium">3.1 Tarification</h3>
                <p>
                  Les tarifs sont indiqués en euros TTC. EmotionsCare se réserve le droit de modifier 
                  ses tarifs à tout moment, sous réserve d'en informer les clients au moins 30 jours 
                  à l'avance.
                </p>

                <h3 className="text-xl font-medium">3.2 Modalités de paiement</h3>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Paiement par carte bancaire (Visa, Mastercard)</li>
                  <li>Virement bancaire (entreprises)</li>
                  <li>Prélèvement automatique (abonnements)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 4 - Droit de rétractation</h2>
              <p>
                Conformément à l'article L.221-18 du Code de la consommation, le client dispose 
                d'un délai de 14 jours francs pour exercer son droit de rétractation sans avoir 
                à justifier de motifs ni à payer de pénalités.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Article 5 - Responsabilité</h2>
              <p>
                EmotionsCare ne saurait être tenue responsable des dommages indirects, lucrum cessans, 
                perte de chiffre d'affaires, perte de clientèle ou perte de données.
              </p>
            </section>

          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">Besoin d'aide ?</h3>
              <p className="text-muted-foreground">
                Si vous avez des questions sur nos conditions de vente, notre équipe est là pour vous aider.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button>Contacter le support</Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline">Centre d'aide</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LegalSalesPage;