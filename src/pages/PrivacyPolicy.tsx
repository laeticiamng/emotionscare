
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
          
          <section className="mb-8">
            <p className="text-muted-foreground">
              Dernière mise à jour : 22 mai 2025
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p>
              La présente Politique de confidentialité décrit comment EmotionsCare collecte, utilise et partage vos informations personnelles lorsque vous utilisez notre service.
              Nous utilisons vos données personnelles pour fournir et améliorer le service. En utilisant le service, vous acceptez la collecte et l'utilisation d'informations conformément à cette politique.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Collecte et utilisation des données</h2>
            <p>
              Nous collectons plusieurs types d'informations à différentes fins pour fournir et améliorer notre service.
            </p>
            
            <h3 className="text-xl font-medium my-4">Types de données collectées</h3>
            
            <h4 className="text-lg font-medium my-2">Données personnelles</h4>
            <p>
              Lors de l'utilisation de notre service, nous pouvons vous demander de nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour vous contacter ou vous identifier (« Données personnelles »). Les informations personnellement identifiables peuvent inclure, sans s'y limiter :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Adresse e-mail</li>
              <li>Prénom et nom</li>
              <li>Données d'utilisation</li>
              <li>Données émotionnelles et de bien-être</li>
            </ul>
            
            <h4 className="text-lg font-medium my-2">Données d'utilisation</h4>
            <p>
              Nous pouvons également collecter des informations sur la façon dont le service est accédé et utilisé (« Données d'utilisation »). Ces données peuvent inclure des informations telles que l'adresse de protocole Internet de votre ordinateur (par exemple, l'adresse IP), le type de navigateur, la version du navigateur, les pages de notre service que vous visitez, l'heure et la date de votre visite, le temps passé sur ces pages, les identifiants uniques des appareils et d'autres données de diagnostic.
            </p>
            
            <h4 className="text-lg font-medium my-2">Données émotionnelles</h4>
            <p>
              Notre service collecte des données sur votre état émotionnel et de bien-être. Ces données sont traitées avec le plus haut niveau de confidentialité et sont utilisées uniquement pour vous fournir des services personnalisés et améliorer votre expérience sur notre plateforme.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Utilisation des données</h2>
            <p>
              EmotionsCare utilise les données collectées à diverses fins :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Pour fournir et maintenir notre service</li>
              <li>Pour vous informer des changements apportés à notre service</li>
              <li>Pour vous permettre de participer aux fonctionnalités interactives de notre service</li>
              <li>Pour fournir un service client</li>
              <li>Pour recueillir des analyses ou des informations précieuses afin d'améliorer notre service</li>
              <li>Pour surveiller l'utilisation de notre service</li>
              <li>Pour détecter, prévenir et résoudre les problèmes techniques</li>
              <li>Pour vous fournir des conseils et des recommandations personnalisés basés sur votre état émotionnel</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Conservation des données</h2>
            <p>
              EmotionsCare conservera vos Données personnelles uniquement pendant la durée nécessaire aux fins énoncées dans cette Politique de confidentialité. Nous conserverons et utiliserons vos Données personnelles dans la mesure nécessaire pour nous conformer à nos obligations légales, résoudre des litiges et appliquer nos politiques.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Transfert des données</h2>
            <p>
              Vos informations, y compris les Données personnelles, peuvent être transférées vers — et maintenues sur — des ordinateurs situés en dehors de votre état, province, pays ou autre juridiction gouvernementale où les lois sur la protection des données peuvent différer de celles de votre juridiction.
            </p>
            <p className="mt-4">
              Votre consentement à cette Politique de confidentialité, suivi de votre soumission de telles informations, représente votre accord à ce transfert.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Divulgation des données</h2>
            <h3 className="text-xl font-medium my-4">Exigences légales</h3>
            <p>
              EmotionsCare peut divulguer vos Données personnelles en croyant de bonne foi qu'une telle action est nécessaire pour :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Se conformer à une obligation légale</li>
              <li>Protéger et défendre les droits ou la propriété d'EmotionsCare</li>
              <li>Prévenir ou enquêter sur d'éventuels actes répréhensibles en rapport avec le service</li>
              <li>Protéger la sécurité personnelle des utilisateurs du service ou du public</li>
              <li>Se protéger contre la responsabilité légale</li>
            </ul>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Sécurité des données</h2>
            <p>
              La sécurité de vos données est importante pour nous, mais n'oubliez pas qu'aucune méthode de transmission sur Internet ou méthode de stockage électronique n'est sûre à 100%. Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos Données personnelles, nous ne pouvons garantir leur sécurité absolue.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Vos droits de protection des données</h2>
            <p>
              En vertu du Règlement général sur la protection des données (RGPD), vous disposez de certains droits concernant vos Données personnelles :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li><strong>Le droit d'accès</strong> - Vous avez le droit de demander des copies de vos Données personnelles.</li>
              <li><strong>Le droit de rectification</strong> - Vous avez le droit de demander que nous corrigions toute information que vous jugez inexacte. Vous avez également le droit de demander que nous complétions les informations que vous jugez incomplètes.</li>
              <li><strong>Le droit à l'effacement</strong> - Vous avez le droit de demander que nous effacions vos Données personnelles, sous certaines conditions.</li>
              <li><strong>Le droit de restreindre le traitement</strong> - Vous avez le droit de demander que nous restreignions le traitement de vos Données personnelles, sous certaines conditions.</li>
              <li><strong>Le droit à la portabilité des données</strong> - Vous avez le droit de demander que nous transférions les données que nous avons collectées à une autre organisation, ou directement à vous, sous certaines conditions.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
            <p>
              Si vous avez des questions concernant cette Politique de confidentialité, veuillez nous contacter :
            </p>
            <ul className="list-disc pl-6 my-4">
              <li>Par email : privacy@emotionscare.fr</li>
              <li>Par courrier : EmotionsCare, Service Confidentialité, 123 Avenue de la Paix, 75001 Paris, France</li>
            </ul>
          </section>
        </motion.div>
      </div>
    </Shell>
  );
};

export default PrivacyPolicy;
