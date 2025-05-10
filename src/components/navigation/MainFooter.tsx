
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Mail, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const MainFooter: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Inscription réussie !",
      description: "Merci pour votre inscription à notre newsletter.",
    });
  };
  
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-bold text-xl">EmotionsCare</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Votre compagnon émotionnel intelligent qui vous aide à explorer, 
              comprendre et améliorer votre bien-être émotionnel.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-medium">Fonctionnalités</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
                  Scan émotionnel
                </Link>
              </li>
              <li>
                <Link to="/journal" className="text-muted-foreground hover:text-foreground transition-colors">
                  Journal émotionnel
                </Link>
              </li>
              <li>
                <Link to="/music" className="text-muted-foreground hover:text-foreground transition-colors">
                  Musicothérapie
                </Link>
              </li>
              <li>
                <Link to="/coach" className="text-muted-foreground hover:text-foreground transition-colors">
                  Coach IA
                </Link>
              </li>
              <li>
                <Link to="/vr" className="text-muted-foreground hover:text-foreground transition-colors">
                  Expérience VR
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium">À propos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  Notre mission
                </Link>
              </li>
              <li>
                <Link to="/team" className="text-muted-foreground hover:text-foreground transition-colors">
                  Notre équipe
                </Link>
              </li>
              <li>
                <Link to="/testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Témoignages
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-medium">Restez informé</h4>
            <p className="text-sm text-muted-foreground">
              Abonnez-vous à notre newsletter pour recevoir des conseils personnalisés.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Votre email" 
                  className="rounded-r-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                  required
                />
                <Button type="submit" className="rounded-l-none">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                En vous inscrivant, vous acceptez notre politique de confidentialité.
              </p>
            </form>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center border-t mt-12 pt-6 text-sm text-muted-foreground">
          <div className="flex flex-col md:flex-row gap-4 mb-4 md:mb-0">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Politique de confidentialité
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Conditions d'utilisation
            </Link>
            <Link to="/cookies" className="hover:text-foreground transition-colors">
              Cookies
            </Link>
            <Link to="/certifications" className="hover:text-foreground transition-colors">
              Certifications
            </Link>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-primary" />
            <span>&copy; {new Date().getFullYear()} EmotionsCare. Tous droits réservés.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
