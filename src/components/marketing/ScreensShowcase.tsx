// @ts-nocheck
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, Headphones } from 'lucide-react';

/**
 * Showcase des interfaces et expériences
 */
export const ScreensShowcase: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Une expérience sur mesure
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Interfaces adaptatives, design accessible, et expériences immersives 
          pour tous les contextes d'usage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Desktop Experience */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              {/* Mock desktop interface */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-blue-200 to-purple-200 rounded"></div>
                <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                
                <div className="grid grid-cols-3 gap-2 mt-4">
                  <div className="h-8 bg-blue-100 rounded"></div>
                  <div className="h-8 bg-green-100 rounded"></div>
                  <div className="h-8 bg-purple-100 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Monitor className="w-5 h-5 text-blue-600" />
              <Badge variant="outline">Desktop</Badge>
            </div>
            <h3 className="font-semibold mb-2">Dashboard complet</h3>
            <p className="text-sm text-muted-foreground">
              Interface riche avec heatmaps, analytics et outils de gestion d'équipe pour les managers.
            </p>
          </CardContent>
        </Card>

        {/* Mobile Experience */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-blue-50 p-8 flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-2 w-32">
              {/* Mock mobile interface */}
              <div className="bg-gray-900 rounded-xl p-3 text-white">
                <div className="flex justify-between items-center mb-3">
                  <div className="w-6 h-1 bg-white rounded"></div>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 bg-white/80 rounded w-3/4"></div>
                  <div className="h-1 bg-white/40 rounded w-1/2"></div>
                  
                  <div className="grid grid-cols-2 gap-1 mt-3">
                    <div className="h-6 bg-blue-400 rounded"></div>
                    <div className="h-6 bg-green-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone className="w-5 h-5 text-green-600" />
              <Badge variant="outline">Mobile</Badge>
            </div>
            <h3 className="font-semibold mb-2">Sessions rapides</h3>
            <p className="text-sm text-muted-foreground">
              Modules de 60-90 secondes optimisés pour mobile, parfaits entre deux réunions.
            </p>
          </CardContent>
        </Card>

        {/* VR Experience */}
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 text-white">
              {/* Mock VR interface */}
              <div className="flex justify-center mb-2">
                <div className="w-12 h-8 border-2 border-white/50 rounded flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="h-2 bg-white/60 rounded mx-auto w-16"></div>
                <div className="h-1 bg-white/40 rounded mx-auto w-12"></div>
                
                <div className="flex justify-center gap-1 mt-3">
                  <div className="w-2 h-4 bg-white/60 rounded"></div>
                  <div className="w-2 h-6 bg-white/80 rounded"></div>
                  <div className="w-2 h-4 bg-white/60 rounded"></div>
                </div>
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Headphones className="w-5 h-5 text-purple-600" />
              <Badge variant="outline">VR/AR</Badge>
            </div>
            <h3 className="font-semibold mb-2">Immersion totale</h3>
            <p className="text-sm text-muted-foreground">
              Expériences de réalité virtuelle pour la méditation et la cohérence cardiaque.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};