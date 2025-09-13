"use client";
import React from "react";
import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
};
export function SeoHead({ title = "EmotionsCare", description = "Bien-être émotionnel", url = "", image = "" }: Props) {
  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      {url && <meta property="og:url" content={url} />}
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
}
