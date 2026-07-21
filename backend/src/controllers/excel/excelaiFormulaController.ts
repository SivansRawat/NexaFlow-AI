import { Request, Response } from 'express';
import { aiClient, AI_MODEL, requireAIKey } from '../../services/aiProvider';
import { JwtPayload } from 'jsonwebtoken';
import prisma from '../../lib/prisma';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

export const explainFormula = async (req: Request, res: Response) => {
  try {
    requireAIKey();
    const openai = aiClient;

    const user = req.user as JwtPayload;
    let { chatId, formula, description } = req.body;

    if (!formula && !description) {
      return res.status(400).json({ error: 'Formula or description is required.' });
    }

    let currentChat;
    if (chatId) {
        currentChat = await prisma.chat.findUnique({
          where: { id: Number(chatId) }
        });
        if (!currentChat || currentChat.userId !== user.id) {
            return res.status(403).json({ error: "Access denied." });
        }
    } else {
        currentChat = await prisma.chat.create({
          data: {
            userId: user.id,
            toolType: 'formula_master',
            title: description ? description.substring(0, 50) : 'Formula Explanation'
          }
        });
    }

    const userPromptText = description || formula;
    await prisma.chatMessage.create({
      data: { 
        chatId: currentChat.id, 
        sender: 'user', 
        content: userPromptText 
      }
    });

    // Fetch the full chat history to provide context
    const previousMessages = await prisma.chatMessage.findMany({
      where: { chatId: currentChat.id },
      orderBy: { createdAt: 'asc' }
    });
    
    const openaiMessages: ChatCompletionMessageParam[] = previousMessages
        .filter((m: any) => m.sender === 'user' || m.sender === 'bot')
        .map((m: any) => ({
            role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
            content: m.content
        }));

    // Retrieve RAG Excel formulas & logical patterns context if available
    let ragContext = '';
    try {
      const ragUrl = process.env.RAG_SERVICE_URL || process.env.LLM_SERVICE_URL || 'https://nexaflow-llm-service.onrender.com';
      const ragRes = await fetch(`${ragUrl}/api/rag/retrieve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userPromptText,
          collection_name: 'excel_templates',
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
      console.log('Excel RAG retrieval skipped:', ragErr);
    }

    const systemPrompt: ChatCompletionMessageParam = { 
        role: 'system', 
        content: `You are an expert in Microsoft Excel formulas. Provide clear, concise explanations and formulas.${
          ragContext ? `\n\n[EXCEL FORMULA PATTERNS & RULES]:\n${ragContext}` : ''
        }` 
    };
    
    const completion = await openai.chat.completions.create({
      model: AI_MODEL,
      messages: [
        systemPrompt,
        ...openaiMessages,
      ],
      max_tokens: 400,
      temperature: 0.2,
    });
    
    const aiContent = completion.choices[0].message?.content || 'Sorry, I could not process that.';
    await prisma.chatMessage.create({
      data: { 
        chatId: currentChat.id, 
        sender: 'bot', 
        content: aiContent 
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
      // Don't fail the request if limit update fails
    }

    const messages = await prisma.chatMessage.findMany({
      where: { chatId: currentChat.id },
      orderBy: { createdAt: 'asc' }
    });
    
    res.json({ chat: currentChat, messages });

  } catch (err) {
    res.status(500).json({ error: 'Failed to explain formula.' });
  }
}; 