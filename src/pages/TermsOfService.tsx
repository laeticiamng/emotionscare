
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
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptation des conditions</h2>
            <p>
              En accédant à ce site et en utilisant nos services, vous acceptez d'être lié par ces conditions d'utilisation, 
              toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect de toutes 
              les lois locales applicables. Si vous n'acceptez pas l'une de ces conditions, vous n'êtes pas autorisé à utiliser 
              ou à accéder à ce site. Les documents contenus dans ce site sont protégés par les lois applicables en matière de 
              droits d'auteur et de marques commerciales.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">2. Licence d'utilisation</h2>
            <p>
              Une autorisation est accordée pour télécharger temporairement une copie des documents (informations ou logiciels) 
              sur le site d'EmotionsCare pour un visionnage transitoire personnel et non commercial uniquement. Il s'agit de 
              l'octroi d'une licence, et non d'un transfert de titre, et sous cette licence, vous ne pouvez pas:
            </p>
            <ul className="list-disc pl-6 mt-4 mb-4">
              <li>Modifier ou copier les documents;</li>
              <li>Utiliser les documents à des fins commerciales ou pour toute présentation publique;</li>
              <li>Tenter de décompiler ou de désosser tout logiciel contenu sur le site d'EmotionsCare;</li>
              <li>Supprimer tout droit d'auteur ou autres annotations de propriété des documents; ou</li>
              <li>Transférer les documents à une autre personne ou "mettre en miroir" les documents sur un autre serveur.</li>
            </ul>
            <p>
              Cette licence sera automatiquement résiliée si vous violez l'une de ces restrictions et peut être résiliée par 
              EmotionsCare à tout moment. À la résiliation de votre visionnage de ces documents ou à la résiliation de cette 
              licence, vous devez détruire tous les documents téléchargés en votre possession, qu'ils soient sous format 
              électronique ou imprimé.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">3. Clause de non-responsabilité</h2>
            <p>
              Les documents sur le site d'EmotionsCare sont fournis "tels quels". EmotionsCare ne donne aucune garantie, 
              expresse ou implicite, et décline et nie par la présente toutes les autres garanties, y compris, sans limitation, 
              les garanties implicites ou les conditions de qualité marchande, d'adéquation à un usage particulier, ou de non-violation 
              de la propriété intellectuelle ou autre violation des droits.
            </p>
            <p className="mt-4">
              En outre, EmotionsCare ne garantit ni ne fait aucune déclaration concernant l'exactitude, les résultats probables, 
              ou la fiabilité de l'utilisation des documents sur son site ou autrement liés à ces documents ou sur tout site lié 
              à ce site.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
            <p>
              En aucun cas, EmotionsCare ou ses fournisseurs ne seront responsables de tout dommage (y compris, sans limitation, 
              les dommages pour perte de données ou de profit, ou en raison d'une interruption d'activité) découlant de l'utilisation 
              ou de l'incapacité d'utiliser les documents sur le site d'EmotionsCare, même si EmotionsCare ou un représentant autorisé 
              d'EmotionsCare a été informé oralement ou par écrit de la possibilité de tels dommages. Comme certaines juridictions 
              n'autorisent pas les limitations sur les garanties implicites, ou les limitations de responsabilité pour les dommages 
              consécutifs ou accessoires, ces limitations peuvent ne pas s'appliquer à vous.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">5. Révisions et errata</h2>
            <p>
              Les documents apparaissant sur le site d'EmotionsCare pourraient inclure des erreurs techniques, typographiques ou 
              photographiques. EmotionsCare ne garantit pas que l'un des documents sur son site est exact, complet ou à jour. 
              EmotionsCare peut apporter des modifications aux documents contenus sur son site à tout moment sans préavis. 
              EmotionsCare ne s'engage toutefois pas à mettre à jour les documents.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">6. Liens</h2>
            <p>
              EmotionsCare n'a pas examiné tous les sites liés à son site et n'est pas responsable du contenu de ces sites liés. 
              L'inclusion de tout lien n'implique pas l'approbation par EmotionsCare du site. L'utilisation d'un tel site lié est 
              aux risques et périls de l'utilisateur.
            </p>
          </section>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">7. Modifications des conditions d'utilisation</h2>
            <p>
              EmotionsCare peut réviser ces conditions d'utilisation de son site à tout moment sans préavis. En utilisant ce site, 
              vous acceptez d'être lié par la version alors actuelle de ces conditions d'utilisation.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Loi applicable</h2>
            <p>
              Toutes les réclamations relatives à notre site web et à nos services sont régies par les lois de la France, 
              sans égard aux dispositions relatives aux conflits de lois.
            </p>
          </section>
        </motion.div>
      </div>
    </Shell>
  );
};

export default TermsOfService;
