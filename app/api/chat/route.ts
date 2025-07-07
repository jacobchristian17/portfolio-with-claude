import { NextRequest, NextResponse } from 'next/server';
import LLMService from '../../services/llmService';
import { ragService } from '../../services/ragService';

export async function POST(request: NextRequest) {
  try {
    const { message, ragEnabled = true, selectedIndexes = ['work', 'school', 'about_me'] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Get LLM configuration from environment variables
    const llmConfig = {
      provider: (process.env.LLM_PROVIDER as any) || 'openai',
      apiKey: process.env.LLM_API_KEY,
      model: process.env.LLM_MODEL,
      baseUrl: process.env.LLM_BASE_URL,
      temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
    };

    // Initialize LLM service
    const llmService = new LLMService(llmConfig);

    let responseContent = '';
    let sources: string[] = [];
    let ragContext = null;

    if (ragEnabled && selectedIndexes.length > 0) {
      // Get RAG context
      const ragData = await ragService.generateRAGContext(message, selectedIndexes);
      
      if (ragData.relevantDocuments.length > 0) {
        // Store RAG context for response
        ragContext = ragData;
        sources = ragData.relevantDocuments.map(result => result.document.metadata.title);

        // Create enhanced prompt with RAG context
        const contextPrompt = `You are Jacob's AI assistant. Based on the following context from Jacob's portfolio, please provide a helpful and accurate response to the user's question.

Context Documents:
${ragData.relevantDocuments.map(result => 
  `[${result.document.metadata.category.toUpperCase()}] ${result.document.metadata.title}:
${result.document.content}
Relevance Score: ${(result.similarity * 100).toFixed(1)}%`
).join('\n\n')}

User Question: ${message}

Please provide a natural, conversational response based on the context above. If the context doesn't contain relevant information for the question, politely say so and offer to help with other topics from Jacob's portfolio.`;

        const llmResponse = await llmService.generateResponse(contextPrompt);
        responseContent = llmResponse.content;
      } else {
        // No relevant documents found
        const noContextPrompt = `You are Jacob's AI assistant. The user asked: "${message}"

I don't have specific information about that topic in Jacob's portfolio. Please politely explain that you don't have information about that specific topic, and suggest asking about Jacob's work experience, education, or personal interests instead.`;

        const llmResponse = await llmService.generateResponse(noContextPrompt);
        responseContent = llmResponse.content;
      }
    } else {
      // RAG disabled, use basic prompt
      const basicPrompt = `You are Jacob's AI assistant. The user asked: "${message}"

Please provide a helpful response. If you don't have specific information about Jacob, you can provide general assistance or suggest asking about topics that might be in Jacob's portfolio like work experience, education, or personal interests.`;

      const llmResponse = await llmService.generateResponse(basicPrompt);
      responseContent = llmResponse.content;
    }

    return NextResponse.json({
      content: responseContent,
      sources,
      ragContext: ragContext ? {
        query: ragContext.query,
        relevantDocuments: ragContext.relevantDocuments.map(result => ({
          title: result.document.metadata.title,
          content: result.document.content,
          similarity: result.similarity,
          category: result.document.metadata.category,
        })),
        selectedIndexes: ragContext.selectedIndexes,
      } : null,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return different error messages based on error type
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          error: 'LLM API key not configured. Please check your environment variables.' 
        }, { status: 500 });
      }
      if (error.message.includes('API error')) {
        return NextResponse.json({ 
          error: 'LLM API is currently unavailable. Please try again later.' 
        }, { status: 503 });
      }
    }

    return NextResponse.json({ 
      error: 'An unexpected error occurred. Please try again.' 
    }, { status: 500 });
  }
}