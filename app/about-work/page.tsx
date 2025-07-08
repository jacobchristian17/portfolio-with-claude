import HeroImage from "../components/HeroImage"

export default function AboutWork() {
  return (
    <div className="min-h-screen p-6" style={{ background: 'linear-gradient(135deg, var(--warm-gray) 0%, var(--cream) 100%)' }}>
      <HeroImage/>
      <div className="max-w-4xl mx-auto backdrop-blur-[1px] relative z-3">
        <div className="glass-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>Work Experience</h1>

          {/* Current Position */}
          <div className="mb-8 border-l-4 border-yellow-500 pl-6">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-4">
              Current Position
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-card-primary)' }}>
                IA/UX Developer (Server-side Frontend)
              </h3>
              <p className="mb-3" style={{ color: 'var(--text-card-tertiary)' }}>77 Global Services Inc. | August 2024 - Present</p>
              <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                Working with a Fortune 500 company, a long-standing client of 77 Global Services Inc.
                I developed and shipped new features for a Chatbot, contributed to updates from legacy systems
                that include dynamic configuration and reusable Frontend components. I work side-by-side with
                ML Engineers, lead code reviews, and contribute to automated end-to-end testing.
                Technologies used include React with Next.js, Redux, Jenkins, and AWS for pipeline deployments.
              </p>
            </div>
          </div>

          {/* Previous Roles */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4" style={{ color: 'var(--text-primary)' }}>Previous Roles</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-card-primary)' }}>
                  Frontend Developer
                </h3>
                <p className="mb-3" style={{ color: 'var(--text-card-tertiary)' }}>GHD | May 2023 - August 2024</p>
                <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                  Worked as a UI/UX Developer for GHD as a direct full-time software developer.
                  Developed cross-platform components for Content Management System, visible on the company website
                  https://ghd.com. Collaborated with UI/UX Designers in the Global Team, worked with QA for test suites
                  and automated end-to-end and unit testing, resolved feature defects, led pull requests and code reviews.
                  Also developed a Forms Validation/Submission Application (H&SE) in Angular/Ionic and improved existing
                  features while contributing to upgrade the Angular core from v12 to v18.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-card-primary)' }}>
                  MERN Stack Developer (Fullstack)
                </h3>
                <p className="mb-3" style={{ color: 'var(--text-card-tertiary)' }}>Vertere Global Solutions Inc. | June 2022 - April 2023</p>
                <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                  Full stack developer with Megawide Construction Corp., a client of Vertere Global Solutions Inc.
                  Worked with legacy React class-component applications, delivered optimizations and new features,
                  improved backend performance and data consistency with MongoDB. Spearheaded publishing the web app
                  from client&rsquo;s local servers to cloud with Linux, Docker, Nginx, and Microsoft Azure. Maintained
                  legacy databases, developed manual pipelines, updated features for Annual Stock Holder Meetings,
                  maintained Profit & Loss Dashboard, and developed a 360-degree Survey System from conception to publishing.
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-medium mb-2" style={{ color: 'var(--text-card-primary)' }}>
                  Full Stack Developer (Freelance)
                </h3>
                <p className="mb-3" style={{ color: 'var(--text-card-tertiary)' }}>March 2020 - April 2022</p>
                <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                  Started as a full stack developer in freelance years, developed and published websites,
                  applications, and mockups for clients, and provided live code tutoring.
                </p>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Core Technical Skills</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-card-primary)' }}>
                Proficient in modern web technologies including React, Next.js, Redux, TypeScript, Node.js, Express,
                Docker, and Git. Experience in working on Microservices for CI/CD Pipelines with Microsoft Azure,
                AWS, Jenkins, and remote repositories like Microsoft Azure Repository, Bitbucket, and GitLab.
              </p>
              <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                Experience with agile methodologies with scrum masters, business analysts, and product owners.
                SDLC includes Jira with Gitbucket for ticketing and resolve system. Has experience working with
                development teams, leading pull requests and resolving merge conflicts at command terminal level
                with Git for production-grade code versioning.
              </p>
            </div>
          </div>

          {/* AI and Modern Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>AI-First Development</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                Currently using Generative and Agentic AI tools for augmented development through prompt engineering
                to ship new features faster, deliver maintainable and scalable code, and improve overall software
                engineering and critical thinking skills. Tools include OpenAI, Groq, and Claude Code.
                Continuously improving to be an AI-First Software Developer that can ship features faster,
                tackle more complex tasks, and solve better problems with accuracy without compromising scalability.
              </p>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Soft Skills</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
                Can work with colleagues or alone, finish deliverables at or before the expected time.
                Listen to people and take criticism without prejudice, understanding that all of this is just part of work.
                I enjoy working with like-minded people who work at their best to beat the market.
                I enjoy spending time with my colleagues on and off work, and am open to knowing them on a personal level.
              </p>
            </div>
          </div>

          {/* Certifications */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-4">Certifications & Training</h2>
            <div className="bg-orange-50 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-card-primary)' }}>Certified Lean Six Sigma White Belt</h4>
                  <p style={{ color: 'var(--text-card-secondary)' }}>Six Sigma PH | February 2025</p>
                  <p className="text-sm" style={{ color: 'var(--text-card-tertiary)' }}>Reference: https://sixsigma.freshlearn.com/certificate/1556969</p>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-card-primary)' }}>Basics of UI Design</h4>
                  <p style={{ color: 'var(--text-card-secondary)' }}>Cambridge International Qualifications, UK | February 2025</p>
                  <p className="text-sm" style={{ color: 'var(--text-card-tertiary)' }}>Reference: https://uniathena.com/verify/certificate?certID=1370-7221-9127</p>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-card-primary)' }}>Odoo v14 Software Development Training & Ionic Mobile Application Development</h4>
                  <p style={{ color: 'var(--text-card-secondary)' }}>Megawide Construction Corp. | December 2023</p>
                  <p className="text-sm" style={{ color: 'var(--text-card-tertiary)' }}>Conducted by Candidoskie P. Berdin II, Senior IT Manager</p>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-card-primary)' }}>Google Cloud Big Data and Machine Learning Fundamentals</h4>
                  <p style={{ color: 'var(--text-card-secondary)' }}>Google Cloud | August 2020 | Grade: 97.30%</p>
                  <p className="text-sm" style={{ color: 'var(--text-card-tertiary)' }}>Reference: https://coursera.org/verify/UUQXGLPDM3VJ2019-2022</p>
                </div>
                <div>
                  <h4 className="font-semibold" style={{ color: 'var(--text-card-primary)' }}>Introduction to TensorFlow for AI, ML, and Deep Learning</h4>
                  <p style={{ color: 'var(--text-card-secondary)' }}>Deeplearning.AI | August 2020 | Grade: 97.82%</p>
                  <p className="text-sm" style={{ color: 'var(--text-card-tertiary)' }}>Reference: https://coursera.org/verify/FFHG8BC72NKZ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Journey Summary */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-card-primary)' }}>Professional Journey</h2>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--text-card-primary)' }}>
              From freelance beginnings to Fortune 500 companies, my career has been driven by continuous learning
              and innovation. I&rsquo;ve evolved from traditional full-stack development to AI-first approaches,
              always focusing on delivering scalable solutions and maintainable code.
            </p>
            <p className="leading-relaxed" style={{ color: 'var(--text-card-secondary)' }}>
              My experience spans various industries and team sizes, giving me adaptability and a comprehensive
              understanding of software development lifecycle. I&rsquo;m passionate about staying at the forefront of
              technology while maintaining strong collaborative relationships with colleagues and stakeholders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}