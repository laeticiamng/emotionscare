import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, Clock, Star } from 'lucide-react';

const B2BAdminSupportManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion du Support</h1>
        <p className="text-muted-foreground">
          Supervision du support client et assistance utilisateur
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets ouverts</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 critiques, 5 normaux</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs aidés</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps de réponse</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">Moyenne</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.6/5</div>
            <p className="text-xs text-muted-foreground">Note moyenne</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tickets récents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Problème synchronisation</p>
                  <p className="text-xs text-muted-foreground">Marie D. • IT • Critique</p>
                  <p className="text-xs text-muted-foreground">Ouvert il y a 2h</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Critique</span>
                  <Button variant="outline" size="sm">Traiter</Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Question sur les badges</p>
                  <p className="text-xs text-muted-foreground">Paul M. • Marketing • Normal</p>
                  <p className="text-xs text-muted-foreground">Ouvert il y a 4h</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Normal</span>
                  <Button variant="outline" size="sm">Traiter</Button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">Demande formation</p>
                  <p className="text-xs text-muted-foreground">Sophie L. • RH • Normal</p>
                  <p className="text-xs text-muted-foreground">Ouvert il y a 1j</p>
                </div>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">Normal</span>
                  <Button variant="outline" size="sm">Traiter</Button>
                </div>
              </div>
            </div>
            <Button className="w-full">Voir tous les tickets</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Centre d'aide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Articles les plus consultés</label>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Comment faire un scan émotionnel</span>
                    <span className="text-xs text-muted-foreground">234 vues</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Configurer les notifications</span>
                    <span className="text-xs text-muted-foreground">187 vues</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Obtenir des badges</span>
                    <span className="text-xs text-muted-foreground">156 vues</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Utiliser le coach IA</span>
                    <span className="text-xs text-muted-foreground">143 vues</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support disponible</label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="chat" defaultChecked />
                    <label htmlFor="chat" className="text-sm">Chat en direct</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="email" defaultChecked />
                    <label htmlFor="email" className="text-sm">Support par email</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="phone" />
                    <label htmlFor="phone" className="text-sm">Support téléphonique</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="video" />
                    <label htmlFor="video" className="text-sm">Session vidéo</label>
                  </div>
                </div>
              </div>
            </div>
            <Button className="w-full">Gérer le centre d'aide</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminSupportManagement;