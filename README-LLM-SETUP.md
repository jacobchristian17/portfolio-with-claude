# LLM Chatbot with RAG Implementation Guide

Your chatbot is now ready for real LLM integration! Here's how to set it up:

## Quick Setup

### 1. Choose Your LLM Provider

**Option A: OpenAI (Recommended for beginners)**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your OpenAI API key
LLM_PROVIDER=openai
LLM_API_KEY=sk-your-openai-api-key-here
LLM_MODEL=gpt-3.5-turbo
```

**Option B: Anthropic (Claude)**
```bash
LLM_PROVIDER=anthropic
LLM_API_KEY=your-anthropic-api-key
LLM_MODEL=claude-3-haiku-20240307
```

**Option C: Groq (Fast & Free)**
```bash
LLM_PROVIDER=groq
LLM_API_KEY=your-groq-api-key
LLM_MODEL=llama3-8b-8192
```

**Option D: Ollama (Local/Self-hosted)**
```bash
# Install Ollama first: https://ollama.ai
# Pull a model: ollama pull llama2

LLM_PROVIDER=ollama
LLM_MODEL=llama2
LLM_BASE_URL=http://localhost:11434
# No API key needed for local Ollama
```

### 2. Get Your API Key

- **OpenAI**: https://platform.openai.com/api-keys
- **Anthropic**: https://console.anthropic.com/
- **Groq**: https://console.groq.com/
- **Ollama**: No API key needed (runs locally)

### 3. Test the Implementation

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/chatbot`

3. Try asking questions like:
   - "What's Jacob's experience with React?"
   - "Tell me about Jacob's education"
   - "What are Jacob's hobbies?"

## How It Works

### RAG Pipeline
1. **Query Processing**: User message is analyzed
2. **Document Retrieval**: Relevant documents are found from 3 indexes:
   - Work experience
   - Education/school
   - Personal/about me
3. **Context Enhancement**: Retrieved documents are added to the LLM prompt
4. **Response Generation**: LLM generates response with context
5. **Source Attribution**: Sources and similarity scores are displayed

### File Structure
```
app/
├── api/chat/route.ts          # Chat API endpoint
├── services/
│   ├── llmService.ts          # LLM provider integrations
│   └── ragService.ts          # RAG document search
├── components/
│   ├── ChatBot.tsx            # Main chatbot UI
│   └── RAGControls.tsx        # RAG settings UI
└── chatbot/page.tsx           # Chatbot demo page
```

## Customization

### Add More Documents
Edit `app/services/ragService.ts` to add more documents to any index:

```typescript
{
  id: 'work-4',
  content: 'Your new work experience...',
  metadata: {
    title: 'New Role',
    category: 'work',
    tags: ['skill1', 'skill2'],
    source: 'Resume'
  }
}
```

### Change LLM Parameters
Modify `.env.local`:

```bash
LLM_TEMPERATURE=0.7     # Creativity (0-1)
LLM_MAX_TOKENS=1000     # Response length
```

### Add New LLM Providers
Extend `llmService.ts` with new provider methods.

## Production Deployment

### Environment Variables
Set these in your deployment platform:

- `LLM_PROVIDER`
- `LLM_API_KEY`
- `LLM_MODEL`
- `LLM_TEMPERATURE`
- `LLM_MAX_TOKENS`

### Security Considerations
- Never commit API keys to git
- Use environment variables for all secrets
- Consider rate limiting for production use
- Monitor API usage and costs

## Troubleshooting

### Common Issues

1. **"LLM API key not configured"**
   - Check `.env.local` file exists
   - Verify API key is correct
   - Restart development server

2. **"API is currently unavailable"**
   - Check internet connection
   - Verify API key has sufficient credits
   - Try a different model

3. **Ollama connection errors**
   - Ensure Ollama is running: `ollama serve`
   - Check the model is installed: `ollama list`
   - Verify base URL in config

4. **Slow responses**
   - Try a faster model (e.g., gpt-3.5-turbo vs gpt-4)
   - Reduce max_tokens
   - Use Groq for fastest responses

### Performance Tips

- **Groq**: Fastest inference (free tier available)
- **OpenAI GPT-3.5**: Good balance of speed/quality
- **Ollama**: Fully private, no API costs
- **Anthropic Claude**: High quality responses

## Cost Estimates (per 1000 messages)

- **OpenAI GPT-3.5-turbo**: ~$0.50
- **Groq Llama3-8B**: Free tier available
- **Anthropic Claude Haiku**: ~$0.75
- **Ollama**: $0 (local compute costs)

Your RAG chatbot is now production-ready! 🚀