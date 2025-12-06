const LANDING_SOURCE = 'landing';
const LANDING_CAMPAIGN = 'launch';

export const LANDING_UTM_QUERY = `?utm_source=${LANDING_SOURCE}&utm_campaign=${LANDING_CAMPAIGN}`;

const isAppPath = (path: string) => path.startsWith('/app');

export const withLandingUtm = (path: string): string => {
  if (!isAppPath(path)) {
    return path;
  }

  const [withoutHash, hash] = path.split('#');
  const [pathname, queryString] = withoutHash.split('?');
  const params = new URLSearchParams(queryString ?? undefined);
  params.set('utm_source', LANDING_SOURCE);
  params.set('utm_campaign', LANDING_CAMPAIGN);
  const normalized = `${pathname}?${params.toString()}`;

  if (!hash) {
    return normalized;
  }

  return `${normalized}#${hash}`;
};

export const stripUtmParams = (search?: string | null): string | null => {
  if (!search || search === '?') {
    return null;
  }

  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  let mutated = false;

  for (const key of Array.from(params.keys())) {
    if (key.toLowerCase().startsWith('utm_')) {
      params.delete(key);
      mutated = true;
    }
  }

  if (!mutated) {
    return null;
  }

  const serialized = params.toString();
  return serialized ? `?${serialized}` : '';
};

export const sanitizeLandingUtm = (
  value: string | null | undefined,
  expected: string,
): string | undefined => {
  if (!value) {
    return undefined;
  }

  return value === expected ? value : undefined;
};

export const LANDING_UTM_SOURCE = LANDING_SOURCE;
export const LANDING_UTM_CAMPAIGN = LANDING_CAMPAIGN;
