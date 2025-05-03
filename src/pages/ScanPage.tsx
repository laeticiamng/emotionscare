
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { Badge } from '@/components/ui/badge';

// Define the EmotionalScan interface within the file
interface EmotionalScan {
  id: string;
  user_id: string;
  date: string;         // ISO timestamp
  mood: number;         // de 0 (très mal) à 100 (au top)
  notes?: string;       // commentaire optionnel
}

const ScanPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<EmotionalScan[]>([]);
  const [mood, setMood] = useState<number>(75);
  const [notes, setNotes] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const today = new Date().toISOString().slice(0, 10);  // YYYY-MM-DD

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Since we don't have a real users table in Supabase,
        // let's simulate some users with emotional scores
        const simulatedUsers: User[] = [
          {
            id: '1',
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            avatar: '',
            anonymity_code: 'Anon-5678',
            emotional_score: 85,
            role: 'Médecin'
          },
          {
            id: '2',
            name: 'Marie Martin',
            email: 'marie.martin@example.com',
            avatar: '',
            anonymity_code: 'Anon-9012',
            emotional_score: 65,
            role: 'Infirmier'
          },
          {
            id: '3',
            name: 'Pierre Bernard',
            email: 'pierre.bernard@example.com',
            avatar: '',
            anonymity_code: 'Anon-3456',
            emotional_score: 32,
            role: 'Aide-soignant'
          },
          {
            id: '4',
            name: 'Sophie Petit',
            email: 'sophie.petit@example.com',
            avatar: '',
            anonymity_code: 'Anon-7890',
            emotional_score: 50,
            role: 'Interne'
          },
        ];
        
        setUsers(simulatedUsers);
        
        // Fetch emotional scans history
        if (user) {
          const { data, error } = await supabase
            .from('emotions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false });
            
          if (error) throw error;
          
          if (data) {
            // Convert emotions data to EmotionalScan format
            const scans: EmotionalScan[] = data.map(emotion => ({
              id: emotion.id,
              user_id: emotion.user_id,
              date: emotion.date,
              mood: emotion.score || 50,
              notes: emotion.text
            }));
            setHistory(scans);
            
            // Pre-fill the slider if there's a scan for today
            const todayScan = scans.find(s => s.date.startsWith(today));
            if (todayScan) {
              setMood(todayScan.mood);
              setNotes(todayScan.notes || '');
            }
          }
        }
      } catch (error: any) {
        toast({
          title: "Erreur",
          description: `Impossible de charger les données: ${error.message}`,
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast, user, today]);

  const handleSave = async () => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour enregistrer un scan émotionnel",
          variant: "destructive"
        });
        return;
      }
      
      setLoading(true);
      
      // Map our UI fields to database fields (score instead of mood, text instead of notes)
      const { data, error } = await supabase
        .from('emotions')
        .upsert({
          user_id: user.id,
          date: new Date().toISOString(),
          score: mood,
          text: notes.trim() || null // Use null instead of undefined for empty strings
        }, {
          onConflict: 'user_id,date',
          returning: 'representation'
        })
        .select()
        .single();
        
      if (error || !data) throw error || new Error('Enregistrement du scan échoué');
      
      // Convert to EmotionalScan format
      const scan: EmotionalScan = {
        id: data.id,
        user_id: data.user_id,
        date: data.date,
        mood: data.score || 50,
        notes: data.text
      };
      
      // Update the history
      setHistory(prev => [scan, ...prev.filter(s => s.id !== scan.id)]);
      
      toast({
        title: "Scan enregistré",
        description: "Votre scan émotionnel a été enregistré avec succès"
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible d'enregistrer le scan: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-200';
    if (score >= 70) return 'bg-green-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const handleUserClick = (userId: string) => {
    navigate(`/scan/${userId}`);
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Scan émotionnel</h1>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* Personal scan form */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">🧠 Votre scan du jour</h2>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Comment vous sentez-vous aujourd'hui ?</label>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={[mood]}
                  onValueChange={(values) => setMood(values[0])}
                  className="w-full mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0</span>
                  <span className="font-medium">{mood}/100</span>
                  <span>100</span>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 font-medium">Quelques notes (optionnel)</label>
                <Textarea
                  rows={3}
                  placeholder="Écrivez quelques mots sur votre état..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSave} 
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Enregistrement...' : 'Sauvegarder'}
              </Button>
            </CardContent>
          </Card>
          
          {/* History */}
          {history.length > 0 && (
            <Card className="mb-8">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Votre historique</h2>
                <div className="space-y-4">
                  {history.map(scan => (
                    <Card key={scan.id} className="overflow-hidden">
                      <div className="flex justify-between items-center p-4">
                        <div>
                          <div className="font-medium">
                            {new Date(scan.date).toLocaleDateString('fr-FR', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                          {scan.notes && <div className="text-sm text-gray-600 mt-1">{scan.notes}</div>}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-lg font-bold">{scan.mood}/100</div>
                          <div className={`w-3 h-3 rounded-full ${getScoreColor(scan.mood)}`}></div>
                        </div>
                      </div>
                      <div className="h-1 w-full bg-gray-200">
                        <div 
                          className={`h-full ${getScoreColor(scan.mood)}`}
                          style={{ width: `${scan.mood}%` }}
                        ></div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Team overview */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-4">Équipe médicale</h2>
            <p className="text-gray-600 mb-4">Consultez l'état émotionnel de votre équipe</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((userData) => (
              <Card 
                key={userData.id}
                className="cursor-pointer transition-all hover:shadow-md hover:bg-accent"
                onClick={() => handleUserClick(userData.id)}
              >
                <CardContent className="flex items-center p-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={userData.avatar} />
                    <AvatarFallback>{(userData.name?.substring(0, 2) || 'UN').toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">
                      {user?.id === userData.id ? 
                        userData.name : 
                        userData.anonymity_code || `Anonyme ${userData.id.substring(0, 4)}`
                      }
                    </div>
                    <div className="text-sm text-muted-foreground">{userData.role || 'Pas de rôle'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={userData.emotional_score ? "default" : "outline"}>
                      Score: {userData.emotional_score || 'N/A'}
                    </Badge>
                    <div className={`w-3 h-3 rounded-full ${getScoreColor(userData.emotional_score)}`}></div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {users.length === 0 && (
              <div className="col-span-2 text-center p-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ScanPage;
