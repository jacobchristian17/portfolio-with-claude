export interface Document {
  id: string;
  content: string;
  metadata: {
    title: string;
    category: 'work' | 'school' | 'about_me';
    tags: string[];
    source: string;
  };
  embedding?: number[];
}

export interface SearchResult {
  document: Document;
  similarity: number;
}

export interface RAGContext {
  query: string;
  relevantDocuments: SearchResult[];
  selectedIndexes: ('work' | 'school' | 'about_me')[];
}

class RAGService {
  private documents: Document[] = [];
  private initialized = false;
  private personalInfo = {};

  constructor() {
    this.initializeIndexes();
  }

  private initializeIndexes() {
    if (this.initialized) return;

    this.personalInfo = {
      "personal_info": {
        "name": "Jacob Christian P. Guanzing",
        "job_title": "Full Stack & AI Integration Engineer",
        "address_line": {
          "street": "69 Coronado St.,",
          "barangay": "Hulo",
          "city": "Mandaluyong",
          "country": "Philippines",
          "zip": "1550"
        },
        "mobile": "+639673802998",
        "email": "jcpguanzing@gmail.com",
        "website": {
          "url": "https://jacobs-space.vercel.app",
          "text": "jacobs-space.vercel.app"
        },
        "linkedin": {
          "url": "https://www.linkedin.com/in/jcpguanzing/",
          "text": "linkedin.com/in/jcpguanzing",
          "icon_url": "https://logospng.org/download/linkedin/logo-linkedin-icon-4096.png"
        }
      },
      "work_info": {
        "summary": "Software Engineer with '5+ years' of experience building fast-moving, AI-driven web applications for global enterprises and cross-border teams. Specialized in shipping scalable React + Next.js platforms with integrated ML/AI features, modern UI/UX, and rapid deployment pipelines (AWS, Azure). Proven ability to deliver features from concept to launch, collaborate async across time zones, and iterate quickly in product environments.",
        "experience": [
          {
            "role": "AI/UX Developer",
            "company": "Seven Seven Global Services Inc.",
            "location": "(US F500C) — Pasig, NCR",
            "period": "Aug 2024 - Aug 2025",
            "features": [
              "Shipped '1 GenAI/ RAG Chatbot & 20+ UI features' to a proprietary platform app used by individuals and teams worldwide",
              "Integrated '4 frontend APIs' in response to proprietary LLM secure endpoint access",
              "Collaborated with 5+ ML Engineers & Data Scientists to deploy LLM solutions",
              "Collaborated with 3+ UX designers for frontend design & implementation",
              "Implemented '20+ automated UI testing suites' with Playwright, 'reducing QA cycles by 70%'",
              "Participated in code reviews maintaining '>90% code quality standards'"
            ]
          },
          {
            "role": "UI/UX Developer",
            "company": "GHD Pty, Ltd.",
            "location": "(AU/CA) — Makati, NCR",
            "period": "May 2023 - Aug 2024",
            "features": [
              "Built '30+ CMS frontend components' improving usability of content authors for company website management",
              "'Led Angular Ionic upgrade from v12 to v18' for cross-platform Health & Safety mobile app for iOS and Android users",
              "Developed '4+ reusable components' with React memoization, 'improving loading performance by 30%'",
              "Implemented '10+ automated testing' with Selenium, 'reducing manual testing cycles by 50%'"
            ]
          },
          {
            "role": "MERN Stack Developer",
            "company": "Vertere Global Solutions Inc.",
            "location": "San Juan, NCR",
            "period": "June 2022 - April 2023",
            "features": [
              "Developed 'Check Request System' for five different HQs, processing 500+ transactions each per month for liquidation, cheque processing, and cash advances",
              "'Profit & Loss Dashboard' for Finance dept., used for expense management",
              "Deployed '4 production applications' using Docker containerization and Azure cloud infrastructure",
              "Implemented HTTPS security protocols and maintained Linux-based server instances with '99.9% uptime'"
            ]
          },
          {
            "role": "Full Stack Developer",
            "company": "Freelance Clients",
            "location": "(GL) — Mandaluyong, NCR",
            "period": "March 2020 - April 2022",
            "features": [
              "Delivered '4+ e-commerce websites' with modern parallax design with SEO",
              "Published with '72.5% On-page' score for Accelerate International Logistics",
              "Provided live coding tutorials to US-based clients",
              "Built tutorial platform user management system for academic institution"
            ]
          }
        ],
        "skills": {
          "hard_skills": [
            {
              "category": "Frontend Tools",
              "skill_list": [
                "React Native",
                "Redux",
                "Angular",
                "Ionic",
                "HTML5",
                "Tailwind CSS 3",
                ".NET",
                "JavaScript ES6",
                "TypeScript",
                "NextJS",
                "GraphQL",
                "jQuery",
                "Bootstrap",
                "SASS",
                "SCSS"
              ]
            },
            {
              "category": "Frontend Concepts",
              "skill_list": [
                "User Interfaces",
                "User Experience",
                "API Integration",
                "TDD",
                "Test-Driven Development",
                "Responsive Design",
                "Data visualization",
                "Product development",
                "Microservices",
                "Unit testing"
              ]
            },
            {
              "category": "Backend",
              "skill_list": [
                "Python Django",
                "Node",
                "Express.js",
                "REST API",
                "Websocket",
                "Database",
                "MongoDB",
                "SQL Server",
                "MySQL",
                "PostgreSQL"
              ]
            },
            {
              "category": "Cloud & DevOps",
              "skill_list": [
                "AWS EC2 S3 Lambda",
                "Microsoft Azure",
                "Firebase",
                "Docker",
                "NGINX",
                "Linux",
                "CI/CD",
                "HTTPS",
                "OAuth 2.0",
                "Jenkins",
                "Serverless"
              ]
            },
            {
              "category": "Agile",
              "skill_list": [
                "Confluence",
                "Jira",
                "Scrum",
                "Kanban"
              ]
            },
            {
              "category": "Tools",
              "skill_list": [
                "Git version control",
                "GitHub",
                "GitLab",
                "BitBucket",
                "Figma",
                "Storybook",
                "Playwright",
                "Cypress",
                "Jest"
              ]
            },
            {
              "category": "Software Engineering",
              "skill_list": [
                "Data Structure Algorithms",
                "Design software",
                "Design Systems",
                "Design Patterns",
                "Troubleshooting",
                "Best practices",
                "Feasibility study"
              ]
            }
          ],
          "soft_skills": [
            {
              "category": "Leadership",
              "skill_list": [
                "Cross-functional team collaboration",
                "Code review leadership",
                "Technical ownership",
                "Leading colleagues"
              ]
            },
            {
              "category": "Communication",
              "skill_list": [
                "Business requirements gathering",
                "Technical documentation",
                "Stakeholder engagement",
                "Technical specifications",
                "Team mentorship",
                "Collaboration skills"
              ]
            },
            {
              "category": "Problem Solving",
              "skill_list": [
                "Algorithm design",
                "Strong analytics",
                "Logic visualization",
                "Debugging",
                "Research",
                "Automation"
              ]
            },
            {
              "category": "Project Management",
              "skill_list": [
                "Agile methodologies",
                "Sprint planning",
                "Time management",
                "SDLC",
                "Design and development"
              ]
            },
            {
              "category": "Work Ethics",
              "skill_list": [
                "Analytical thinking",
                "Visionary",
                "Intuitive",
                "Flexibility",
                "Innovation",
                "Self-driven",
                "Leadership experience",
                "Ability to work independently",
                "Communication skills",
                "Adaptability",
                "Creativity"
              ]
            },
            {
              "category": "Languages",
              "skill_list": [
                "English (Professional)",
                "Filipino (Native)"
              ]
            }
          ]
        }
      },
      "education": {
        "degree": "Bachelor of Science in Computer Engineering",
        "school_location": "Mapua University, Manila, PH",
        "period": "2015-2022"
      },
      "certifications": [
        {
          "certification_name": "Certified Lean Six Sigma White Belt",
          "certification_provider": "Six Sigma PH",
          "certification_date": "2025",
          "certification_link": "https://sixsigma.freshlearn.com/certificate/1556969"
        },
        {
          "certification_name": "Basics of UI Design",
          "certification_provider": "Cambridge International Qualifications, UK",
          "certification_date": "2025",
          "certification_link": "https://uniathena.com/verify/certificate?certID=1370-7221-9127"
        },
        {
          "certification_name": "Google Cloud Big Data and Machine Learning Fundamentals",
          "certification_provider": "Google Cloud Platform - GCP",
          "certification_date": "2020",
          "certification_link": "https://coursera.org/verify/UUQXGLPDM3VJ2019-2022"
        },
        {
          "certification_name": "Introduction to TensorFlow for AI, ML, and Deep Learning",
          "certification_provider": "DeepLearning.AI",
          "certification_date": "2020",
          "certification_link": "https://coursera.org/verify/FFHG8BC72NKZ"
        }
      ],
      "other": {
        "interest_and_hobbies": [
          {
            "title": "Emerging Technologies",
            "content": "Passionate about adopting cutting-edge tools to enhance development efficiency. In 2020, I mastered React for frontend development during my academic years. By 2022, I transitioned to mobile-first development, followed by cross-platform PWAs and native mobile apps in 2023. Today, I leverage LLMs, AI-augmented workflows, and prompt engineering to accelerate web development."
          },
          {
            "title": "Continuous Learning",
            "content": "I stay motivated by actively explore advancements in AI/ML technologies, cloud platforms, and modern frontend frameworks, following the latest trends in software development with articles and blogs. Received technical training during my tenure on enterprise corporations"
          }
        ]
      }
    }

    // Generate documents from personalInfo
    const info: any = this.personalInfo;

    this.documents = [
      // Work Experience Documents - Generated from personalInfo
      ...info.work_info.experience.map((exp: any, index: number) => ({
        id: `work-exp-${index + 1}`,
        content: `${exp.role} at ${exp.company} in ${exp.location} from ${exp.period}. ${exp.features.join('. ')}`,
        metadata: {
          title: `${exp.role} at ${exp.company} (${exp.period})`,
          category: 'work' as const,
          tags: this.extractTagsFromExperience(exp),
          source: 'Work Experience'
        }
      })),

      // Professional Summary
      {
        id: 'work-summary',
        content: info.work_info.summary,
        metadata: {
          title: 'Professional Summary',
          category: 'work',
          tags: ['experience', 'summary', 'ai', 'full-stack', 'react', 'nextjs', 'ml', 'aws', 'azure', '5+ years'],
          source: 'Professional Summary'
        }
      },

      // Technical Skills - Frontend
      {
        id: 'work-skills-frontend',
        content: `Frontend development expertise includes: ${info.work_info.skills.hard_skills[0].skill_list.join(', ')}. Also experienced with ${info.work_info.skills.hard_skills[1].skill_list.join(', ')}`,
        metadata: {
          title: 'Frontend Technical Skills',
          category: 'work',
          tags: [...info.work_info.skills.hard_skills[0].skill_list.map((s: string) => s.toLowerCase()), 'frontend', 'ui', 'ux'],
          source: 'Technical Skills'
        }
      },

      // Technical Skills - Backend
      {
        id: 'work-skills-backend',
        content: `Backend development skills: ${info.work_info.skills.hard_skills[2].skill_list.join(', ')}`,
        metadata: {
          title: 'Backend Technical Skills',
          category: 'work',
          tags: [...info.work_info.skills.hard_skills[2].skill_list.map((s: string) => s.toLowerCase()), 'backend', 'api', 'database'],
          source: 'Technical Skills'
        }
      },

      // Technical Skills - Cloud & DevOps
      {
        id: 'work-skills-cloud',
        content: `Cloud and DevOps expertise: ${info.work_info.skills.hard_skills[3].skill_list.join(', ')}`,
        metadata: {
          title: 'Cloud & DevOps Skills',
          category: 'work',
          tags: [...info.work_info.skills.hard_skills[3].skill_list.map((s: string) => s.toLowerCase()), 'cloud', 'devops', 'infrastructure'],
          source: 'Technical Skills'
        }
      },

      // Soft Skills
      ...info.work_info.skills.soft_skills.map((skill: any, index: number) => ({
        id: `work-soft-${index + 1}`,
        content: `${skill.category} skills include: ${skill.skill_list.join(', ')}`,
        metadata: {
          title: `${skill.category} Skills`,
          category: 'work' as const,
          tags: [...skill.skill_list.map((s: string) => s.toLowerCase()), 'soft skills'],
          source: 'Soft Skills'
        }
      })),

      // Certifications
      ...info.certifications.map((cert: any, index: number) => ({
        id: `work-cert-${index + 1}`,
        content: `${cert.certification_name} from ${cert.certification_provider} in ${cert.certification_date}. Verification: ${cert.certification_link}`,
        metadata: {
          title: cert.certification_name,
          category: 'work' as const,
          tags: ['certification', 'training', cert.certification_provider.toLowerCase(), cert.certification_name.toLowerCase()],
          source: 'Certifications'
        }
      })),

      // Education
      {
        id: 'school-degree',
        content: `${info.education.degree} from ${info.education.school_location} (${info.education.period}). Specialized in .NET5 Fullstack Technology and computer engineering fundamentals.`,
        metadata: {
          title: 'Computer Engineering Degree',
          category: 'school',
          tags: ['education', 'degree', 'computer engineering', 'mapua', 'university', '.net', 'fullstack'],
          source: 'Education'
        }
      },

      // Thesis Project
      {
        id: 'school-thesis',
        content: `Senior thesis project: "Determination of Driver's Alertness Based on Eye State with Edge Computing". Applied AI-powered Face and Motion detection to an ARM64 device as an edge computing agent. It analyzes real-time camera feed input to detect and conclude the state of the eyes of a person. Practical applications include drowsiness detection using eye state. Algorithms included Convolutional Neural Networks, Deep learning, and Sigmoid Classification.`,
        metadata: {
          title: 'Thesis Project - AI & Edge Computing',
          category: 'school',
          tags: ['thesis', 'ai', 'machine learning', 'edge computing', 'computer vision', 'cnn', 'deep learning', 'arm64'],
          source: 'Academic Project'
        }
      },

      // Personal Info
      {
        id: 'about-contact',
        content: `${info.personal_info.name} is a ${info.personal_info.job_title} based in ${info.personal_info.address_line.city}, ${info.personal_info.address_line.country}. Contact: ${info.personal_info.email}, ${info.personal_info.mobile}. Portfolio: ${info.personal_info.website.url}. LinkedIn: ${info.personal_info.linkedin.url}`,
        metadata: {
          title: 'Contact Information',
          category: 'about_me',
          tags: ['contact', 'email', 'phone', 'location', 'linkedin', 'portfolio', 'personal'],
          source: 'Contact Info'
        }
      },

      // Interests and Hobbies
      ...info.other.interest_and_hobbies.map((interest: any, index: number) => ({
        id: `about-interest-${index + 1}`,
        content: interest.content,
        metadata: {
          title: interest.title,
          category: 'about_me' as const,
          tags: ['interests', 'hobbies', 'personal', interest.title.toLowerCase()],
          source: 'Personal Interests'
        }
      })),

      // Additional personal info
      {
        id: 'about-personal',
        content: 'Jacob is 27 years old, originally from Cabanatuan City, Nueva Ecija. He lived in Kuwait during junior and senior high school, then moved to Mandaluyong to pursue Computer Engineering at Mapua University. He enjoys playing strategic video games like Dota2 and Valorant, as well as puzzles. Outside of work, he loves beaches, photography, and traveling with his partner of 9 years, Francesca, after whom this AI assistant is named.',
        metadata: {
          title: 'Personal Background',
          category: 'about_me',
          tags: ['personal', 'background', 'age', 'location', 'hobbies', 'games', 'travel', 'photography'],
          source: 'Personal Bio'
        }
      }
    ];

    this.initialized = true;
  }

