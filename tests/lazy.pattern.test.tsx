import { lazyDefault } from '@/lib/lazyDefault';
import { render, screen } from '@testing-library/react';
import { Suspense } from 'react';

describe('lazyDefault', () => {
  it('renders default exported component correctly', async () => {
    const LazyComponent = lazyDefault(() =>
      Promise.resolve({
        default: () => <div>Default Export</div>
      })
    );

    render(
      <Suspense fallback={<div>loading</div>}>
        <LazyComponent />
      </Suspense>
    );

    expect(await screen.findByText('Default Export')).toBeInTheDocument();
  });

  it('renders named exported component correctly', async () => {
    const NamedComponent = () => <div>Named Export</div>;
    const LazyComponent = lazyDefault(() =>
      Promise.resolve({
        NamedComponent
      }),
      'NamedComponent'
    );

    render(
      <Suspense fallback={<div>loading</div>}>
        <LazyComponent />
      </Suspense>
    );

    expect(await screen.findByText('Named Export')).toBeInTheDocument();
  });
});
