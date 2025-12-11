/**
 * Crisis Alert System - Système d'alertes de crise en temps réel
 * Gère les contacts d'urgence, détection de patterns et notifications
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Phone,
  Heart,
  Shield,
  Plus,
  Trash2,
  Bell,
  MessageSquare,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Mail
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  notifyOnCrisis: boolean;
  priority: number;
}

interface CrisisAlert {
  id: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  resolved: boolean;
  resolvedAt?: Date;
}

const CRISIS_RESOURCES = [
  { name: 'SOS Amitié', phone: '09 72 39 40 50', available: '24/7' },
  { name: 'Fil Santé Jeunes', phone: '0 800 235 236', available: '9h-23h' },
  { name: 'SOS Suicide', phone: '3114', available: '24/7' },
  { name: 'Croix-Rouge Écoute', phone: '0 800 858 858', available: '24/7' },
];

export const CrisisAlertSystem: React.FC = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<EmergencyContact[]>([
    {
      id: '1',
      name: 'Dr. Martin',
      phone: '+33 6 12 34 56 78',
      email: 'dr.martin@example.com',
      relationship: 'Médecin traitant',
      notifyOnCrisis: true,
      priority: 1
    }
  ]);
  const [alerts, setAlerts] = useState<CrisisAlert[]>([]);
  const [settings, setSettings] = useState({
    autoDetection: true,
    notifyContacts: true,
    lowMoodThreshold: 3,
    consecutiveDays: 3,
    nighttimeAlerts: false
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState<Partial<EmergencyContact>>({
    notifyOnCrisis: true,
    priority: contacts.length + 1
  });
  const [isMonitoring, setIsMonitoring] = useState(true);

  // Simuler la détection de patterns
  useEffect(() => {
    if (!settings.autoDetection) return;
    
    const interval = setInterval(() => {
      // Simulation: 5% de chance de détecter un pattern préoccupant
      if (Math.random() < 0.05 && isMonitoring) {
        const newAlert: CrisisAlert = {
          id: Date.now().toString(),
          timestamp: new Date(),
          severity: Math.random() > 0.7 ? 'high' : 'medium',
          type: 'mood_pattern',
          description: 'Pattern de baisse d\'humeur détecté sur les 3 derniers jours',
          resolved: false
        };
        setAlerts(prev => [newAlert, ...prev]);
        
        toast({
          title: '⚠️ Alerte détectée',
          description: newAlert.description,
          variant: 'destructive'
        });
      }
    }, 30000); // Vérifier toutes les 30 secondes

    return () => clearInterval(interval);
  }, [settings.autoDetection, isMonitoring, toast]);

  const addContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir le nom et le téléphone.',
        variant: 'destructive'
      });
      return;
    }

    const contact: EmergencyContact = {
      id: Date.now().toString(),
      name: newContact.name,
      phone: newContact.phone,
      email: newContact.email,
      relationship: newContact.relationship || 'Autre',
      notifyOnCrisis: newContact.notifyOnCrisis ?? true,
      priority: contacts.length + 1
    };

    setContacts(prev => [...prev, contact]);
    setNewContact({ notifyOnCrisis: true, priority: contacts.length + 2 });
    setShowAddContact(false);
    
    toast({
      title: 'Contact ajouté',
      description: `${contact.name} a été ajouté à vos contacts d'urgence.`
    });
  };

  const removeContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast({
      title: 'Contact supprimé',
      description: 'Le contact a été retiré de votre liste.'
    });
  };

  const resolveAlert = (id: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, resolved: true, resolvedAt: new Date() } : a
    ));
    toast({
      title: 'Alerte résolue',
      description: 'L\'alerte a été marquée comme résolue.'
    });
  };

  const activeAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  return (
    <div className="space-y-6">
      {/* Header avec statut */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Système d'Alerte Crise
          </h2>
          <p className="text-muted-foreground">Détection et gestion des situations de crise</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isMonitoring ? 'default' : 'secondary'} className="gap-1">
            <Activity className={`h-3 w-3 ${isMonitoring ? 'animate-pulse' : ''}`} />
            {isMonitoring ? 'Surveillance active' : 'En pause'}
          </Badge>
          <Switch
            checked={isMonitoring}
            onCheckedChange={setIsMonitoring}
            aria-label="Activer la surveillance"
          />
        </div>
      </div>

      {/* Alertes actives */}
      {activeAlerts.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{activeAlerts.length} alerte(s) active(s)</AlertTitle>
          <AlertDescription>
            Des patterns préoccupants ont été détectés. Consultez les détails ci-dessous.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="alerts" className="gap-1">
            <Bell className="h-4 w-4" />
            Alertes
            {activeAlerts.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 text-xs">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="contacts" className="gap-1">
            <Phone className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-1">
            <Heart className="h-4 w-4" />
            Ressources
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-1">
            <Activity className="h-4 w-4" />
            Paramètres
          </TabsTrigger>
        </TabsList>

        {/* Onglet Alertes */}
        <TabsContent value="alerts" className="space-y-4">
          {activeAlerts.length === 0 && resolvedAlerts.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <h3 className="text-lg font-semibold">Tout va bien</h3>
                <p className="text-muted-foreground">Aucune alerte détectée récemment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {activeAlerts.map(alert => (
                <Card key={alert.id} className="border-destructive/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-destructive' :
                          alert.severity === 'high' ? 'bg-destructive/80' :
                          alert.severity === 'medium' ? 'bg-warning' : 'bg-muted'
                        }`}>
                          <AlertTriangle className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{alert.type === 'mood_pattern' ? 'Pattern émotionnel' : alert.type}</h4>
                            <Badge variant={alert.severity === 'critical' || alert.severity === 'high' ? 'destructive' : 'secondary'}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp.toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => resolveAlert(alert.id)}>
                        Résoudre
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {resolvedAlerts.length > 0 && (
                <div className="pt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">Alertes résolues</h4>
                  {resolvedAlerts.slice(0, 5).map(alert => (
                    <Card key={alert.id} className="mb-2 opacity-60">
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{alert.description}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            Résolu le {alert.resolvedAt?.toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        {/* Onglet Contacts */}
        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Ces contacts seront notifiés en cas de détection de crise.
            </p>
            <Dialog open={showAddContact} onOpenChange={setShowAddContact}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un contact d'urgence</DialogTitle>
                  <DialogDescription>
                    Ce contact pourra être notifié en cas de situation préoccupante.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-name">Nom *</Label>
                    <Input
                      id="contact-name"
                      value={newContact.name || ''}
                      onChange={e => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Dr. Dupont"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Téléphone *</Label>
                    <Input
                      id="contact-phone"
                      value={newContact.phone || ''}
                      onChange={e => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-email">Email</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={newContact.email || ''}
                      onChange={e => setNewContact(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="contact@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact-relationship">Relation</Label>
                    <Select
                      value={newContact.relationship}
                      onValueChange={v => setNewContact(prev => ({ ...prev, relationship: v }))}
                    >
                      <SelectTrigger id="contact-relationship">
                        <SelectValue placeholder="Sélectionner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Médecin traitant">Médecin traitant</SelectItem>
                        <SelectItem value="Psychologue">Psychologue</SelectItem>
                        <SelectItem value="Famille">Famille</SelectItem>
                        <SelectItem value="Ami proche">Ami proche</SelectItem>
                        <SelectItem value="Autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-crisis">Notifier en cas de crise</Label>
                    <Switch
                      id="notify-crisis"
                      checked={newContact.notifyOnCrisis}
                      onCheckedChange={v => setNewContact(prev => ({ ...prev, notifyOnCrisis: v }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddContact(false)}>
                    Annuler
                  </Button>
                  <Button onClick={addContact}>Ajouter</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-3">
            {contacts.map(contact => (
              <Card key={contact.id}>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{contact.name}</h4>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right text-sm">
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </div>
                        {contact.email && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                      <Badge variant={contact.notifyOnCrisis ? 'default' : 'secondary'}>
                        {contact.notifyOnCrisis ? 'Notifiable' : 'Non notifiable'}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeContact(contact.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Ressources */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Lignes d'écoute
              </CardTitle>
              <CardDescription>
                Ces services sont disponibles pour vous accompagner en cas de besoin.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              {CRISIS_RESOURCES.map(resource => (
                <div 
                  key={resource.phone}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div>
                    <h4 className="font-medium">{resource.name}</h4>
                    <p className="text-sm text-muted-foreground">{resource.available}</p>
                  </div>
                  <a 
                    href={`tel:${resource.phone.replace(/\s/g, '')}`}
                    className="flex items-center gap-2 text-primary font-semibold hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {resource.phone}
                  </a>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Paramètres */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de détection</CardTitle>
              <CardDescription>
                Configurez les seuils et comportements du système d'alerte.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Détection automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Analyser les patterns émotionnels automatiquement
                  </p>
                </div>
                <Switch
                  checked={settings.autoDetection}
                  onCheckedChange={v => setSettings(prev => ({ ...prev, autoDetection: v }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Notifier les contacts</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoyer des alertes aux contacts d'urgence
                  </p>
                </div>
                <Switch
                  checked={settings.notifyContacts}
                  onCheckedChange={v => setSettings(prev => ({ ...prev, notifyContacts: v }))}
                />
              </div>

              <div className="space-y-2">
                <Label>Seuil d'humeur basse</Label>
                <Select
                  value={settings.lowMoodThreshold.toString()}
                  onValueChange={v => setSettings(prev => ({ ...prev, lowMoodThreshold: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Très bas</SelectItem>
                    <SelectItem value="2">2 - Bas</SelectItem>
                    <SelectItem value="3">3 - Modéré</SelectItem>
                    <SelectItem value="4">4 - Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Jours consécutifs pour alerte</Label>
                <Select
                  value={settings.consecutiveDays.toString()}
                  onValueChange={v => setSettings(prev => ({ ...prev, consecutiveDays: parseInt(v) }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 jours</SelectItem>
                    <SelectItem value="3">3 jours</SelectItem>
                    <SelectItem value="5">5 jours</SelectItem>
                    <SelectItem value="7">7 jours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CrisisAlertSystem;
