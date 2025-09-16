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
    // Support both generic LLM_ and provider-specific (GROQ_) prefixes
    const provider = (process.env.LLM_PROVIDER as any) || 'groq';

    let llmConfig;
    if (provider === 'groq') {
      llmConfig = {
        provider: 'groq',
        apiKey: process.env.GROQ_API_KEY || process.env.LLM_API_KEY,
        model: process.env.GROQ_MODEL || process.env.LLM_MODEL || 'llama3-8b-8192',
        temperature: parseFloat(process.env.GROQ_TEMPERATURE || process.env.LLM_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.GROQ_MAX_TOKENS || process.env.LLM_MAX_TOKENS || '1000'),
      };
    } else {
      llmConfig = {
        provider: provider,
        apiKey: process.env.LLM_API_KEY,
        model: process.env.LLM_MODEL,
        baseUrl: process.env.LLM_BASE_URL,
        temperature: parseFloat(process.env.LLM_TEMPERATURE || '0.7'),
        maxTokens: parseInt(process.env.LLM_MAX_TOKENS || '1000'),
      };
    }

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
        const contextPrompt = `
        ## ROLE
        - You are Francesca, Jacob's AI assistant. You answer questions to users about Jacob, his work, school, and personal life

        ## CONTEXT
        - Context Documents:
        ${ragData.relevantDocuments.map(result =>
          `[${result.document.metadata.category.toUpperCase()}] ${result.document.metadata.title}:
        ${result.document.content}
        Relevance Score: ${(result.similarity * 100).toFixed(1)}%`
        ).join('\n\n')}
        - User Question: ${message}

        ## ASK
        - Based on the following context from Jacob's portfolio, provide a helpful and accurate response to the user's question.
        
        ## CONSTRAINTS
        - Provide a natural, conversational response based on the context above.
        - Be concise, give short, summarized answers only
        - Only exceed 4 sentences when asked for more details
        - Include a cheerful, yet witty personality on the first sentence
        - Avoid creativity when going thru the details
        - Do not include greetings
        `;

        const llmResponse = await llmService.generateResponse(contextPrompt);
        responseContent = llmResponse.content;
      } else {
        // No relevant documents found
        const noContextPrompt = `
        ## ROLE
        - You are Francesca, Jacob's AI assistant. You answer questions to users about Jacob, his work, school, and personal life
        
        ## CONTEXT
        - The user asked: "${message}"
        - You dont have specific documents to provide accurate answers to the user's question 
        - Suggest asking about Jacob's work experience, education, or personal interests instead.

        ## CONSTRAINTS
        - Provide a natural, conversational response based on the context above.
        - Be concise, give short, summarized answers only
        - Maximum of 3 sentences only
        - Include a cheerful, yet witty personality
        - Do not include greetings
        `;

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
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        return NextResponse.json({
          error: 'Rate limit exceeded. Please wait a moment and try again, or switch to a different LLM provider.'
        }, { status: 429 });
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