import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Users, 
  Crown, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  ArrowRight,
  Heart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const UnifiedLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"b2c" | "b2b_user" | "b2b_admin">("b2c");
  
  const { signIn } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté à EmotionsCare"
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Vérifiez vos identifiants et réessayez",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loginOptions = [
    {
      key: "b2c" as const,
      title: "Personnel",
      description: "Accès individuel à vos outils de bien-être",
      icon: User,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      key: "b2b_user" as const,
      title: "Employé",
      description: "Accès collaborateur aux outils d'équipe",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      key: "b2b_admin" as const,
      title: "Manager",  
      description: "Accès administrateur et analytics RH",
      icon: Crown,
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">EmotionsCare</h1>
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Connexion à votre espace
          </h2>
          <p className="text-muted-foreground">
            Choisissez votre type de compte et connectez-vous
          </p>
        </div>

        {/* Account Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Type de Compte</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loginOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.key}
                  onClick={() => setLoginType(option.key)}
                  className={`w-full p-3 rounded-lg border transition-all ${
                    loginType === option.key
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${option.bgColor}`}>
                      <IconComponent className={`h-4 w-4 ${option.color}`} />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-foreground">
                        {option.title}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {option.description}
                      </div>
                    </div>
                    {loginType === option.key && (
                      <Badge variant="default" className="text-xs">
                        Sélectionné
                      </Badge>
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Connexion
              <Badge variant="outline" className="text-xs">
                {loginOptions.find(opt => opt.key === loginType)?.title}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  "Connexion..."
                ) : (
                  <>
                    Se connecter
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-4 space-y-3">
              <div className="text-center">
                <Link 
                  to="/signup" 
                  className="text-sm text-primary hover:underline"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Nouveau sur EmotionsCare ?
                  </span>
                </div>
              </div>

              <Link to="/signup">
                <Button variant="outline" className="w-full">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          En vous connectant, vous acceptez nos{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            conditions d'utilisation
          </Link>
          {" "}et notre{" "}
          <Link to="/privacy" className="text-primary hover:underline">
            politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;