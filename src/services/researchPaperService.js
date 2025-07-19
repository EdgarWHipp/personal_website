// Research paper service for mental wellness application

class ResearchPaperService {
  constructor() {
    this.storageKey = 'bwell_research_papers';
    this.papers = this.loadPapers();
  }

  // Load papers from localStorage
  loadPapers() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      // Error loading research papers
      return [];
    }
  }

  // Save papers to localStorage
  savePapers() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.papers));
      return true;
    } catch (error) {
      // Error saving research papers
      return false;
    }
  }

  // Add a new research paper
  async addPaper(paperData) {
    try {
      const paper = {
        id: Date.now().toString(),
        title: paperData.title,
        authors: paperData.authors || '',
        journal: paperData.journal || '',
        year: paperData.year || new Date().getFullYear(),
        doi: paperData.doi || '',
        url: paperData.url || '',
        abstract: paperData.abstract || '',
        fullText: paperData.fullText || '',
        tags: paperData.tags || [],
        addedDate: new Date().toISOString(),
        chunks: [],
        keyFindings: []
      };

      // Process the paper content into chunks for better retrieval
      paper.chunks = this.chunkText(paper.fullText || paper.abstract, 500);
      
      // Extract key findings using simple heuristics
      paper.keyFindings = this.extractKeyFindings(paper.fullText || paper.abstract);

      this.papers.push(paper);
      this.savePapers();
      
      // Added research paper
      return { success: true, paper };
    } catch (error) {
      // Error adding paper
      return { success: false, error: error.message };
    }
  }

  // Chunk text for better processing
  chunkText(text, maxChunkSize = 500) {
    if (!text) return [];
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if (currentChunk.length + sentence.length > maxChunkSize) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        }
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }

  // Extract key findings using simple pattern matching
  extractKeyFindings(text) {
    if (!text) return [];
    
    const findingPatterns = [
      /(?:found that|showed that|demonstrated that|revealed that|indicated that)\s+([^.!?]{20,200})/gi,
      /(?:results suggest|findings indicate|data show|evidence suggests)\s+([^.!?]{20,200})/gi,
      /(?:significant|significantly|p\s*<|p\s*=)\s+([^.!?]{10,150})/gi,
      /(?:conclusion|conclusions?):\s*([^.!?]{20,300})/gi
    ];

    const findings = [];
    for (const pattern of findingPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match[1] && match[1].trim().length > 15) {
          findings.push(match[1].trim());
        }
      }
    }

    return [...new Set(findings)].slice(0, 10); // Remove duplicates, limit to 10
  }

  // Search papers by keywords, topics, or relevance to current conversation
  searchRelevantPapers(query, conversationContext = []) {
    if (!query && !conversationContext.length) return [];

    const searchTerms = this.extractSearchTerms(query, conversationContext);
    const scoredPapers = [];

    for (const paper of this.papers) {
      let score = 0;
      const searchableText = `${paper.title} ${paper.abstract} ${paper.keyFindings.join(' ')} ${paper.tags.join(' ')}`.toLowerCase();

      // Score based on search terms
      for (const term of searchTerms) {
        const termCount = (searchableText.match(new RegExp(term.toLowerCase(), 'g')) || []).length;
        score += termCount * (term.length > 3 ? 2 : 1); // Longer terms get more weight
      }

      if (score > 0) {
        scoredPapers.push({ paper, score });
      }
    }

    return scoredPapers
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.paper);
  }

  // Extract search terms from query and conversation context
  extractSearchTerms(query = '', conversationContext = []) {
    const terms = new Set();
    
    // Add query terms
    if (query) {
      const queryTerms = query.toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 2 && !this.isStopWord(term));
      queryTerms.forEach(term => terms.add(term));
    }

    // Add terms from recent conversation
    const recentMessages = conversationContext.slice(-3); // Last 3 messages
    for (const message of recentMessages) {
      if (message.sender === 'user') {
        const messageTerms = message.text.toLowerCase()
          .split(/\s+/)
          .filter(term => term.length > 3 && !this.isStopWord(term));
        messageTerms.forEach(term => terms.add(term));
      }
    }

    // Add psychology/mental health terms if present
    const psychTerms = ['anxiety', 'depression', 'therapy', 'cognitive', 'behavioral', 
                       'trauma', 'stress', 'mindfulness', 'emotion', 'mood', 'coping'];
    const text = (query + ' ' + conversationContext.map(m => m.text).join(' ')).toLowerCase();
    for (const term of psychTerms) {
      if (text.includes(term)) {
        terms.add(term);
      }
    }

    return Array.from(terms);
  }

  // Simple stop words list
  isStopWord(word) {
    const stopWords = ['the', 'and', 'but', 'for', 'are', 'with', 'this', 'that', 'from', 'they', 'have', 'been'];
    return stopWords.includes(word.toLowerCase());
  }

  // Get research context for AI based on current conversation
  getResearchContext(conversationHistory, maxTokens = 1500) {
    const relevantPapers = this.searchRelevantPapers('', conversationHistory);
    
    if (relevantPapers.length === 0) {
      return {
        hasResearch: false,
        context: '',
        papers: []
      };
    }

    let context = "\n\nRelevant Research Context:\n";
    let tokenCount = 0;
    const usedPapers = [];

    for (const paper of relevantPapers) {
      const paperSummary = `\n• ${paper.title} (${paper.year})\n  Key findings: ${paper.keyFindings.slice(0, 2).join('; ')}\n`;
      
      if (tokenCount + paperSummary.length < maxTokens) {
        context += paperSummary;
        tokenCount += paperSummary.length;
        usedPapers.push({
          title: paper.title,
          year: paper.year,
          authors: paper.authors
        });
      } else {
        break;
      }
    }

    context += "\nPlease incorporate these evidence-based insights into your therapeutic responses when relevant.";

    return {
      hasResearch: true,
      context,
      papers: usedPapers,
      totalPapers: this.papers.length
    };
  }

  // Parse common research paper formats
  async parsePaperFromText(text) {
    const paper = {
      title: '',
      authors: '',
      journal: '',
      year: null,
      abstract: '',
      fullText: text,
      tags: []
    };

    // Extract title (usually first line or after "Title:")
    const titleMatch = text.match(/^(.+?)(?:\n|\r)/m) || text.match(/title:?\s*(.+?)(?:\n|\r)/im);
    if (titleMatch) {
      paper.title = titleMatch[1].trim();
    }

    // Extract authors
    const authorMatch = text.match(/authors?:?\s*(.+?)(?:\n|\r)/im);
    if (authorMatch) {
      paper.authors = authorMatch[1].trim();
    }

    // Extract year
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      paper.year = parseInt(yearMatch[0]);
    }

    // Extract abstract
    const abstractMatch = text.match(/abstract:?\s*(.+?)(?:\n\s*\n|\n(?:introduction|keywords?))/ims);
    if (abstractMatch) {
      paper.abstract = abstractMatch[1].trim();
    }

    // Auto-generate tags based on content
    paper.tags = this.generateTags(text);

    return paper;
  }

  // Generate tags based on content analysis
  generateTags(text) {
    const psychologyTerms = {
      'cognitive-behavioral': ['cbt', 'cognitive behavioral', 'cognitive behavior'],
      'depression': ['depression', 'depressive', 'mood disorder'],
      'anxiety': ['anxiety', 'anxious', 'panic', 'worry'],
      'therapy': ['therapy', 'therapeutic', 'treatment', 'intervention'],
      'mindfulness': ['mindfulness', 'meditation', 'mindful'],
      'trauma': ['trauma', 'ptsd', 'traumatic'],
      'adolescent': ['adolescent', 'teenager', 'youth'],
      'neuroplasticity': ['neuroplasticity', 'brain plasticity', 'neural'],
      'randomized-trial': ['randomized', 'rct', 'controlled trial'],
      'meta-analysis': ['meta-analysis', 'systematic review']
    };

    const tags = [];
    const lowerText = text.toLowerCase();

    for (const [tag, patterns] of Object.entries(psychologyTerms)) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          tags.push(tag);
          break;
        }
      }
    }

    return [...new Set(tags)]; // Remove duplicates
  }

  // Get all papers with metadata
  getAllPapers() {
    return this.papers.map(paper => ({
      id: paper.id,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      tags: paper.tags,
      addedDate: paper.addedDate,
      findingsCount: paper.keyFindings.length
    }));
  }

  // Delete a paper
  deletePaper(paperId) {
    const index = this.papers.findIndex(p => p.id === paperId);
    if (index !== -1) {
      const deleted = this.papers.splice(index, 1)[0];
      this.savePapers();
      return { success: true, deleted };
    }
    return { success: false, error: 'Paper not found' };
  }

  // Clear all papers
  clearAllPapers() {
    this.papers = [];
    this.savePapers();
    localStorage.removeItem(this.storageKey);
    return { success: true };
  }
}

// Export singleton instance
const researchPaperService = new ResearchPaperService();
export default researchPaperService; 