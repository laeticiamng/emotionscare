
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const Legal: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg max-w-none dark:prose-invert"
        >
          <h1 className="text-4xl font-bold mb-8">Mentions légales</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Éditeur du site</h2>
            <p>
              EmotionsCare est édité par EmotionsCare SAS, société par actions simplifiée au capital de 10 000€.
              <br />
              Siège social : 123 Avenue de la Paix, 75001 Paris, France
              <br />
              SIRET : 123 456 789 00010
              <br />
              N° TVA Intracommunautaire : FR 12 345678900
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Directeur de la publication</h2>
            <p>
              Le directeur de la publication est Mme Claire Martin, Directrice Générale.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par Cloud Services SAS
              <br />
              Adresse : 45 Rue des Serveurs, 59000 Lille, France
              <br />
              Téléphone : +33 3 20 12 34 56
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Propriété intellectuelle</h2>
            <p>
              L'ensemble du contenu de ce site (structure, textes, logos, images, vidéos, sons, etc.) est la propriété exclusive d'EmotionsCare ou de ses partenaires.
              Toute reproduction ou représentation, intégrale ou partielle, par quelque procédé que ce soit, faite sans le consentement préalable et écrit d'EmotionsCare est illicite et constitue une contrefaçon.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Protection des données personnelles</h2>
            <p>
              EmotionsCare s'engage à protéger la confidentialité de vos données personnelles.
              Conformément à la législation en vigueur, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              Pour exercer ce droit, veuillez nous contacter à l'adresse : privacy@emotionscare.fr
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p>
              Notre site utilise des cookies pour améliorer votre expérience utilisateur et réaliser des statistiques de visite.
              En naviguant sur ce site, vous acceptez l'utilisation de cookies conformément à notre politique de confidentialité.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Nous contacter</h2>
            <p>
              Pour toute question concernant nos mentions légales, vous pouvez nous contacter :
              <br />
              Par email : contact@emotionscare.fr
              <br />
              Par téléphone : +33 1 23 45 67 89
              <br />
              Par courrier : EmotionsCare, Service Juridique, 123 Avenue de la Paix, 75001 Paris, France
            </p>
          </section>
        </motion.div>
      </div>
    </Shell>
  );
};

export default Legal;
