import React from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HttpErrorAction {
  label: string;
  to?: string;
  onClick?: () => void;
  variant?: 'default' | 'secondary' | 'outline' | 'ghost';
  icon?: LucideIcon;
}

interface HttpErrorSuggestion {
  label: string;
  href: string;
  description?: string;
}

interface HttpErrorLayoutProps {
  statusCode: number;
  title: string;
  description: string;
  icon?: LucideIcon;
  actions?: HttpErrorAction[];
  suggestions?: HttpErrorSuggestion[];
  supportText?: string;
}

const HttpErrorLayout: React.FC<HttpErrorLayoutProps> = ({
  statusCode,
  title,
  description,
  icon: Icon = AlertTriangle,
  actions = [],
  suggestions = [],
  supportText,
}) => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-6"
      data-testid="page-root"
    >
      <div className="w-full max-w-4xl space-y-8">
        <Card className="text-center shadow-lg border border-border/60">
          <CardHeader className="space-y-6">
            <div className="flex justify-center">
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-10 w-10" aria-hidden="true" />
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold tracking-[0.35em] text-muted-foreground uppercase">
                {statusCode}
              </p>
              <CardTitle className="text-3xl">{title}</CardTitle>
              <CardDescription className="text-base leading-relaxed text-muted-foreground">
                {description}
              </CardDescription>
            </div>
          </CardHeader>

          {actions.length > 0 && (
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
              {actions.map(action => {
                const ActionIcon = action.icon;
                const content = (
                  <>
                    {ActionIcon ? <ActionIcon className="mr-2 h-4 w-4" aria-hidden="true" /> : null}
                    {action.label}
                  </>
                );

                if (action.to) {
                  return (
                    <Button key={`${action.label}-${action.to}`} variant={action.variant ?? 'default'} size="lg" asChild>
                      <Link to={action.to}>{content}</Link>
                    </Button>
                  );
                }

                return (
                  <Button
                    key={action.label}
                    variant={action.variant ?? 'default'}
                    size="lg"
                    onClick={action.onClick}
                  >
                    {content}
                  </Button>
                );
              })}
            </CardContent>
          )}
        </Card>

        {(suggestions.length > 0 || supportText) && (
          <Card className="border-dashed border-border/60">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Raccourcis utiles</CardTitle>
              {supportText ? (
                <CardDescription className="text-muted-foreground">{supportText}</CardDescription>
              ) : null}
            </CardHeader>

            {suggestions.length > 0 && (
              <CardContent className="grid gap-3 sm:grid-cols-2">
                {suggestions.map(suggestion => (
                  <Link
                    key={`${suggestion.href}-${suggestion.label}`}
                    to={suggestion.href}
                    className="flex flex-col rounded-lg border border-border/60 p-4 transition hover:border-primary/60 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <span className="font-medium text-foreground">{suggestion.label}</span>
                    {suggestion.description ? (
                      <span className="text-sm text-muted-foreground">{suggestion.description}</span>
                    ) : null}
                  </Link>
                ))}
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </div>
  );
};

export type { HttpErrorAction, HttpErrorSuggestion };
export default HttpErrorLayout;
