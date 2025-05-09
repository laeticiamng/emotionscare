
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Shield, Mail, Lock, CheckCircle, AlertCircle, Bell, UserCog } from 'lucide-react';
import { isAdminRole } from '@/utils/roleUtils';
import { motion } from 'framer-motion';
import { Separator } from "@/components/ui/separator";

const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [validationState, setValidationState] = useState({ email: '', password: '' });
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Validate email format
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) ? 'success' : email ? 'error' : '';
  };

  // Validate password
  const validatePassword = (password) => {
    return password && password.length >= 6 ? 'success' : password ? 'error' : '';
  };

  // Handle input change with validation
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setValidationState(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidationState(prev => ({ ...prev, password: validatePassword(value) }));
  };
  
  // Redirect if already authenticated as admin
  useEffect(() => {
    console.log("AdminLoginPage: Auth effect running", { isAuthenticated, isLoading, user, role: user?.role });
    if (isAuthenticated && !isLoading && user && isAdminRole(user.role)) {
      console.log("AdminLoginPage: Already authenticated as admin, redirecting to dashboard");
      
      // Show success toast with animation
      toast({
        title: "Connexion réussie",
        description: `Bienvenue dans l'espace administration, ${user.name}!`,
        variant: "default",
      });
      
      navigate('/admin');
    }
  }, [isAuthenticated, isLoading, user, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showVerification) {
      // Handle verification code submission
      if (!verificationCode || verificationCode.length < 6) {
        toast({
          title: "Code invalide",
          description: "Veuillez saisir un code de vérification valide",
          variant: "destructive"
        });
        return;
      }
      
      setIsSubmitting(true);
      // In a real implementation, verify the 2FA code
      // For this demo, we'll simulate a successful verification
      setTimeout(() => {
        toast({
          title: "Vérification réussie",
          description: "Connexion sécurisée en cours...",
        });
        
        // Proceed with login after successful verification
        proceedWithLogin();
      }, 1500);
      
      return;
    }
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    if (useMagicLink) {
      setIsSubmitting(true);
      try {
        // Note: This is a placeholder for magic link functionality
        // In a real implementation, this would call an API to send the magic link
        toast({
          title: "Lien magique envoyé",
          description: "Veuillez vérifier votre boîte mail pour vous connecter",
        });
        setIsSubmitting(false);
      } catch (error: any) {
        console.error("Erreur d'envoi du magic link:", error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible d'envoyer le lien magique. Veuillez réessayer.",
          variant: "destructive"
        });
        setIsSubmitting(false);
      }
      return;
    }

    // For admin login, simulate a 2FA step
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowVerification(true);
    }, 800);
  };

  const proceedWithLogin = async () => {
    try {
      const user = await login(email, password);
      
      // Check if user has admin privileges
      if (isAdminRole(user.role)) {
        toast({
          title: "Connexion réussie",
          description: `Bienvenue dans l'espace administration, ${user.name}!`,
        });
        
        // Navigation to admin dashboard after successful admin login
        navigate('/admin');
      } else {
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les droits d'administration nécessaires",
          variant: "destructive"
        });
        navigate('/');
      }
    } catch (error: any) {
      console.error("Erreur de connexion admin:", error);
      toast({
        title: "Erreur de connexion",
        description: error.message || "Impossible de se connecter. Veuillez vérifier vos identifiants.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMagicLinkToggle = () => {
    setShowMagicLink(true);
    setUseMagicLink(!useMagicLink);
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

  // If still checking authentication status, show minimal UI
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#0891B2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2>Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #111827 0%, #0C4A6E 100%)"
      }}
    >
      {/* Background animated pattern */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <div className="container max-w-md z-10">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="mb-4 group text-white/70 hover:text-white hover:bg-white/10"
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
            <h1 className="text-3xl font-semibold mb-1 text-white">
              EmotionsCare<span className="text-xs align-super">™</span>
            </h1>
            <p className="text-white/70 flex items-center justify-center">
              par ResiMax<span className="text-xs align-super">™</span> - <Shield size={16} className="mx-1 text-[#0891B2]" /> Espace Direction
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="shadow-xl border-[#1E3A46] bg-[#1a2235]/90 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="text-white">Administration</CardTitle>
              <CardDescription className="text-gray-300">
                Identifiez-vous pour accéder aux indicateurs de bien-être
              </CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {!showVerification ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@example.com"
                          value={email}
                          onChange={handleEmailChange}
                          required
                          className={`pl-9 bg-[#111827] border-[#2E3B52] text-white ${
                            validationState.email === 'success'
                              ? 'border-green-600 focus-visible:ring-green-600/30'
                              : validationState.email === 'error'
                              ? 'border-red-600 focus-visible:ring-red-600/30'
                              : ''
                          } transition-all duration-300`}
                        />
                        {validationState.email === 'success' && (
                          <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                        )}
                        {validationState.email === 'error' && (
                          <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>

                    {!useMagicLink && (
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••"
                            required={!useMagicLink}
                            className={`pl-9 bg-[#111827] border-[#2E3B52] text-white ${
                              validationState.password === 'success'
                                ? 'border-green-600 focus-visible:ring-green-600/30'
                                : validationState.password === 'error'
                                ? 'border-red-600 focus-visible:ring-red-600/30'
                                : ''
                            } transition-all duration-300`}
                          />
                          {validationState.password === 'success' && (
                            <CheckCircle className="absolute right-3 top-3 h-4 w-4 text-green-600" />
                          )}
                          {validationState.password === 'error' && (
                            <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-6 py-4">
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-[#0891B2]/20 flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 text-[#0891B2]" />
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">Vérification en deux étapes</h3>
                      <p className="text-sm text-gray-300">
                        Un code de sécurité a été envoyé à {email.replace(/(\w{2})[\w.-]+@([\w.]+)/, "$1***@$2")}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="verification-code" className="text-gray-300">Code de vérification</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="verification-code"
                          type="text"
                          inputMode="numeric"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="123456"
                          className="bg-[#111827] border-[#2E3B52] text-white text-center"
                          maxLength={6}
                        />
                      </div>
                      <p className="text-sm text-gray-400 mt-2">
                        Le code expire dans 5 minutes
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <motion.div
                  className="w-full"
                  variants={buttonVariants}
                  initial="rest"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    type="submit" 
                    className={`w-full relative overflow-hidden group ${showVerification 
                      ? 'bg-[#0891B2] hover:bg-[#0891B2]/90' 
                      : 'bg-[#FF6F61] hover:bg-[#FF6F61]/90'} text-white`}
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
                        <span className="opacity-0">Connexion en cours...</span>
                      </>
                    ) : showVerification ? 'Vérifier le code' : useMagicLink ? 'Envoyer le lien magique' : 'Connexion Admin'}
                    
                    {!isSubmitting && (
                      <motion.span 
                        className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      />
                    )}
                  </Button>
                </motion.div>
                  
                {!showVerification && (
                  <>
                    <div className="flex justify-between w-full text-sm">
                      <Link to="/login" className="text-[#0891B2] hover:underline">
                        Espace utilisateur
                      </Link>
                      {!showMagicLink && (
                        <button 
                          type="button"
                          onClick={handleMagicLinkToggle}
                          className="text-[#0891B2] hover:underline"
                        >
                          Connexion sans mot de passe
                        </button>
                      )}
                    </div>

                    <div className="relative my-4 w-full">
                      <Separator className="bg-gray-700" />
                      <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-[#1a2235] px-2 text-xs text-gray-400">
                        accès sécurisé
                      </span>
                    </div>
                    
                    <div className="flex justify-center gap-4 w-full">
                      <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="w-9 h-9 rounded-full bg-[#111827]/50 flex items-center justify-center">
                          <Shield size={18} />
                        </div>
                        <span>Connexion<br/>chiffrée</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="w-9 h-9 rounded-full bg-[#111827]/50 flex items-center justify-center">
                          <Bell size={18} />
                        </div>
                        <span>Alertes<br/>d'intrusion</span>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-gray-400 text-xs">
                        <div className="w-9 h-9 rounded-full bg-[#111827]/50 flex items-center justify-center">
                          <UserCog size={18} />
                        </div>
                        <span>Gestion<br/>avancée</span>
                      </div>
                    </div>
                  </>
                )}
                  
                {showVerification && (
                  <div className="flex justify-center w-full text-sm">
                    <button 
                      type="button"
                      onClick={() => {
                        setShowVerification(false);
                        setVerificationCode('');
                      }}
                      className="text-[#0891B2] hover:underline"
                    >
                      Utiliser une autre méthode
                    </button>
                  </div>
                )}
                  
                {!showVerification && (
                  <p className="text-xs text-center text-gray-400 mt-4">
                    * Pour la démo, utilisez: admin@example.com (mot de passe : admin)
                  </p>
                )}
              </CardFooter>
            </form>
          </Card>
        </motion.div>

        {/* System status indicator */}
        <motion.div
          className="mt-8 flex items-center justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-white/70">Tous les systèmes opérationnels</span>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
