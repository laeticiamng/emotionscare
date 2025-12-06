-- Create system_health_metrics table for real-time KPIs
create table if not exists public.system_health_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric not null,
  metric_unit text,
  timestamp timestamptz default now(),
  metadata jsonb,
  created_at timestamptz default now()
);

-- Create system_health_thresholds table for configurable alerting
create table if not exists public.system_health_thresholds (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null unique,
  warning_threshold numeric not null,
  critical_threshold numeric not null,
  comparison_operator text not null check (comparison_operator in ('gt', 'lt', 'gte', 'lte')),
  enabled boolean default true,
  notification_channels text[] default array['slack', 'email'],
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.system_health_metrics enable row level security;
alter table public.system_health_thresholds enable row level security;

-- Create policies
create policy "Admins can view system health metrics"
  on public.system_health_metrics
  for select
  using (true);

create policy "System can insert health metrics"
  on public.system_health_metrics
  for insert
  with check (true);

create policy "Admins can manage thresholds"
  on public.system_health_thresholds
  for all
  using (true)
  with check (true);

-- Create indexes
create index idx_system_health_metrics_name_timestamp on public.system_health_metrics(metric_name, timestamp desc);
create index idx_system_health_thresholds_enabled on public.system_health_thresholds(enabled);

-- Insert default thresholds
insert into public.system_health_thresholds (metric_name, warning_threshold, critical_threshold, comparison_operator, description) values
  ('uptime_percentage', 99.5, 99.0, 'lt', 'System uptime percentage'),
  ('avg_response_time_ms', 500, 1000, 'gt', 'Average API response time'),
  ('error_rate_percentage', 1.0, 5.0, 'gt', 'Error rate percentage'),
  ('alerts_per_hour', 10, 20, 'gt', 'Number of alerts per hour'),
  ('cpu_usage_percentage', 70, 85, 'gt', 'CPU usage percentage'),
  ('memory_usage_percentage', 75, 90, 'gt', 'Memory usage percentage')
on conflict (metric_name) do nothing;

comment on table public.system_health_metrics is 'Stores real-time system health KPI metrics';
comment on table public.system_health_thresholds is 'Configurable thresholds for system health alerting';