/**
 * HomeB2BPage - Landing page B2B
 * TICKET: FE/BE-Router-Cleanup-01
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Routes } from '@/routerV2/helpers';
import { Building, Users, BarChart, Shield, Award, Zap } from 'lucide-react';

const HomeB2BPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-gray-900">EmotionsCare Business</span>
          </div>
          <div className="flex space-x-4">
            <Link to={Routes.login({ segment: 'b2b' })}>
              <Button variant="ghost">Connexion équipe</Button>
            </Link>
            <Link to={Routes.contact()}>
              <Button>Demander une démo</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transformez le bien-être en entreprise
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Augmentez la productivité et réduisez l'absentéisme avec notre plateforme 
            de bien-être émotionnel conçue pour les équipes et les organisations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to={Routes.contact()}>
              <Button size="lg" className="px-8">
                Demander une démo
              </Button>
            </Link>
            <Link to={Routes.b2cLanding()}>
              <Button size="lg" variant="outline" className="px-8">
                Version particuliers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <p className="text-lg opacity-90">Amélioration du bien-être</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">-40%</div>
              <p className="text-lg opacity-90">Réduction de l'absentéisme</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">+25%</div>
              <p className="text-lg opacity-90">Augmentation de la productivité</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nos solutions pour votre entreprise
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Gestion d'équipes</h3>
                <p className="text-gray-600">
                  Suivez le bien-être de vos collaborateurs et identifiez les signaux faibles
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <BarChart className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Analytics RH</h3>
                <p className="text-gray-600">
                  Tableaux de bord complets pour mesurer l'impact sur la performance
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Conformité RGPD</h3>
                <p className="text-gray-600">
                  Sécurité et confidentialité des données garanties selon les normes européennes
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Programmes personnalisés</h3>
                <p className="text-gray-600">
                  Solutions sur mesure adaptées à votre secteur et à vos enjeux
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Intégrations API</h3>
                <p className="text-gray-600">
                  Connectez-vous facilement à vos outils RH et de gestion existants
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Support dédié</h3>
                <p className="text-gray-600">
                  Accompagnement complet avec votre Customer Success Manager
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Tarifs adaptés à votre organisation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Starter</h3>
                <div className="text-3xl font-bold mb-4">€15<span className="text-sm text-gray-600">/utilisateur/mois</span></div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Jusqu'à 50 utilisateurs</li>
                  <li>Modules de base</li>
                  <li>Support par email</li>
                  <li>Rapports mensuels</li>
                </ul>
                <Button variant="outline" className="w-full">Commencer</Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardContent className="p-6">
                <div className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full mb-4">
                  Le plus populaire
                </div>
                <h3 className="text-xl font-semibold mb-4">Business</h3>
                <div className="text-3xl font-bold mb-4">€25<span className="text-sm text-gray-600">/utilisateur/mois</span></div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Jusqu'à 500 utilisateurs</li>
                  <li>Tous les modules</li>
                  <li>Support prioritaire</li>
                  <li>Analytics avancés</li>
                  <li>Intégrations API</li>
                </ul>
                <Button className="w-full">Demander une démo</Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
                <div className="text-3xl font-bold mb-4">Sur mesure</div>
                <ul className="text-sm text-gray-600 space-y-2 mb-6">
                  <li>Utilisateurs illimités</li>
                  <li>Personnalisation complète</li>
                  <li>Support dédié 24/7</li>
                  <li>SLA garantie</li>
                  <li>Formation sur site</li>
                </ul>
                <Button variant="outline" className="w-full">Nous contacter</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Prêt à améliorer le bien-être de vos équipes ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Planifiez une démonstration personnalisée avec notre équipe
          </p>
          <Link to={Routes.contact()}>
            <Button size="lg" variant="secondary" className="px-8">
              Planifier une démo
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6" />
                <span className="text-xl font-bold">EmotionsCare Business</span>
              </div>
              <p className="text-gray-400">
                Solutions de bien-être émotionnel pour les entreprises
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={Routes.about()} className="hover:text-white">À propos</Link></li>
                <li><Link to={Routes.contact()} className="hover:text-white">Contact</Link></li>
                <li><Link to={Routes.help()} className="hover:text-white">Aide</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to={Routes.b2cLanding()} className="hover:text-white">Particuliers</Link></li>
                <li><Link to={Routes.b2bLanding()} className="hover:text-white">Entreprises</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">CGV</a></li>
                <li><a href="#" className="hover:text-white">Confidentialité</a></li>
                <li><a href="#" className="hover:text-white">RGPD</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EmotionsCare Business. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomeB2BPage;