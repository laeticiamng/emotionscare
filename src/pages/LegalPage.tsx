
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LegalPage = () => {
  return (
    <Shell>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">Mentions légales</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>EmotionsCare - Mentions légales</CardTitle>
            <CardDescription>Dernière mise à jour : 22 mai 2025</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none">
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">1. Informations légales</h2>
              <p>
                Le site EmotionsCare est édité par la société EmotionsCare SAS, au capital de 10 000€, 
                immatriculée au RCS de Paris sous le numéro 123 456 789, dont le siège social est situé au 123 rue de la Paix, 75001 Paris.
              </p>
              <p>
                N° de TVA intracommunautaire : FR 12 345 678 910<br />
                Directeur de la publication : Jane Doe<br />
                Email : contact@emotionscare.com<br />
                Téléphone : +33 1 23 45 67 89
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">2. Hébergement</h2>
              <p>
                Le site EmotionsCare est hébergé par la société DigitalOcean, LLC.<br />
                Adresse : 101 Avenue of the Americas, 10th Floor, New York, NY 10013, USA
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu du site EmotionsCare (structure, textes, images, graphismes, logo, etc.) 
                est la propriété exclusive d'EmotionsCare SAS ou de ses partenaires.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission, ou exploitation totale ou partielle 
                du site ou de son contenu, par quelque procédé que ce soit, sans l'autorisation préalable et écrite 
                d'EmotionsCare SAS, est strictement interdite.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">4. Données personnelles</h2>
              <p>
                Les informations concernant la collecte et le traitement des données personnelles sont détaillées 
                dans notre Politique de confidentialité accessible sur ce site.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">5. Cookies</h2>
              <p>
                Le site EmotionsCare utilise des cookies. Pour en savoir plus sur notre politique en matière de cookies, 
                veuillez consulter notre Politique de confidentialité.
              </p>
            </section>
            
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3">6. Responsabilité</h2>
              <p>
                EmotionsCare SAS ne pourra être tenue responsable des dommages directs ou indirects résultant 
                de l'utilisation du site ou de l'impossibilité d'y accéder.
              </p>
              <p>
                EmotionsCare SAS se réserve le droit de modifier le contenu du site à tout moment et sans préavis.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Droit applicable</h2>
              <p>
                Le présent site et les présentes mentions légales sont soumis au droit français. 
                En cas de litige, les tribunaux français seront compétents.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default LegalPage;
