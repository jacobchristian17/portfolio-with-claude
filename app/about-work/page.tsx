export default function AboutWork() {
  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="glass-card rounded-2xl shadow-royal p-8">
          <h1 className="text-4xl font-bold text-royal-gradient mb-8 text-center">💼 Work Experience</h1>
          
          {/* Current Position */}
          <div className="mb-8 border-l-4 border-blue-500 pl-6">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">
              Current Position
            </h2>
            <h3 className="text-xl font-medium text-gray-800 mb-2">
              IA/UX Developer (Server-side Frontend)
            </h3>
            <p className="text-gray-600 mb-2">77 Global Services Inc. | August 2024 - Present</p>
            <p className="text-gray-700 leading-relaxed">
              Working with a Fortune 500 company, a long-standing client of 77 Global Services Inc. 
              I developed and shipped new features for a Chatbot, contributed to updates from legacy systems 
              that include dynamic configuration and reusable Frontend components. I work side-by-side with 
              ML Engineers, lead code reviews, and contribute to automated end-to-end testing. 
              Technologies used include React with Next.js, Redux, Jenkins, and AWS for pipeline deployments.
            </p>
          </div>

          {/* Previous Roles */}
          <div className="space-y-8">
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Frontend Developer
              </h3>
              <p className="text-gray-600 mb-2">GHD | May 2023 - August 2024</p>
              <p className="text-gray-700 leading-relaxed">
                Worked as a UI/UX Developer for GHD as a direct full-time software developer. 
                Developed cross-platform components for Content Management System, visible on the company website 
                https://ghd.com. Collaborated with UI/UX Designers in the Global Team, worked with QA for test suites 
                and automated end-to-end and unit testing, resolved feature defects, led pull requests and code reviews. 
                Also developed a Forms Validation/Submission Application (H&SE) in Angular/Ionic and improved existing 
                features while contributing to upgrade the Angular core from v12 to v18.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                MERN Stack Developer (Fullstack)
              </h3>
              <p className="text-gray-600 mb-2">Vertere Global Solutions Inc. | June 2022 - April 2023</p>
              <p className="text-gray-700 leading-relaxed">
                Full stack developer with Megawide Construction Corp., a client of Vertere Global Solutions Inc. 
                Worked with legacy React class-component applications, delivered optimizations and new features, 
                improved backend performance and data consistency with MongoDB. Spearheaded publishing the web app 
                from client's local servers to cloud with Linux, Docker, Nginx, and Microsoft Azure. Maintained 
                legacy databases, developed manual pipelines, updated features for Annual Stock Holder Meetings, 
                maintained Profit & Loss Dashboard, and developed a 360-degree Survey System from conception to publishing.
              </p>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Full Stack Developer (Freelance)
              </h3>
              <p className="text-gray-600 mb-2">March 2020 - April 2022</p>
              <p className="text-gray-700 leading-relaxed">
                Started as a full stack developer in freelance years, developed and published websites, 
                applications, and mockups for clients, and provided live code tutoring.
              </p>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="mt-10 bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Core Technical Skills</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Proficient in modern web technologies including React, Next.js, Redux, TypeScript, Node.js, Express, 
              Docker, and Git. Experience in working on Microservices for CI/CD Pipelines with Microsoft Azure, 
              AWS, Jenkins, and remote repositories like Microsoft Azure Repository, Bitbucket, and GitLab.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Experience with agile methodologies with scrum masters, business analysts, and product owners. 
              SDLC includes Jira with Gitbucket for ticketing and resolve system. Has experience working with 
              development teams, leading pull requests and resolving merge conflicts at command terminal level 
              with Git for production-grade code versioning.
            </p>
          </div>

          {/* AI and Modern Skills */}
          <div className="mt-6 bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-blue-800 mb-4">AI-First Development</h2>
            <p className="text-gray-700 leading-relaxed">
              Currently using Generative and Agentic AI tools for augmented development through prompt engineering 
              to ship new features faster, deliver maintainable and scalable code, and improve overall software 
              engineering and critical thinking skills. Tools include OpenAI, Groq, and Claude Code. 
              Continuously improving to be an AI-First Software Developer that can ship features faster, 
              tackle more complex tasks, and solve better problems with accuracy without compromising scalability.
            </p>
          </div>

          {/* Soft Skills */}
          <div className="mt-6 bg-green-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-green-800 mb-4">Soft Skills</h2>
            <p className="text-gray-700 leading-relaxed">
              Can work with colleagues or alone, finish deliverables at or before the expected time. 
              Listen to people and take criticism without prejudice, understanding that all of this is just part of work. 
              I enjoy working with like-minded people who work at their best to beat the market. 
              I enjoy spending time with my colleagues on and off work, and am open to knowing them on a personal level.
            </p>
          </div>

          {/* Certifications */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-yellow-800 mb-4">Certifications & Training</h2>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold">Certified Lean Six Sigma White Belt</h4>
                <p className="text-gray-600">Six Sigma PH | February 2025</p>
                <p className="text-sm text-gray-500">Reference: https://sixsigma.freshlearn.com/certificate/1556969</p>
              </div>
              <div>
                <h4 className="font-semibold">Basics of UI Design</h4>
                <p className="text-gray-600">Cambridge International Qualifications, UK | February 2025</p>
                <p className="text-sm text-gray-500">Reference: https://uniathena.com/verify/certificate?certID=1370-7221-9127</p>
              </div>
              <div>
                <h4 className="font-semibold">Odoo v14 Software Development Training & Ionic Mobile Application Development</h4>
                <p className="text-gray-600">Megawide Construction Corp. | December 2023</p>
                <p className="text-sm text-gray-500">Conducted by Candidoskie P. Berdin II, Senior IT Manager</p>
              </div>
              <div>
                <h4 className="font-semibold">Google Cloud Big Data and Machine Learning Fundamentals</h4>
                <p className="text-gray-600">Google Cloud | August 2020 | Grade: 97.30%</p>
                <p className="text-sm text-gray-500">Reference: https://coursera.org/verify/UUQXGLPDM3VJ2019-2022</p>
              </div>
              <div>
                <h4 className="font-semibold">Introduction to TensorFlow for AI, ML, and Deep Learning</h4>
                <p className="text-gray-600">Deeplearning.AI | August 2020 | Grade: 97.82%</p>
                <p className="text-sm text-gray-500">Reference: https://coursera.org/verify/FFHG8BC72NKZ</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}