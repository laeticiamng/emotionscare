
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Story } from '@/types/Story';

interface WelcomeHeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  actionLink?: string;
  showStories?: boolean;
}

const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  className = '',
  title = "Bienvenue sur votre Assistant émotionnel",
  subtitle = "Suivez votre bien-être et améliorez votre quotidien",
  actionLabel = "Commencer",
  actionLink = "/dashboard",
  showStories = true
}) => {
  // Exemples d'histoires de réussite
  const successStories: Story[] = [
    {
      id: '1',
      title: 'Amélioration du sommeil',
      content: 'J\'ai utilisé les conseils personnalisés pendant 2 semaines et mon sommeil s\'est nettement amélioré. Je me réveille plus reposé et énergique.',
      author: 'Thomas D.',
      created_at: '2025-04-10',
      date: '2025-04-10',
      tags: ['sommeil', 'bien-être']
    },
    {
      id: '2',
      title: 'Moins de stress au travail',
      content: 'Les techniques de respiration et méditation m\'ont aidé à mieux gérer mon stress professionnel. Je me sens plus équilibré.',
      author: 'Sophie M.',
      created_at: '2025-03-22',
      date: '2025-03-22',
      tags: ['travail', 'stress']
    }
  ];
  
  // Histoire mise en avant
  const featuredStory: Story = {
    id: '3',
    title: 'Mon parcours de transformation',
    content: 'En suivant les recommandations personnalisées, j\'ai pu améliorer considérablement ma santé mentale en seulement un mois. La plateforme m\'a aidé à identifier mes déclencheurs émotionnels et à développer des stratégies efficaces.',
    author: 'Marie L.',
    created_at: '2025-05-01',
    date: '2025-05-01',
    tags: ['santé mentale', 'transformation'],
    cta: {
      text: 'Lire le témoignage complet',
      link: '/stories/3'
    }
  };

  return (
    <section className={`py-12 md:py-24 lg:py-32 ${className}`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">{title}</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">{subtitle}</p>
          </div>
          <div className="space-y-2 w-full max-w-sm">
            <Button asChild className="w-full" size="lg">
              <Link to={actionLink}>
                {actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        {showStories && (
          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map(story => (
              <div key={story.id} className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-bold">{story.title}</h3>
                  <p className="text-sm text-muted-foreground">{story.content}</p>
                  <div className="flex items-center pt-2">
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                      {story.author?.charAt(0)}
                    </div>
                    <div className="ml-2">
                      <p className="text-sm font-medium">{story.author}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="rounded-lg border bg-accent p-6 text-accent-foreground">
              <div className="flex flex-col space-y-2">
                <span className="text-xs uppercase font-bold tracking-wider">Témoignage</span>
                <h3 className="font-bold">{featuredStory.title}</h3>
                <p className="text-sm">{featuredStory.content}</p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link to={featuredStory.cta?.link || '#'}>
                    {featuredStory.cta?.text || "Lire plus"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WelcomeHero;
