// import { Request, Response } from 'express';
// import * as XLSX from 'xlsx';
// import { aiClient, AI_MODEL, requireAIKey } from '../../services/aiProvider';
// import prisma from '../../lib/prisma';
// import { JwtPayload } from 'jsonwebtoken';
// import type { ChatCompletionUserMessageParam, ChatCompletionAssistantMessageParam, ChatCompletionMessageParam } from 'openai/resources/chat/completions';


// // Helper function for outlier detection
// const getOutliers = (data: any[], column: string) => {
//     const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
//     if (values.length < 2) return [];

//     const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
//     const stdDev = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((acc, v) => acc + v, 0) / values.length);
//     const outliers = [];
//     const threshold = 3; // 3 standard deviations

//     for (let i = 0; i < data.length; i++) {
//         const value = parseFloat(data[i][column]);
//         if (!isNaN(value) && Math.abs(value - mean) > threshold * stdDev) {
//             outliers.push(`Row ${i + 2}: Value '${value}' in column '${column}' is a potential outlier.`);
//         }
//     }
//     return outliers;
// };

// // POST /api/ai/analyze-excel
// export const analyzeExcel = async (req: Request, res: Response) => {
//   try {
//     requireAIKey();
//     const openai = aiClient;

//     const user = req.user as JwtPayload;
//     let { chatId, prompt } = req.body;



//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     let currentChat;
//     if (chatId) {
//         currentChat = await prisma.chat.findUnique({
//           where: { id: Number(chatId) }
//         });
//         if (!currentChat || currentChat.userId !== user.id) {
//             return res.status(403).json({ error: "Access denied." });
//         }
//     } else {
//         currentChat = await prisma.chat.create({
//           data: {
//             userId: user.id,
//             toolType: 'sheet_summarizer',
//             title: file.originalname
//           }
//         });
//         await prisma.chatMessage.create({
//           data: {
//             chatId: currentChat.id,
//             sender: 'user',
//             content: `File: ${file.originalname}`,
//             metadata: { fileName: file.originalname, fileSize: file.size, fileType: file.mimetype }
//           }
//         });
//     }

//     const workbook = XLSX.read(file.buffer, { type: 'buffer' });
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
//     if (!jsonData || jsonData.length === 0) {
//       return res.status(400).json({ error: 'No data found in the uploaded Excel file.' });
//     }

//     const fullDataText = JSON.stringify(jsonData, null, 2);

//     // Save the user's message first
//     if (prompt) {
//         await prisma.chatMessage.create({
//           data: { 
//             chatId: currentChat.id, 
//             sender: 'user', 
//             content: prompt 
//           }
//         });
//     }
        
//     let openaiMessages: ChatCompletionMessageParam[] = [];
//     if (currentChat) {
//         // Fetch all previous messages for this chat, including the one we just saved
//         const previousMessages = await prisma.chatMessage.findMany({
//           where: { chatId: currentChat.id },
//           orderBy: { createdAt: 'asc' }
//         });
//         openaiMessages = previousMessages
//             .filter((m: any) => m.sender === 'user' || m.sender === 'bot')
//             .map((m: any) => ({
//                 role: m.sender === 'user' ? 'user' as const : 'assistant' as const,
//                 content: m.content
//             }));
//     }

//     const systemPromptText = `You are an expert data analyst. Given the following Excel sheet data and your chat history, provide a concise summary and actionable insights. Format your response as a JSON object with keys "summary" and "insights". Full Data: \n${fullDataText}`;
//     const systemPrompt: ChatCompletionMessageParam = { role: 'system', content: systemPromptText };
        
//     const messagesForOpenAI: ChatCompletionMessageParam[] = [
//         systemPrompt,
//         ...openaiMessages
//     ];

//     const completion = await openai.chat.completions.create({
//         model: AI_MODEL,
//         messages: messagesForOpenAI,
//         response_format: { "type": "json_object" },
//         max_tokens: 500,
//         temperature: 0.3,
//     });

