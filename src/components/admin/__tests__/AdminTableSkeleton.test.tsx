import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminTableSkeleton from '../AdminTableSkeleton';

describe('AdminTableSkeleton', () => {
  it('renders with default props', () => {
    render(<AdminTableSkeleton />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Chargement en cours...')).toBeInTheDocument();
  });

  it('renders the correct number of table rows', () => {
    const { container } = render(<AdminTableSkeleton rows={3} columns={4} />);
    // rows are inside the divide-y container
    const divideContainer = container.querySelector('.divide-y');
    expect(divideContainer?.children.length).toBe(3);
  });

  it('hides header when showHeader is false', () => {
    const { container } = render(<AdminTableSkeleton showHeader={false} />);
    // Header skeleton is a h-7 w-64 skeleton
    const headerSkeleton = container.querySelector('.h-7.w-64');
    expect(headerSkeleton).toBeNull();
  });

  it('hides search when showSearch is false', () => {
    const { container } = render(<AdminTableSkeleton showSearch={false} />);
    // Search bar is a h-10 flex-1 skeleton inside a flex gap-4 wrapper
    const searchSkeletons = container.querySelectorAll('.h-10.flex-1');
    expect(searchSkeletons.length).toBe(0);
  });

  it('hides stats when showStats is false', () => {
    const { container } = render(<AdminTableSkeleton showStats={false} />);
    // Stats cards are in a md:grid-cols-4 container
    const statsGrid = container.querySelector('.md\\:grid-cols-4');
    expect(statsGrid).toBeNull();
  });

  it('renders stats cards when showStats is true', () => {
    const { container } = render(<AdminTableSkeleton showStats />);
    const statsGrid = container.querySelector('.md\\:grid-cols-4');
    expect(statsGrid).toBeInTheDocument();
    expect(statsGrid?.children.length).toBe(4);
  });
});
