import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Shield, TrendingUp } from 'lucide-react';

const B2BAdminCommunityManagement: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion Communauté</h1>
        <p className="text-muted-foreground">
          Modération et animation de la communauté d'entreprise
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membres actifs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications aujourd'hui</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">+8% par rapport à hier</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">Taux d'interaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Modération</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Signalements en attente</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Règles de communauté</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="respect" defaultChecked />
                <label htmlFor="respect" className="text-sm">Respect mutuel obligatoire</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="confidentiality" defaultChecked />
                <label htmlFor="confidentiality" className="text-sm">Confidentialité des partages</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="professional" defaultChecked />
                <label htmlFor="professional" className="text-sm">Contenu professionnel uniquement</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="automod" />
                <label htmlFor="automod" className="text-sm">Modération automatique IA</label>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Actions de modération</label>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">Avertissement</Button>
                <Button variant="outline" size="sm">Suppression</Button>
                <Button variant="destructive" size="sm">Suspension</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Nouvelle publication</p>
                    <p className="text-xs text-muted-foreground">Marie D. - "Conseils gestion stress"</p>
                    <p className="text-xs text-muted-foreground">Il y a 15min</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Commentaire</p>
                    <p className="text-xs text-muted-foreground">Paul M. - Réponse utile</p>
                    <p className="text-xs text-muted-foreground">Il y a 32min</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium">Signalement</p>
                    <p className="text-xs text-muted-foreground">Contenu inapproprié signalé</p>
                    <p className="text-xs text-muted-foreground">Il y a 1h</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default B2BAdminCommunityManagement;