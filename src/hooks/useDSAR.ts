// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useDSAR = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['dsar-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dsar_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (request: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('dsar_requests')
        .insert({ ...request, user_id: user?.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsar-requests'] });
      toast.success('Demande créée');
    },
  });

  const generatePackageMutation = useMutation({
    mutationFn: async (requestId: string) => {
      const { data, error } = await supabase.functions.invoke('dsar-handler/generate-package', {
        body: { requestId },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dsar-requests'] });
      toast.success('Package généré');
    },
  });

  return {
    requests,
    isLoading,
    createRequest: createRequestMutation.mutateAsync,
    generatePackage: generatePackageMutation.mutateAsync,
  };
};
