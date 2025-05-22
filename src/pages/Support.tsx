
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Shell from '@/Shell';
import { 
  MessageSquare, 
  MailIcon, 
  PhoneIcon, 
  BookOpenIcon, 
  HelpCircleIcon,
  Heart 
} from 'lucide-react';

const Support: React.FC = () => {
  const navigate = useNavigate();

  // FAQ items
  const faqItems = [
    {
      question: "Comment fonctionne le scan émotionnel ?",
      answer: "Notre scan émotionnel utilise l'intelligence artificielle pour analyser vos expressions faciales, votre voix et vos réponses à des questions spécifiques. Il identifie ensuite votre état émotionnel actuel et propose des recommandations personnalisées."
    },
    {
      question: "Est-ce que mes données sont protégées ?",
      answer: "Absolument. Nous prenons la confidentialité de vos données très au sérieux. Toutes les informations sont cryptées et nous ne partageons jamais vos données avec des tiers sans votre consentement explicite. Vous pouvez consulter notre politique de confidentialité pour plus de détails."
    },
    {
      question: "Comment annuler mon abonnement ?",
      answer: "Vous pouvez annuler votre abonnement à tout moment depuis votre espace personnel. Accédez à la section 'Paramètres' puis 'Abonnement' et cliquez sur 'Annuler mon abonnement'. Vous conserverez l'accès aux fonctionnalités jusqu'à la fin de votre période de facturation."
    },
    {
      question: "Les entreprises peuvent-elles voir les données individuelles des collaborateurs ?",
      answer: "Non. Les administrateurs B2B n'ont accès qu'à des données agrégées et anonymisées sur le bien-être général de l'équipe. Les informations individuelles restent strictement confidentielles, assurant ainsi la vie privée de chaque collaborateur."
    },
    {
      question: "Comment démarrer avec la plateforme ?",
      answer: "Après votre inscription, nous vous guiderons à travers un court processus d'onboarding pour personnaliser votre expérience. Nous vous recommandons de commencer par un scan émotionnel pour obtenir vos premières recommandations personnalisées."
    }
  ];

  return (
    <Shell>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
            Comment pouvons-nous vous aider ?
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground">
            Notre équipe est là pour vous accompagner dans votre parcours de bien-être émotionnel.
          </p>
        </motion.div>
        
        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Chat Option */}
          <motion.div 
            className="bg-card rounded-lg p-6 border shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Chat en direct</h3>
            <p className="text-muted-foreground mb-4">
              Discutez avec notre équipe de support en temps réel pour une assistance immédiate.
            </p>
            <Button className="w-full">
              Démarrer un chat
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Disponible 7j/7, de 8h à 20h
            </p>
          </motion.div>
          
          {/* Email Option */}
          <motion.div 
            className="bg-card rounded-lg p-6 border shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <MailIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Email</h3>
            <p className="text-muted-foreground mb-4">
              Envoyez-nous un message et nous vous répondrons dans les 24 heures.
            </p>
            <Button variant="outline" className="w-full">
              support@emotioncare.com
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Réponse sous 24h ouvrées
            </p>
          </motion.div>
          
          {/* Phone Option */}
          <motion.div 
            className="bg-card rounded-lg p-6 border shadow-sm text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -5 }}
          >
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <PhoneIcon className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Téléphone</h3>
            <p className="text-muted-foreground mb-4">
              Besoin de parler à un conseiller ? Appelez notre équipe de support.
            </p>
            <Button variant="outline" className="w-full">
              01 23 45 67 89
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Du lundi au vendredi, 9h-18h
            </p>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex justify-center items-center mb-4">
              <HelpCircleIcon className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-3xl font-bold">Questions fréquentes</h2>
            </div>
            <p className="text-muted-foreground">
              Trouvez rapidement des réponses aux questions les plus courantes
            </p>
          </motion.div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                className="border rounded-lg p-6 bg-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
              >
                <h3 className="text-lg font-semibold mb-2">{item.question}</h3>
                <p className="text-muted-foreground">{item.answer}</p>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Button onClick={() => navigate('/faq')} variant="outline">
              Voir toutes les questions fréquentes
            </Button>
          </motion.div>
        </div>
        
        {/* Documentation Section */}
        <motion.div 
          className="bg-primary/5 rounded-xl p-8 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <div className="flex justify-center items-center mb-4">
            <BookOpenIcon className="h-8 w-8 text-primary mr-2" />
            <h2 className="text-2xl font-bold">Documentation</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Explorez notre centre de documentation pour des guides détaillés sur toutes nos fonctionnalités et des conseils pour tirer le meilleur parti de notre plateforme.
          </p>
          <Button>
            Accéder à la documentation
          </Button>
        </motion.div>
        
        {/* Health Crisis Section */}
        <motion.div 
          className="mt-16 p-6 border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 rounded-lg max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <div className="flex items-start">
            <Heart className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Urgence émotionnelle ?</h3>
              <p className="text-muted-foreground mb-3">
                Notre plateforme n'est pas conçue pour les urgences de santé mentale. Si vous ou un proche êtes en situation de crise :
              </p>
              <ul className="list-disc pl-5 mb-4 text-muted-foreground space-y-1">
                <li>Contactez immédiatement le 15 (SAMU)</li>
                <li>Appelez le 3114, numéro national de prévention du suicide (24/7)</li>
                <li>Rendez-vous aux urgences de l'hôpital le plus proche</li>
              </ul>
              <p className="text-sm text-muted-foreground italic">
                Notre plateforme est un outil de bien-être et ne remplace pas un avis médical professionnel.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </Shell>
  );
};

export default Support;
