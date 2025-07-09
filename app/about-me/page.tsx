"use client";
import HeroImage from "../components/HeroImage"
import { useAppSelector } from "../store/hooks";

export default function AboutMe() {
  const { isDarkMode } = useAppSelector((state) => state.theme);
  const themePrefix = {
    bgPrimary: isDarkMode ? "bg-black/50" : "bg-white/30",
    borderColor: isDarkMode ? "border-blue-200" : "border-blue-900"
  }
  return (
    <div className="min-h-screen p-6" >
      <HeroImage />
      <div className="max-w-4xl mx-auto backdrop-blur-[1px] relative z-3">
        <div className={"glass-card rounded-lg shadow-lg p-4 md:p-8"}>
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>About Me</h1>

          {/* Personal Introduction */}
          <div className="mb-8 border-l-4 pl-2 md:pl-6" style={{ borderColor: 'var(--text-secondary)' }}>
            <h2 className="text-2xl font-semibold mb-1 md:mb-4" style={{ color: 'var(--text-secondary)' }}>
              Meet Jacob 🥷🏻
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="leading-relaxed md:text-justify mb-4" style={{ color: 'var(--text-card-primary)' }}>
                — I&rsquo;m Jacob, the developer and publisher of this site. I&rsquo;m currently 27 years old
                and passionate about creating something! <br /><br /><span className="max-md:flex max-md:flex-col leading-tlg:ight justify-center w-full italic"><img className="w-24 h-full" src="https://www.icegif.com/wp-content/uploads/2023/05/icegif-771.gif" alt="funny jif"/></span><span className="italic leading-none">I express my self through music, arts, and video games. Typical nerd stuff</span>
              </p>
              {/* <div className="lg:flex justify-center w-full"><div className="section-divider relative z-3 about-me"></div></div>
              <br /> */}
              <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                — In my journey as a software engineer for more than 5 years, I learned that being stagnant is a thing of the past; living without improving takes the fun out of life for me. I&rsquo;m eager to learn new technologies and enjoy solving complex problems.
                I look at software engineering like a very big puzzle - there&rsquo;s something deeply satisfying about finding
                elegant solutions to challenging problems!
              </p>
              <br />
            </div>
          </div>

          {/* Background & Origins */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ borderColor: 'var(--text-secondary)' }}>Background & Journey</h2>
            <div className="bg-yellow-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">Origins</h3>
                  <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                    Originally from the City of Cabanatuan, Nueva Ecija, Philippines. My journey took me across
                    different countries and cities, each contributing to my diverse perspective and adaptability.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-card-primary)' }}>🏠 Hometown</h4>
                    <p className="text-sm" style={{ color: 'var(--text-card-secondary)' }}>
                      Cabanatuan, Nueva Ecija (PH)
                      <br />
                      <span className="text-gray-500">Where it all began</span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-card-primary)' }}>🎓 High School</h4>
                    <p className="text-sm" style={{ color: 'var(--text-card-secondary)' }}>
                      Kuwait (KW)
                      <br />
                      <span className="text-gray-500">Junior & Senior years</span>
                    </p>
                  </div>
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-semibold mb-2" style={{ color: 'var(--text-card-primary)' }}>🏛️ University</h4>
                    <p className="text-sm" style={{ color: 'var(--text-card-secondary)' }}>
                      Manila, NCR (PH)
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
            <h2 className="text-2xl font-semibold mb-4" style={{ borderColor: 'var(--text-secondary)' }}>Hobbies & Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">🎮 Gaming</h3>
                <p className="leading-relaxed md:text-justify mb-3" style={{ color: 'var(--text-card-primary)' }}>
                  I enjoy playing video games that involve planning and team coordination like Dota2 and Valorant.
                  These games help me develop strategic thinking and collaboration skills.
                </p>
                <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                  I also enjoy single-player games like Tetris and puzzles, which complement my love for
                  problem-solving in programming.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3">🏖️ Travel & Photography</h3>
                <p className="leading-relaxed md:text-justify mb-3" style={{ color: 'var(--text-card-primary)' }}>
                  Outside of work, I love going to beaches and exploring different places with my significant other.
                  There&rsquo;s something refreshing about discovering new locations and cultures.
                </p>
                <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                  Photography allows me to capture these moments and see the world from different perspectives,
                  much like how I approach coding challenges.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Philosophy */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text mb-4" style={{ borderColor: 'var(--text-secondary)' }}>Personal Philosophy</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🧩 Problem-Solving Mindset</h4>
                  <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                    I treat code examples like puzzles - each challenge is an opportunity to learn and grow.
                    This mindset drives my continuous pursuit of elegant and efficient solutions.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">🚀 Innovation & Impact</h4>
                  <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                    I&rsquo;m passionate about creating innovative solutions that make a positive impact.
                    Whether it&rsquo;s improving user experience or solving complex technical challenges,
                    I aim to contribute meaningfully to every project.
                  </p>
                </div>

                <div className="border-l-4 border-blue-900 pl-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📚 Continuous Learning</h4>
                  <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
                    I&rsquo;m always eager to learn new technologies and stay current with industry trends.
                    The field of technology evolves rapidly, and I embrace this constant evolution as
                    an opportunity for growth.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ borderColor: 'var(--text-secondary)' }}>Fun Facts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🎯</div>
                <h4 className="font-semibold text-blue-800 mb-1">Strategic Gamer</h4>
                <p className="text-sm" style={{ color: 'var(--text-card-primary)' }}>Dota2 & Valorant player</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🧩</div>
                <h4 className="font-semibold text-blue-800 mb-1">Puzzle Lover</h4>
                <p className="text-sm" style={{ color: 'var(--text-card-primary)' }}>Tetris & logic puzzles</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">📸</div>
                <h4 className="font-semibold text-blue-800 mb-1">Photography</h4>
                <p className="text-sm" style={{ color: 'var(--text-card-primary)' }}>Capturing moments & places</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">🌍</div>
                <h4 className="font-semibold text-blue-800 mb-1">Traveler</h4>
                <p className="text-sm" style={{ color: 'var(--text-card-primary)' }}>Beach lover & explorer</p>
              </div>


              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl mb-2">💻</div>
                <h4 className="font-semibold text-blue-800 mb-1">Creator</h4>
                <p className="text-sm" style={{ color: 'var(--text-card-primary)' }}>Built this portfolio!</p>
              </div>
            </div>
          </div>

          {/* Contact & Connect */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other notes</h2>
            <p className="leading-relaxed md:text-justify mb-4" style={{ color: 'var(--text-card-primary)' }}>
              I would love to hear from you! 🫵🏻 Reach me out for collaborating on interesting projects, connecting with fellow developers and tech enthusiasts.
            </p>
            <p className="leading-relaxed md:text-justify" style={{ color: 'var(--text-card-primary)' }}>
              Feel free to explore my work, which will be published publicly on Github! You can know more about my experience and education through the menu or you can ask 🤖 Francesca yourself!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}