/**
 * Interface Swagger UI pour la documentation de l'API publique
 * Phase 3 - Excellence
 */

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export function APIDocumentation() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Documentation API EmotionsCare</h1>
          <p className="text-muted-foreground text-lg">
            API REST complète pour intégrer les services EmotionsCare dans vos applications.
          </p>
        </div>

        <div className="bg-card rounded-lg shadow-lg p-6">
          <SwaggerUI
            url="/docs/openapi.yaml"
            docExpansion="list"
            defaultModelsExpandDepth={1}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
          />
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">🔐 Authentification</h3>
            <p className="text-sm text-muted-foreground">
              Utilisez votre clé API dans le header X-API-Key ou un token JWT Bearer.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">⚡ Rate Limiting</h3>
            <p className="text-sm text-muted-foreground">
              Gratuit: 1000 req/jour | Pro: 10k req/jour | Enterprise: Illimité
            </p>
          </div>

          <div className="bg-card rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">📡 Webhooks</h3>
            <p className="text-sm text-muted-foreground">
              Recevez des notifications en temps réel pour les événements importants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
