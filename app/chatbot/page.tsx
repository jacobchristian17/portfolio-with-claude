"use client";
import ChatBot from "../components/ChatBot";
import RAGControls from "../components/RAGControls";

export default function ChatBotPage() {
  const handleMessage = async (message: string) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock response with potential RAG sources
    const responses = [
      {
        content: "Hello! I'm an AI assistant. How can I help you today?",
        sources: ["Knowledge Base", "FAQ Database"]
      },
      {
        content: "I understand you're asking about that topic. Based on the available information, here's what I can tell you...",
        sources: ["Document 1", "Reference Manual"]
      },
      {
        content: "That's an interesting question! Let me provide you with some relevant information.",
        sources: ["Research Paper", "Technical Documentation"]
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">AI Chatbot with RAG</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chatbot */}
          <div className="lg:col-span-2">
            <ChatBot 
              onMessage={handleMessage}
              ragEnabled={true}
              documents={["doc1.pdf", "doc2.txt", "knowledge_base.md"]}
            />
          </div>
          
          {/* Controls and Info Panel */}
          <div className="space-y-6">
            <RAGControls />
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">RAG Demo</h2>
              <p className="text-sm text-gray-600 mb-4">
                Try asking questions about:
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Work:</strong> "What's my experience with React?"</li>
                <li>• <strong>School:</strong> "Tell me about my education"</li>
                <li>• <strong>Personal:</strong> "What are my hobbies?"</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-6 mb-2">Features</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• 3 specialized knowledge indexes</li>
                <li>• Similarity-based document retrieval</li>
                <li>• Context-aware responses</li>
                <li>• Source attribution & relevance scoring</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}