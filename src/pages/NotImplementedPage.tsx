
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Construction } from 'lucide-react';

const NotImplementedPage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <Construction size={64} className="text-muted-foreground mb-6" />
      <h1 className="text-3xl font-bold mb-2">Fonctionnalité en construction</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        Cette partie de l'application est en cours de développement et sera disponible prochainement.
      </p>
      <Button onClick={() => navigate('/dashboard')}>
        Retour au tableau de bord
      </Button>
    </div>
  );
};

export default NotImplementedPage;
