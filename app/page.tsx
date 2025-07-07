"use client";
import ChatBot from "./components/ChatBot";
import RAGControls from "./components/RAGControls";

export default function Home() {
  const handleMessage = async (message: string) => {
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="floating">
            <h1 className="text-6xl font-bold text-royal-gradient mb-6">
              Welcome to Jacob's Space 🥷🏻
            </h1>
          </div>
          <p className="text-2xl text-gray-700 mb-6 font-medium">
            Full-Stack Developer & AI Enthusiast
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover my professional journey through an AI-powered experience. Ask me anything about my work, 
            education, or personal interests using the intelligent chatbot below.
          </p>
        </div>

        {/* Logo Carousel Section */}
        <div className="mb-12 overflow-hidden glass-card rounded-2xl p-6">
          <h3 className="text-center text-xl font-semibold text-gray-700 mb-6">Technologies & Tools I Love</h3>
          <div className="relative h-16">
            <div className="logo-carousel flex items-center space-x-8 whitespace-nowrap">
              <div className="flex items-center space-x-8">
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">React</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">Next.js</span>
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">TypeScript</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">Node.js</span>
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">Docker</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">AWS</span>
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">Redux</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">MongoDB</span>
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">Angular</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">Jenkins</span>
                <span className="px-6 py-2 bg-royal-gradient text-white rounded-full text-sm font-semibold">AI/ML</span>
                <span className="px-6 py-2 bg-gold-gradient text-white rounded-full text-sm font-semibold">Claude Code</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          {/* Main Chatbot */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-2 hover-lift">
              <ChatBot 
                onMessage={handleMessage}
                ragEnabled={true}
                documents={["work experience", "education", "personal info"]}
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="space-y-6">
            <div className="glass-card-royal rounded-2xl p-1 hover-glow">
              <RAGControls />
            </div>
            
            <div className="glass-card-gold rounded-2xl p-6 hover-glow">
              <h3 className="font-bold mb-4 text-gray-800 text-lg">✨ Try These Questions</h3>
              <div className="space-y-3 text-sm">
                <div className="glass-card p-3 rounded-lg text-blue-800 font-medium hover-lift cursor-pointer">
                  "What's Jacob's React experience?"
                </div>
                <div className="glass-card p-3 rounded-lg text-green-800 font-medium hover-lift cursor-pointer">
                  "Tell me about his education"
                </div>
                <div className="glass-card p-3 rounded-lg text-purple-800 font-medium hover-lift cursor-pointer">
                  "What are his hobbies?"
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-2xl p-8 hover-lift border-royal-gradient">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">💼</div>
              <h3 className="text-2xl font-bold text-royal-gradient mb-4">Work Experience</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Explore my professional journey from Fortune 500 companies to innovative startups, 
              featuring cutting-edge technologies and AI-first development.
            </p>
            <a 
              href="/about-work" 
              className="btn-royal w-full text-center block"
            >
              Explore Journey →
            </a>
          </div>

          <div className="glass-card rounded-2xl p-8 hover-lift border-royal-gradient">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-2xl font-bold text-royal-gradient mb-4">Education</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Discover my Computer Engineering degree and AI research projects, including 
              edge computing and neural network implementations.
            </p>
            <a 
              href="/about-school" 
              className="btn-gold w-full text-center block"
            >
              View Studies →
            </a>
          </div>

          <div className="glass-card rounded-2xl p-8 hover-lift border-royal-gradient">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🥷🏻</div>
              <h3 className="text-2xl font-bold text-royal-gradient mb-4">About Me</h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Get to know the person behind the code - my interests, philosophy, 
              and what drives my passion for creating innovative solutions.
            </p>
            <a 
              href="/about-me" 
              className="btn-royal w-full text-center block"
            >
              Meet Jacob →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
