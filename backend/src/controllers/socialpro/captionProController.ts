import { Request, Response } from 'express';
import { aiClient, AI_MODEL, requireAIKey } from '../../services/aiProvider';
import prisma from '../../lib/prisma';

export const sendCaptionChatMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    const { message, chatId, platform, industry, tone } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'No message provided' });
    }

    let chat;
    if (chatId) {
      chat = await prisma.socialMediaCaptionChat.findUnique({ where: { id: Number(chatId) } });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = await prisma.socialMediaCaptionChat.create({ 
        data: { 
          userId, 
          platform: platform || 'Instagram',
          industry: industry || null,
          tone: tone || null
        } 
      });
    }

    // Save user message
    await prisma.socialMediaCaptionChatMessage.create({
      data: { 
        chatId: chat.id, 
        sender: 'user', 
        content: message,
        metadata: { platform, industry, tone }
      }
    });

    // Compose prompt for OpenAI
    const platformSpecific = platform === 'LinkedIn' 
      ? 'professional and business-oriented'
      : 'engaging and visually appealing';
    
    const industryContext = industry ? ` for ${industry} industry` : '';
    const toneContext = tone ? ` with a ${tone} tone` : '';
    
    const prompt = `You are an expert social media content creator specializing in ${platform} captions. 
    
Create a compelling, ${platformSpecific} caption${industryContext}${toneContext} for the following request:

${message}

Requirements:
- Make it engaging and shareable
- Include relevant emojis where appropriate
- Keep it within ${platform === 'LinkedIn' ? '1300' : '2200'} characters
- Use ${platform === 'LinkedIn' ? 'professional' : 'casual and friendly'} language
- Include a call-to-action if appropriate

Return only the caption text.`;

    // Retrieve RAG viral hooks & captions context if available
    let ragContext = '';
    try {
      const ragUrl = process.env.RAG_SERVICE_URL || process.env.LLM_SERVICE_URL || 'https://nexaflow-llm-service.onrender.com';
      const ragRes = await fetch(`${ragUrl}/api/rag/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          collection_name: 'socialpro_templates',
          n_results: 2
        })
      });
      if (ragRes.ok) {
        const ragData: any = await ragRes.json();
        if (ragData.chunks && ragData.chunks.length > 0) {
          ragContext = ragData.chunks.map((c: any) => c.text).join('\n\n');
        }
      }
    } catch (ragErr) {
      console.log('SocialPro RAG retrieval skipped:', ragErr);
    }

    const openai = aiClient;
    const response = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        { 
          role: 'system', 
          content: `You are an expert social media content creator.${
            ragContext ? `\n\n[VIRAL SOCIAL MEDIA HOOKS & TEMPLATES]:\n${ragContext}` : ''
          }`
        },
        { role: 'user', content: prompt }
      ]
    });

    const answer = response.choices[0].message.content || '';

    // Save AI response
    await prisma.socialMediaCaptionChatMessage.create({
      data: { 
        chatId: chat.id, 
        sender: 'bot', 
        content: answer,
        metadata: { platform, industry, tone }
      }
    });

    // Update user limit after successful OpenAI response
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/user/update-limit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ limitType: 'message' })
        });
      }
    } catch (limitError) {
      console.error('Failed to update user limit:', limitError);
    }

    const messages = await prisma.socialMediaCaptionChatMessage.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({ chat_id: chat.id, messages });
  } catch (err) {
    console.error('Error in sendCaptionChatMessage:', err);
    res.status(500).json({ error: 'Failed to process caption request' });
  }
};

export const getCaptionChatById = async (req: Request, res: Response) => {
  try {
    const { chat_id } = req.params;
    const userId = (req as any).user?.id;
    const chat = await prisma.socialMediaCaptionChat.findUnique({
      where: { id: Number(chat_id) },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    if (!chat || chat.userId !== userId) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    res.json({ chat_id, messages: chat.messages });
  } catch (err) {
    console.error('Error in getCaptionChatById:', err);
    res.status(500).json({ error: 'Failed to fetch chat' });
  }
};

export const getUserCaptionChats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });
    const chats = await prisma.socialMediaCaptionChat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });
    res.json({ chats });
  } catch (err) {
    console.error('Error in getUserCaptionChats:', err);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};
