import { Button } from '@/components/ui/button'

type TagFilterProps = {
  tags: string[]
  active: string[]
  onToggle: (tag: string) => void
  onReset: () => void
  isLoading?: boolean
}

export function TagFilter({ tags, active, onToggle, onReset, isLoading }: TagFilterProps) {
  if (!tags.length) return null
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">Filtrer par tags</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtres de tags">
        <Button
          type="button"
          size="sm"
          variant={active.length === 0 ? 'default' : 'outline'}
          onClick={onReset}
          disabled={isLoading}
          data-testid="journal-tag-all"
        >
          Tous
        </Button>
        {tags.map(tag => {
          const selected = active.includes(tag)
          return (
            <Button
              key={tag}
              type="button"
              size="sm"
              variant={selected ? 'default' : 'outline'}
              onClick={() => onToggle(tag)}
              disabled={isLoading}
              data-testid={`journal-tag-${tag}`}
            >
              #{tag}
            </Button>
          )
        })}
      </div>
    </div>
  )
}
