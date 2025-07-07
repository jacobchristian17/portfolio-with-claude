export default function AboutMe() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">About Me</h1>
          
          {/* Personal Introduction */}
          <div className="mb-8 border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">
              Meet Jacob 🥷🏻
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                I'm Jacob, the developer and publisher of this website/web application. I'm currently 27 years old 
                and passionate about creating innovative solutions that make a positive impact through code.
              </p>
              <p className="text-gray-700 leading-relaxed">
                I'm always eager to learn new technologies and enjoy solving complex problems. 
                I treat code examples like puzzles - there's something deeply satisfying about finding 
                elegant solutions to challenging problems.
              </p>
            </div>
          </div>

          {/* Background & Origins */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">Background & Journey</h2>
            <div className="bg-green-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Origins</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Originally from the City of Cabanatuan, Nueva Ecija, Philippines. My journey took me across 
                    different countries and cities, each contributing to my diverse perspective and adaptability.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-600 mb-2">🏠 Hometown</h4>
                    <p className="text-sm text-gray-700">
                      Cabanatuan, Nueva Ecija
                      <br />
                      <span className="text-gray-500">Where it all began</span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-600 mb-2">🎓 High School</h4>
                    <p className="text-sm text-gray-700">
                      Kuwait
                      <br />
                      <span className="text-gray-500">Junior & Senior years</span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold text-green-600 mb-2">🏛️ University</h4>
                    <p className="text-sm text-gray-700">
                      Mandaluyong, Manila
                      <br />
                      <span className="text-gray-500">Mapua University</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hobbies & Interests */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-purple-600 mb-4">Hobbies & Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-3">🎮 Gaming</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  I enjoy playing video games that involve planning and team coordination like Dota2 and Valorant. 
                  These games help me develop strategic thinking and collaboration skills.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  I also enjoy single-player games like Tetris and puzzles, which complement my love for 
                  problem-solving in programming.
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-3">🏖️ Travel & Photography</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Outside of work, I love going to beaches and exploring different places with my significant other. 
                  There's something refreshing about discovering new locations and cultures.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Photography allows me to capture these moments and see the world from different perspectives, 
                  much like how I approach coding challenges.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Philosophy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">Personal Philosophy</h2>
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧩 Problem-Solving Mindset</h4>
                  <p className="text-gray-700 leading-relaxed">
                    I treat code examples like puzzles - each challenge is an opportunity to learn and grow. 
                    This mindset drives my continuous pursuit of elegant and efficient solutions.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚀 Innovation & Impact</h4>
                  <p className="text-gray-700 leading-relaxed">
                    I'm passionate about creating innovative solutions that make a positive impact. 
                    Whether it's improving user experience or solving complex technical challenges, 
                    I aim to contribute meaningfully to every project.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-400 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📚 Continuous Learning</h4>
                  <p className="text-gray-700 leading-relaxed">
                    I'm always eager to learn new technologies and stay current with industry trends. 
                    The field of technology evolves rapidly, and I embrace this constant evolution as 
                    an opportunity for growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-pink-600 mb-4">Fun Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-pink-800 mb-1">Strategic Gamer</h4>
                <p className="text-sm text-gray-700">Dota2 & Valorant player</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧩</div>
                <h4 className="font-semibold text-pink-800 mb-1">Puzzle Lover</h4>
                <p className="text-sm text-gray-700">Tetris & logic puzzles</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📸</div>
                <h4 className="font-semibold text-pink-800 mb-1">Photography</h4>
                <p className="text-sm text-gray-700">Capturing moments & places</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌍</div>
                <h4 className="font-semibold text-pink-800 mb-1">Traveler</h4>
                <p className="text-sm text-gray-700">Beach lover & explorer</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🔄</div>
                <h4 className="font-semibold text-pink-800 mb-1">Adaptable</h4>
                <p className="text-sm text-gray-700">Philippines → Kuwait → Manila</p>
              </div>
              
              <div className="bg-pink-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💻</div>
                <h4 className="font-semibold text-pink-800 mb-1">Creator</h4>
                <p className="text-sm text-gray-700">Built this portfolio!</p>
              </div>
            </div>
          </div>

          {/* Contact & Connect */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Let's Connect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              I'm always open to discussing new opportunities, collaborating on interesting projects, 
              or simply connecting with fellow developers and tech enthusiasts.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Feel free to explore my work experience and education through the navigation menu, 
              or ask the AI chatbot on the home page about any specific aspects of my background!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}