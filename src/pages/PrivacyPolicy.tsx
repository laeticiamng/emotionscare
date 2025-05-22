
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg max-w-none dark:prose-invert"
        >
          <h1 className="text-4xl font-bold mb-8">Politique de confidentialité</h1>
          
          <section className="mb-12">
            <p className="lead mb-6">
              Chez EmotionsCare, la confidentialité de vos données personnelles est une priorité absolue. 
              Cette politique de confidentialité explique comment nous collectons, utilisons et protégeons vos informations.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Informations que nous collectons</h2>
            <p>Nous pouvons collecter les types d'informations suivants :</p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li><strong>Informations personnelles</strong> : nom, adresse email, numéro de téléphone, et autres coordonnées similaires.</li>
              <li><strong>Informations de profil</strong> : vos préférences, centres d'intérêt, et paramètres personnalisés.</li>
              <li><strong>Données d'utilisation</strong> : comment vous utilisez notre application, y compris la fréquence d'utilisation et les fonctionnalités auxquelles vous accédez.</li>
              <li><strong>Données émotionnelles</strong> : informations sur votre état émotionnel, recueillies via les fonctionnalités de scan émotionnel ou journaux.</li>
              <li><strong>Données de l'appareil</strong> : informations techniques sur l'appareil que vous utilisez pour accéder à nos services.</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Comment nous utilisons vos informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li>Fournir, maintenir et améliorer nos services</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Vous envoyer des notifications relatives à votre compte</li>
              <li>Vous informer sur les mises à jour et nouvelles fonctionnalités</li>
              <li>Développer de nouvelles fonctionnalités basées sur l'utilisation collective</li>
              <li>Analyser l'efficacité de nos services et comprendre comment ils sont utilisés</li>
              <li>Détecter et prévenir les fraudes et abus</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Protection de vos informations émotionnelles</h2>
            <p>
              Les données émotionnelles que nous collectons sont particulièrement sensibles. Nous mettons en place des mesures 
              de protection renforcées pour ces données :
            </p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li>Chiffrement de bout en bout pour toutes les données émotionnelles</li>
              <li>Anonymisation des données utilisées pour la recherche et l'amélioration des services</li>
              <li>Accès strictement limité même au sein de notre organisation</li>
              <li>Politique de suppression automatique selon les préférences utilisateur</li>
              <li>Aucun partage avec des tiers sans consentement explicite</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Partage d'informations</h2>
            <p>
              Nous ne vendons jamais vos données personnelles à des tiers. Nous pouvons partager vos informations dans les 
              circonstances suivantes :
            </p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li>Avec votre consentement explicite</li>
              <li>Avec nos fournisseurs de services qui nous aident à fournir nos services</li>
              <li>Pour respecter les obligations légales</li>
              <li>En cas de fusion, acquisition ou vente d'actifs (vos droits de confidentialité seront préservés)</li>
              <li>Sous forme agrégée et anonymisée pour l'analyse et la recherche</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services et 
              respecter nos obligations légales. Si vous supprimez votre compte, nous supprimerons vos données personnelles 
              dans un délai de 30 jours, sauf si la loi nous oblige à les conserver plus longtemps.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Vos droits</h2>
            <p>Selon votre localisation, vous pouvez avoir certains droits concernant vos données personnelles, notamment :</p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier des données inexactes</li>
              <li>Supprimer vos données</li>
              <li>Limiter ou vous opposer au traitement de vos données</li>
              <li>Exporter vos données dans un format portable</li>
              <li>Retirer votre consentement à tout moment</li>
            </ul>
            <p>
              Pour exercer ces droits, contactez-nous à privacy@emotionscare.fr.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Sécurité des données</h2>
            <p>
              Nous prenons la sécurité de vos données très au sérieux et mettons en œuvre des mesures techniques et 
              organisationnelles appropriées pour protéger vos données personnelles contre la perte, l'accès non autorisé, 
              la divulgation, l'altération et la destruction.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Nous vous informerons de tout 
              changement significatif par email ou par une notification dans notre application. Nous vous encourageons à 
              consulter régulièrement cette politique pour rester informé de la façon dont nous protégeons vos informations.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Nous contacter</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité ou nos pratiques en matière de 
              protection des données, veuillez nous contacter à :
            </p>
            <p className="mt-4">
              EmotionsCare<br />
              Service Protection des Données<br />
              123 Avenue de la Paix, 75001 Paris, France<br />
              privacy@emotionscare.fr<br />
              +33 1 23 45 67 89
            </p>
          </section>
        </motion.div>
      </div>
    </Shell>
  );
};

export default PrivacyPolicy;
