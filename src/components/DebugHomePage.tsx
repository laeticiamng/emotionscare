import React from 'react';
import { Link } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Home } from 'lucide-react';

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';

export default function DebugHomePage() {
  logger.debug('DebugHomePage component rendered', {}, 'UI');

  // Redirect to home in production
  if (!isDevelopment) {
    window.location.href = '/';
    return null;
  }

  try {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              🔧 Debug HomePage
              <Badge variant="secondary">DEV ONLY</Badge>
            </h1>
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Informations de diagnostic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Si vous voyez ce message, React fonctionne correctement.
              </p>

              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>React component rendered successfully</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Tailwind CSS styling applied</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>React Router working (you're seeing this page)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Date actuelle: {new Date().toLocaleDateString('fr-FR')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Heure: {new Date().toLocaleTimeString('fr-FR')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Mode: {import.meta.env.MODE}</span>
                </li>
              </ul>

              <div className="pt-4">
                <Button asChild>
                  <Link to="/login">
                    Test Link → Login
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    logger.error('Error in DebugHomePage render', error as Error, 'UI');
    return (
      <div className="min-h-screen bg-destructive/10 p-6">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error in DebugHomePage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">
              Error: {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}