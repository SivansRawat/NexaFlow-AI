import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  noindex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_TITLE = 'NexaFlow AI - Universal RAG & Enterprise AI Automation Suite';
const DEFAULT_DESCRIPTION = 'Automate business workflows with PDF document intelligence, Excel formula analytics, MailCraft AI copywriting, and self-hosted vector search RAG.';
const DEFAULT_KEYWORDS = 'NexaFlow AI, RAG AI, Universal RAG, PDF Brain, PDF Chat Agent, Excel AI Formula Master, MailCraft AI, SocialPro AI, Bulk Mailer AI, SmartDocs, Vector Database, Enterprise Automation';
const DEFAULT_CANONICAL = 'https://nexa-flow-ai.vercel.app/';
const DEFAULT_OG_IMAGE = 'https://nexa-flow-ai.vercel.app/premium-preview.png';

export const SEO: React.FC<SEOProps> = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
  jsonLd,
}) => {
  const fullTitle = title ? `${title} | NexaFlow AI` : DEFAULT_TITLE;
  const currentUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `https://nexa-flow-ai.vercel.app${canonical.startsWith('/') ? '' : '/'}${canonical}`)
    : DEFAULT_CANONICAL;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Robots meta directive */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="NexaFlow AI" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured JSON-LD Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
