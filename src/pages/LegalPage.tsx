
import React from 'react';
import Shell from '@/Shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';

const LegalPage = () => {
  return (
    <Shell>
      <div className="container py-8 max-w-4xl mx-auto">
        <motion.h1 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Informations légales
        </motion.h1>
        
        <Tabs defaultValue="legal">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="legal" className="flex-1">Mentions légales</TabsTrigger>
            <TabsTrigger value="terms" className="flex-1">Conditions d'utilisation</TabsTrigger>
            <TabsTrigger value="privacy" className="flex-1">Confidentialité</TabsTrigger>
          </TabsList>
          
          <TabsContent value="legal">
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
          </TabsContent>
          
          <TabsContent value="terms">
            <Card>
              <CardHeader>
                <CardTitle>Conditions Générales d'Utilisation</CardTitle>
                <CardDescription>Dernière mise à jour : 22 mai 2025</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  Les présentes Conditions Générales d'Utilisation ("CGU") régissent l'utilisation du service EmotionsCare ("Service") proposé par EmotionsCare SAS ("Société").
                  En accédant ou en utilisant le Service, vous acceptez d'être lié par ces CGU. Si vous n'acceptez pas ces CGU, vous ne devez pas utiliser le Service.
                </p>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">1. Description du Service</h2>
                  <p>
                    EmotionsCare est une plateforme de bien-être émotionnel proposant des outils et services de gestion du stress,
                    de musicothérapie et d'accompagnement au bien-être personnel et professionnel.
                  </p>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">2. Conditions d'accès</h2>
                  <p>
                    Pour utiliser le Service, vous devez être âgé d'au moins 18 ans ou disposer de l'autorisation d'un parent ou tuteur légal.
                    Vous êtes responsable de maintenir la confidentialité de vos identifiants et de toutes les activités qui se déroulent sous votre compte.
                  </p>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">3. Propriété intellectuelle</h2>
                  <p>
                    Tous les droits de propriété intellectuelle relatifs au Service appartiennent à la Société ou à ses concédants.
                    Aucun droit ou licence ne vous est accordé hormis le droit d'utiliser le Service conformément à ces CGU.
                  </p>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">4. Limitations de responsabilité</h2>
                  <p>
                    Le Service est fourni "en l'état" sans garantie d'aucune sorte. La Société ne garantit pas que le Service sera ininterrompu,
                    sécurisé ou exempt d'erreurs. La Société ne sera pas responsable des dommages indirects, spéciaux, consécutifs ou punitifs.
                  </p>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Modifications des CGU</h2>
                  <p>
                    La Société se réserve le droit de modifier ces CGU à tout moment. Les modifications prendront effet dès leur publication.
                    Il vous incombe de consulter régulièrement ces CGU pour vous tenir informé de toute modification.
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Politique de Confidentialité</CardTitle>
                <CardDescription>Dernière mise à jour : 22 mai 2025</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  La présente Politique de Confidentialité décrit comment EmotionsCare SAS collecte, utilise et partage vos informations
                  lorsque vous utilisez notre service EmotionsCare ("Service").
                </p>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">1. Collecte des données</h2>
                  <p>
                    Nous collectons plusieurs types d'informations à des fins diverses pour fournir et améliorer notre Service :
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Données d'identité : nom, prénom, adresse email</li>
                    <li>Données d'utilisation : interaction avec l'application, préférences</li>
                    <li>Données émotionnelles : stress, humeur, bien-être (avec votre consentement explicite)</li>
                    <li>Données techniques : adresse IP, navigateur, appareil</li>
                  </ul>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">2. Utilisation des données</h2>
                  <p>Nous utilisons vos données personnelles pour :</p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Fournir et maintenir notre Service</li>
                    <li>Personnaliser votre expérience</li>
                    <li>Améliorer notre Service</li>
                    <li>Communiquer avec vous</li>
                    <li>Respecter nos obligations légales</li>
                  </ul>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">3. Conservation des données</h2>
                  <p>
                    Nous conservons vos données personnelles uniquement aussi longtemps que nécessaire aux fins définies
                    dans cette Politique de Confidentialité, et conformément à nos obligations légales.
                  </p>
                </section>
                
                <section className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">4. Vos droits</h2>
                  <p>
                    Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez des droits suivants :
                  </p>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Droit d'accès à vos données</li>
                    <li>Droit de rectification</li>
                    <li>Droit à l'effacement</li>
                    <li>Droit à la limitation du traitement</li>
                    <li>Droit à la portabilité des données</li>
                    <li>Droit d'opposition</li>
                  </ul>
                </section>
                
                <section>
                  <h2 className="text-xl font-semibold mb-3">5. Contact</h2>
                  <p>
                    Si vous avez des questions concernant cette Politique de Confidentialité, veuillez nous contacter à :
                    privacy@emotionscare.com
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Shell>
  );
};

export default LegalPage;
