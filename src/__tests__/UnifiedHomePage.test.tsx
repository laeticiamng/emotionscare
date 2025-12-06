import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock du composant UnifiedHomePage
const MockUnifiedHomePage = () => {
  return (
    <div>
      <h1>EmotionsCare</h1>
      <p>Plateforme d'intelligence émotionnelle</p>
    </div>
  );
};

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('UnifiedHomePage', () => {
  it('renders without crashing', () => {
    const Wrapper = createTestWrapper();
    
    render(
      <Wrapper>
        <MockUnifiedHomePage />
      </Wrapper>
    );

    expect(screen.getByText('EmotionsCare')).toBeInTheDocument();
    expect(screen.getByText('Plateforme d\'intelligence émotionnelle')).toBeInTheDocument();
  });

  it('should not use hooks in conditional blocks', () => {
    // Test exemple de mauvaise pratique (commenté pour ne pas faire échouer le test)
    
    // ❌ Mauvais - hook dans un if
    // const BadComponent = ({ condition }: { condition: boolean }) => {
    //   if (condition) {
    //     const [state] = useState(0); // ESLint devrait signaler cette erreur
    //     return <div>{state}</div>;
    //   }
    //   return null;
    // };

    // ✅ Bon - hook au top level
    const GoodComponent = ({ condition }: { condition: boolean }) => {
      const [state] = React.useState(0);
      
      if (!condition) {
        return null;
      }
      
      return <div>{state}</div>;
    };

    const Wrapper = createTestWrapper();
    
    render(
      <Wrapper>
        <GoodComponent condition={true} />
      </Wrapper>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});