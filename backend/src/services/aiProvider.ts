import OpenAI from 'openai';

const groqKey = process.env.GROQ_API_KEY;
const xaiKey = process.env.XAI_API_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

const apiKey = groqKey || xaiKey || openaiKey;
const isGroqKey = apiKey?.startsWith('gsk_');
const isXaiKey = Boolean(xaiKey && !isGroqKey);

const baseURL = isGroqKey
  ? process.env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1'
  : isXaiKey
    ? process.env.XAI_BASE_URL || 'https://api.x.ai/v1'
    : process.env.OPENAI_BASE_URL;

export const AI_MODEL = isGroqKey
  ? process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
  : isXaiKey
    ? process.env.XAI_MODEL || 'grok-4.3'
    : process.env.OPENAI_MODEL || 'gpt-3.5-turbo';

export const getAIProviderName = () => {
  if (isGroqKey) return 'Groq';
  if (isXaiKey) return 'xAI';
  return 'OpenAI';
};

export const requireAIKey = () => {
  if (!apiKey) {
    throw new Error('No AI API key configured. Set GROQ_API_KEY, XAI_API_KEY, or OPENAI_API_KEY.');
  }
};

export const aiClient = new OpenAI({
  apiKey,
  ...(baseURL ? { baseURL } : {}),
});
