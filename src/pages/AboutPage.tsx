
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Users, Award, Lightbulb, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div data-testid="page-root" className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">À propos d'EmotionsCare</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Nous révolutionnons le bien-être émotionnel des professionnels de santé 
            grâce à l'intelligence artificielle et une approche scientifique validée.
          </p>
          <Button size="lg" asChild>
            <Link to="/choose-mode">
              Rejoindre la communauté
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Notre Mission</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">
                  Soutenir ceux qui nous soignent
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Les professionnels de santé font face à des défis émotionnels uniques : 
                  stress intense, surcharge de travail, exposition à la souffrance. 
                  Notre mission est de leur offrir des outils scientifiquement validés 
                  pour préserver et améliorer leur bien-être.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  Avec EmotionsCare, nous créons un écosystème de soutien qui combine 
                  technologie de pointe, expertise clinique et communauté bienveillante.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <Card className="text-center p-6">
                  <Heart className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Empathie</h4>
                  <p className="text-sm text-muted-foreground">
                    Comprendre et accompagner avec bienveillance
                  </p>
                </Card>
                <Card className="text-center p-6">
                  <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">
                    Technologies avancées au service du bien-être
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Nos Valeurs</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8">
              <CardHeader>
                <Users className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous croyons en la force du collectif. Ensemble, nous sommes plus forts 
                  face aux défis émotionnels du quotidien professionnel.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardHeader>
                <Award className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nous nous engageons à fournir des outils de la plus haute qualité, 
                  basés sur la recherche scientifique la plus récente.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardHeader>
                <Heart className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Bienveillance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chaque interaction est guidée par la compassion et le respect 
                  de l'expérience unique de chaque professionnel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Notre Équipe</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une équipe pluridisciplinaire d'experts en psychologie, technologie 
              et sciences de la santé, unis par une vision commune.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                <h3 className="text-xl font-semibold">Dr. Marie Dubois</h3>
                <p className="text-muted-foreground">Psychologue clinicienne & Co-fondatrice</p>
              </div>
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto"></div>
                <h3 className="text-xl font-semibold">Alex Martin</h3>
                <p className="text-muted-foreground">CTO & Expert IA</p>
              </div>
              <div className="space-y-4">
                <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto"></div>
                <h3 className="text-xl font-semibold">Dr. Sophie Laurent</h3>
                <p className="text-muted-foreground">Responsable Recherche & Validation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Rejoignez le mouvement
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Faites partie de la communauté de professionnels qui transforment 
            leur approche du bien-être émotionnel.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/choose-mode">
              Commencer maintenant
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
