import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Code, Shield, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/lib/routes';

/**
 * Page Crédits & Licences Open Source
 */
export const LicensesPage: React.FC = () => {
  const navigate = useNavigate();

  const licenses = [
    {
      category: 'Frameworks & Librairies principales',
      packages: [
        { name: 'React', version: '18.2.0', license: 'MIT', url: 'https://react.dev' },
        { name: 'Vite', version: '5.x', license: 'MIT', url: 'https://vitejs.dev' },
        { name: 'TypeScript', version: '5.x', license: 'Apache-2.0', url: 'https://www.typescriptlang.org' },
        { name: 'Tailwind CSS', version: '3.x', license: 'MIT', url: 'https://tailwindcss.com' },
      ]
    },
    {
      category: 'Composants UI',
      packages: [
        { name: '@radix-ui/react-*', version: '1.x', license: 'MIT', url: 'https://www.radix-ui.com' },
        { name: 'lucide-react', version: '0.369.0', license: 'ISC', url: 'https://lucide.dev' },
        { name: 'framer-motion', version: '11.x', license: 'MIT', url: 'https://www.framer.com/motion' },
        { name: '@chakra-ui/react', version: '3.19.1', license: 'MIT', url: 'https://chakra-ui.com' },
      ]
    },
    {
      category: 'Backend & Data',
      packages: [
        { name: '@supabase/supabase-js', version: '2.43.4', license: 'MIT', url: 'https://supabase.com' },
        { name: '@tanstack/react-query', version: '5.x', license: 'MIT', url: 'https://tanstack.com/query' },
        { name: 'zod', version: '3.23.8', license: 'MIT', url: 'https://zod.dev' },
        { name: 'react-hook-form', version: '7.53.0', license: 'MIT', url: 'https://react-hook-form.com' },
      ]
    },
    {
      category: 'Visualisation de données',
      packages: [
        { name: 'chart.js', version: '4.4.9', license: 'MIT', url: 'https://www.chartjs.org' },
        { name: 'react-chartjs-2', version: '5.3.0', license: 'MIT', url: 'https://react-chartjs-2.js.org' },
        { name: 'recharts', version: '2.12.7', license: 'MIT', url: 'https://recharts.org' },
      ]
    },
    {
      category: 'IA & Machine Learning',
      packages: [
        { name: '@huggingface/transformers', version: '3.7.2', license: 'Apache-2.0', url: 'https://huggingface.co/docs/transformers.js' },
        { name: '@mediapipe/tasks-vision', version: '0.10.22', license: 'Apache-2.0', url: 'https://developers.google.com/mediapipe' },
        { name: 'openai', version: '4.100.0', license: 'MIT', url: 'https://platform.openai.com' },
      ]
    },
    {
      category: '3D & Multimédia',
      packages: [
        { name: 'three', version: '0.160.1', license: 'MIT', url: 'https://threejs.org' },
        { name: '@react-three/fiber', version: '8.13.5', license: 'MIT', url: 'https://docs.pmnd.rs/react-three-fiber' },
        { name: '@react-three/drei', version: '9.59.0', license: 'MIT', url: 'https://github.com/pmndrs/drei' },
        { name: 'tone', version: '15.1.22', license: 'MIT', url: 'https://tonejs.github.io' },
      ]
    },
    {
      category: 'Monitoring & Analytics',
      packages: [
        { name: '@sentry/react', version: '7.120.3', license: 'BSD-3-Clause', url: 'https://sentry.io' },
        { name: '@vercel/analytics', version: '1.5.0', license: 'MIT', url: 'https://vercel.com/analytics' },
      ]
    },
    {
      category: 'Utilitaires',
      packages: [
        { name: 'date-fns', version: '3.6.0', license: 'MIT', url: 'https://date-fns.org' },
        { name: 'uuid', version: '11.1.0', license: 'MIT', url: 'https://github.com/uuidjs/uuid' },
        { name: 'clsx', version: '2.1.0', license: 'MIT', url: 'https://github.com/lukeed/clsx' },
        { name: 'sonner', version: '2.0.5', license: 'MIT', url: 'https://sonner.emilkowal.ski' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <Button
          onClick={() => navigate(routes.public.home())}
          variant="outline"
          size="sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <CardTitle className="text-3xl flex items-center gap-2">
                <Code className="h-8 w-8 text-primary" />
                Crédits & Licences Open Source
              </CardTitle>
              <Badge variant="outline" className="text-sm">
                186 dépendances
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              EmotionsCare est construit avec des technologies open source. Nous remercions tous les contributeurs de ces projets.
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            
            {/* Préambule */}
            <section className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-2">Conformité aux licences Open Source</h3>
                  <p className="text-sm text-muted-foreground">
                    Cette page liste les principales bibliothèques et frameworks open source utilisés dans EmotionsCare. 
                    Toutes les licences sont respectées conformément à leurs termes. Pour consulter le texte complet de chaque licence, 
                    veuillez visiter les liens officiels fournis.
                  </p>
                </div>
              </div>
            </section>

            {/* Liste des packages par catégorie */}
            {licenses.map((category, idx) => (
              <section key={idx}>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  {category.category}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.packages.map((pkg, pkgIdx) => (
                    <Card key={pkgIdx} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">{pkg.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              Version {pkg.version}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {pkg.license}
                          </Badge>
                        </div>
                        <a
                          href={pkg.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1 mt-2"
                        >
                          Documentation
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}

            {/* Textes de licences courantes */}
            <section className="border-t pt-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Textes des licences principales</h2>
              
              {/* MIT License */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">MIT License</CardTitle>
                  <p className="text-xs text-muted-foreground">Utilisée par la majorité de nos dépendances</p>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
                  </pre>
                </CardContent>
              </Card>

              {/* Apache 2.0 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Apache License 2.0</CardTitle>
                  <p className="text-xs text-muted-foreground">Utilisée notamment par TypeScript, Hugging Face, MediaPipe</p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-2">
                    Texte complet disponible sur : 
                    <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-1">
                      https://www.apache.org/licenses/LICENSE-2.0
                    </a>
                  </p>
                  <p className="text-sm">
                    La licence Apache 2.0 permet l'utilisation, la modification et la distribution du logiciel, 
                    sous réserve de conserver les mentions de copyright et d'inclure le texte de la licence.
                  </p>
                </CardContent>
              </Card>

              {/* ISC License */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ISC License</CardTitle>
                  <p className="text-xs text-muted-foreground">Utilisée par Lucide Icons</p>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
{`Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`}
                  </pre>
                </CardContent>
              </Card>
            </section>

            {/* Note finale */}
            <section className="border-t pt-6">
              <h3 className="font-semibold mb-2">Note importante</h3>
              <p className="text-sm text-muted-foreground">
                Cette liste représente les principales dépendances directes. Pour obtenir la liste complète des 186 dépendances 
                (incluant les dépendances transitives), consultez le fichier <code className="bg-muted px-1 py-0.5 rounded">package.json</code> du projet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Si vous constatez une omission ou une erreur concernant une attribution de licence, merci de nous contacter à : 
                <a href="mailto:legal@emotionscare.com" className="text-primary hover:underline ml-1">legal@emotionscare.com</a>
              </p>
            </section>

            <section className="text-xs text-muted-foreground border-t pt-4">
              <p><strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p><strong>Version :</strong> 1.0</p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LicensesPage;
