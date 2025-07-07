export default function AboutSchool() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-6">Education</h1>
          
          {/* Education Overview */}
          <div className="mb-8 border-l-4 border-orange-600 pl-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Bachelor of Science in Computer Engineering
            </h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Mapua University, Manila, Philippines
              </h3>
              <p className="text-gray-600 mb-3">Graduated: 2022</p>
              <p className="text-gray-700 leading-relaxed">
                Completed a comprehensive Computer Engineering program with a focus on .NET5 Fullstack Technology. 
                The curriculum included extensive coursework in algorithms, data structures, database systems, 
                software engineering, and machine learning principles.
              </p>
            </div>
          </div>

          {/* Thesis Project */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Senior Thesis Project</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                "Determination of Driver's Alertness Based on Eye State with Edge Computing"
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Project Overview</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Applied AI-powered Face and Motion detection to an ARM64 device as an edge computing agent. 
                    The system analyzes real-time camera feed input to detect and conclude the state of a person's eyes. 
                    The practical application focuses on drowsiness detection using eye state analysis.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Technical Implementation</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-medium text-gray-800 mb-2">Algorithms Used</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Convolutional Neural Networks (CNN)</li>
                        <li>• Deep Learning techniques</li>
                        <li>• Sigmoid Classification</li>
                        <li>• Real-time image processing</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded border">
                      <h5 className="font-medium text-gray-800 mb-2">Technologies</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• ARM64 edge computing device</li>
                        <li>• Computer vision libraries</li>
                        <li>• Machine learning frameworks</li>
                        <li>• Real-time video processing</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Impact & Applications</h4>
                  <p className="text-gray-700 leading-relaxed">
                    This project demonstrated practical applications of AI in safety systems, particularly for 
                    preventing accidents caused by driver drowsiness. The edge computing approach ensured 
                    real-time processing without relying on cloud connectivity, making it suitable for 
                    automotive applications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Coursework */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">Key Coursework</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-800 mb-3">Core Computer Engineering</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Data Structures & Algorithms</li>
                  <li>• Database Systems Design</li>
                  <li>• Software Engineering Principles</li>
                  <li>• Computer Architecture</li>
                  <li>• Operating Systems</li>
                  <li>• Network Programming</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-6">
                <h3 className="font-semibold text-orange-800 mb-3">AI & Machine Learning</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Machine Learning Fundamentals</li>
                  <li>• Artificial Intelligence</li>
                  <li>• Computer Vision</li>
                  <li>• Neural Networks</li>
                  <li>• Pattern Recognition</li>
                  <li>• Image Processing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Academic Specialization */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-orange-600 mb-4">Academic Specialization</h2>
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-medium text-gray-800 mb-3">
                .NET5 Fullstack Technology Focus
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Specialized in Microsoft's .NET5 ecosystem for full-stack development, gaining comprehensive 
                knowledge in both frontend and backend technologies within the Microsoft technology stack.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-orange-600 mb-2">Frontend</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• ASP.NET Core MVC</li>
                    <li>• Razor Pages</li>
                    <li>• JavaScript/TypeScript</li>
                    <li>• CSS/Bootstrap</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-orange-600 mb-2">Backend</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• C# Programming</li>
                    <li>• ASP.NET Core Web API</li>
                    <li>• Entity Framework</li>
                    <li>• SQL Server</li>
                  </ul>
                </div>
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-orange-600 mb-2">Tools & Deployment</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Visual Studio</li>
                    <li>• Azure DevOps</li>
                    <li>• IIS Deployment</li>
                    <li>• Git Version Control</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Journey */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Academic Journey</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h4 className="font-semibold text-gray-800">Research & Development Focus</h4>
                <p className="text-gray-700">
                  Throughout my studies, I maintained a strong focus on research and practical application of 
                  theoretical concepts, culminating in the successful completion of an AI-driven thesis project 
                  that bridges computer vision and edge computing.
                </p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-4">
                <h4 className="font-semibold text-gray-800">Hands-on Learning</h4>
                <p className="text-gray-700">
                  The program emphasized practical implementation alongside theoretical learning, providing 
                  extensive lab work and project-based assignments that prepared me for real-world software 
                  development challenges.
                </p>
              </div>
              
              <div className="border-l-4 border-purple-400 pl-4">
                <h4 className="font-semibold text-gray-800">Technology Integration</h4>
                <p className="text-gray-700">
                  Gained experience integrating various technologies and platforms, from low-level hardware 
                  programming to high-level application development, providing a comprehensive understanding 
                  of the full technology stack.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}