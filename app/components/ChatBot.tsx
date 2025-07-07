"use client";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMessage, setLoading, clearMessages, toggleRAGIndex } from "../store/messageSlice";
import type { Message } from "../store/messageSlice";
import { ragService } from "../services/ragService";

interface ChatBotProps {
  onMessage?: (message: string) => Promise<{ content: string; sources?: string[] }>;
  ragEnabled?: boolean;
  documents?: string[];
}

export default function ChatBot({ 
  onMessage, 
  ragEnabled = false, 
  documents = [] 
}: ChatBotProps) {
  const dispatch = useAppDispatch();
  const { messages, isLoading, ragSettings } = useAppSelector((state) => state.messages);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
    setInput("");
    dispatch(setLoading(true));

    try {
      let response;
      let ragContext = undefined;

      if (ragSettings.enabled && ragSettings.selectedIndexes.length > 0) {
        // Get RAG context
        const ragData = await ragService.generateRAGContext(input, ragSettings.selectedIndexes);
        
        if (ragData.relevantDocuments.length > 0) {
          ragContext = {
            query: ragData.query,
            relevantDocuments: ragData.relevantDocuments.map(result => ({
              title: result.document.metadata.title,
              content: result.document.content,
              similarity: result.similarity,
              category: result.document.metadata.category
            })),
            selectedIndexes: ragData.selectedIndexes
          };

          // Generate response with RAG context
          const contextPrompt = `Context from relevant documents:
${ragData.relevantDocuments.map(result => 
  `[${result.document.metadata.category.toUpperCase()}] ${result.document.metadata.title}: ${result.document.content}`
).join('\n\n')}

User question: ${input}

Please provide a helpful response based on the context above.`;

          response = onMessage 
            ? await onMessage(contextPrompt)
            : { 
                content: `Based on the relevant information I found, here's what I can tell you: ${ragData.relevantDocuments[0]?.document.content.substring(0, 200)}...`,
                sources: ragData.relevantDocuments.map(result => result.document.metadata.title)
              };
        } else {
          response = onMessage 
            ? await onMessage(input)
            : { content: "I don't have specific information about that topic in my knowledge base. Could you try rephrasing your question?" };
        }
      } else {
        response = onMessage 
          ? await onMessage(input)
          : { content: "This is a demo response. Connect to an LLM API to enable real chat functionality." };
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        role: "assistant",
        timestamp: new Date(),
        sources: response.sources,
        ragContext,
      };

      dispatch(addMessage(assistantMessage));
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      dispatch(addMessage(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleClearMessages = () => {
    dispatch(clearMessages());
  };

  return (
    <div className="flex flex-col h-96 bg-white border border-gray-300 rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">AI Assistant</h3>
          {ragSettings.enabled && (
            <p className="text-sm text-blue-100">
              RAG enabled • {ragSettings.selectedIndexes.join(', ')} indexes active
            </p>
          )}
        </div>
        <button
          onClick={handleClearMessages}
          className="text-sm px-2 py-1 bg-blue-700 hover:bg-blue-800 rounded"
        >
          Clear
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            Start a conversation by typing a message below
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  <p className="font-medium">Sources:</p>
                  <ul className="list-disc list-inside">
                    {message.sources.map((source, index) => (
                      <li key={index}>{source}</li>
                    ))}
                  </ul>
                </div>
              )}
              {message.ragContext && message.ragContext.relevantDocuments.length > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  <p className="font-medium">RAG Context:</p>
                  <ul className="list-disc list-inside">
                    {message.ragContext.relevantDocuments.map((doc, index) => (
                      <li key={index}>
                        <span className="font-medium">[{doc.category}]</span> {doc.title} 
                        <span className="text-gray-500"> ({Math.round(doc.similarity * 100)}% match)</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}