  // Helper method to extract tags from experience
  private extractTagsFromExperience(exp: any): string[] {
    const tags: string[] = [];

    // Extract technologies from role and features
    const techKeywords = ['react', 'angular', 'vue', 'nodejs', 'python', 'aws', 'azure', 'docker', 'kubernetes', 'jenkins',
                          'typescript', 'javascript', 'redux', 'nextjs', 'graphql', 'playwright', 'selenium', 'jest',
                          'mongodb', 'mysql', 'postgresql', 'ci/cd', 'api', 'llm', 'ai', 'ml', 'chatbot', 'rag'];

    const fullText = `${exp.role} ${exp.features.join(' ')}`.toLowerCase();

    techKeywords.forEach(tech => {
      if (fullText.includes(tech)) {
        tags.push(tech);
      }
    });

    // Add role-based tags
    if (exp.role.toLowerCase().includes('frontend')) tags.push('frontend');
    if (exp.role.toLowerCase().includes('backend')) tags.push('backend');
    if (exp.role.toLowerCase().includes('fullstack') || exp.role.toLowerCase().includes('full stack')) tags.push('fullstack');
    if (exp.role.toLowerCase().includes('ai') || exp.role.toLowerCase().includes('ml')) tags.push('ai', 'machine learning');
    if (exp.role.toLowerCase().includes('ux') || exp.role.toLowerCase().includes('ui')) tags.push('ui', 'ux', 'design');

    // Add company as tag
    tags.push(exp.company.toLowerCase());

    return [...new Set(tags)]; // Remove duplicates
  }

