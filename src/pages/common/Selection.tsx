
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Users } from 'lucide-react';

const Selection: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex flex-col">
      <header className="container max-w-7xl mx-auto py-6">
        <div className="flex justify-center mb-4">
          <img src="/logo.svg" alt="EmotionsCare Logo" className="h-10" />
        </div>
        <h1 className="text-3xl font-bold text-center">EmotionsCare</h1>
        <p className="text-center text-muted-foreground mt-2">
          Plateforme de bien-être émotionnel pour particuliers et entreprises
        </p>
      </header>

      <main className="container max-w-7xl mx-auto py-12 flex-1 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Choisissez votre profil</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProfileCard 
              title="Particulier" 
              description="Accédez à votre espace personnel de bien-être émotionnel"
              icon={<User className="h-12 w-12" />}
              loginPath="/b2c/login"
              registerPath="/b2c/register"
              color="bg-primary/10"
              textColor="text-primary"
            />
            
            <ProfileCard 
              title="Collaborateur" 
              description="Espace dédié aux employés pour le bien-être professionnel"
              icon={<Users className="h-12 w-12" />}
              loginPath="/b2b/user/login"
              registerPath="/b2b/user/register"
              color="bg-blue-500/10"
              textColor="text-blue-500"
            />
            
            <ProfileCard 
              title="Administration" 
              description="Gestion des équipes et rapports pour RH et direction"
              icon={<Building2 className="h-12 w-12" />}
              loginPath="/b2b/admin/login"
              registerPath="/b2b/admin/login"
              color="bg-purple-500/10"
              textColor="text-purple-500"
              hideRegister
            />
          </div>
        </div>
      </main>
      
      <footer className="container max-w-7xl mx-auto py-6">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EmotionsCare - Tous droits réservés
        </p>
      </footer>
    </div>
  );
};

interface ProfileCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  loginPath: string;
  registerPath: string;
  color: string;
  textColor: string;
  hideRegister?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ 
  title, 
  description, 
  icon, 
  loginPath, 
  registerPath,
  color,
  textColor,
  hideRegister
}) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className={`${color} p-3 rounded-full w-fit mb-4`}>
          <div className={textColor}>
            {icon}
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Link 
            to={loginPath}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          >
            Connexion
          </Link>
          
          {!hideRegister && (
            <Link 
              to={registerPath}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full"
            >
              Inscription
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Selection;
