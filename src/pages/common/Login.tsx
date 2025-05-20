
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, LogIn, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import '@/styles/auth-animations.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      if (email === 'demo@example.com' && password === 'password') {
        navigate('/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
      setIsLoading(false);
    }, 1500);
  };
  
  // Card background gradient based on time of day
  const getBackgroundGradient = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return 'bg-morning'; // Morning
    } else if (hour >= 12 && hour < 18) {
      return 'bg-afternoon'; // Afternoon
    } else if (hour >= 18 && hour < 22) {
      return 'bg-evening'; // Evening
    } else {
      return 'bg-night'; // Night
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/5"></div>
        
        {/* Ambient circles */}
        <motion.div
          className="ambient-circle primary"
          style={{ width: '500px', height: '500px', top: '10%', left: '10%', opacity: 0.05 }}
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="ambient-circle accent"
          style={{ width: '600px', height: '600px', bottom: '10%', right: '10%', opacity: 0.05 }}
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className={`shadow-xl backdrop-blur-sm bg-card/95 overflow-hidden ${getBackgroundGradient()}`}>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-30 z-0"
            animate={{ opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <CardHeader className="relative z-10">
            <div className="flex justify-center mb-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                <User size={30} />
              </motion.div>
            </div>
            <CardTitle className="text-center text-2xl font-bold">Connexion</CardTitle>
            <CardDescription className="text-center">
              Accédez à votre espace personnel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-md bg-destructive/10 text-destructive text-sm font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>
                
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-background/50 backdrop-blur-sm focus:ring-2 ring-primary/20 transition-all duration-300"
                    placeholder="exemple@email.com"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                </div>
              </div>
                
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe
                  </Label>
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-primary hover:underline focus:outline-none"
                  >
                    Mot de passe oublié?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 bg-background/50 backdrop-blur-sm focus:ring-2 ring-primary/20 transition-all duration-300"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
                
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="submit" 
                  className="w-full relative overflow-hidden group bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="loading-dots">
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                        <div className="bg-white"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      Se connecter
                    </>
                  )}
                  
                  <motion.span 
                    className="absolute inset-0 bg-white opacity-0"
                    whileHover={{ 
                      opacity: [0, 0.1, 0],
                      transition: { duration: 1.5, repeat: Infinity }
                    }}
                  />
                </Button>
              </motion.div>
            </form>
          </CardContent>
            
          <CardFooter className="relative z-10 flex-col space-y-4">
            <div className="text-sm text-center">
              Pas encore inscrit?{" "}
              <motion.a
                href="/register"
                className="text-primary font-medium hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Créer un compte
              </motion.a>
            </div>
            
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Retour à l'accueil
            </motion.a>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;
