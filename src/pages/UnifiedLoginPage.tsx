import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, Building } from 'lucide-react';
import { Link } from 'react-router-dom';

const UnifiedLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'b2c' | 'b2b-user' | 'b2b-admin'>('b2c');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center p-4" data-testid="page-root">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            EmotionsCare
          </h1>
          <p className="text-muted-foreground mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Connexion</CardTitle>
            <CardDescription>
              Choisissez votre type de compte pour vous connecter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginType} onValueChange={(value) => setLoginType(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="b2c" className="text-xs">
                  <User className="mr-1 h-3 w-3" />
                  Personnel
                </TabsTrigger>
                <TabsTrigger value="b2b-user" className="text-xs">
                  <Building className="mr-1 h-3 w-3" />
                  Employé
                </TabsTrigger>
                <TabsTrigger value="b2b-admin" className="text-xs">
                  <Building className="mr-1 h-3 w-3" />
                  Manager
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="votre@email.com" 
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <TabsContent value="b2c" className="space-y-4">
                  <Button className="w-full" size="lg">
                    Se connecter - Personnel
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Accès à votre espace bien-être personnel
                  </div>
                </TabsContent>

                <TabsContent value="b2b-user" className="space-y-4">
                  <Button className="w-full" size="lg" variant="secondary">
                    Se connecter - Employé
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Accès à l'espace collaborateur entreprise
                  </div>
                </TabsContent>

                <TabsContent value="b2b-admin" className="space-y-4">
                  <Button className="w-full" size="lg" variant="outline">
                    Se connecter - Manager
                  </Button>
                  <div className="text-center text-sm text-muted-foreground">
                    Accès aux outils de gestion RH
                  </div>
                </TabsContent>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="text-center">
                  <Link 
                    to="/signup" 
                    className="text-sm text-primary hover:underline"
                  >
                    Pas encore de compte ? S'inscrire
                  </Link>
                </div>
                
                <div className="text-center">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-muted-foreground hover:text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-muted-foreground">
          En vous connectant, vous acceptez nos{' '}
          <Link to="/legal/terms" className="hover:underline">
            conditions d'utilisation
          </Link>{' '}
          et notre{' '}
          <Link to="/legal/privacy" className="hover:underline">
            politique de confidentialité
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnifiedLoginPage;