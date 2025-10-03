
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Camera, Pencil } from 'lucide-react';

const PersonalProfile: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    displayName: 'Thomas Martin',
    email: 'thomas.martin@example.com',
    bio: 'Passionné par le développement personnel et le bien-être émotionnel.',
    profileImage: 'https://i.pravatar.cc/300?img=8'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil mis à jour",
      description: "Vos informations personnelles ont été enregistrées."
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profil Personnel
          </CardTitle>
          <CardDescription>
            Mettez à jour vos informations personnelles et votre photo de profil.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.profileImage} alt="Photo de profil" />
              <AvatarFallback>TM</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <h3 className="font-medium">Photo de profil</h3>
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Changer la photo
                </Button>
                <Button type="button" variant="ghost" size="sm">
                  Supprimer
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                JPG, PNG ou GIF. 5 Mo maximum.
              </p>
            </div>
          </div>

          {/* Personal details */}
          <div className="grid gap-5">
            <div className="grid gap-2.5">
              <Label htmlFor="displayName">
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Nom d'affichage
                </span>
              </Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="email">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  Adresse email
                </span>
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2.5">
              <Label htmlFor="bio">
                <span className="flex items-center gap-2">
                  <Pencil className="h-4 w-4 text-muted-foreground" />
                  Biographie
                </span>
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Dites-nous en plus sur vous..."
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2 border-t p-6">
          <Button type="button" variant="outline">Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default PersonalProfile;
