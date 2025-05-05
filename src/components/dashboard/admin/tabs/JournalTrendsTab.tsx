
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const JournalTrendsTab: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Répartition des humeurs</CardTitle>
          <CardDescription>Distribution anonymisée des états d'esprit</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="flex h-full items-center justify-center">
            <div className="flex gap-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <span className="text-5xl">😊</span>
                </div>
                <h4 className="font-medium">Positif</h4>
                <p className="text-2xl font-bold text-green-600">62%</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <span className="text-5xl">😐</span>
                </div>
                <h4 className="font-medium">Neutre</h4>
                <p className="text-2xl font-bold text-blue-600">28%</p>
              </div>
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                  <span className="text-5xl">😔</span>
                </div>
                <h4 className="font-medium">Négatif</h4>
                <p className="text-2xl font-bold text-amber-600">10%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Word Cloud des entrées journal</CardTitle>
          <CardDescription>Mots-clés les plus utilisés (anonymisés)</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <div className="bg-white/80 p-6 rounded-xl w-full h-full flex flex-wrap items-center justify-center gap-3">
            {['bien-être', 'équipe', 'travail', 'stress', 'réunion', 'projet', 'deadline', 'pause', 
              'satisfaction', 'accomplissement', 'challenge', 'communication', 'soutien', 'objectifs'].map((word, i) => (
              <div 
                key={i}
                className="px-3 py-1 rounded-full bg-blue-100 text-blue-800"
                style={{ 
                  fontSize: `${Math.max(14, Math.min(24, 14 + Math.random() * 10))}px`,
                  opacity: 0.6 + (Math.random() * 0.4)
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card className="col-span-1 md:col-span-2 glass-card">
        <CardHeader>
          <CardTitle>Streaks moyens par service</CardTitle>
          <CardDescription>Nombre moyen de jours consécutifs avec entrées journal</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4">Service</th>
                  <th className="text-left py-3 px-4">Streak moyen</th>
                  <th className="text-left py-3 px-4">Participation</th>
                  <th className="text-left py-3 px-4">Évolution</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Marketing</td>
                  <td className="py-3 px-4">5.2 jours</td>
                  <td className="py-3 px-4">78%</td>
                  <td className="py-3 px-4 text-green-600">↑ +2.1%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">R&D</td>
                  <td className="py-3 px-4">4.8 jours</td>
                  <td className="py-3 px-4">72%</td>
                  <td className="py-3 px-4 text-green-600">↑ +1.2%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Ventes</td>
                  <td className="py-3 px-4">3.5 jours</td>
                  <td className="py-3 px-4">65%</td>
                  <td className="py-3 px-4 text-amber-600">↓ -0.8%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Support</td>
                  <td className="py-3 px-4">4.1 jours</td>
                  <td className="py-3 px-4">70%</td>
                  <td className="py-3 px-4 text-green-600">↑ +1.5%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalTrendsTab;
