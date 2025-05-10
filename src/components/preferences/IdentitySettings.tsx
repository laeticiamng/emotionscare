import React, { useState } from 'react';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';

const IdentitySettings = () => {
  const { preferences, updatePreferences } = useUserPreferences();
  const { toast } = useToast();
  
  const [avatarUrl, setAvatarUrl] = useState(preferences.avatarUrl || '');
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  // Handle avatar file selection
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  // Save identity settings
  const saveIdentity = () => {
    // In a real app, you would upload the image to storage here
    // and get back a URL to save to user preferences
    
    updatePreferences({
      avatarUrl: previewUrl || avatarUrl,
      // Other fields are updated immediately via the onChange events
    });
    
    toast({
      title: "Identité mise à jour",
      description: "Vos informations personnelles ont été enregistrées."
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-center"
      >
        <Avatar className="w-24 h-24 mb-4">
          <AvatarImage src={previewUrl || avatarUrl} alt="Avatar" />
          <AvatarFallback className="bg-primary/20">
            {preferences.displayName?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <Button variant="outline" className="mb-2">
          <Upload className="mr-2 h-4 w-4" />
          <label htmlFor="avatar-upload" className="cursor-pointer">
            Choisir une image
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </Button>
        
        <p className="text-xs text-muted-foreground text-center max-w-xs">
          Votre avatar est visible dans vos journaux, conversations et partages communautaires
        </p>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-4"
      >
        <div className="grid gap-2">
          <Label htmlFor="displayName">Nom affiché</Label>
          <Input 
            id="displayName" 
            value={preferences.displayName || ''} 
            onChange={(e) => updatePreferences({ displayName: e.target.value })} 
            placeholder="Comment souhaitez-vous être appelé?" 
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="pronouns">Pronoms</Label>
          <Select 
            defaultValue={preferences.pronouns || 'autre'}
            onValueChange={(value) => updatePreferences({ pronouns: value as 'il' | 'elle' | 'iel' | 'autre' })}
          >
            <SelectTrigger id="pronouns">
              <SelectValue placeholder="Choisir vos pronoms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="il">Il (He/Him)</SelectItem>
              <SelectItem value="elle">Elle (She/Her)</SelectItem>
              <SelectItem value="iel">Iel (They/Them)</SelectItem>
              <SelectItem value="autre">Autre/Préfère ne pas préciser</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid gap-2">
          <Label htmlFor="biography">Biographie intérieure</Label>
          <Textarea 
            id="biography" 
            value={preferences.biography || ''} 
            onChange={(e) => updatePreferences({ biography: e.target.value })}
            placeholder="Comment souhaitez-vous qu'on vous parle ici?"
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground">
            Cette description aide notre IA à s'adapter à votre style de communication préféré
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end"
      >
        <Button onClick={saveIdentity}>Enregistrer les changements</Button>
      </motion.div>
    </motion.div>
  );
};

export default IdentitySettings;
