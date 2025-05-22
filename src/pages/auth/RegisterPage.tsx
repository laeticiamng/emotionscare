
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RegisterPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Compte créé avec succès",
        description: "Vous allez être redirigé vers la page de connexion.",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur lors de l'inscription",
        description: "Une erreur s'est produite. Veuillez réessayer.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/50">
      <motion.div 
        className="w-full max-w-md"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Inscription</CardTitle>
              <CardDescription>
                Créez votre compte personnel pour accéder à toutes nos fonctionnalités
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="name" className="flex items-center justify-between">
                    Nom complet
                    {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
                  </Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Entrez votre nom" 
                    className={errors.name ? "border-destructive" : ""}
                  />
                </motion.div>
                
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="email" className="flex items-center justify-between">
                    Email
                    {errors.email && <span className="text-xs text-destructive">{errors.email}</span>}
                  </Label>
                  <Input 
                    id="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    type="email" 
                    placeholder="votre@email.com" 
                    className={errors.email ? "border-destructive" : ""}
                  />
                </motion.div>
                
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="password" className="flex items-center justify-between">
                    Mot de passe
                    {errors.password && <span className="text-xs text-destructive">{errors.password}</span>}
                  </Label>
                  <Input 
                    id="password"
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    type="password" 
                    className={errors.password ? "border-destructive" : ""}
                  />
                </motion.div>
                
                <motion.div className="space-y-2" variants={itemVariants}>
                  <Label htmlFor="confirmPassword" className="flex items-center justify-between">
                    Confirmez le mot de passe
                    {errors.confirmPassword && <span className="text-xs text-destructive">{errors.confirmPassword}</span>}
                  </Label>
                  <Input 
                    id="confirmPassword" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    type="password" 
                    className={errors.confirmPassword ? "border-destructive" : ""}
                  />
                </motion.div>
                
                <motion.div className="flex items-center space-x-2 pt-2" variants={itemVariants}>
                  <div className="relative">
                    <Checkbox 
                      id="terms"
                      name="terms"
                      checked={formData.terms} 
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({
                          ...prev,
                          terms: !!checked
                        }))
                      }
                      className={errors.terms ? "border-destructive" : ""}
                    />
                    {errors.terms && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-4 -top-1 w-2 h-2 bg-destructive rounded-full"
                      />
                    )}
                  </div>
                  <Label htmlFor="terms" className="text-sm flex-1">
                    J'accepte les <Link to="/terms" className="text-primary hover:underline">conditions d'utilisation</Link> et la <Link to="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>
                  </Label>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <Button 
                  type="submit" 
                  className="w-full mb-4 h-11"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      S'inscrire
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Vous avez déjà un compte?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Se connecter
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
        
        <motion.div 
          variants={itemVariants}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <div className="flex items-center justify-center space-x-1">
            <Check className="h-4 w-4 text-green-500" />
            <span>Protection des données conforme RGPD</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
