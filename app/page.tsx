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
import ImpactGrid from "./components/ImpactGrid";
import { useRef } from "react";
import personalInfo from "./data/personal_info.json";

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

  const handleSubmit = async (index: number) => {
    const input = sampleQuestions[index];
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

      if (ragSettings.selectedIndexes.length > 0) {
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

          const contextPrompt = `Context from relevant documents:
  ${ragData.relevantDocuments.map(result =>
            `[${result.document.metadata.category.toUpperCase()}] ${result.document.metadata.title}: ${result.document.content}`
          ).join('\n\n')}
  
  User question: ${input}
  
  Please provide a helpful response based on the context above.`;

          response = await handleMessage(contextPrompt);
        } else {
          response = await handleMessage(input);
        }
      } else {
        response = { content: "Please select at least one knowledge area to get personalized responses about Jacob!" };
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
      console.error(error);
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

        {/* Hero Section - Professional Layout */}
        <div id="section-hero" className="text-center mb-16 select-none">
          {/* Name & Title */}
          <div id="hero-title-container" className="mb-8">
            <h1 id="hero-title" className="text-5xl lg:text-6xl font-bold text-royal-gradient-animated mb-4">
              {personalInfo.name}
            </h1>
            <p id="hero-subtitle" className="text-2xl lg:text-3xl font-semibold text-royal-gradient-animated mb-4">
              {personalInfo.title}
            </p>
            <p id="hero-summary" className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {personalInfo.summary}
            </p>
          </div>

          {/* Business Impact Section */}
          <div id="section-impact" className="max-w-3xl mx-auto mb-12">
            <ImpactGrid items={personalInfo.impact} />
          </div>

          {/* CTA Buttons */}
          <div id="hero-cta" className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              id="btn-ask-francesca"
              onClick={scrollToChatBot}
              className="btn-royal px-8 py-3 rounded-xl font-semibold hover-lift transition-all duration-300"
            >
              💬 Ask Francesca
            </button>
            <a
              id="btn-view-work"
              href="/about-work"
              className="glass-card-royal px-8 py-3 rounded-xl font-semibold hover-lift transition-all duration-300 text-center"
              style={{ color: 'var(--text-primary)' }}
            >
              💼 View Work
            </a>
          </div>
        </div>

      </div>

      {/* Skills Carousel - Full Width */}
      <div id="section-skills-carousel" className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-16 relative z-3">
        <TechCarousel 
          title="⚙️ Tech Stack" 
          techItems={techStack} 
          subtitle="Professional experience with the following tools and frameworks:" 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-1">

        {/* Chatbot Section */}
        <div id="section-chatbot-header" className="text-center mb-8">
          <h2 className="text-3xl font-bold text-royal-gradient mb-2">Meet Francesca</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Ask anything about my experience, skills, or background</p>
        </div>

        {/* Sample Questions */}
        <div id="section-questions" className="mb-8 relative z-3">
          <div id="questions-card" className="glass-card rounded-2xl p-6 lg:p-8 hover-glow">
            <h3 id="questions-title" className="font-bold mb-6 text-royal-gradient text-xl text-center">✨ Try These Questions</h3>
            <div id="questions-grid" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div id="btn-question-work" className="glass-card-royal p-4 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(0)}>
                <div className="text-2xl mb-2">💼</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>&ldquo;What&rsquo;s Jacob&rsquo;s React experience?&rdquo;</div>
              </div>
              <div id="btn-question-education" className="glass-card-royal p-4 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(1)}>
                <div className="text-2xl mb-2">🎓</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>&ldquo;Tell me about his education&rdquo;</div>
              </div>
              <div id="btn-question-hobbies" className="glass-card-royal p-4 rounded-xl text-center font-medium hover-lift cursor-pointer transition-all duration-300" onClick={() => handleSubmit(2)}>
                <div className="text-2xl mb-2">🥷🏻</div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>&ldquo;What are his hobbies?&rdquo;</div>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot */}
        <div id="section-chatbot" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 relative z-3" ref={chatBotRef}>
          <div id="chatbot-container" className="lg:col-span-2">
            <div id="chatbot-card" className="glass-card rounded-2xl p-2 hover-lift">
              <ChatBot
                onMessage={handleMessage}
                ragEnabled={true}
                documents={["work experience", "education", "personal info"]}
              />
            </div>
          </div>
          <div id="rag-controls-container" className="space-y-6">
            <div id="rag-controls-card" className="glass-card rounded-2xl p-1 hover-glow">
              <RAGControls />
            </div>
          </div>
        </div>

        <div id="section-divider" className="section-divider relative z-3 mb-16"></div>

        {/* Quick Navigation */}
        <div id="section-navigation" className="relative z-3">
          <div id="navigation-grid" className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-40">
            <div id="nav-card-career" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
              <div id="nav-card-career-header" className="text-center mb-6">
                <div className="text-4xl mb-4">💼</div>
                <h3 id="nav-card-career-title" className="text-2xl font-bold text-royal-gradient mb-4">Career</h3>
              </div>
              <p id="nav-card-career-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                Explore my professional journey from small business clients to Fortune 500 companies featuring cutting-edge technologies and AI-first development.
              </p>
              <a id="nav-link-career" href="/about-work" className="btn-royal w-full text-center block py-3">
                Explore Journey →
              </a>
            </div>

            <div id="nav-card-education" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
              <div id="nav-card-education-header" className="text-center mb-6">
                <div className="text-4xl mb-4">🎓</div>
                <h3 id="nav-card-education-title" className="text-2xl font-bold text-royal-gradient mb-4">Education</h3>
              </div>
              <p id="nav-card-education-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                Discover my Computer Engineering degree and AI research projects, including edge computing and neural network implementations.
              </p>
              <a id="nav-link-education" href="/about-school" className="btn-royal w-full text-center block py-3">
                View Studies →
              </a>
            </div>

            <div id="nav-card-about" className="glass-card rounded-2xl p-4 lg:p-8 hover-lift border-royal-gradient">
              <div id="nav-card-about-header" className="text-center mb-6">
                <div className="text-4xl mb-4">🥷🏻</div>
                <h3 id="nav-card-about-title" className="text-2xl font-bold text-royal-gradient mb-4">About Me</h3>
              </div>
              <p id="nav-card-about-desc" className="mb-6 leading-relaxed italic" style={{ color: 'var(--text-secondary)' }}>
                Get to know the person behind the code - my interests, philosophy, and what drives my passion for software engineering.
              </p>
              <a id="nav-link-about" href="/about-me" className="btn-royal w-full text-center block py-3">
                Meet Jacob →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
