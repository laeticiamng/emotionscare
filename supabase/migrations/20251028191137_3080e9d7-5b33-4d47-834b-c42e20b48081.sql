-- Correction urgente: Activer RLS sur security_manual_actions
ALTER TABLE public.security_manual_actions ENABLE ROW LEVEL SECURITY;

-- Créer une politique pour que seuls les admins puissent voir les actions
CREATE POLICY "Admins can view manual actions"
  ON public.security_manual_actions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Créer une politique pour que seuls les admins puissent mettre à jour
CREATE POLICY "Admins can update manual actions"
  ON public.security_manual_actions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );