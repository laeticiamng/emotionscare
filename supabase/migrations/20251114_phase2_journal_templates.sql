-- Phase 2: Templates de journal pré-configurés

-- Table pour les templates de journal
create table if not exists public.journal_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category text not null check (category in ('gratitude', 'mood', 'goals', 'reflection', 'wellness', 'custom')),
  icon text,
  color text,
  prompts jsonb not null default '[]'::jsonb, -- Liste de prompts/questions
  tags text[] default array[]::text[],
  is_system boolean default true, -- Templates système vs personnalisés
  user_id uuid references auth.users(id) on delete cascade, -- NULL pour templates système
  is_active boolean default true,
  usage_count integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table pour les entrées de journal basées sur des templates
create table if not exists public.journal_template_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  template_id uuid references public.journal_templates(id) on delete set null,
  journal_note_id uuid references public.journal_notes(id) on delete cascade,
  responses jsonb not null default '{}'::jsonb, -- Réponses aux prompts
  completion_percentage integer default 0,
  mood_score integer check (mood_score >= 1 and mood_score <= 10),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table pour suivre les habitudes de journaling
create table if not exists public.journal_habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  template_id uuid references public.journal_templates(id) on delete cascade,
  frequency text not null check (frequency in ('daily', 'weekly', 'monthly', 'custom')),
  preferred_time time, -- Heure préférée
  reminder_enabled boolean default false,
  last_entry_at timestamptz,
  current_streak integer default 0,
  longest_streak integer default 0,
  total_entries integer default 0,
  created_at timestamptz default now(),
  unique(user_id, template_id)
);

-- Indexes
create index if not exists idx_journal_templates_category on public.journal_templates(category);
create index if not exists idx_journal_templates_user_id on public.journal_templates(user_id);
create index if not exists idx_journal_template_entries_user_id on public.journal_template_entries(user_id);
create index if not exists idx_journal_template_entries_template_id on public.journal_template_entries(template_id);
create index if not exists idx_journal_habits_user_id on public.journal_habits(user_id);

-- RLS
alter table public.journal_templates enable row level security;
alter table public.journal_template_entries enable row level security;
alter table public.journal_habits enable row level security;

-- Policies pour journal_templates
create policy "System templates are viewable by all authenticated users"
  on public.journal_templates for select
  using (is_system = true or auth.uid() = user_id);

create policy "Users can create their own templates"
  on public.journal_templates for insert
  with check (auth.uid() = user_id and is_system = false);

create policy "Users can update their own templates"
  on public.journal_templates for update
  using (auth.uid() = user_id);

create policy "Users can delete their own templates"
  on public.journal_templates for delete
  using (auth.uid() = user_id);

-- Policies pour journal_template_entries
create policy "Users can view their own template entries"
  on public.journal_template_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their own template entries"
  on public.journal_template_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own template entries"
  on public.journal_template_entries for update
  using (auth.uid() = user_id);

create policy "Users can delete their own template entries"
  on public.journal_template_entries for delete
  using (auth.uid() = user_id);

-- Policies pour journal_habits
create policy "Users can view their own habits"
  on public.journal_habits for select
  using (auth.uid() = user_id);

create policy "Users can create their own habits"
  on public.journal_habits for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own habits"
  on public.journal_habits for update
  using (auth.uid() = user_id);

create policy "Users can delete their own habits"
  on public.journal_habits for delete
  using (auth.uid() = user_id);

