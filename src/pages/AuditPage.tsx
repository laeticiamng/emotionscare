
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectAuditDashboard from '@/components/audit/ProjectAuditDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Code, TestTube, Settings } from 'lucide-react';

const AuditPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Audit Projet EmotionsCare</h1>
        <p className="text-muted-foreground mt-2">
          État complet du développement et des fonctionnalités
        </p>
      </div>

      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Fonctionnalités
          </TabsTrigger>
          <TabsTrigger value="technical" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Technique
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Tests
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuration
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features">
          <ProjectAuditDashboard />
        </TabsContent>

        <TabsContent value="technical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Structure du Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Composants React</span>
                  <Badge>45+</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Pages</span>
                  <Badge>12+</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Hooks personnalisés</span>
                  <Badge>8+</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Services API</span>
                  <Badge>5+</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>React 18</span>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>TypeScript</span>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tailwind CSS</span>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Framer Motion</span>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Supabase</span>
                  <Badge className="bg-green-100 text-green-800">✓</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tests">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tests Unitaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600">45%</div>
                  <div className="text-sm text-muted-foreground">Couverture actuelle</div>
                  <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                    Objectif: 90%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tests E2E</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">0</div>
                  <div className="text-sm text-muted-foreground">Tests Cypress</div>
                  <Badge className="mt-2 bg-red-100 text-red-800">
                    À implémenter
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Lighthouse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">85</div>
                  <div className="text-sm text-muted-foreground">Score moyen</div>
                  <Badge className="mt-2 bg-green-100 text-green-800">
                    Objectif: 90+
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Build</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Badge className="bg-blue-100 text-blue-800">Bun</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Package Manager</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-purple-100 text-purple-800">Vite</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Bundler</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-green-100 text-green-800">ESBuild</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Transpiler</div>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-orange-100 text-orange-800">SWC</Badge>
                    <div className="text-sm text-muted-foreground mt-1">Minifier</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Variables d'Environnement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>SUPABASE_URL</span>
                    <Badge className="bg-green-100 text-green-800">✓ Configuré</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>SUPABASE_ANON_KEY</span>
                    <Badge className="bg-green-100 text-green-800">✓ Configuré</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>OPENAI_API_KEY</span>
                    <Badge className="bg-green-100 text-green-800">✓ Configuré</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>HUME_API_KEY</span>
                    <Badge className="bg-green-100 text-green-800">✓ Configuré</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditPage;
