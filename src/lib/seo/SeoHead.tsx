// @ts-nocheck
"use client";
import React from "react";
import { Helmet } from "react-helmet-async";

type SeoHeadProps = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noIndex?: boolean;
  type?: string;
  siteName?: string;
};

const DEFAULT_SITE_NAME = "EmotionsCare";
const DEFAULT_DESCRIPTION =
  "Plateforme d'intelligence émotionnelle pour le bien-être personnel et professionnel. Analysez et améliorez vos émotions avec nos outils innovants.";
const DEFAULT_IMAGE_PATH = "/images/vr-banner-bg.jpg";
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://emotionscare.com";

const resolveAbsoluteUrl = (value: string): string => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;
  return `${BASE_URL}${normalized}`;
};

export function SeoHead({
  title,
  description,
  url,
  image,
  noIndex = false,
  type = "website",
  siteName: siteNameProp,
}: SeoHeadProps) {
  const siteName = siteNameProp ?? DEFAULT_SITE_NAME;
  const pageTitle = title ? `${title} | ${siteName}` : siteName;
  const pageDescription = description ?? DEFAULT_DESCRIPTION;
  const sanitizedUrl = url?.trim();
  const canonicalUrl = sanitizedUrl && sanitizedUrl.length > 0 ? resolveAbsoluteUrl(sanitizedUrl) : BASE_URL;
  const openGraphImage = resolveAbsoluteUrl(image?.trim() || DEFAULT_IMAGE_PATH);

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {noIndex && <meta name="robots" content="noindex,follow" />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={openGraphImage} />
      <meta property="og:image:alt" content={pageTitle} />
      <meta property="og:locale" content="fr_FR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={openGraphImage} />
      <meta name="twitter:url" content={canonicalUrl} />

      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
}