  // Enhanced text similarity with better keyword matching
  private calculateSimilarity(query: string, document: Document): number {
    const queryWords = query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
    const contentWords = document.content.toLowerCase().split(/\s+/);
    const tagWords = document.metadata.tags.join(' ').toLowerCase().split(/\s+/);
    const titleWords = document.metadata.title.toLowerCase().split(/\s+/);

    // Combine all document text
    const allDocText = `${document.content} ${document.metadata.tags.join(' ')} ${document.metadata.title}`.toLowerCase();

    let score = 0;
    const maxScore = queryWords.length;

    for (const queryWord of queryWords) {
      // Exact word match in content (highest weight)
      if (contentWords.includes(queryWord)) {
        score += 3;
      }
      // Exact word match in tags (high weight)
      else if (tagWords.includes(queryWord)) {
        score += 2;
      }
      // Exact word match in title (medium weight)
      else if (titleWords.includes(queryWord)) {
        score += 1.5;
      }
      // Partial match anywhere (low weight)
      else if (allDocText.includes(queryWord)) {
        score += 0.5;
      }

      // Boost score for work-related terms
      if (['work', 'experience', 'job', 'career', 'position', 'role', 'skills', 'developer', 'engineer', 'technical', 'certification', 'training'].includes(queryWord)) {
        if (document.metadata.category === 'work') {
          score += 1;
        }
      }
    }

    // Normalize score (0-1 range)
    const normalizedScore = Math.min(score / (maxScore * 3), 1);

    // Debug logging
    console.log(`Query: "${query}" | Document: "${document.metadata.title}" | Score: ${normalizedScore.toFixed(3)}`);

    return normalizedScore;
  }

