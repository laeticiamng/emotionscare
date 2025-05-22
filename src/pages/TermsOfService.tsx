
import React from 'react';
import Shell from '@/Shell';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <Shell>
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg max-w-none dark:prose-invert"
        >
          <h1 className="text-4xl font-bold mb-8">Conditions d'utilisation</h1>
          
          <section className="mb-8">
            <p className="text-muted-foreground">
              Dernière mise à jour : 22 mai 2025
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant ou en utilisant le service EmotionsCare, vous acceptez d'être lié par ces Conditions. Si vous n'êtes pas d'accord avec une partie des conditions, vous ne pouvez pas accéder au service.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Modifications des conditions</h2>
            <p>
              Nous nous réservons le droit, à notre seule discrétion, de modifier ou de remplacer ces Conditions à tout moment. Si une révision est importante, nous fournirons un préavis d'au moins 30 jours avant l'entrée en vigueur de nouvelles conditions. Ce qui constitue un changement important sera déterminé à notre seule discrétion.
            </p>
            <p className="mt-4">
              En continuant à accéder ou à utiliser notre Service après que ces révisions deviennent effectives, vous acceptez d'être lié par les conditions révisées. Si vous n'acceptez pas les nouvelles conditions, veuillez cesser d'utiliser le Service.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Comptes utilisateurs</h2>
            <p>
              Lorsque vous créez un compte avec nous, vous garantissez que vous avez plus de 18 ans et que les informations que vous fournissez sont exactes, complètes et à jour à tout moment. Des informations inexactes, incomplètes ou obsolètes peuvent entraîner la résiliation immédiate de votre compte sur le Service.
            </p>
            <p className="mt-4">
              Vous êtes responsable du maintien de la confidentialité de votre compte et de votre mot de passe, y compris, mais sans s'y limiter, de la restriction de l'accès à votre ordinateur et/ou compte. Vous acceptez d'assumer la responsabilité de toutes les activités ou actions qui se produisent sous votre compte et/ou mot de passe, que votre mot de passe soit avec notre Service ou un service tiers.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Contenu utilisateur</h2>
            <p>
              Notre Service vous permet de publier, de lier, de stocker, de partager et de mettre à disposition certaines informations, textes, graphiques, vidéos ou autres contenus ("Contenu"). Vous êtes responsable du Contenu que vous publiez sur ou via le Service, y compris de sa légalité, fiabilité et pertinence.
            </p>
            <p className="mt-4">
              En publiant du Contenu sur ou via le Service, vous déclarez et garantissez que : (i) le Contenu vous appartient (vous en êtes le propriétaire) et/ou vous avez le droit de l'utiliser et le droit de nous accorder les droits et la licence comme prévu dans ces Conditions, et (ii) que la publication de votre Contenu sur ou via le Service ne viole pas les droits à la vie privée, les droits de publicité, les droits d'auteur, les droits contractuels ou tout autre droit de toute personne ou entité.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Propriété intellectuelle</h2>
            <p>
              Le Service et son contenu original, fonctionnalités et fonctionnalités sont et resteront la propriété exclusive d'EmotionsCare et de ses concédants. Le Service est protégé par le droit d'auteur, les marques déposées et d'autres lois de France et d'autres pays. Nos marques commerciales et notre habillage commercial ne peuvent pas être utilisés en relation avec un produit ou un service sans le consentement écrit préalable d'EmotionsCare.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Liens vers d'autres sites web</h2>
            <p>
              Notre Service peut contenir des liens vers des sites web ou services tiers qui ne sont pas détenus ou contrôlés par EmotionsCare.
            </p>
            <p className="mt-4">
              EmotionsCare n'a aucun contrôle sur et n'assume aucune responsabilité pour le contenu, les politiques de confidentialité ou les pratiques de tout site web ou service tiers. Vous reconnaissez et acceptez en outre que EmotionsCare ne sera pas responsable, directement ou indirectement, de tout dommage ou perte causé ou présumé avoir été causé par ou en relation avec l'utilisation ou la confiance accordée à un tel contenu, biens ou services disponibles sur ou par l'intermédiaire de ces sites web ou services.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Résiliation</h2>
            <p>
              Nous pouvons résilier ou suspendre votre compte immédiatement, sans préavis ni responsabilité, pour quelque raison que ce soit, y compris, sans limitation, si vous violez les Conditions.
            </p>
            <p className="mt-4">
              En cas de résiliation, votre droit d'utiliser le Service cessera immédiatement. Si vous souhaitez résilier votre compte, vous pouvez simplement cesser d'utiliser le Service.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">8. Limitation de responsabilité</h2>
            <p>
              En aucun cas EmotionsCare, ni ses administrateurs, employés, partenaires, agents, fournisseurs ou affiliés, ne seront responsables de tout dommage indirect, accessoire, spécial, consécutif ou punitif, y compris, sans s'y limiter, la perte de profits, de données, d'usage, de clientèle, ou d'autres pertes intangibles, résultant de (i) votre accès ou utilisation ou incapacité à accéder ou utiliser le Service ; (ii) tout comportement ou contenu d'un tiers sur le Service ; (iii) tout contenu obtenu à partir du Service ; et (iv) l'accès non autorisé, l'utilisation ou l'altération de vos transmissions ou contenu, que ce soit sur la base d'une garantie, d'un contrat, d'un délit (y compris la négligence) ou de toute autre théorie légale, que nous ayons été informés ou non de la possibilité de tels dommages.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">9. Clause de non-responsabilité</h2>
            <p>
              Votre utilisation du Service est à vos propres risques. Le Service est fourni "tel quel" et "tel que disponible". Le Service est fourni sans garantie d'aucune sorte, expresse ou implicite, y compris, mais sans s'y limiter, les garanties implicites de qualité marchande, d'adéquation à un usage particulier, de non-contrefaçon ou de performance.
            </p>
            <p className="mt-4">
              EmotionsCare ne garantit pas que a) le Service répondra à vos exigences spécifiques, b) le Service sera ininterrompu, opportun, sécurisé ou sans erreur, c) les résultats qui peuvent être obtenus de l'utilisation du Service seront précis ou fiables, d) la qualité de tout produit, service, information ou autre matériel acheté ou obtenu par vous par l'intermédiaire du Service répondra à vos attentes, ou e) toute erreur dans le Service sera corrigée.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Loi applicable</h2>
            <p>
              Ces Conditions seront régies et interprétées conformément aux lois de France, sans égard à ses dispositions en matière de conflit de lois.
            </p>
            <p className="mt-4">
              Notre incapacité à faire respecter un droit ou une disposition de ces Conditions ne sera pas considérée comme une renonciation à ces droits. Si une disposition de ces Conditions est jugée invalide ou inapplicable par un tribunal, les dispositions restantes de ces Conditions resteront en vigueur.
            </p>
          </section>
        </motion.div>
      </div>
    </Shell>
  );
};

export default TermsOfService;
