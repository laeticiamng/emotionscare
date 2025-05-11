
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Shell from '@/Shell';

const TeamPage: React.FC = () => {
  return (
    <Shell>
      <div className="max-w-6xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Mon équipe</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Team member cards */}
          {[1, 2, 3, 4, 5].map((member) => (
            <Card key={member} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Membre d'équipe {member}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Équipe: Développement</p>
                <p>Rôle: Développeur</p>
                <p>Statut: Actif</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Shell>
  );
};

export default TeamPage;
