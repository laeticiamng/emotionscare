# User Goals Table Documentation

## Overview
The `user_goals` table stores user-defined goals and objectives for tracking wellness, mindfulness, and personal development progress.

## Schema

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| `id` | UUID | NO | `gen_random_uuid()` | Primary key |
| `user_id` | UUID | NO | - | Foreign key to auth.users |
| `title` | TEXT | NO | - | Goal title (e.g., "Méditer 5 fois par semaine") |
| `description` | TEXT | YES | - | Optional detailed description |
| `category` | TEXT | NO | - | Goal category (wellness, mindfulness, energy, emotions, etc.) |
| `progress` | INTEGER | NO | 0 | Progress percentage (0-100) |
| `target_value` | INTEGER | YES | - | Target value to achieve |
| `current_value` | INTEGER | NO | 0 | Current value achieved towards the goal |
| `unit` | TEXT | YES | - | Unit of measurement (minutes, sessions, days, etc.) |
| `start_date` | DATE | NO | - | Goal start date |
| `deadline` | DATE | NO | - | Goal deadline date |
| `end_date` | DATE | YES | - | Actual completion date (legacy, use deadline) |
| `status` | TEXT | NO | 'active' | Goal status (active, completed, archived, paused, abandoned) |
| `reward_points` | INTEGER | YES | 0 | Points earned upon completion |
| `created_at` | TIMESTAMPTZ | NO | NOW() | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

## Status Values
- `active` - Goal is currently being worked on
- `completed` - Goal has been achieved (progress = 100)
- `archived` - Goal has been archived by user (hidden from active view)
- `paused` - Goal is temporarily paused
- `abandoned` - Goal has been abandoned

## Row Level Security (RLS)
✅ RLS is **ENABLED**

Policy: "Users can manage their own goals"
- Users can only access goals where `user_id = auth.uid()`
- Full CRUD permissions for own goals

## Triggers
- `update_user_goals_updated_at` - Automatically updates `updated_at` timestamp on row updates

## Indexes
- `idx_user_goals_user_status` - ON (user_id, status) - For filtering active/completed goals
- `idx_user_goals_deadline` - ON (user_id, deadline DESC) WHERE status = 'active' - For deadline sorting

## Usage with useGoals Hook

### TypeScript Interface
```typescript
interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category: string;
  progress: number; // 0-100
  target_value?: number;
  current_value?: number;
  deadline: string; // ISO date string
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}
```

### Example Usage
```typescript
import { useGoals } from '@/hooks/useGoals';

function MyComponent() {
  const { goals, stats, createGoal, updateProgress } = useGoals();

  const handleCreateGoal = async () => {
    await createGoal({
      title: 'Méditer 5 fois par semaine',
      description: 'Pratiquer la méditation quotidienne',
      category: 'wellness',
      progress: 0,
      target_value: 5,
      current_value: 0,
      deadline: '2025-12-31',
      status: 'active',
    });
  };

  const handleUpdateProgress = async (goalId: string, newProgress: number) => {
    await updateProgress(goalId, newProgress);
  };

  return (
    <div>
      {goals.map(goal => (
        <div key={goal.id}>
          <h3>{goal.title}</h3>
          <progress value={goal.progress} max={100} />
        </div>
      ))}
    </div>
  );
}
```

## Progress Calculation
The `progress` field can be:
1. **Manually set** (0-100)
2. **Auto-calculated** from `current_value` and `target_value`:
   ```sql
   progress = (current_value::FLOAT / target_value::FLOAT * 100)::INTEGER
   ```

## Migration History
- `20250830085500` - Initial table creation
- `20251116000000` - Schema alignment with useGoals hook
  - Added `progress`, `current_value`, `deadline` columns
  - Updated status constraint to include 'archived'
  - Migrated existing data

## Common Queries

### Get active goals for user
```sql
SELECT * FROM user_goals
WHERE user_id = auth.uid()
  AND status = 'active'
ORDER BY deadline ASC;
```

### Get goal statistics
```sql
SELECT
  COUNT(*) as total_goals,
  COUNT(*) FILTER (WHERE status = 'active') as active_goals,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_goals,
  ROUND(AVG(progress)) as avg_progress
FROM user_goals
WHERE user_id = auth.uid();
```

### Mark goal as completed
```sql
UPDATE user_goals
SET
  status = 'completed',
  progress = 100,
  current_value = target_value
WHERE id = $1
  AND user_id = auth.uid();
```

## Best Practices
1. Always set a realistic `deadline`
2. Use descriptive `category` values for filtering
3. Update `progress` regularly (either manually or via `current_value`)
4. Mark goals as `archived` instead of deleting for historical data
5. Use `target_value` and `current_value` for measurable goals
6. Include `unit` for clarity (e.g., "sessions", "minutes", "days")

## Related Tables
- `user_rewards` - Rewards earned upon goal completion
- `user_activity_sessions` - Activity sessions contributing to goal progress

## Support
For database schema issues or questions:
- Email: tech@emotionscare.com
- Slack: #database-support
