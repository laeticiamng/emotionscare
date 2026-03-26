// @ts-nocheck
import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SafeNote } from '@/modules/journal/components/JournalList'

describe('SafeNote', () => {
  it('renders lightweight markdown safely', () => {
    const note = 'Bonjour **toi**\n- Première idée\n- Deuxième idée\n<script>alert(1)</script>'
    const { container } = render(<SafeNote text={note} />)

    expect(container.querySelectorAll('li')).toHaveLength(2)
    expect(container.querySelector('strong')?.textContent).toBe('toi')
    expect(container.querySelector('script')).toBeNull()
    expect(screen.getByText('Première idée')).toBeInTheDocument()
  })
})
