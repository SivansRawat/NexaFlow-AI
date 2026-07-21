import { Request, Response } from 'express';
import prisma from '../../lib/prisma';
import { llmService, ChatMessage } from '../../services/llmService';

export const sendTonePolisherChatMessage = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    const { message, chatId } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'No message provided' });
    }

    let chat;
    if (chatId) {
      chat = await prisma.tonePolisherChat.findUnique({ where: { id: Number(chatId) } });
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = await prisma.tonePolisherChat.create({
        data: { userId }
      });
    }

    // Save user message
    await prisma.tonePolisherChatMessage.create({
      data: { chatId: chat.id, sender: 'user', content: message }
    });

    // Get chat history for context
    const messages = await prisma.tonePolisherChatMessage.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' }
    });

    // Prepare conversation history for LLM
    const conversationHistory: ChatMessage[] = messages.map((msg: { sender: string; content: string }) => ({
      role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    // Retrieve RAG tone guidelines if available
    let ragContext = '';
    try {
      const ragUrl = process.env.RAG_SERVICE_URL || process.env.LLM_SERVICE_URL || 'https://nextflow-ai-llm-production.up.railway.app';
      const ragRes = await fetch(`${ragUrl}/api/rag/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: message,
          collection_name: 'mailcraft_templates',
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
      console.log('Tone Polisher RAG retrieval skipped:', ragErr);
    }

    // Create system prompt for tone polishing
    const systemPrompt = `You are a professional tone polisher and writing assistant. Your role is to help users improve their text by:

1. Analyzing the tone and style of their text
2. Suggesting improvements for clarity, professionalism, and impact
3. Providing polished versions that maintain the original intent
4. Offering specific feedback on grammar, tone, and structure${
  ragContext ? `\n\n[RAG TONE GUIDELINES & FRAMEWORKS]:\n${ragContext}` : ''
}

Always respond in a helpful, professional manner.`;

    // Add system message at the beginning
    const fullConversation: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory
    ];

    // Get AI response from self-hosted LLM
    const answer = await llmService.chatCompletion(
      fullConversation,
      0.7, // temperature
      1000 // max tokens
    );

    // Save AI response
    await prisma.tonePolisherChatMessage.create({
      data: { chatId: chat.id, sender: 'bot', content: answer }
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
      // Don't fail the request if limit update fails
    }

    const updatedMessages = await prisma.tonePolisherChatMessage.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: 'asc' }
    });

    res.json({
      aiMessage: answer,
      chatId: chat.id,
      messages: updatedMessages
    });
  } catch (error) {
    console.error('TonePolisher chat error:', error);
    res.status(500).json({ error: 'Failed to process tone polishing request' });
  }
};

// export const getTonePolisherChatById = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user?.id;
//     if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

//     const { chat_id } = req.params;
//     const chatId = parseInt(chat_id);

//     if (isNaN(chatId)) {
//       return res.status(400).json({ error: 'Invalid chat ID' });
//     }

//     const chat = await prisma.tonePolisherChat.findFirst({
//       where: { id: chatId, userId },
//       include: {
//         messages: {
//           orderBy: { createdAt: 'asc' }
//         }
//       }
//     });

//     if (!chat) {
//       return res.status(404).json({ error: 'Chat not found' });
//     }

//     res.json(chat);
//   } catch (error) {
//     console.error('Get tone polisher chat error:', error);
//     res.status(500).json({ error: 'Failed to retrieve chat' });
//   }
// };


export const getTonePolisherChatById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'User not authenticated.' });

    const { chat_id } = req.params;
    const chatId = parseInt(String(chat_id));  // ✅ FIXED: ensure string type

    if (isNaN(chatId)) {
      return res.status(400).json({ error: 'Invalid chat ID' });
    }

    const chat = await prisma.tonePolisherChat.findFirst({
      where: { id: chatId, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' }
        }
      }
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.json(chat);
  } catch (error) {
    console.error('Get tone polisher chat error:', error);
    res.status(500).json({ error: 'Failed to retrieve chat' });
  }
};