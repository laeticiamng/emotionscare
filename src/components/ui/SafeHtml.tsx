// @ts-nocheck
import React, { useMemo } from 'react';
import DOMPurify from 'dompurify';

interface SafeHtmlProps {
  html: string;
  className?: string;
  allowedTags?: string[];
  allowedAttr?: string[];
}

/**
 * Composant centralisé pour le rendu HTML sécurisé via DOMPurify.
 * Remplace tout usage direct de dangerouslySetInnerHTML.
 */
export const SafeHtml: React.FC<SafeHtmlProps> = ({
  html,
  className,
  allowedTags,
  allowedAttr,
}) => {
  const sanitized = useMemo(() => {
    const config: Record<string, unknown> = {};
    if (allowedTags) config.ALLOWED_TAGS = allowedTags;
    if (allowedAttr) config.ALLOWED_ATTR = allowedAttr;
    return DOMPurify.sanitize(html, config);
  }, [html, allowedTags, allowedAttr]);

  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

export default SafeHtml;
