import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const BASE_URL = 'https://nexa-flow-ai.vercel.app';

const routes = [
  {
    path: '/',
    title: 'NexaFlow AI - Universal RAG & Enterprise AI Automation Suite',
    description: 'Automate business workflows with PDF document intelligence, Excel formula analytics, MailCraft AI copywriting, and self-hosted vector search RAG.',
    keywords: 'NexaFlow AI, RAG AI, Universal RAG, PDF Brain, PDF Chat Agent, Excel AI Formula Master, MailCraft AI, SocialPro AI, Bulk Mailer AI, SmartDocs, Vector Database, Enterprise Automation',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      'name': 'NexaFlow AI',
      'operatingSystem': 'Web, All',
      'applicationCategory': 'BusinessApplication',
      'description': 'Enterprise AI automation suite featuring Universal RAG vector retrieval, PDF Intelligence, Excel analytics, MailCraft AI, and SocialPro AI.',
      'url': `${BASE_URL}/`,
      'offers': {
        '@type': 'Offer',
        'price': '0.00',
        'priceCurrency': 'USD'
      }
    }
  },
  {
    path: '/login',
    title: 'Sign In to Your Workspace | NexaFlow AI',
    description: 'Access your NexaFlow AI suite. Log in to use PDF Intelligence, AI Excel Formula Master, MailCraft AI, and vector search RAG.',
    keywords: 'NexaFlow login, AI dashboard sign in, NexaFlow AI account',
    robots: 'index, follow'
  },
  {
    path: '/signup',
    title: 'Create Your Account | NexaFlow AI',
    description: 'Join NexaFlow AI today. Get instant access to PDF Chat Agent, Excel AI Formula Master, MailCraft AI, and enterprise workflow tools.',
    keywords: 'NexaFlow signup, register NexaFlow AI, free AI workspace account',
    robots: 'index, follow'
  },
  {
    path: '/smartdocs/offerletter',
    title: 'AI Offer Letter Generator | NexaFlow AI',
    description: 'Generate professional, customizable employment offer letters instantly with live PDF preview, digital signing fields, and corporate branding.',
    keywords: 'AI offer letter generator, employment contract composer, HR document automation, offer letter PDF builder',
    robots: 'index, follow'
  },
  {
    path: '/smartdocs/smartinvoice',
    title: 'Smart AI Invoice Generator | NexaFlow AI',
    description: 'Create professional, tax-compliant business invoices in seconds with instant PDF download, live preview, and automated calculations.',
    keywords: 'AI invoice generator, online invoice builder, GST invoice creator, tax invoice generator PDF',
    robots: 'index, follow'
  },
  {
    path: '/premium',
    title: 'AI Suite Workspace Dashboard | NexaFlow AI',
    description: 'Access all NexaFlow AI tools in one central workspace: Excel Suite, PDF Hub, MailCraft AI, SocialPro AI, SmartDocs, and AI Workmate.',
    keywords: 'AI workspace dashboard, NexaFlow premium, enterprise AI suite',
    robots: 'index, follow'
  },
  {
    path: '/premium/excel',
    title: 'AI Excel Analytics & Formula Master | NexaFlow AI',
    description: 'Supercharge spreadsheets with AI Chart Builder, Excel Formula Master, Error & Trend Detector, and AI Sheet Summarizer.',
    keywords: 'AI Excel formula master, spreadsheet AI summarizer, chart builder AI, Excel error detector',
    robots: 'index, follow'
  },
  {
    path: '/premium/pdfhub',
    title: 'PDF Document Intelligence Hub & RAG Vector Search | NexaFlow AI',
    description: 'Interact with PDFs using vector search RAG, AI PDF Brain summarization, smart table extraction, and PDF batch processing.',
    keywords: 'PDF Chat Agent, PDF Brain summarizer, RAG PDF vector search, PDF table extractor AI',
    robots: 'index, follow'
  },
  {
    path: '/premium/mailcraft',
    title: 'MailCraft AI - Intelligent Email Copywriting & Outreach | NexaFlow AI',
    description: 'Craft high-converting cold emails, optimize email subject lines for maximum open rates, and polish email tone with AI.',
    keywords: 'MailCraft AI, email copywriting AI, subject line optimizer, cold email generator, tone polisher AI',
    robots: 'index, follow'
  },
  {
    path: '/premium/socialpro',
    title: 'SocialPro AI - Viral Social Captions & Ad Copy Generator | NexaFlow AI',
    description: 'Generate viral social media captions, trending hashtag strategies, high-converting ad copy, and content rewrites with AI.',
    keywords: 'SocialPro AI, viral caption generator, hashtag strategist AI, ad copy generator, caption rewriter AI',
    robots: 'index, follow'
  },
  {
    path: '/premium/smartdocs',
    title: 'SmartDocs - Intelligent Document Automation Suite | NexaFlow AI',
    description: 'Automate essential business documentation. Create custom invoices, job offer letters, contracts, and legal templates with AI.',
    keywords: 'SmartDocs AI, business document generator, invoice builder, offer letter generator',
    robots: 'index, follow'
  },
  {
    path: '/premium/bulkmailer',
    title: 'AI Bulk Mailer & Mail Merge Engine | NexaFlow AI',
    description: 'Launch personalized email campaigns from Excel files, select smart outreach templates, and automate mail merge with AI.',
    keywords: 'AI bulk mailer, Excel to email engine, mail merge AI, automated outreach campaigns',
    robots: 'index, follow'
  },
  {
    path: '/premium/aiworkmate',
    title: 'AI Workmate Assistant & Multi-LLM Chat Agent | NexaFlow AI',
    description: 'Interact with leading LLM models including ChatGPT, Claude 3.5, DeepSeek, and Grok in one unified AI workmate workspace.',
    keywords: 'AI Workmate, multi LLM chat agent, DeepSeek AI assistant, Claude 3.5 chat agent',
    robots: 'index, follow'
  },
  {
    path: '/premium/datafill',
    title: 'DataFill AI - Automated Form & Spreadsheet Engine | NexaFlow AI',
    description: 'Automate form filling, map Excel columns, extract structured data, and clean datasets automatically with AI.',
    keywords: 'DataFill AI, auto form filler, Excel form mapper, structured data extractor AI',
    robots: 'index, follow'
  },
  {
    path: '/premium/settings',
    title: 'Account Settings & Subscription | NexaFlow AI',
    description: 'Manage your NexaFlow AI account settings, password security, and active subscription plan.',
    keywords: 'NexaFlow settings, user security, account subscription',
    robots: 'noindex, nofollow'
  },
  {
    path: '/admin',
    title: 'Admin Dashboard | NexaFlow AI',
    description: 'NexaFlow AI System Administration Portal.',
    keywords: 'NexaFlow admin dashboard, system portal',
    robots: 'noindex, nofollow'
  },
  {
    path: '/adminlogin',
    title: 'Admin Portal Login | NexaFlow AI',
    description: 'Admin Login Portal for NexaFlow AI.',
    keywords: 'NexaFlow admin login',
    robots: 'noindex, nofollow'
  }
];

