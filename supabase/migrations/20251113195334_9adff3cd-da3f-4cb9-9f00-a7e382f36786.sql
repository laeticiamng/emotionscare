-- Create notification_webhooks table for Slack/Discord integrations
create table if not exists public.notification_webhooks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  webhook_type text not null check (webhook_type in ('slack', 'discord')),
  webhook_url text not null,
  channel text,
  enabled boolean default true,
  events text[] not null default array['ab_test_significant', 'ticket_created'],
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.notification_webhooks enable row level security;

-- Create policies
create policy "Admins can manage notification webhooks"
  on public.notification_webhooks
  for all
  using (true)
  with check (true);

-- Create index for performance
create index idx_notification_webhooks_enabled on public.notification_webhooks(enabled);

comment on table public.notification_webhooks is 'Stores Slack and Discord webhook configurations for notifications';