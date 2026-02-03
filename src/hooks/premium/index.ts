/**
 * Index centralisé des hooks premium
 * Export des hooks ElevenLabs, Perplexity et Firecrawl
 */

// ElevenLabs - Text-to-Speech #1 mondial
export { useElevenLabs, default as useElevenLabsHook } from '../useElevenLabs';

// Perplexity - AI Search #1 mondial
export { 
  usePerplexity, 
  useWellnessSearch, 
  useEmotionSearch,
  default as usePerplexityHook 
} from '../usePerplexity';

// Firecrawl - Web Scraping #1 mondial
export { 
  useFirecrawl, 
  useWellnessResources,
  default as useFirecrawlHook 
} from '../useFirecrawl';
