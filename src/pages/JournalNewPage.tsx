import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Save, Mic, MicOff, Camera, Image, Smile, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const JournalNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const moodOptions = [
    { value: 'happy', label: '😊 Joyeux', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'calm', label: '😌 Calme', color: 'bg-blue-100 text-blue-800' },
    { value: 'anxious', label: '😰 Anxieux', color: 'bg-orange-100 text-orange-800' },
    { value: 'sad', label: '😢 Triste', color: 'bg-gray-100 text-gray-800' },
    { value: 'excited', label: '🤩 Excité', color: 'bg-purple-100 text-purple-800' },
    { value: 'tired', label: '😴 Fatigué', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'grateful', label: '🙏 Reconnaissant', color: 'bg-green-100 text-green-800' },
  ];

  const suggestedTags = [
    'travail', 'famille', 'sport', 'santé', 'créativité', 'voyage', 
    'amis', 'lecture', 'nature', 'méditation', 'objectifs', 'défis'
  ];

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir au moins le titre et le contenu');
      return;
    }

    const entry = {
      id: Date.now().toString(),
      title,
      content,
      mood,
      tags,
      isPrivate,
      date: selectedDate,
      createdAt: new Date().toISOString(),
    };

    // Ici, sauvegarder l'entrée dans le store/API
    console.log('Nouvelle entrée de journal:', entry);
    
    // Retour vers la page journal avec un message de succès
    navigate('/app/journal', { 
      state: { message: 'Entrée sauvegardée avec succès!' } 
    });
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Ici, implémenter la reconnaissance vocale
  };

  const selectedMoodData = moodOptions.find(m => m.value === mood);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold">Nouvelle Entrée</h1>
              <p className="text-sm text-muted-foreground">Partagez vos pensées et émotions</p>
            </div>
          </div>
          
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Métadonnées */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Humeur</label>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger>
                  <SelectValue placeholder="Comment vous sentez-vous ?" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Visibilité</label>
              <Select value={isPrivate ? 'private' : 'public'} onValueChange={(value) => setIsPrivate(value === 'private')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">🔒 Privé</SelectItem>
                  <SelectItem value="public">🌍 Partagé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedMoodData && (
            <div className="mt-4">
              <Badge className={selectedMoodData.color}>
                {selectedMoodData.label}
              </Badge>
            </div>
          )}
        </Card>

        {/* Contenu Principal */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Input
                placeholder="Donnez un titre à votre entrée..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            <div className="relative">
              <Textarea
                placeholder="Que s'est-il passé aujourd'hui ? Comment vous sentez-vous ? Qu'avez-vous appris ?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] resize-none"
              />
              
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleRecording}
                  className={isRecording ? 'bg-red-100 text-red-700 animate-pulse' : ''}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Camera className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {content.length} caractères • ~{Math.ceil(content.split(' ').length / 200)} min de lecture
            </div>
          </div>
        </Card>

        {/* Tags */}
        <Card className="p-4">
          <h3 className="font-medium mb-3">Tags</h3>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Tags suggérés :</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags
                .filter(tag => !tags.includes(tag))
                .slice(0, 8)
                .map((tag) => (
                <Badge 
                  key={tag}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  onClick={() => addTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Conseils d'écriture */}
        <Card className="p-4 bg-blue-50 border-blue-200">
          <h3 className="font-medium text-blue-900 mb-2">💡 Conseils pour bien écrire</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Soyez authentique et honnête avec vos émotions</li>
            <li>• Décrivez les détails qui ont marqué votre journée</li>
            <li>• Notez ce pour quoi vous êtes reconnaissant</li>
            <li>• Identifiez les leçons apprises ou les réflexions importantes</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default JournalNewPage;