-- Insérer les templates système par défaut
insert into public.journal_templates (name, slug, description, category, icon, color, prompts, tags) values
(
  'Gratitude Quotidienne',
  'daily-gratitude',
  'Cultivez la reconnaissance en notant ce pour quoi vous êtes reconnaissant',
  'gratitude',
  '🙏',
  '#FFD700',
  '[
    {"id": "q1", "question": "Pour quoi êtes-vous reconnaissant aujourd''hui ?", "type": "textarea"},
    {"id": "q2", "question": "Qui a rendu votre journée spéciale ?", "type": "text"},
    {"id": "q3", "question": "Quel petit moment vous a fait sourire ?", "type": "textarea"}
  ]'::jsonb,
  array['gratitude', 'bien-être', 'positif']
),
(
  'Suivi de Humeur',
  'mood-tracker',
  'Suivez et comprenez vos variations émotionnelles',
  'mood',
  '😊',
  '#00CED1',
  '[
    {"id": "mood", "question": "Comment vous sentez-vous maintenant ?", "type": "mood_scale", "scale": 10},
    {"id": "emotions", "question": "Quelles émotions ressentez-vous ?", "type": "multi_choice", "options": ["Joie", "Tristesse", "Anxiété", "Calme", "Colère", "Excitation"]},
    {"id": "triggers", "question": "Qu''est-ce qui a influencé votre humeur ?", "type": "textarea"},
    {"id": "energy", "question": "Niveau d''énergie", "type": "slider", "min": 1, "max": 10}
  ]'::jsonb,
  array['humeur', 'émotions', 'bien-être']
),
(
  'Objectifs et Intentions',
  'goals-intentions',
  'Définissez vos objectifs et intentions pour la journée ou la semaine',
  'goals',
  '🎯',
  '#32CD32',
  '[
    {"id": "main_goal", "question": "Quel est votre objectif principal aujourd''hui ?", "type": "text"},
    {"id": "why", "question": "Pourquoi cet objectif est-il important ?", "type": "textarea"},
    {"id": "steps", "question": "Quelles actions allez-vous entreprendre ?", "type": "checklist"},
    {"id": "obstacles", "question": "Quels obstacles pourriez-vous rencontrer ?", "type": "textarea"},
    {"id": "support", "question": "De quoi avez-vous besoin pour réussir ?", "type": "text"}
  ]'::jsonb,
  array['objectifs', 'productivité', 'intentions']
),
(
  'Réflexion du Soir',
  'evening-reflection',
  'Faites le bilan de votre journée avant de dormir',
  'reflection',
  '🌙',
  '#4B0082',
  '[
    {"id": "highlights", "question": "Quels ont été les points forts de votre journée ?", "type": "textarea"},
    {"id": "challenges", "question": "Quels défis avez-vous rencontrés ?", "type": "textarea"},
    {"id": "learning", "question": "Qu''avez-vous appris aujourd''hui ?", "type": "textarea"},
    {"id": "tomorrow", "question": "Qu''attendez-vous avec impatience demain ?", "type": "text"}
  ]'::jsonb,
  array['réflexion', 'bilan', 'soir']
),
(
  'Bien-être Global',
  'wellness-check',
  'Évaluez votre bien-être physique, mental et émotionnel',
  'wellness',
  '💪',
  '#FF6347',
  '[
    {"id": "physical", "question": "Bien-être physique (1-10)", "type": "slider", "min": 1, "max": 10},
    {"id": "mental", "question": "Bien-être mental (1-10)", "type": "slider", "min": 1, "max": 10},
    {"id": "emotional", "question": "Bien-être émotionnel (1-10)", "type": "slider", "min": 1, "max": 10},
    {"id": "sleep", "question": "Qualité du sommeil (1-10)", "type": "slider", "min": 1, "max": 10},
    {"id": "exercise", "question": "Avez-vous fait de l''exercice ?", "type": "yes_no"},
    {"id": "nutrition", "question": "Comment évaluez-vous votre alimentation ?", "type": "slider", "min": 1, "max": 10},
    {"id": "notes", "question": "Notes supplémentaires", "type": "textarea"}
  ]'::jsonb,
  array['bien-être', 'santé', 'équilibre']
),
(
  'Méditation et Pleine Conscience',
  'mindfulness',
  'Pratiquez la pleine conscience et notez vos observations',
  'wellness',
  '🧘',
  '#9370DB',
  '[
    {"id": "duration", "question": "Durée de la pratique (minutes)", "type": "number"},
    {"id": "technique", "question": "Technique utilisée", "type": "select", "options": ["Respiration", "Body scan", "Visualisation", "Mantra", "Autre"]},
    {"id": "experience", "question": "Comment s''est passée votre pratique ?", "type": "textarea"},
    {"id": "insights", "question": "Prises de conscience", "type": "textarea"},
    {"id": "calm_level", "question": "Niveau de calme après (1-10)", "type": "slider", "min": 1, "max": 10}
  ]'::jsonb,
  array['méditation', 'pleine conscience', 'relaxation']
)
on conflict (slug) do nothing;

-- Fonction pour mettre à jour les habitudes de journal
create or replace function public.update_journal_habit_streak()
returns trigger as $$
declare
  v_habit record;
  v_last_entry_date date;
  v_today date := current_date;
begin
  -- Récupérer l'habitude associée
  select * into v_habit
  from public.journal_habits
  where user_id = new.user_id and template_id = new.template_id;

  if found then
    v_last_entry_date := date(v_habit.last_entry_at);

    -- Mettre à jour le streak
    if v_last_entry_date = v_today - interval '1 day' then
      -- Continuer le streak
      update public.journal_habits
      set
        current_streak = current_streak + 1,
        longest_streak = greatest(longest_streak, current_streak + 1),
        total_entries = total_entries + 1,
        last_entry_at = now()
      where id = v_habit.id;
    elsif v_last_entry_date < v_today - interval '1 day' then
      -- Réinitialiser le streak
      update public.journal_habits
      set
        current_streak = 1,
        total_entries = total_entries + 1,
        last_entry_at = now()
      where id = v_habit.id;
    else
      -- Même jour, juste incrémenter total_entries
      update public.journal_habits
      set
        total_entries = total_entries + 1,
        last_entry_at = now()
      where id = v_habit.id;
    end if;

    -- Incrémenter le compteur d'utilisation du template
    update public.journal_templates
    set usage_count = usage_count + 1
    where id = new.template_id;
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger pour mettre à jour automatiquement les habitudes
create trigger on_journal_template_entry_created
  after insert on public.journal_template_entries
  for each row execute function public.update_journal_habit_streak();
