
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import HeroSection from '@/components/home/HeroSection';
import { Shield, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';

// Types pour les bénéfices et témoignages
interface Benefit {
  id: string;
  title: string;
  description: string;
  iconUrl: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarUrl: string;
}

// Composant pour les bénéfices
const BenefitCard = ({ benefit, index }: { benefit: Benefit; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        // Enregistrer l'événement analytics quand la carte est visible
        console.debug('Analytics Event:', 'benefitViewed', { benefitId: benefit.id });
        // Ici, on pourrait appeler une API pour enregistrer l'événement
      }
    }, { threshold: 0.3 });
    
    const element = document.getElementById(`benefit-${benefit.id}`);
    if (element) observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  }, [benefit.id]);
  
  return (
    <motion.div
      id={`benefit-${benefit.id}`}
      data-id={benefit.id}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-center justify-center mb-4 h-16 w-16 mx-auto bg-blue-50 dark:bg-blue-900/30 rounded-full">
        <img src={benefit.iconUrl} alt="" className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">{benefit.title}</h3>
      <p className="text-sm text-center text-gray-600 dark:text-gray-300">{benefit.description}</p>
    </motion.div>
  );
};

// Carousel de témoignages
const TestimonialsCarousel = ({ testimonials }: { testimonials: Testimonial[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 6000);
    
    return () => clearInterval(timer);
  }, [testimonials.length]);
  
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };
  
  if (testimonials.length === 0) return null;
  
  return (
    <div className="relative max-w-4xl mx-auto">
      <div 
        className="overflow-hidden" 
        aria-live="polite" 
        aria-atomic="true"
      >
        <div className="flex">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="w-full flex-shrink-0"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: currentIndex === index ? 1 : 0,
                x: `${(index - currentIndex) * 100}%`
              }}
              transition={{ duration: 0.5 }}
              aria-hidden={currentIndex !== index}
            >
              <blockquote className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-md">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.avatarUrl} 
                    alt={testimonial.name} 
                    className="h-12 w-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="text-lg italic">{testimonial.content}</p>
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-6 space-x-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToPrev}
          aria-label="Témoignage précédent"
        >
          <span className="sr-only">Précédent</span>
          &larr;
        </Button>
        {testimonials.map((_, index) => (
          <Button
            key={index}
            variant={currentIndex === index ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentIndex(index)}
            aria-label={`Témoignage ${index + 1}`}
            aria-current={currentIndex === index}
            className="w-8 h-8 p-0"
          >
            {index + 1}
          </Button>
        ))}
        <Button 
          variant="outline" 
          size="icon" 
          onClick={goToNext}
          aria-label="Témoignage suivant"
        >
          <span className="sr-only">Suivant</span>
          &rarr;
        </Button>
      </div>
    </div>
  );
};

// TourModal pour l'onboarding
const TourModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      completeTour();
    }
  };
  
  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  const completeTour = () => {
    localStorage.setItem('tourCompleted', 'true');
    console.debug('Analytics Event:', 'tourCompleted');
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-lg w-full mx-4"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Découvrez EmotionsCare</h2>
          
          <div className="mb-6">
            {step === 1 && (
              <div>
                <h3 className="text-xl mb-3">Bienvenue dans l'expérience EmotionsCare</h3>
                <p>Découvrez comment notre plateforme peut vous aider à mieux gérer vos émotions et améliorer votre bien-être quotidien.</p>
                <img src="/images/tour-step1.jpg" alt="Illustration EmotionsCare" className="my-4 rounded-lg" />
              </div>
            )}
            
            {step === 2 && (
              <div>
                <h3 className="text-xl mb-3">Une approche personnalisée</h3>
                <p>Notre plateforme s'adapte à vos besoins spécifiques et vous propose des solutions sur mesure pour votre situation émotionnelle.</p>
                <img src="/images/tour-step2.jpg" alt="Solutions personnalisées" className="my-4 rounded-lg" />
              </div>
            )}
            
            {step === 3 && (
              <div>
                <h3 className="text-xl mb-3">Prêt à commencer ?</h3>
                <p>Créez votre compte et commencez votre voyage vers un meilleur équilibre émotionnel dès aujourd'hui.</p>
                <img src="/images/tour-step3.jpg" alt="Commencer votre voyage" className="my-4 rounded-lg" />
              </div>
            )}
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full mb-6">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={step === 1}
            >
              Précédent
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div 
                  key={i}
                  className={`w-2 h-2 rounded-full ${i + 1 <= step ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'}`}
                />
              ))}
            </div>
            
            <Button
              onClick={nextStep}
            >
              {step < totalSteps ? 'Suivant' : 'Terminer'}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Formulaire newsletter
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    setIsSubmitting(true);
    
    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 800));
      
      console.debug('Newsletter subscription:', { email });
      
      // Réinitialiser le formulaire
      setEmail('');
      
      toast({
        title: "Inscription réussie",
        description: "Vous êtes maintenant inscrit à notre newsletter",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'inscription",
        description: "Un problème est survenu, veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-sm">
      <div className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
        <Button 
          type="submit"
          disabled={isSubmitting}
          className="rounded-l-none"
        >
          {isSubmitting ? "..." : "S'inscrire"}
        </Button>
      </div>
    </form>
  );
};

// Page d'accueil principale
const LandingPage = () => {
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [showTourModal, setShowTourModal] = useState(false);
  const [showOnboardingTour, setShowOnboardingTour] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Enregistrer l'événement de vue de la page hero
    console.debug('Analytics Event:', 'heroViewed');
    
    // Charger les données des bénéfices et témoignages
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Simuler des appels API pour les données
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données simulées pour les bénéfices
        const mockBenefits: Benefit[] = [
          {
            id: "1",
            title: "Scan émotionnel",
            description: "Analysez vos émotions en temps réel et suivez votre évolution au quotidien.",
            iconUrl: "/icons/emotion-scan.svg"
          },
          {
            id: "2",
            title: "Musique adaptative",
            description: "Des playlists générées selon votre état émotionnel pour vous aider à vous sentir mieux.",
            iconUrl: "/icons/music-therapy.svg"
          },
          {
            id: "3",
            title: "Coach personnel",
            description: "Un assistant IA qui vous accompagne et vous conseille pour gérer vos émotions.",
            iconUrl: "/icons/ai-coach.svg"
          },
          {
            id: "4",
            title: "Connexion sociale",
            description: "Rejoignez une communauté bienveillante et partagez votre parcours émotionnel.",
            iconUrl: "/icons/social-connection.svg"
          }
        ];
        
        // Données simulées pour les témoignages
        const mockTestimonials: Testimonial[] = [
          {
            id: "1",
            name: "Sophie Martin",
            role: "Utilisatrice",
            company: "Freelance",
            content: "EmotionsCare m'a aidée à mieux comprendre mes émotions et à développer des stratégies efficaces pour gérer mon stress quotidien.",
            avatarUrl: "/avatars/user-1.jpg"
          },
          {
            id: "2",
            name: "Thomas Dubois",
            role: "Manager",
            company: "TechCorp",
            content: "Grâce à la version entreprise, notre équipe a pu améliorer sa cohésion et son bien-être général, ce qui a directement impacté notre productivité.",
            avatarUrl: "/avatars/user-2.jpg"
          },
          {
            id: "3",
            name: "Émilie Petit",
            role: "Psychologue",
            company: "Centre de bien-être",
            content: "Je recommande cette plateforme à mes patients comme complément à nos séances. Les résultats sont vraiment encourageants.",
            avatarUrl: "/avatars/user-3.jpg"
          }
        ];
        
        // Charger les feature flags
        const showTour = localStorage.getItem('tourCompleted') !== 'true';
        
        setBenefits(mockBenefits);
        setTestimonials(mockTestimonials);
        setShowOnboardingTour(showTour);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const handleB2CClick = () => {
    console.debug('Analytics Event:', 'ctaParticulierClicked');
    navigate('/b2c/login');
  };
  
  const handleB2BClick = () => {
    console.debug('Analytics Event:', 'ctaEntrepriseClicked');
    navigate('/b2b/selection');
  };
  
  const startTour = () => {
    console.debug('Analytics Event:', 'tourStarted');
    setShowTourModal(true);
  };
  
  return (
    <div className="min-h-screen">
      <header className="relative bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">EmotionsCare</h1>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Connexion
            </Button>
            <Button onClick={handleB2CClick}>
              S'inscrire
            </Button>
          </div>
        </div>
      </header>
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* CTA Buttons */}
        <section className="bg-white dark:bg-gray-900 py-10">
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.09, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button 
                  size="lg"
                  className="w-full md:w-auto px-8 py-6 text-lg shadow-md"
                  onClick={handleB2CClick}
                  aria-label="Accéder à l'espace particulier"
                  role="button"
                >
                  Je suis un particulier
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.09, ease: [0.4, 0, 0.2, 1] }}
              >
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full md:w-auto px-8 py-6 text-lg border-2"
                  onClick={handleB2BClick}
                  aria-label="Accéder à l'espace entreprise"
                  role="button"
                >
                  Je suis une entreprise
                </Button>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section 
          className="py-16 bg-gray-50 dark:bg-gray-800"
          aria-labelledby="benefits-heading"
        >
          <div className="container mx-auto px-6">
            <h2 
              id="benefits-heading"
              className="text-3xl font-bold text-center mb-12"
            >
              Une solution complète pour votre bien-être émotionnel
            </h2>
            
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow animate-pulse">
                    <div className="flex items-center justify-center mb-4">
                      <div className="h-16 w-16 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            ) : benefits.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Aucune donnée disponible</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {benefits.map((benefit, index) => (
                  <BenefitCard key={benefit.id} benefit={benefit} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section 
          className="py-16 bg-white dark:bg-gray-900"
          aria-labelledby="testimonials-heading"
        >
          <div className="container mx-auto px-6">
            <h2 
              id="testimonials-heading"
              className="text-3xl font-bold text-center mb-12"
            >
              Ce que nos utilisateurs disent
            </h2>
            
            {isLoading ? (
              <div className="max-w-4xl mx-auto p-8 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md animate-pulse">
                <div className="flex items-center mb-6">
                  <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full mr-4"></div>
                  <div>
                    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
              </div>
            ) : testimonials.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Aucun témoignage disponible</p>
            ) : (
              <TestimonialsCarousel testimonials={testimonials} />
            )}
          </div>
        </section>
        
        {/* Onboarding Tour Section */}
        {showOnboardingTour && (
          <section className="py-16 bg-blue-50 dark:bg-blue-900/20">
            <div className="container mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-6">Découvrez notre plateforme</h2>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                Faites le tour de notre plateforme et découvrez comment nous pouvons vous aider à mieux gérer vos émotions.
              </p>
              
              <Button 
                size="lg"
                onClick={startTour}
                className="px-8"
              >
                Démarrer la visite guidée
              </Button>
              
              {/* Tour Modal */}
              <TourModal 
                isOpen={showTourModal}
                onClose={() => setShowTourModal(false)}
              />
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer 
        className="bg-gray-100 dark:bg-gray-800 py-12"
        aria-labelledby="footer-heading"
      >
        <div className="container mx-auto px-6">
          <h2 id="footer-heading" className="sr-only">Footer</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">EmotionsCare</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Votre partenaire pour un meilleur équilibre émotionnel et un bien-être durable.
              </p>
              
              <div className="flex space-x-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Facebook size={20} />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Twitter size={20} />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Instagram size={20} />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Liens utiles</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Support</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">CGU</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Confidentialité</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Cookies</a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 dark:text-gray-300 hover:underline">Presse</a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Inscrivez-vous pour recevoir nos actualités et conseils pour votre bien-être.
              </p>
              
              <NewsletterForm />
              
              <div className="mt-6 flex items-center">
                <div className="mr-3 flex-shrink-0 bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full">
                  <Shield size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Compte protégé par un cryptage de bout en bout
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              &copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
      
      {/* FullPageLoader - Serait utilisé pour les transitions de navigation */}
      {/* Ce composant serait affiché lors des navigations longues */}
    </div>
  );
};

export default LandingPage;