async function injectSeo() {
  const rootHtmlPath = path.join(DIST_DIR, 'index.html');
  let baseHtml;
  try {
    baseHtml = await fs.readFile(rootHtmlPath, 'utf8');
  } catch (err) {
    console.error(`Error reading ${rootHtmlPath}:`, err);
    process.exit(1);
  }

  console.log(`🚀 Starting Post-Build SEO HTML Injection for ${routes.length} routes...`);

  for (const route of routes) {
    const canonicalUrl = route.path === '/' ? `${BASE_URL}/` : `${BASE_URL}${route.path}`;
    let html = baseHtml;

    // Replace Title
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);
    html = html.replace(/<meta name="title" content="[\s\S]*?" \/>/i, `<meta name="title" content="${route.title}" />`);

    // Replace Description
    html = html.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${route.description}" />`);

    // Replace Keywords
    if (route.keywords) {
      html = html.replace(/<meta name="keywords" content="[\s\S]*?" \/>/i, `<meta name="keywords" content="${route.keywords}" />`);
    }

    // Replace Robots
    html = html.replace(/<meta name="robots" content="[\s\S]*?" \/>/i, `<meta name="robots" content="${route.robots}" />`);

    // Replace Canonical
    html = html.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

    // Replace Open Graph Tags
    html = html.replace(/<meta property="og:url" content="[\s\S]*?" \/>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content="[\s\S]*?" \/>/i, `<meta property="og:title" content="${route.title}" />`);
    html = html.replace(/<meta property="og:description" content="[\s\S]*?" \/>/i, `<meta property="og:description" content="${route.description}" />`);

    // Replace Twitter Card Tags
    html = html.replace(/<meta name="twitter:url" content="[\s\S]*?" \/>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta name="twitter:title" content="[\s\S]*?" \/>/i, `<meta name="twitter:title" content="${route.title}" />`);
    html = html.replace(/<meta name="twitter:description" content="[\s\S]*?" \/>/i, `<meta name="twitter:description" content="${route.description}" />`);

    // Inject/Replace JSON-LD Schema if provided
    if (route.jsonLd) {
      const jsonLdScript = `<script type="application/ld+json">\n${JSON.stringify(route.jsonLd, null, 2)}\n</script>`;
      html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, jsonLdScript);
    }

    if (route.path === '/') {
      // Save root index.html
      await fs.writeFile(rootHtmlPath, html, 'utf8');
      console.log(`  ✓ Injected SEO into root dist/index.html`);
    } else {
      // Save dist/<route>/index.html
      const routeSubdir = path.join(DIST_DIR, route.path.replace(/^\//, ''));
      await fs.mkdir(routeSubdir, { recursive: true });
      const targetFilePath = path.join(routeSubdir, 'index.html');
      await fs.writeFile(targetFilePath, html, 'utf8');
      console.log(`  ✓ Generated dist${route.path}/index.html`);
    }
  }

  console.log(`✨ SEO Injection Completed Successfully!`);
}

injectSeo();
