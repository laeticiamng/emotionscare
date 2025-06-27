
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Globe, Camera, Shield, Bell, Palette, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileSettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [formData, setFormData] = useState({
    name: 'Sophie Martin',
    email: 'sophie.martin@email.com',
    phone: '+33 6 12 34 56 78',
    bio: 'Passionnée de bien-être et de méditation. J\'aime partager mes expériences pour aider les autres dans leur parcours.',
    location: 'Paris, France',
    website: 'https://mon-blog-wellbeing.com',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false
    },
    privacy: {
      profilePublic: true,
      activityVisible: true,
      allowMessages: true
    },
    theme: 'system'
  });

  const sections = [
    { id: 'profile', name: 'Profil', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Confidentialité', icon: Shield },
    { id: 'appearance', name: 'Apparence', icon: Palette }
  ];

  const badges = [
    { name: 'Méditateur Assidu', color: 'bg-blue-100 text-blue-800', earned: '2024-01-15' },
    { name: 'Mentor Communauté', color: 'bg-green-100 text-green-800', earned: '2024-02-20' },
    { name: 'Explorateur VR', color: 'bg-purple-100 text-purple-800', earned: '2024-03-10' },
    { name: 'Musicothérapeute', color: 'bg-pink-100 text-pink-800', earned: '2024-03-25' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNestedChange = (category: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Photo de profil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/api/placeholder/96/96" />
            <AvatarFallback className="text-2xl">SM</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Changer la photo
            </Button>
            <p className="text-sm text-gray-600">JPG, PNG ou GIF. Max 5MB.</p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="website">Site web</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="bio">Biographie</Label>
            <Textarea
              id="bio"
              placeholder="Parlez-nous de vous..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Vos badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">🏆</span>
                </div>
                <div>
                  <Badge className={badge.color}>{badge.name}</Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    Obtenu le {new Date(badge.earned).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationsSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Préférences de notification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notif">Notifications par email</Label>
              <p className="text-sm text-gray-600">Recevez des mises à jour par email</p>
            </div>
            <Switch
              id="email-notif"
              checked={formData.notifications.email}
              onCheckedChange={(checked) => handleNestedChange('notifications', 'email', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notif">Notifications push</Label>
              <p className="text-sm text-gray-600">Notifications sur votre appareil</p>
            </div>
            <Switch
              id="push-notif"
              checked={formData.notifications.push}
              onCheckedChange={(checked) => handleNestedChange('notifications', 'push', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sms-notif">Notifications SMS</Label>
              <p className="text-sm text-gray-600">Messages importants par SMS</p>
            </div>
            <Switch
              id="sms-notif"
              checked={formData.notifications.sms}
              onCheckedChange={(checked) => handleNestedChange('notifications', 'sms', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="marketing-notif">Emails marketing</Label>
              <p className="text-sm text-gray-600">Offres spéciales et nouveautés</p>
            </div>
            <Switch
              id="marketing-notif"
              checked={formData.notifications.marketing}
              onCheckedChange={(checked) => handleNestedChange('notifications', 'marketing', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderPrivacySection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres de confidentialité</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profile-public">Profil public</Label>
              <p className="text-sm text-gray-600">Votre profil est visible par les autres utilisateurs</p>
            </div>
            <Switch
              id="profile-public"
              checked={formData.privacy.profilePublic}
              onCheckedChange={(checked) => handleNestedChange('privacy', 'profilePublic', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="activity-visible">Activité visible</Label>
              <p className="text-sm text-gray-600">Les autres peuvent voir votre activité récente</p>
            </div>
            <Switch
              id="activity-visible"
              checked={formData.privacy.activityVisible}
              onCheckedChange={(checked) => handleNestedChange('privacy', 'activityVisible', checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allow-messages">Autoriser les messages</Label>
              <p className="text-sm text-gray-600">Les autres utilisateurs peuvent vous envoyer des messages</p>
            </div>
            <Switch
              id="allow-messages"
              checked={formData.privacy.allowMessages}
              onCheckedChange={(checked) => handleNestedChange('privacy', 'allowMessages', checked)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderAppearanceSection = () => (
    <Card>
      <CardHeader>
        <CardTitle>Apparence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Thème</Label>
          <div className="grid grid-cols-3 gap-4 mt-3">
            {[
              { id: 'light', name: 'Clair', preview: 'bg-white border-2' },
              { id: 'dark', name: 'Sombre', preview: 'bg-gray-900 border-2' },
              { id: 'system', name: 'Système', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' }
            ].map((theme) => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  formData.theme === theme.id
                    ? 'ring-2 ring-blue-500'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleInputChange('theme', theme.id)}
              >
                <div className={`w-full h-16 rounded ${theme.preview} mb-2`}></div>
                <p className="text-sm font-medium text-center">{theme.name}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Paramètres du Profil
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mt-2">
            Personnalisez votre profil et vos préférences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                          activeSection === section.id
                            ? 'bg-blue-100 text-blue-700'
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{section.name}</span>
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === 'profile' && renderProfileSection()}
              {activeSection === 'notifications' && renderNotificationsSection()}
              {activeSection === 'privacy' && renderPrivacySection()}
              {activeSection === 'appearance' && renderAppearanceSection()}
            </motion.div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <Button className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Sauvegarder les modifications
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