  public async searchDocuments(
    query: string,
    indexes: ('work' | 'school' | 'about_me')[] = ['work', 'school', 'about_me'],
    topK: number = 3
  ): Promise<SearchResult[]> {
    // Filter documents by selected indexes
    const filteredDocs = this.documents.filter(doc =>
      indexes.includes(doc.metadata.category)
    );

    // Calculate similarities
    const results: SearchResult[] = filteredDocs.map(doc => ({
      document: doc,
      similarity: this.calculateSimilarity(query, doc)
    }));

    // Sort by similarity and return top K
    const filteredResults = results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter(result => result.similarity > 0.05); // Lowered threshold for better matching

    // Additional debug logging
    console.log(`\nRAG Search Results for "${query}":`);
    console.log(`Found ${filteredResults.length} relevant documents (threshold: 0.05)`);
    filteredResults.forEach((result, index) => {
      console.log(`${index + 1}. ${result.document.metadata.title} - Score: ${result.similarity.toFixed(3)}`);
    });

    return filteredResults;
  }

  public async generateRAGContext(
    query: string,
    indexes: ('work' | 'school' | 'about_me')[] = ['work', 'school', 'about_me']
  ): Promise<RAGContext> {
    const relevantDocuments = await this.searchDocuments(query, indexes);

    return {
      query,
      relevantDocuments,
      selectedIndexes: indexes
    };
  }

  public getDocumentsByCategory(category: 'work' | 'school' | 'about_me'): Document[] {
    return this.documents.filter(doc => doc.metadata.category === category);
  }

  public getAllDocuments(): Document[] {
    return this.documents;
  }
}

export const ragService = new RAGService();