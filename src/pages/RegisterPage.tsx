
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [validationState, setValidationState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  
  // Validation functions
  const validateName = (name: string) => {
    return name.length >= 2 ? 'success' : name ? 'error' : '';
  };
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? 'success' : email ? 'error' : '';
  };
  
  const validatePassword = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;
    
    setPasswordStrength(strength);
    
    return password.length >= 6 ? 'success' : password ? 'error' : '';
  };
  
  const validateConfirmPassword = (confirmPassword: string) => {
    return confirmPassword === formData.password ? 'success' : confirmPassword ? 'error' : '';
  };
  
  // Handle input changes with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    if (name === 'name') {
      setValidationState(prev => ({ ...prev, name: validateName(value) }));
    } else if (name === 'email') {
      setValidationState(prev => ({ ...prev, email: validateEmail(value) }));
    } else if (name === 'password') {
      setValidationState(prev => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword: formData.confirmPassword ? validateConfirmPassword(formData.confirmPassword) : ''
      }));
    } else if (name === 'confirmPassword') {
      setValidationState(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value) }));
    }
  };

  const canProceedToStep2 = () => {
    return (
      validateName(formData.name) === 'success' &&
      validateEmail(formData.email) === 'success'
    );
  };

  const handleNextStep = () => {
    if (canProceedToStep2()) {
      setStep(2);
    } else {
      // Validate all fields explicitly before showing error toast
      setValidationState({
        name: validateName(formData.name),
        email: validateEmail(formData.email),
        password: validationState.password,
        confirmPassword: validationState.confirmPassword
      });
      
      toast({
        title: "Champs invalides",
        description: "Veuillez remplir correctement tous les champs",
        variant: "destructive"
      });
    }
  };
  
  const handlePrevStep = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    const nameValid = validateName(formData.name) === 'success';
    const emailValid = validateEmail(formData.email) === 'success';
    const passwordValid = validatePassword(formData.password) === 'success';
    const confirmPasswordValid = validateConfirmPassword(formData.confirmPassword) === 'success';
    
    if (!nameValid || !emailValid || !passwordValid || !confirmPasswordValid) {
      setValidationState({
        name: validateName(formData.name),
        email: validateEmail(formData.email),
        password: validatePassword(formData.password),
        confirmPassword: validateConfirmPassword(formData.confirmPassword)
      });
      
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir correctement tous les champs",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // This is just a mock registration function
      // In a real app, you would call a registration API endpoint
      
      setTimeout(() => {
        // Show success animation and message
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès !",
        });
        
        // Auto login after registration
        login(formData.email, formData.password)
          .then(() => {
            // Navigate to dashboard after successful login
            navigate('/dashboard');
          })
          .catch(error => {
            console.error("Error during auto-login:", error);
            navigate('/login');
          });
      }, 1500);
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Erreur lors de l'inscription",
        description: error.message || "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };
  
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.03 },
    tap: { scale: 0.97 }
  };

  const stepVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0
    }),
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      transition: {
        duration: 0.3
      }
    })
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #ffffff, #F0F9FF)"
      }}
    >
      {/* Background animated wave */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='600' y1='25' x2='600' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='650' y1='25' x2='650' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='c' gradientUnits='userSpaceOnUse' x1='700' y1='25' x2='700' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='d' gradientUnits='userSpaceOnUse' x1='750' y1='25' x2='750' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='e' gradientUnits='userSpaceOnUse' x1='800' y1='25' x2='800' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='f' gradientUnits='userSpaceOnUse' x1='850' y1='25' x2='850' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='g' gradientUnits='userSpaceOnUse' x1='900' y1='25' x2='900' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='h' gradientUnits='userSpaceOnUse' x1='950' y1='25' x2='950' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='i' gradientUnits='userSpaceOnUse' x1='1000' y1='25' x2='1000' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='j' gradientUnits='userSpaceOnUse' x1='1050' y1='25' x2='1050' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='k' gradientUnits='userSpaceOnUse' x1='1100' y1='25' x2='1100' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3ClinearGradient id='l' gradientUnits='userSpaceOnUse' x1='1150' y1='25' x2='1150' y2='777'%3E%3Cstop offset='0' stop-color='%233B82F6'/%3E%3Cstop offset='1' stop-color='%23BFDBFE'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill-opacity='1'%3E%3Crect fill='url(%23a)' width='1200' height='800'/%3E%3Crect fill='url(%23b)' x='100' width='1100' height='800'/%3E%3Crect fill='url(%23c)' x='200' width='1000' height='800'/%3E%3Crect fill='url(%23d)' x='300' width='900' height='800'/%3E%3Crect fill='url(%23e)' x='400' width='800' height='800'/%3E%3Crect fill='url(%23f)' x='500' width='700' height='800'/%3E%3Crect fill='url(%23g)' x='600' width='600' height='800'/%3E%3Crect fill='url(%23h)' x='700' width='500' height='800'/%3E%3Crect fill='url(%23i)' x='800' width='400' height='800'/%3E%3Crect fill='url(%23j)' x='900' width='300' height='800'/%3E%3Crect fill='url(%23k)' x='1000' width='200' height='800'/%3E%3Crect fill='url(%23l)' x='1100' width='100' height='800'/%3E%3C/g%3E%3C/svg%3E\")",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container max-w-md z-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 group"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-300" size={16} />
            Retour à l'accueil
          </Button>
            
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.6 }
              }
            }}
          >
            <h1 className="text-3xl font-semibold mb-1 text-[#1B365D]">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-slate-600">
              Créez votre compte et prenez soin de vos émotions
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-xl border-[#E8F1FA] backdrop-blur-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Inscription</CardTitle>
                  <CardDescription>
                    Rejoignez EmotionsCare en quelques étapes
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                  <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <motion.div
                  key={`step-${step}`}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={stepVariants}
                  custom={step === 1 ? 1 : -1}
                >
                  {step === 1 ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className={`pl-9 ${
                              validationState.name === 'success'
                                ? 'border-green-500 focus-visible:ring-green-500'
                                : validationState.name === 'error'
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            } transition-all duration-300`}
                          />
                          {validationState.name === 'success' && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                          )}
                          {validationState.name === 'error' && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-9 ${
                              validationState.email === 'success'
                                ? 'border-green-500 focus-visible:ring-green-500'
                                : validationState.email === 'error'
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            } transition-all duration-300`}
                          />
                          {validationState.email === 'success' && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                          )}
                          {validationState.email === 'error' && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className={`pl-9 ${
                              validationState.password === 'success'
                                ? 'border-green-500 focus-visible:ring-green-500'
                                : validationState.password === 'error'
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            } transition-all duration-300`}
                          />
                          {validationState.password === 'success' && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                          )}
                          {validationState.password === 'error' && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                        
                        {formData.password && (
                          <div className="mt-2">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Force du mot de passe</span>
                              <span className="text-xs font-medium">
                                {passwordStrength < 25 && 'Faible'}
                                {passwordStrength >= 25 && passwordStrength < 50 && 'Moyen'}
                                {passwordStrength >= 50 && passwordStrength < 75 && 'Bon'}
                                {passwordStrength >= 75 && 'Excellent'}
                              </span>
                            </div>
                            <Progress
                              value={passwordStrength}
                              className={`h-1.5 ${
                                passwordStrength < 25 ? 'bg-red-200' : 
                                passwordStrength < 50 ? 'bg-orange-200' : 
                                passwordStrength < 75 ? 'bg-yellow-200' : 'bg-green-200'
                              }`}
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmez le mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`pl-9 ${
                              validationState.confirmPassword === 'success'
                                ? 'border-green-500 focus-visible:ring-green-500'
                                : validationState.confirmPassword === 'error'
                                ? 'border-red-500 focus-visible:ring-red-500'
                                : ''
                            } transition-all duration-300`}
                          />
                          {validationState.confirmPassword === 'success' && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                          )}
                          {validationState.confirmPassword === 'error' && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
                
                {step === 2 && (
                  <div className="flex items-center p-3 rounded-xl bg-blue-50 text-sm text-blue-700 gap-2 mt-2">
                    <Info className="h-4 w-4 flex-shrink-0" />
                    <p>Votre mot de passe doit contenir au moins 8 caractères, dont une majuscule et un chiffre.</p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                {step === 1 ? (
                  <motion.div
                    className="w-full"
                    variants={buttonVariants}
                    initial="rest"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button 
                      type="button"
                      className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                      onClick={handleNextStep}
                    >
                      Continuer
                    </Button>
                  </motion.div>
                ) : (
                  <div className="flex gap-3 w-full">
                    <Button 
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={handlePrevStep}
                    >
                      Retour
                    </Button>
                    <motion.div
                      className="flex-1"
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white relative"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="absolute inset-0 flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                            </span>
                            <span className="opacity-0">Inscription en cours...</span>
                          </>
                        ) : 'S\'inscrire'}
                      </Button>
                    </motion.div>
                  </div>
                )}
                  
                <div className="flex justify-center w-full text-sm">
                  <p>
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                      Connectez-vous
                    </Link>
                  </p>
                </div>

                <div className="relative my-4 w-full">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-xs text-muted-foreground">
                    ou inscrivez-vous avec
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-3 w-full">
                  <Button variant="outline" type="button" className="h-10 px-2 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#4285F4]" xmlns="http://www.w3.org/2000/svg">
                      <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                        <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                        <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                        <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                        <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                      </g>
                    </svg>
                  </Button>
                  <Button variant="outline" type="button" className="h-10 px-2 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.6725 16.3843C16.2637 17.241 15.7908 18.0076 15.2538 18.6841C14.5254 19.6334 13.9123 20.2644 13.4145 20.5772C12.6462 21.0988 11.8304 21.3628 10.9651 21.3726C10.3551 21.3726 9.64045 21.2112 8.82444 20.8844C8.00782 20.5587 7.26486 20.3973 6.59511 20.3973C5.89584 20.3973 5.13295 20.5587 4.30591 20.8844C3.47857 21.2112 2.80255 21.3825 2.27704 21.401C1.44938 21.4371 0.623894 21.1656 0 20.6878C-0.531749 20.1089 -0.970765 19.387 -1.31706 18.5205C-1.69517 17.5717 -1.88502 16.5798 -1.88502 15.5459C-1.88502 14.3469 -1.64568 13.2892 -1.16786 12.3719C-0.781422 11.6358 -0.26166 11.0241 0.390936 10.5356C1.04353 10.0471 1.76418 9.79667 2.5543 9.78691C3.19723 9.78691 3.99369 9.97025 4.94654 10.3299C5.89846 10.6902 6.49906 10.8719 6.74666 10.8719C6.93849 10.8719 7.6518 10.6565 8.8834 10.2279C10.047 9.82938 11.0103 9.67896 11.7764 9.77427C13.2223 9.97317 14.3265 10.5897 15.0843 11.6281C13.8213 12.3915 13.1951 13.4901 13.2043 14.9203C13.2129 16.0458 13.6485 16.9657 14.5103 17.6755C14.8987 18.0022 15.3359 18.2564 15.824 18.4395C15.7639 18.7566 15.7002 19.0619 15.6324 19.3559C15.3166 20.1453 14.9362 20.8844 14.491 21.5733C13.9933 21.3628 13.5626 21.0823 13.1951 20.7305C12.4658 20.0697 11.8526 19.2067 11.3574 18.1393C10.8622 17.0742 10.6138 16.0798 10.6138 15.1536C10.6138 14.3077 10.8622 13.5447 11.3574 12.8653C11.8526 12.1859 12.5097 11.6608 13.3257 11.2914C13.9047 11.025 14.4054 10.8882 14.83 10.8804C14.4005 9.90558 13.7812 9.17325 12.9694 8.68122C12.1588 8.19001 11.218 7.93505 10.147 7.91553C9.21985 7.91553 8.37746 8.1462 7.6138 8.60515C6.85013 9.06452 6.27583 9.60283 5.8897 10.2185C5.50357 10.8341 5.31012 11.4619 5.31012 12.1004C5.31012 12.672 5.46169 13.2567 5.76482 13.853C6.06796 14.4493 6.47451 14.9292 6.98359 15.291C6.58558 16.0538 6.11185 16.7714 5.56577 17.4424C5.02061 18.1147 4.50391 18.6532 4.01699 19.0619C3.48317 18.5989 3.01747 18.0323 2.61946 17.3614C2.19391 16.6451 1.98114 15.8821 1.98114 15.0708C1.98114 14.054 2.26175 13.1075 2.82297 12.232C3.3842 11.3559 4.12217 10.6711 5.03824 10.177C5.95493 9.68343 6.9301 9.4366 7.96624 9.4366C8.79389 9.4366 9.56195 9.59518 10.2688 9.91141C10.9756 10.2276 11.5867 10.6511 12.1012 11.1813C12.6163 11.7115 13.0281 12.298 13.3374 12.9419C13.6461 13.5857 13.8398 14.2516 13.9188 14.9397C13.9972 15.6279 13.9647 16.2757 13.8203 16.8825L13.2961 16.9544C12.8179 17.0132 12.3827 16.9447 11.9912 16.7487C11.5991 16.5539 11.2856 16.2832 11.0494 15.9388C10.8144 15.5944 10.6961 15.2083 10.6961 14.7792C10.6961 14.2319 10.8716 13.7383 11.2214 13.2984C11.5724 12.8579 12.0643 12.5656 12.6983 12.4203C12.6494 11.967 12.4774 11.5369 12.1823 11.1307C11.8866 10.7245 11.504 10.4219 11.0329 10.223C10.5625 10.0241 10.0836 9.92464 9.59667 9.92464C8.92753 9.92464 8.3215 10.0997 7.77919 10.451C7.23626 10.8023 6.80783 11.2761 6.49513 11.8729C6.18182 12.4691 6.02547 13.1137 6.02547 13.8074C6.02547 14.5511 6.20715 15.2293 6.5705 15.8426C7.21343 14.9465 8.00386 14.4777 8.94066 14.4371C9.32679 14.4169 9.67331 14.507 9.98022 14.7082C10.2865 14.9088 10.4904 15.1871 10.5905 15.5405C10.6907 15.894 10.6541 16.2535 10.4814 16.62C10.19 17.2258 9.75412 17.5286 9.17471 17.5286C8.82395 17.5286 8.51847 17.4215 8.25759 17.2072C7.9973 16.993 7.80421 16.7097 7.67841 16.3574L7.60062 16.1057C7.60062 16.1332 7.59538 16.1827 7.58634 16.2535C7.57729 16.3242 7.57276 16.3818 7.57276 16.4231C7.57276 16.6051 7.60062 16.7633 7.65747 16.8973C7.7137 17.0308 7.80421 17.1439 7.92848 17.2354C8.05275 17.327 8.19522 17.3723 8.35589 17.3723C8.6442 17.3723 8.91343 17.2378 9.16493 16.9681C9.41642 16.699 9.59667 16.3799 9.7066 16.0113C9.9768 15.1477 9.87366 14.3987 9.39585 13.7657C8.91803 13.1321 8.24299 12.8159 7.37074 12.8159C6.59693 12.8159 5.92232 13.0361 5.34854 13.4762C4.77475 13.9163 4.35601 14.4975 4.09251 15.2171C3.82901 15.9388 3.77674 16.6926 3.93803 17.4797C4.01891 17.8831 4.18549 18.3134 4.43798 18.7706C4.69117 19.2279 5.04085 19.6783 5.48692 20.1225C5.93299 20.5667 6.45787 20.9412 7.06257 21.246C7.66727 21.5508 8.23303 21.7028 8.76042 21.7028C9.61833 21.7028 10.4185 21.4684 11.1606 20.9995C11.9027 20.5307 12.5504 19.9056 13.1036 19.1244C13.6566 18.3433 14.1412 17.4988 14.5563 16.5902C14.9719 15.6822 15.2932 14.8247 15.5219 14.0176C15.7506 13.2111 15.9044 12.573 15.9839 12.1044C15.988 12.0532 15.9933 12.0025 15.9992 11.9525C16.2846 12.3239 16.5156 12.7419 16.69 13.2083C16.9686 13.9877 17.1084 14.7901 17.1084 15.6157C17.1084 16.484 16.963 17.3492 16.6725 18.2105C16.9588 18.0711 17.2705 17.8622 17.6083 17.5838C17.9462 17.3053 18.2344 17.0239 18.4734 16.7402C18.7124 16.4559 18.9318 16.1394 19.1299 15.7889C19.3273 15.4385 19.4497 15.1362 19.4956 14.8849C19.5889 14.4328 19.6362 13.9347 19.6362 13.3902C19.6362 12.7086 19.485 12 19.1813 11.2655C18.8776 10.5305 18.4547 9.91141 17.9128 9.40716C17.3697 8.90332 16.7524 8.51395 16.0588 8.23905C15.3652 7.96333 14.6553 7.8261 13.9304 7.82537C13.6709 7.82537 13.4321 7.83594 13.2129 7.85831C14.4789 8.61093 15.3749 9.52201 15.9006 10.5956C16.1162 11.0417 16.2653 11.5181 16.3477 12.0245C16.5444 13.2051 16.3991 14.4023 15.912 15.6141C16.1289 15.8047 16.4038 15.9878 16.752 16.1645C17.1001 16.3412 17.3758 16.5304 17.5777 16.7304C17.604 16.7555 17.6248 16.7714 17.6509 16.7965C17.3467 16.6991 17.0209 16.5706 16.6725 16.3843Z" fill="currentColor"/>
                    </svg>
                  </Button>
                  <Button variant="outline" type="button" className="h-10 px-2 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M24 12.073c0-5.97-4.854-10.825-10.825-10.825-5.97 0-10.824 4.854-10.824 10.825 0 5.402 3.954 9.879 9.12 10.695v-7.562h-2.744v-3.133h2.744V9.412c0-2.707 1.614-4.203 4.079-4.203 1.183 0 2.421.211 2.421.211v2.657h-1.363c-1.343 0-1.76.833-1.76 1.688v2.027h2.998l-.48 3.13h-2.518v7.563c5.167-.815 9.122-5.293 9.122-10.694z" fill="currentColor"/>
                    </svg>
                  </Button>
                </div>
                
                <div className="mt-4">
                  <p className="text-xs text-center text-muted-foreground">
                    En vous inscrivant, vous acceptez nos{' '}
                    <a href="#" className="text-blue-600 hover:underline">Conditions d'utilisation</a>{' '}
                    et notre{' '}
                    <a href="#" className="text-blue-600 hover:underline">Politique de confidentialité</a>.
                  </p>
                </div>
              </CardFooter>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
