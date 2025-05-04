
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { createGroup } from '@/lib/communityService';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Plus } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const groupSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  topic: z.string().min(2, { message: 'La thématique doit contenir au moins 2 caractères' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof groupSchema>;

interface GroupFormProps {
  onGroupCreated: (newGroup: any) => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ onGroupCreated }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [creating, setCreating] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      name: '',
      topic: '',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Non connecté",
        description: "Vous devez être connecté pour créer un groupe",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setCreating(true);
      const group = await createGroup(data.name, data.topic, data.description || undefined);
      onGroupCreated(group);
      form.reset();
    } catch (error) {
      console.error('Error creating group:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le groupe",
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="mb-8 border-2 border-primary/20">
      <CardHeader>
        <h2 className="text-xl font-medium">Créer un nouveau groupe</h2>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom du groupe</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Gestion du stress" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thématique</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Méditation, Anxiété..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Décrivez l'objectif de votre groupe..." 
                      rows={3} 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={creating}
              className="flex items-center gap-2"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Créer un groupe
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default GroupForm;
