
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { motion } from 'framer-motion';

const fakeEmotionData = [
  { date: '01 Mai', joie: 70, tristesse: 20, colère: 10, peur: 15, sérénité: 60 },
  { date: '02 Mai', joie: 65, tristesse: 25, colère: 20, peur: 10, sérénité: 55 },
  { date: '03 Mai', joie: 75, tristesse: 15, colère: 5, peur: 10, sérénité: 70 },
  { date: '04 Mai', joie: 60, tristesse: 30, colère: 25, peur: 20, sérénité: 50 },
  { date: '05 Mai', joie: 80, tristesse: 10, colère: 5, peur: 5, sérénité: 75 },
  { date: '06 Mai', joie: 85, tristesse: 5, colère: 10, peur: 5, sérénité: 80 },
  { date: '07 Mai', joie: 75, tristesse: 15, colère: 15, peur: 10, sérénité: 65 },
];

const fakeWeeklyData = [
  { semaine: 'Sem 1', bien_être: 65, stress: 35 },
  { semaine: 'Sem 2', bien_être: 70, stress: 30 },
  { semaine: 'Sem 3', bien_être: 60, stress: 40 },
  { semaine: 'Sem 4', bien_être: 75, stress: 25 },
];

const B2CEmotionProgressPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <div className="container mx-auto py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold mb-6">Suivi de Progression Émotionnelle</h1>
        
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Suivi Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Suivi Hebdomadaire</TabsTrigger>
            <TabsTrigger value="calendar">Calendrier</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Évolution quotidienne des émotions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fakeEmotionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="joie" stroke="#4ade80" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="tristesse" stroke="#60a5fa" />
                      <Line type="monotone" dataKey="colère" stroke="#f87171" />
                      <Line type="monotone" dataKey="peur" stroke="#a78bfa" />
                      <Line type="monotone" dataKey="sérénité" stroke="#34d399" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Émotions dominantes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: 'Joie', value: 75 },
                          { name: 'Tristesse', value: 15 },
                          { name: 'Colère', value: 10 },
                          { name: 'Peur', value: 8 },
                          { name: 'Sérénité', value: 68 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#60a5fa" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Facteurs influençant</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <span>Sommeil</span>
                      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Alimentation</span>
                      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Activité physique</span>
                      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </li>
                    <li className="flex justify-between items-center">
                      <span>Relations sociales</span>
                      <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="weekly">
            <Card>
              <CardHeader>
                <CardTitle>Tendance hebdomadaire</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={fakeWeeklyData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="semaine" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bien_être" stackId="a" fill="#4ade80" />
                      <Bar dataKey="stress" stackId="a" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des fonctionnalités</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between">
                      <span>Journal émotionnel</span>
                      <span className="font-medium">12 sessions</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Musique</span>
                      <span className="font-medium">8 sessions</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Audio relaxants</span>
                      <span className="font-medium">6 sessions</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Coach IA</span>
                      <span className="font-medium">4 sessions</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recommandations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-1">
                    <li className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">Augmenter les sessions de méditation</li>
                    <li className="p-2 bg-green-50 dark:bg-green-900/20 rounded">Continuer l'usage du journal émotionnel</li>
                    <li className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded">Explorer les playlists de détente</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Calendrier émotionnel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  {date && (
                    <div className="mt-6 p-4 border rounded-lg w-full">
                      <h3 className="text-lg font-semibold mb-2">{date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Émotion dominante</p>
                          <p className="font-medium">Joie (75%)</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sessions</p>
                          <p className="font-medium">3 activités</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Bien-être global</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default B2CEmotionProgressPage;
