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

  constructor() {
    this.initializeIndexes();
  }

  private initializeIndexes() {
    if (this.initialized) return;

    this.documents = [
      // Work Index
      {
        id: 'work-1',
        content: 'Worked with a Fortune 500 company, a long standing client of 77 Global Services Inc. Developed and shipped new features of a Chatbot, contributed to the update from legacy that includes dynamic configuration and reusable Frontend components. Worked side-to-side with ML Engineers, lead code reviews, and contributed to automated end-to-end testing. Tools used are React with Next, Redux, and used Jenkins and AWS for pipeline deployments',
        metadata: {
          title: 'Current Position - IA/UX Developer (Server-side Frontend) at 77 Global Services Inc. from August 2024 to present',
          category: 'work',
          tags: ['software engineering', 'frontend', 'react', 'next', 'redux', 'typescript'],
          source: 'Resume'
        }
      },
      {
        id: 'work-2',
        content: 'Previously worked as a UI/UX Developer for GHD as direct full-time software developer. Developed cross-platform components for Content Management System, which can be seen on the company website https://ghd.com. Collaborated with UI/UX Designers in the Global Team, worked with QA for test suites and automated end-to-end and unit testing, resolved feature defects, lead pull requests and code reviews. Also, another project is a Forms Validation/Submission Application (H&SE) developed in Angular/Ionic. Improved existing features and contributed to upgrade the Angular core from v12 to v18',
        metadata: {
          title: 'Previous Role - Frontend Developer at GHD from May 2023 to August 2024',
          category: 'work',
          tags: ['frontend', 'react', 'typescript', 'CMS', 'OAuth2', 'Angularv12', 'Angularv18'],
          source: 'Resume'
        }
      },
      {
        id: 'work-3',
        content: 'Full stack developer with Megawide Construction Corp., a client of Vertere Global Solutions Inc. Worked with legacy React class-component application, delivered optimizations and new features, improved backend performance and data consistency with MongoDB, spearheaded publishing the web app from the clients local servers to cloud with Linux, Docker, Nginx, and Microsoft Azure. Maintained legacy databases, developed manual pipelines, and updated features of Annual Stock Holder Meetings, maintained Profit & Loss Dashboard, developed 360-degree Survey System from conception to publishing, and also general basic devops as part of everyday development lifecycle',
        metadata: {
          title: 'Previous Role - MERN Stack Developer (Fullstack) at Vertere Global Solutions Inc. from  June 2022 to April 2023',
          category: 'work',
          tags: ['react', 'typescript', 'microsoft azure', 'docker', 'agile', 'nginx', 'nodejs', 'express', 'mongodb', 'mysql'],
          source: 'Resume'
        }
      },
      {
        id: 'work-4',
        content: 'Started as a full stack developer on freelance years, developed and published websites, applications, and mockups for clients, and live code tutoring.',
        metadata: {
          title: 'Previous Role - Full Stack Developer with Freelance jobs from March 2020 to April 2022',
          category: 'work',
          tags: ['react', 'typescript', 'microsoft azure', 'docker', 'agile', 'nginx', 'nodejs', 'express', 'mongodb', 'mysql'],
          source: 'Resume'
        }
      },
      {
        id: 'work-5',
        content: 'Proficient in modern web technologies including React, Next.js, Redux, TypeScript, Node.js, Express, Docker, and Git. Experience in working on Microservices for CI/CD Pipelines with Microsoft Azure, AWS, Jenkins, and remote repositories like Microsoft Azure Repository, Bitbucket, and GitLab. Experience with agile methodologies with scrum masters, business analysts, and product owners; SDLC includes Jira with Gitbucket for ticketing and resolve system. Has experience in working with development team, leading pull requests and resolving merge conflicts on a command terminal level with Git for production-grade code versioning.',
        metadata: {
          title: 'Core Technical Skills',
          category: 'work',
          tags: ['react', 'nextjs', 'typescript', 'nodejs', 'express', 'aws', 'microsoft azure', 'jenkins', 'docker', 'linux', 'ci/cd', 'agile',],
          source: 'Core Technical Skills'
        }
      },
      {
        id: 'work-6',
        content: 'Currently using Generative and Agentic AI tools for augmented development, by using prompt engineering, to ship new features faster, to deliver maintainable and scalable code, and to improve overall software engineering and critical thinking skills. Generative AI tools include OpenAI, Groq. Agentic AI tools include Claude Code. Improving myself to be an AI-First Software Developer that can ship features faster, tackle more complex task, and solve better problems with accuracy without compromising scalability of the code and the products being delivered',
        metadata: {
          title: 'Improved Skillset',
          category: 'work',
          tags: ['gpt', 'rag', 'llm', 'prompt engineering', 'ai-first', 'latest ai tools', 'generative ai', 'agentic ai', 'context engineering'],
          source: 'Improving Technical Skills'
        }
      },
      {
        id: 'work-7',
        content: 'Can work with colleagues or alone, finish deliverables at or before the expected time; listen to people and take critisism without prejudice, understanding that all of this is just part of work. I enjoy working with like minded people, who works at their best to beat the market. I enjoy spending time with my colleagues on and off work, and is open to know them on a personal level.',
        metadata: {
          title: 'Soft Skills',
          category: 'work',
          tags: ['communication', 'team oriented', 'soft skills', 'coordination', 'honesty'],
          source: 'Soft Skills'
        }
      },
      {
        id: 'work-8',
        content: 'Completed the following trainings: 1) Certified Lean Sig Sigma White Belt at Sig Sigma PH on February 2025 (reference: https://sixsigma.freshlearn.com/certificate/1556969) 2) Basics of UI Design at Cambridge International Qualifications, UK on Feb 2025 (reference: https://uniathena.com/verify/certificate?certID=1370-7221-9127) 3) Odoo v14 Software Development Training and 4) Ionic Mobile Application Development at Megawide Construction Corp. on December 2023 conducted by Candidoskie P. Berdin II, Senior IT Manager 5) Google Cloude Big Data and Machine Learning Fundamentals at Google Cloud on August 2020 with Grade: 97.30% (reference: https://coursera.org/verify/UUQXGLPDM3VJ2019-2022) 6) Introduction to Tensorflow for Artificial Intelligence, Machine Learning, and Deep Learning at Deeplearning.AI on August 2020 with Grade: 97.82% (refernece: https://coursera.org/verify/FFHG8BC72NKZ)',
        metadata: {
          title: 'Certifications',
          category: 'work',
          tags: ['certifications', 'six sigma', 'cambridge', 'training'],
          source: 'Certifications'
        }
      },
      
      // School Index
      {
        id: 'school-1',
        content: 'Bachelor of Science in Computer Engieering from Mapua University, Manila, Philippines in 2022. Majored in .NET5 Fullstack Technology, and published a thesis tittled "Determination of Driver’s Alertness Based on Eye State with Edge Computing" ',
        metadata: {
          title: 'Education - Computer Engineering Degree',
          category: 'school',
          tags: ['computer engineering', 'algorithms', 'data structures', 'machine learning', 'education', 'study'],
          source: 'Academic Records'
        }
      },
      {
        id: 'school-2',
        content: 'Senior thesis project: Applied AI-powered Face and Motion detection to an ARM64 device as an edge computing agent. It analyzes real-time camera feed input to detect and conclude the state of the eyes of a person. Practical applications include drowsiness detection using eye state. Algorithms included are Convolutional Neural Networks, Deep learning, Sigmoid Classification',
        metadata: {
          title: 'Thesis Project - Determination of Driver’s Alertness Based on Eye State with Edge Computing',
          category: 'school',
          tags: ['ai', 'nlp', 'machine learning', 'thesis', 'capstone', 'project'],
          source: 'Project Portfolio'
        }
      },
      
      // About Me Index
      {
        id: 'about-1',
        content: 'My hobbies are playing video games that involve planning and team coordination like Dota2 and Valorant. I also enjoy single player games like tetris and puzzles. I treat code examples like puzzles. I am always eager to learn new technologies. Outside of work, I love going to beaches, photography, and exploring different places with my significant other.',
        metadata: {
          title: 'Hobbies, Interests, and Values',
          category: 'about_me',
          tags: ['hobbies',],
          source: 'Personal Statement'
        }
      },
      {
        id: 'about-2',
        content: 'Im currently 27 years old. Originally from City of Cabanatuan, Nueva Ecija. I moved to Kuwait to finish my junior and senior highschool years, and then to Mandaluyong to pursue my study in Mapua University as Computer Engineer.',
        metadata: {
          title: 'Personal Background',
          category: 'about_me',
          tags: ['location', 'home', ''],
          source: 'Personal Bio'
        }
      },
      {
        id: 'about-4',
        content: 'The developer and publisher of this website/ web application is 🥷🏻Jacob. ',
        metadata: {
          title: 'Personal Profile',
          category: 'about_me',
          tags: ['information', 'profile', 'personal', 'publisher'],
          source: 'Personal Profile'
        }
      },
    ];

    this.initialized = true;
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