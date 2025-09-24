// LLM Service - Supports multiple providers (OpenAI, Anthropic, Ollama, etc.)

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'ollama' | 'groq';
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  temperature?: number;
  maxTokens?: number;
  contextWindowSize?: number;
  maxContextTokens?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

class LLMService {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async generateResponse(prompt: string, conversationHistory?: ChatMessage[]): Promise<LLMResponse> {
    const messages = this.buildMessagesWithContext(prompt, conversationHistory);

    switch (this.config.provider) {
      case 'openai':
        return this.callOpenAI(messages);
      case 'anthropic':
        return this.callAnthropic(messages);
      case 'ollama':
        return this.callOllama(messages);
      case 'groq':
        return this.callGroq(messages);
      default:
        throw new Error(`Unsupported LLM provider: ${this.config.provider}`);
    }
  }

  private buildMessagesWithContext(prompt: string, conversationHistory?: ChatMessage[]): ChatMessage[] {
    const messages: ChatMessage[] = [];

    if (conversationHistory && conversationHistory.length > 0) {
      const windowSize = this.config.contextWindowSize || 10;
      const maxTokens = this.config.maxContextTokens || 2000;

      const recentMessages = conversationHistory.slice(-windowSize);

      let totalTokens = 0;
      const filteredMessages: ChatMessage[] = [];

      for (let i = recentMessages.length - 1; i >= 0; i--) {
        const messageTokens = this.estimateTokens(recentMessages[i].content);
        if (totalTokens + messageTokens > maxTokens) break;
        filteredMessages.unshift(recentMessages[i]);
        totalTokens += messageTokens;
      }

      messages.push(...filteredMessages);
    }

    messages.push({ role: 'user', content: prompt });

    return messages;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  private async callOpenAI(messages: ChatMessage[]): Promise<LLMResponse> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'gpt-3.5-turbo',
        messages: messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  }

  private async callAnthropic(messages: ChatMessage[]): Promise<LLMResponse> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.config.apiKey!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: this.config.model || 'claude-3-haiku-20240307',
        max_tokens: this.config.maxTokens || 1000,
        messages: messages,
        temperature: this.config.temperature || 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        promptTokens: data.usage.input_tokens,
        completionTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
    };
  }

  private async callOllama(messages: ChatMessage[]): Promise<LLMResponse> {
    const baseUrl = this.config.baseUrl || 'http://localhost:11434';

    const formattedPrompt = messages.map(m =>
      m.role === 'user' ? `User: ${m.content}` : `Assistant: ${m.content}`
    ).join('\n\n');

    const response = await fetch(`${baseUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: this.config.model || 'llama2',
        prompt: formattedPrompt,
        stream: false,
        options: {
          temperature: this.config.temperature || 0.7,
          num_predict: this.config.maxTokens || 1000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.response,
      usage: {
        promptTokens: data.prompt_eval_count || 0,
        completionTokens: data.eval_count || 0,
        totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      },
    };
  }

  private async callGroq(messages: ChatMessage[]): Promise<LLMResponse> {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: this.config.model || 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: messages,
        temperature: this.config.temperature || 0.7,
        max_tokens: this.config.maxTokens || 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens,
      },
    };
  }
}

export default LLMService;