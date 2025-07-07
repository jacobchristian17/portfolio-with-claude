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
        content: 'Software Engineer at TechCorp with 3+ years of experience in full-stack development. Specialized in React, Node.js, and cloud infrastructure. Led a team of 5 developers on a major e-commerce platform that increased conversion rates by 25%.',
        metadata: {
          title: 'Current Position - Software Engineer',
          category: 'work',
          tags: ['software engineering', 'full-stack', 'react', 'nodejs', 'leadership'],
          source: 'Resume'
        }
      },
      {
        id: 'work-2',
        content: 'Previously worked as a Frontend Developer at StartupXYZ where I built responsive web applications using React and TypeScript. Implemented a design system that reduced development time by 40% and improved code consistency across teams.',
        metadata: {
          title: 'Previous Role - Frontend Developer',
          category: 'work',
          tags: ['frontend', 'react', 'typescript', 'design system'],
          source: 'Resume'
        }
      },
      {
        id: 'work-3',
        content: 'Proficient in modern web technologies including React, Next.js, TypeScript, Node.js, Express, PostgreSQL, MongoDB, AWS, Docker, and Git. Experience with agile methodologies and continuous integration/deployment pipelines.',
        metadata: {
          title: 'Technical Skills',
          category: 'work',
          tags: ['react', 'nextjs', 'typescript', 'aws', 'docker', 'agile'],
          source: 'Skills Assessment'
        }
      },
      
      // School Index
      {
        id: 'school-1',
        content: 'Bachelor of Science in Computer Science from State University, graduated Magna Cum Laude with a 3.8 GPA. Coursework included Data Structures, Algorithms, Database Systems, Software Engineering, and Machine Learning.',
        metadata: {
          title: 'Education - Computer Science Degree',
          category: 'school',
          tags: ['computer science', 'algorithms', 'data structures', 'machine learning'],
          source: 'Academic Records'
        }
      },
      {
        id: 'school-2',
        content: 'Senior capstone project: Built an AI-powered study assistant using natural language processing and machine learning. The application helped students create personalized study plans and achieved 85% user satisfaction in testing.',
        metadata: {
          title: 'Capstone Project - AI Study Assistant',
          category: 'school',
          tags: ['ai', 'nlp', 'machine learning', 'capstone'],
          source: 'Project Portfolio'
        }
      },
      {
        id: 'school-3',
        content: 'Active member of the Computer Science Student Association and participated in hackathons. Won 2nd place in the Annual Tech Innovation Challenge for developing a sustainable energy monitoring app.',
        metadata: {
          title: 'Extracurricular Activities',
          category: 'school',
          tags: ['hackathons', 'student association', 'innovation', 'sustainability'],
          source: 'Activities Record'
        }
      },
      
      // About Me Index
      {
        id: 'about-1',
        content: 'Passionate about creating innovative solutions that make a positive impact. I enjoy solving complex problems through code and am always eager to learn new technologies. Outside of work, I love hiking, photography, and contributing to open-source projects.',
        metadata: {
          title: 'Personal Interests and Values',
          category: 'about_me',
          tags: ['innovation', 'problem solving', 'hiking', 'photography', 'open source'],
          source: 'Personal Statement'
        }
      },
      {
        id: 'about-2',
        content: 'Originally from Seattle, now based in San Francisco. I have a rescue dog named Max who loves long walks and playing fetch. I believe in work-life balance and enjoy cooking, especially trying new recipes from different cultures.',
        metadata: {
          title: 'Personal Background',
          category: 'about_me',
          tags: ['seattle', 'san francisco', 'dog owner', 'cooking', 'culture'],
          source: 'Personal Bio'
        }
      },
      {
        id: 'about-3',
        content: 'Strong advocate for diversity and inclusion in tech. I mentor junior developers and volunteer at local coding bootcamps. My goal is to help create a more inclusive tech industry where everyone can thrive.',
        metadata: {
          title: 'Community Involvement',
          category: 'about_me',
          tags: ['diversity', 'inclusion', 'mentoring', 'volunteering', 'community'],
          source: 'Community Profile'
        }
      },
      {
        id: 'about-3',
        content: 'Strong advocate for diversity and inclusion in tech. I mentor junior developers and volunteer at local coding bootcamps. My goal is to help create a more inclusive tech industry where everyone can thrive.',
        metadata: {
          title: 'Community Involvement',
          category: 'about_me',
          tags: ['diversity', 'inclusion', 'mentoring', 'volunteering', 'community'],
          source: 'Community Profile'
        }
      }
    ];

    this.initialized = true;
  }

  // Simple text similarity based on keyword overlap (in production, use proper embeddings)
  private calculateSimilarity(query: string, document: Document): number {
    const queryWords = query.toLowerCase().split(/\s+/);
    const contentWords = document.content.toLowerCase().split(/\s+/);
    const tagWords = document.metadata.tags.join(' ').toLowerCase().split(/\s+/);
    
    const allDocWords = [...contentWords, ...tagWords];
    const intersection = queryWords.filter(word => allDocWords.includes(word));
    
    // Simple Jaccard similarity
    const union = [...new Set([...queryWords, ...allDocWords])];
    return intersection.length / union.length;
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
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK)
      .filter(result => result.similarity > 0.1); // Minimum similarity threshold
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