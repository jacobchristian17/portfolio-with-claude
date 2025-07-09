"use client";
import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addMessage, setLoading, clearMessages } from "../store/messageSlice";
import type { Message } from "../store/messageSlice";
import { ragService } from "../services/ragService";

interface ChatBotProps {
  onMessage?: (message: string) => Promise<{ content: string; sources?: string[] }>;
  ragEnabled?: boolean;
  documents?: string[];
}

export default function ChatBot({
  onMessage,
}: ChatBotProps) {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const { messages, isLoading, ragSettings } = useAppSelector((state) => state.messages);
  const [input, setInput] = useState("");
  const [collapsedSources, setCollapsedSources] = useState<Set<string>>(new Set());
  const [collapsedContext, setCollapsedContext] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Scrolls the message container to the bottom to show the latest message.
   * Uses requestAnimationFrame to ensure DOM updates are complete before scrolling.
   * This provides smooth scrolling behavior and prevents timing issues with DOM updates.
   * 
   * @function scrollToBottom
   * @returns {void}
   * 
   * @example
   * // Called automatically when new messages are added
   * scrollToBottom();
   */
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      // Use requestAnimationFrame to ensure the DOM has updated
      requestAnimationFrame(() => {
        container.scrollTop = container.scrollHeight;
      });
    }
  };

  useEffect(() => {
    // Only scroll when messages array length changes (new message added)
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages.length]);

  /**
   * Handles form submission for sending chat messages.
   * Processes user input, generates RAG context if available, calls external message handler,
   * and manages the complete message lifecycle including error handling.
   * 
   * @async
   * @function handleSubmit
   * @param {React.FormEvent} e - The form submission event
   * @returns {Promise<void>}
   * 
   * @throws {Error} When message processing fails, displays error message to user
   * 
   * @example
   * // Called when user submits the chat form
   * <form onSubmit={handleSubmit}>
   *   <input type="text" value={input} />
   *   <button type="submit">Send</button>
   * </form>
   * 
   * @description
   * Process flow:
   * 1. Validates input and checks loading state
   * 2. Creates and dispatches user message
   * 3. Generates RAG context if indexes are selected
   * 4. Calls external message handler or provides fallback response
   * 5. Creates and dispatches assistant message with sources and context
   * 6. Handles errors gracefully with user-friendly error messages
   * 7. Always clears loading state in finally block
   */
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

      // RAG is always enabled, check if any indexes are selected
      if (ragSettings.selectedIndexes.length > 0) {
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
          : { content: "Please select at least one knowledge area to get personalized responses about Jacob!" };
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
      console.error(error)
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

  /**
   * Clears all chat messages and resets UI state.
   * Dispatches the clearMessages action and resets all collapse states for sources and context.
   * This provides a clean slate for the user to start a new conversation.
   * 
   * @function handleClearMessages
   * @returns {void}
   * 
   * @example
   * // Called when user clicks the clear messages button
   * <button onClick={handleClearMessages}>Clear Chat</button>
   * 
   * @description
   * Actions performed:
   * 1. Dispatches clearMessages() to remove all messages from Redux store
   * 2. Resets collapsedSources state to empty Set
   * 3. Resets collapsedContext state to empty Set
   * 4. UI automatically updates to show empty state message
   */
  const handleClearMessages = () => {
    dispatch(clearMessages());
    setCollapsedSources(new Set());
    setCollapsedContext(new Set());
  };

  /**
   * Toggles the collapse state of the sources section for a specific message.
   * Uses Set data structure to efficiently track which message sources are collapsed.
   * Provides smooth UI interaction for showing/hiding source information.
   * 
   * @function toggleSources
   * @param {string} messageId - The unique identifier of the message whose sources to toggle
   * @returns {void}
   * 
   * @example
   * // Called when user clicks on sources header
   * <button onClick={() => toggleSources(message.id)}>
   *   Sources ({message.sources.length})
   * </button>
   * 
   * @description
   * Toggle logic:
   * 1. Creates a new Set from the previous collapsed sources state
   * 2. If messageId exists in set, removes it (expand sources)
   * 3. If messageId doesn't exist in set, adds it (collapse sources)
   * 4. Updates state with the new Set
   * 5. UI automatically reflects the change with smooth animations
   */
  const toggleSources = (messageId: string) => {
    setCollapsedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  /**
   * Toggles the collapse state of the RAG context section for a specific message.
   * Manages the visibility of contextual relevance information including similarity scores.
   * Uses Set data structure for efficient state management and smooth UI interactions.
   * 
   * @function toggleContext
   * @param {string} messageId - The unique identifier of the message whose context to toggle
   * @returns {void}
   * 
   * @example
   * // Called when user clicks on context relevance header
   * <button onClick={() => toggleContext(message.id)}>
   *   Context relevance ({message.ragContext.relevantDocuments.length})
   * </button>
   * 
   * @description
   * Toggle logic:
   * 1. Creates a new Set from the previous collapsed context state
   * 2. If messageId exists in set, removes it (expand context)
   * 3. If messageId doesn't exist in set, adds it (collapse context)
   * 4. Updates state with the new Set
   * 5. UI shows/hides RAG context with document categories, titles, and similarity scores
   * 6. Smooth animations provide visual feedback for the state change
   */
  const toggleContext = (messageId: string) => {
    setCollapsedContext(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  return (
    <div className="flex flex-col h-128 glass-card rounded-2xl overflow-hidden shadow-royal">
      {/* Header */}
      <div className="bg-royal-gradient text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">🤖 Ask Francesca!</h3>
          <p className="text-sm text-blue-100">
            She knows a thing or two about Jacob
          </p>
        </div>
        <button
          onClick={handleClearMessages}
          className="btn-gold text-sm px-3 py-1 cursor-pointer rounded-full flex items-center justify-center w-12 h-12 max-md:w-10 max-md:h-10 hover:text-yellow-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 512 512">
            <path
              d="M 167 18 L 160 32 L 167 18 L 160 32 L 64 32 L 64 32 Q 50 32 41 41 Q 32 50 32 64 Q 32 78 41 87 Q 50 96 64 96 L 448 96 L 448 96 Q 462 96 471 87 Q 480 78 480 64 Q 480 50 471 41 Q 462 32 448 32 L 352 32 L 352 32 L 345 18 L 345 18 Q 336 1 316 0 L 196 0 L 196 0 Q 176 1 167 18 L 167 18 Z M 448 128 L 64 128 L 448 128 L 64 128 L 85 467 L 85 467 Q 87 486 100 499 Q 114 512 133 512 L 379 512 L 379 512 Q 398 512 412 499 Q 425 486 427 467 L 448 128 L 448 128 Z"
            />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
      >
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
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.role === "user"
                ? "bg-royal-gradient text-white shadow-royal"
                : "glass-card text-gray-800 shadow-soft"
                }`}
            >
              <p className="text-sm" style={{ color: message.role === "user" ? 'var(--text-usr-primary)' : 'var(--text-primary)' }}>{message.content}</p>
              {message.sources && message.sources.length > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  <button
                    onClick={() => toggleSources(message.id)}
                    className="flex items-center gap-1 font-medium hover:opacity-100 transition-opacity"
                    style={{ color: isDarkMode ? 'var(--gold-dark)' : 'var(--text-primary)' }}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${collapsedSources.has(message.id) ? 'rotate-90' : 'rotate-0'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Sources ({message.sources.length})
                  </button>
                  {collapsedSources.has(message.id) && (
                    <ul className="list-disc list-inside mt-1 pl-4">
                      {message.sources.map((source, index) => (
                        <li key={index} style={{ color: 'var(--text-secondary)' }}>{source}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {message.ragContext && message.ragContext.relevantDocuments.length > 0 && (
                <div className="mt-2 text-xs opacity-75">
                  <button
                    onClick={() => toggleContext(message.id)}
                    className="flex items-center gap-1 font-medium hover:opacity-100 transition-opacity"
                    style={{ color: isDarkMode ? 'var(--gold-dark)' : 'var(--text-primary)' }}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${collapsedContext.has(message.id) ? 'rotate-90' : 'rotate-0'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Context relevance ({message.ragContext.relevantDocuments.length})
                  </button>
                  {collapsedContext.has(message.id) && (
                    <ul className="list-disc list-inside mt-1 pl-4">
                      {message.ragContext.relevantDocuments.map((doc, index) => (
                        <li key={index}>
                          <span className="font-normal" style={{ color: isDarkMode? 'var(--gold-light)': 'var(--text-secondary)' }}>[{doc.category}] </span>
                          <span className="font-bold" style={{ color: isDarkMode? 'var(--gold-light)': 'var(--text-secondary)' }}>{doc.title} </span>
                          <span style={{ color: isDarkMode? 'var(--gold-light)': 'var(--text-secondary)' }}> - {Math.round(doc.similarity * 100)}% match</span>
                        </li>
                      ))}
                    </ul>
                  )}
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
            <div className="glass-card text-gray-800 px-4 py-2 rounded-lg shadow-soft">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-royal-gradient rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gold-gradient rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-royal-gradient rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 mt-1 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-royal disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}