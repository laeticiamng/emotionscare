import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Sparkles, 
  Target, 
  Zap, 
  Users, 
  TrendingUp,
  Play,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const HomeB2CPage: React.FC = () => {
  const features = [
    {
      icon: Heart,
      title: "Scan Émotionnel IA",
      description: "Analyse en temps réel de vos émotions via reconnaissance faciale",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      icon: Sparkles,
      title: "Musicothérapie Adaptative",
      description: "Playlists personnalisées selon votre état émotionnel",
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      icon: Target,
      title: "Coach IA Personnel",
      description: "Accompagnement personnalisé 24/7 avec intelligence artificielle",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    },
    {
      icon: Zap,
      title: "Modules Flash-Glow",
      description: "Boost instantané de bien-être en 5 minutes chrono",
      color: "text-primary",
      bgColor: "bg-primary/10"
    }
  ];

  const benefits = [
    "Réduction du stress jusqu'à 67% en 30 jours",
    "Amélioration du sommeil et de la concentration",
    "Techniques de respiration et méditation guidée",
    "Suivi de progression avec analytics détaillées",
    "Communauté bienveillante et supportive",
    "Accès illimité à tous les modules premium"
  ];

  const testimonials = [
    {
      name: "Marie L.",
      role: "Consultante",
      comment: "EmotionsCare a transformé ma gestion du stress. Les modules flash sont parfaits entre deux réunions !",
      rating: 5
    },
    {
      name: "Thomas K.",
      role: "Étudiant",
      comment: "Le coach IA comprend vraiment mes besoins. C'est comme avoir un thérapeute disponible 24/7.",
      rating: 5
    },
    {
      name: "Sophie R.",
      role: "Manager",
      comment: "La musicothérapie adaptative m'aide énormément à retrouver ma sérénité après des journées intenses.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="outline" className="px-4 py-2">
              🚀 Nouvelle version avec IA générative
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Votre Bien-être
              <span className="text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Amplifié par l'IA
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez EmotionsCare, la plateforme qui révolutionne votre quotidien avec des outils
              d'intelligence artificielle pour gérer stress, émotions et développement personnel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button size="lg" className="px-8 py-3">
                  <Play className="mr-2 h-5 w-5" />
                  Commencer Gratuitement
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" size="lg" className="px-8 py-3">
                  <ArrowRight className="mr-2 h-5 w-5" />
                  Voir la Démo
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>14 jours gratuits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-primary" />
                <span>+10k utilisateurs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Outils d'IA Révolutionnaires
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Chaque fonctionnalité est conçue avec l'intelligence artificielle 
              pour s'adapter parfaitement à vos besoins uniques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${feature.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Résultats Prouvés Scientifiquement
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nos utilisateurs constatent des améliorations mesurables 
                dès les premières semaines d'utilisation.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/signup">
                  <Button size="lg">
                    Rejoindre EmotionsCare
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Card className="p-8 text-center">
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <span className="text-4xl font-bold text-primary">67%</span>
                  </div>
                  <p className="text-lg font-medium">
                    Réduction moyenne du stress
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mesuré sur 1000+ utilisateurs après 30 jours
                  </p>
                </div>
              </Card>

              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-full p-4">
                <Users className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ils Transforment Leur Quotidien
            </h2>
            <p className="text-lg text-muted-foreground">
              Découvrez comment EmotionsCare change la vie de nos utilisateurs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-primary">⭐</span>
                    ))}
                  </div>
                  <p className="text-foreground italic">
                    "{testimonial.comment}"
                  </p>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Prêt à Transformer Votre Bien-être ?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Rejoignez des milliers d'utilisateurs qui ont déjà révolutionné 
            leur quotidien avec EmotionsCare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="px-8 py-3">
                <Sparkles className="mr-2 h-5 w-5" />
                Commencer Maintenant
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="px-8 py-3">
                Questions ? Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeB2CPage;