//     let aiContent = completion.choices[0].message?.content || '{"summary": "Could not generate analysis.", "insights": []}';
//     await prisma.chatMessage.create({
//       data: { 
//         chatId: currentChat.id, 
//         sender: 'bot', 
//         content: aiContent 
//       }
//     });

//     // Update user limit after successful OpenAI response
//     try {
//       const token = req.headers.authorization?.split(' ')[1];
//       if (token) {
//         await fetch(`${process.env.BACKEND_URL || 'http://localhost:5000'}/api/user/update-limit`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//           },
//           body: JSON.stringify({ limitType: 'message' })
//         });
//       }
//     } catch (limitError) {
//       console.error('Failed to update user limit:', limitError);
//       // Don't fail the request if limit update fails
//     }
        
//     const messages = await prisma.chatMessage.findMany({
//       where: { chatId: currentChat.id },
//       orderBy: { createdAt: 'asc' }
//     });
    
//     res.json({ chat: currentChat, messages });

//     } catch (err) {
//         res.status(500).json({ error: 'Failed to analyze Excel file' });
//     }
// }; 


import { Request, Response } from 'express';
import * as XLSX from 'xlsx';
import { aiClient, AI_MODEL, requireAIKey } from '../../services/aiProvider';
import prisma from '../../lib/prisma';
import { JwtPayload } from 'jsonwebtoken';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import ragService from '../../services/ragService';

// RAG configuration for Excel
const USE_RAG_EXCEL = process.env.USE_RAG_EXCEL === 'true';
const EXCEL_CHUNK_SIZE = parseInt(process.env.EXCEL_CHUNK_SIZE || '50', 10);

// Helper function for outlier detection (unchanged)
const getOutliers = (data: any[], column: string) => {
    const values = data.map(row => parseFloat(row[column])).filter(v => !isNaN(v));
    if (values.length < 2) return [];

    const mean = values.reduce((acc, v) => acc + v, 0) / values.length;
    const stdDev = Math.sqrt(values.map(v => Math.pow(v - mean, 2)).reduce((acc, v) => acc + v, 0) / values.length);
    const outliers = [];
    const threshold = 3; // 3 standard deviations

    for (let i = 0; i < data.length; i++) {
        const value = parseFloat(data[i][column]);
        if (!isNaN(value) && Math.abs(value - mean) > threshold * stdDev) {
            outliers.push(`Row ${i + 2}: Value '${value}' in column '${column}' is a potential outlier.`);
        }
    }
    return outliers;
};

