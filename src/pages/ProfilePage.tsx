
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Shell from '@/Shell';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide').optional(),
  phone: z.string().optional(),
  job: z.string().optional(),
  company: z.string().optional(),
  bio: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'Veuillez entrer votre mot de passe actuel'),
  newPassword: z.string().min(8, 'Le nouveau mot de passe doit contenir au moins 8 caractères'),
  confirmPassword: z.string().min(8),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      job: '',
      company: '',
      bio: '',
    },
  });
  
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });
  
  const onUpdateProfile = async (data: ProfileFormValues) => {
    try {
      setIsUpdating(true);
      // Simuler une mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Erreur de mise à jour:', error);
      toast.error('Une erreur est survenue lors de la mise à jour du profil');
    } finally {
      setIsUpdating(false);
    }
  };
  
  const onChangePassword = async (data: PasswordFormValues) => {
    try {
      setIsChangingPassword(true);
      // Simuler un changement de mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Mot de passe modifié avec succès');
      passwordForm.reset();
    } catch (error) {
      console.error('Erreur de changement de mot de passe:', error);
      toast.error('Une erreur est survenue lors du changement de mot de passe');
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };
  
  return (
    <Shell>
      <motion.div
        className="container max-w-4xl py-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback className="text-2xl">
                {user?.name ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="mt-4 text-center">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" className="mt-4">
              Modifier la photo
            </Button>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground mb-6">
              Gérez vos informations personnelles et paramètres de sécurité
            </p>
            
            <Tabs defaultValue="account">
              <TabsList className="mb-6">
                <TabsTrigger value="account">Informations</TabsTrigger>
                <TabsTrigger value="security">Sécurité</TabsTrigger>
                <TabsTrigger value="preferences">Préférences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="account" className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Informations personnelles</h3>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={profileForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nom complet</FormLabel>
                              <FormControl>
                                <Input placeholder="Jean Dupont" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="jean.dupont@exemple.com" disabled {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Téléphone</FormLabel>
                              <FormControl>
                                <Input placeholder="+33 6 XX XX XX XX" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="job"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Poste</FormLabel>
                              <FormControl>
                                <Input placeholder="Développeur" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={profileForm.control}
                          name="company"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Entreprise</FormLabel>
                              <FormControl>
                                <Input placeholder="Entreprise XYZ" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <textarea 
                                className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Parlez-nous un peu de vous..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isUpdating}>
                          {isUpdating ? 'Mise à jour...' : 'Mettre à jour le profil'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Modifier le mot de passe</h3>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe actuel</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nouveau mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmer le mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isChangingPassword}>
                          {isChangingPassword ? 'Modification...' : 'Modifier le mot de passe'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
                
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Sessions actives</h3>
                  <div className="rounded-md border p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Session actuelle</p>
                        <p className="text-sm text-muted-foreground">Dernière activité : il y a quelques minutes</p>
                      </div>
                      <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 text-xs rounded-full px-2 py-1">
                        Actif
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Déconnecter toutes les autres sessions
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="preferences" className="space-y-6">
                <div className="bg-card border rounded-lg p-6">
                  <h3 className="font-medium text-lg mb-4">Préférences de notification</h3>
                  <p className="text-muted-foreground mb-4">
                    Cette fonctionnalité sera bientôt disponible.
                  </p>
                  
                  <Button variant="outline" disabled>
                    Gérer les notifications
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </Shell>
  );
};

export default ProfilePage;
