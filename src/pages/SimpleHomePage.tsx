import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SimpleHomePage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-4xl font-bold">EmotionsCare</h1>
          <p className="text-xl text-muted-foreground">
            Plateforme de bien-être émotionnel
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">B2C - Personnel</h2>
            <p className="text-muted-foreground">
              Accédez à vos outils de bien-être personnel
            </p>
            <Link to="/app/dashboard">
              <Button className="w-full">Accéder au Dashboard</Button>
            </Link>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-2xl font-semibold">B2B - Entreprise</h2>
            <p className="text-muted-foreground">
              Solutions pour votre organisation
            </p>
            <Link to="/entreprise">
              <Button variant="outline" className="w-full">En savoir plus</Button>
            </Link>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Link to="/app/scan">
            <Card className="p-4 hover:bg-muted transition-colors cursor-pointer">
              <h3 className="font-semibold">Scanner</h3>
              <p className="text-sm text-muted-foreground">Analyse faciale</p>
            </Card>
          </Link>
          <Link to="/app/music">
            <Card className="p-4 hover:bg-muted transition-colors cursor-pointer">
              <h3 className="font-semibold">Musique</h3>
              <p className="text-sm text-muted-foreground">Thérapie musicale</p>
            </Card>
          </Link>
          <Link to="/app/coach">
            <Card className="p-4 hover:bg-muted transition-colors cursor-pointer">
              <h3 className="font-semibold">Coach IA</h3>
              <p className="text-sm text-muted-foreground">Assistant virtuel</p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