// POST /api/ai/analyze-excel
export const analyzeExcel = async (req: Request, res: Response) => {
  try {
    requireAIKey();
    const openai = aiClient;

    const user = req.user as JwtPayload;
    let { chatId, prompt } = req.body;

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
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
            toolType: 'sheet_summarizer',
            title: file.originalname
          }
        });
        await prisma.chatMessage.create({
          data: {
            chatId: currentChat.id,
            sender: 'user',
            content: `File: ${file.originalname}`,
            metadata: { fileName: file.originalname, fileSize: file.size, fileType: file.mimetype }
          }
        });
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        
    if (!jsonData || jsonData.length === 0) {
      return res.status(400).json({ error: 'No data found in the uploaded Excel file.' });
    }

    const fullDataText = JSON.stringify(jsonData, null, 2);

    // --- RAG Ingestion (if enabled) ---
    let docId: string | null = null;
    if (USE_RAG_EXCEL && jsonData.length > 0) {
      try {
        // Chunk the rows into groups of EXCEL_CHUNK_SIZE
        const chunks: string[] = [];
        for (let i = 0; i < jsonData.length; i += EXCEL_CHUNK_SIZE) {
          const chunkRows = jsonData.slice(i, i + EXCEL_CHUNK_SIZE);
          chunks.push(JSON.stringify(chunkRows));
        }
        const chunkText = chunks.join('\n---\n');

        docId = `excel_${currentChat.id}_${Date.now()}`;
        await ragService.ingestDocument({
          documentId: docId,
          documentText: chunkText,
          metadata: {
            fileName: file.originalname,
            fileSize: file.size,
            chatId: currentChat.id,
            userId: user.id,
            rowCount: jsonData.length,
            chunkSize: EXCEL_CHUNK_SIZE
          },
          collectionName: `user_${user.id}_excel`
        });
        console.log(`✅ Ingested Excel into RAG: ${file.originalname}`);
      } catch (ragError) {
        console.error('Excel RAG ingestion failed, falling back to direct mode:', ragError);
        // Continue without RAG
      }
    }

    // Save the user's message first
    if (prompt) {
        await prisma.chatMessage.create({
          data: { 
            chatId: currentChat.id, 
            sender: 'user', 
            content: prompt 
          }
        });
    }
        
    // Fetch all previous messages for this chat (for conversation context)
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

    let aiContent = '';
    let usedRag = false;

    // --- Try RAG retrieval if enabled and ingestion succeeded ---
    if (USE_RAG_EXCEL && docId) {
      try {
        // Use ragService.retrieveContext to get relevant chunks
        const userPrompt = prompt || 'Summarize this data';
        const retrieved = await ragService.retrieveContext(
          userPrompt,
          `user_${user.id}_excel`,
          5  // top 5 chunks
        );

        if (retrieved.chunks.length > 0) {
          const contextText = retrieved.chunks.map(c => c.text).join('\n\n---\n\n');
          const ragPrompt = `Answer the question based on the Excel data context below.\n\nContext:\n${contextText}\n\nQuestion: ${userPrompt}\n\nAnswer:`;

          // Build messages with conversation history + RAG context
          const messagesForOpenAI: ChatCompletionMessageParam[] = [
            { role: 'system', content: 'You are an expert data analyst. Use the provided Excel data context to answer the user\'s question accurately and concisely.' },
            ...openaiMessages,
            { role: 'user', content: ragPrompt }
          ];

          const completion = await openai.chat.completions.create({
            model: AI_MODEL,
            messages: messagesForOpenAI,
            max_tokens: 800,
            temperature: 0.3,
          });

          aiContent = completion.choices[0].message?.content || 'No answer generated.';
          usedRag = true;
          console.log('✅ RAG answer generated for Excel');
        } else {
          console.log('No relevant chunks retrieved, falling back to direct analysis');
        }
      } catch (ragError) {
        console.error('Excel RAG retrieval failed, falling back to direct LLM:', ragError);
      }
    }

    // --- Fallback to original direct analysis if RAG not used ---
    if (!usedRag) {
      const systemPromptText = `You are an expert data analyst. Given the following Excel sheet data and your chat history, provide a concise summary and actionable insights. Format your response as a JSON object with keys "summary" and "insights". Full Data: \n${fullDataText}`;
      const systemPrompt: ChatCompletionMessageParam = { role: 'system', content: systemPromptText };
        
      const messagesForOpenAI: ChatCompletionMessageParam[] = [
          systemPrompt,
          ...openaiMessages
      ];

      const completion = await openai.chat.completions.create({
          model: AI_MODEL,
          messages: messagesForOpenAI,
          response_format: { "type": "json_object" },
          max_tokens: 500,
          temperature: 0.3,
      });

      aiContent = completion.choices[0].message?.content || '{"summary": "Could not generate analysis.", "insights": []}';
    }

    // Save the bot's response
    await prisma.chatMessage.create({
      data: { 
        chatId: currentChat.id, 
        sender: 'bot', 
        content: aiContent 
      }
    });

    // Update user limit after successful AI response
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
        console.error(err);
        res.status(500).json({ error: 'Failed to analyze Excel file' });
    }
};