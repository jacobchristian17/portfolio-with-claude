"use client";
import ChatBot from "./components/ChatBot";
import RAGControls from "./components/RAGControls";
import TechCarousel from "./components/TechCarousel";
import { techStack } from "./assets/tech-logos";
import { useDispatch } from "react-redux";
import { addMessage, setLoading } from "./store/messageSlice";
import type { Message } from "./store/messageSlice";
import { useAppSelector } from "./store/hooks";
import { ragService } from "./services/ragService";
import HeroImage from "./components/HeroImage";
import { useRef } from "react";

export default function Home() {
  const dispatch = useDispatch();
  const { ragSettings } = useAppSelector((state) => state.messages);
  const chatBotRef = useRef<HTMLDivElement>(null);
  const sampleQuestions = [
    "What's Jacob's React experience?",
    "Tell me about his education",
    "What are his hobbies?"
  ]

  const handleMessage = async (message: string, conversationHistory?: any[]) => {
    try {
      console.log('Sending message:', message);
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          ragEnabled: true,
          selectedIndexes: ['work', 'school', 'about_me'],
          conversationHistory: conversationHistory || [],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      return {
        content: data.content,
        sources: data.sources || [],
      };
    } catch (error) {
      console.error('Chat error:', error);

      // Fallback to mock response if API fails
      const fallbackResponses = [
        {
          content: "I'm having trouble connecting to the LLM service right now. This is a fallback response. Please check your API configuration or try again later.",
          sources: ["Fallback System"]
        },
        {
          content: "It looks like the LLM API isn't configured yet. To enable real AI responses, please set up your environment variables with an API key.",
          sources: ["System Message"]
        }
      ];

      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
  };

  const scrollToChatBot = () => {
    if (chatBotRef.current) {
      chatBotRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSubmit = async (index: any) => {
    const input = sampleQuestions[index]

    // Scroll to chatbot smoothly
    scrollToChatBot();
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    dispatch(addMessage(userMessage));
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

          response = handleMessage
            ? await handleMessage(contextPrompt)
            : {
              content: `Based on the relevant information I found, here's what I can tell you: ${ragData.relevantDocuments[0]?.document.content.substring(0, 200)}...`,
              sources: ragData.relevantDocuments.map(result => result.document.metadata.title)
            };
        } else {
          response = handleMessage
            ? await handleMessage(input)
            : { content: "I don't have specific information about that topic in my knowledge base. Could you try rephrasing your question?" };
        }
      } else {
        response = handleMessage
          ? await handleMessage(input)
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

  return (
    <div id="home-page" className="min-h-screen">
      <div id="hero-image-desktop" className="hidden lg:block">
        <HeroImage />
      </div>
      <div id="home-content" className="max-w-7xl mx-auto px-6 py-8 relative z-1">
        <div id="hero-image-mobile" className="lg:hidden">
          <HeroImage />
        </div>
        {/* Hero Section */}
        <div id="section-hero" className="text-center mb-12 select-none">
          <div id="hero-title-container" className="floating">
            <h1 id="hero-title" className="text-6xl font-bold text-royal-gradient mb-6">
              Welcome to Jacob&rsquo;s Space 🥷🏻
            </h1>
          </div>
          <p id="hero-subtitle" className="text-2xl mb-6 font-medium font-bold text-royal-gradient">
            Full-Stack Developer & AI Enthusiast
          </p>
          <p id="hero-description" className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Discover my professional journey through an AI-powered experience. Explore my work,
            education, and personal interests with <span id="hero-francesca-link" className="font-bold text-royal-gradient cursor-pointer" onClick={scrollToChatBot}>Francesca</span>, my lovely AI Assistant
          </p>
        </div>

        {/* Mobile: Try These Questions First */}
        <div id="section-questions-mobile" className="mb-12 lg:hidden relative z-3">
          <div id="questions-card-mobile" className="glass-card rounded-2xl p-8 hover-glow">
            <h3 id="questions-title-mobile" className="font-bold mb-8 text-royal-gradient text-2xl text-center">✨ Try These Questions</h3>
            <div id="questions-grid-mobile" className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div id="btn-question-work-mobile" className="glass-card-royal px-6 py-3 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(0)}>
                <div className="text-3xl mb-3">💼</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"What&rsquo;s Jacob&rsquo;s React experience?"</div>
              </div>
              <div id="btn-question-education-mobile" className="glass-card-royal px-6 py-3 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(1)}>
                <div className="text-3xl mb-3">🎓</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"Tells me about his education"</div>
              </div>
              <div id="btn-question-hobbies-mobile" className="glass-card-royal px-6 py-3 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(2)}>
                <div className="text-3xl mb-3">🥷🏻</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"What are his hobbies?"</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div id="section-chatbot" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8  relative z-3" ref={chatBotRef}>
          {/* Main Chatbot */}
          <div id="chatbot-container" className="lg:col-span-2">
            <div id="chatbot-card" className="glass-card rounded-2xl p-2 hover-lift">
              <ChatBot
                onMessage={handleMessage}
                ragEnabled={true}
                documents={["work experience", "education", "personal info"]}
              />
            </div>
          </div>

          {/* Controls */}
          <div id="rag-controls-container" className="space-y-6">
            <div id="rag-controls-card" className="glass-card rounded-2xl p-1 hover-glow">
              <RAGControls />
            </div>
          </div>
        </div>

        {/* Desktop: Try These Questions */}
        <div id="section-questions-desktop" className="mb-12 hidden lg:block relative z-3">
          <div id="questions-card-desktop" className="glass-card rounded-2xl p-8 hover-glow">
            <h3 id="questions-title-desktop" className="font-bold mb-8 text-royal-gradient text-2xl text-center">✨ Try These Questions</h3>
            <div id="questions-grid-desktop" className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div id="btn-question-work-desktop" className="glass-card-royal p-6 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(0)}>
                <div className="text-3xl mb-3">💼</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"What&rsquo;s Jacob&rsquo;s React experience?"</div>
              </div>
              <div id="btn-question-education-desktop" className="glass-card-royal p-6 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(1)}>
                <div className="text-3xl mb-3">🎓</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"Tells me about his education"</div>
              </div>
              <div id="btn-question-hobbies-desktop" className="glass-card-royal p-6 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(2)}>
                <div className="text-3xl mb-3">🥷🏻</div>
                <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>"What are his hobbies?"</div>
              </div>
            </div>
          </div>
        </div>


        {/* Technology Carousel Section */}
      </div>

      <div id="section-divider-1" className="section-divider relative z-3"></div>

      <TechCarousel title="⚙️ Tech Stack" techItems={techStack} subtitle="Professional experience with the following tools and frameworks:" />


      <div id="section-divider-2" className="section-divider relative z-3 mb-24"></div>

      <div id="section-navigation" className="max-w-7xl mx-auto px-6 relative z-3">

        {/* Quick Navigation */}
        <div id="navigation-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-40">
          <div id="nav-card-career" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
            <div id="nav-card-career-header" className="text-center mb-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 id="nav-card-career-title" className="max-md:text-justify text-2xl font-bold text-royal-gradient mb-4">Career</h3>
            </div>
            <p id="nav-card-career-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              Explore my professional journey from small business clients to Fortune 500 companies featuring cutting-edge technologies and AI-first development.
            </p>
            <a
              id="nav-link-career"
              href="/about-work"
              className="btn-royal w-full text-center block py-3"
            >
              Explore Journey →
            </a>
          </div>

          <div id="nav-card-education" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
            <div id="nav-card-education-header" className="text-center mb-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 id="nav-card-education-title" className="max-md:text-justify text-2xl font-bold text-royal-gradient mb-4">Education</h3>
            </div>
            <p id="nav-card-education-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              Discover my Computer Engineering degree and AI research projects, including
              edge computing and neural network implementations.
            </p>
            <a
              id="nav-link-education"
              href="/about-school"
              className="btn-royal w-full text-center block py-3"
            >
              View Studies →
            </a>
          </div>

          <div id="nav-card-about" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
            <div id="nav-card-about-header" className="text-center mb-6">
              <div className="text-4xl mb-4">🥷🏻</div>
              <h3 id="nav-card-about-title" className="max-md:text-justify text-2xl font-bold text-royal-gradient mb-4">About Me</h3>
            </div>
            <p id="nav-card-about-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
              Get to know the person behind the code - my interests, philosophy,
              and what drives my passion for my career as a software engineer in general.

            </p>
            <a
              id="nav-link-about"
              href="/about-me"
              className="btn-royal w-full text-center block py-3"
            >
              Meet Jacob →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
