import React, { useState, useEffect } from 'react';
import researchPaperService from '../services/researchPaperService';

export default function ResearchPaperManager({ onClose }) {
  const [papers, setPapers] = useState([]);
  const [showAddPaper, setShowAddPaper] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadPapers();
  }, []);

  const loadPapers = () => {
    const allPapers = researchPaperService.getAllPapers();
    setPapers(allPapers);
  };

  const showMessage = (message, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 3000);
  };

  const handleDeletePaper = async (paperId) => {
    if (window.confirm('Are you sure you want to delete this research paper?')) {
      const result = researchPaperService.deletePaper(paperId);
      if (result.success) {
        loadPapers();
        showMessage('Paper deleted successfully');
      } else {
        showMessage(result.error, true);
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete ALL research papers? This cannot be undone.')) {
      const result = researchPaperService.clearAllPapers();
      if (result.success) {
        loadPapers();
        showMessage('All papers cleared');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-5/6 flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-bold">R</span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Research Paper Manager</h2>
              <p className="text-sm text-gray-500">Feed evidence-based research into Kimi K2 for enhanced therapy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {papers.length} paper{papers.length !== 1 ? 's' : ''} loaded
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-light"
            >
              ×
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            Success: {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            Error: {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setShowAddPaper(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Add Research Paper
            </button>
            <button
              onClick={loadPapers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                const samplePaper = {
                  title: "Cognitive Behavioral Therapy for Anxiety Disorders: A Meta-Analysis",
                  authors: "Smith, J., Johnson, K., & Wilson, L.",
                  journal: "Journal of Clinical Psychology",
                  year: 2023,
                  abstract: "This meta-analysis examined the effectiveness of CBT for anxiety disorders. Results showed that CBT significantly reduced anxiety symptoms (d = 0.85, p < 0.001) compared to control conditions. The findings indicate that CBT is highly effective for treating various anxiety disorders.",
                  fullText: "Background: Cognitive Behavioral Therapy (CBT) has been widely used for treating anxiety disorders. Methods: We analyzed 45 randomized controlled trials involving 3,242 participants. Results: CBT showed significant effectiveness with large effect sizes. The treatment was particularly effective for generalized anxiety disorder and social anxiety. Conclusion: CBT should be considered a first-line treatment for anxiety disorders.",
                  tags: ["cognitive-behavioral", "anxiety", "therapy", "meta-analysis"]
                };
                researchPaperService.addPaper(samplePaper).then(() => {
                  loadPapers();
                  showMessage('Sample paper added successfully');
                });
              }}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
            >
              Add Sample Paper
            </button>
            {papers.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Papers List */}
        <div className="flex-1 overflow-y-auto p-6">
          {papers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 font-bold text-gray-400">R</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Research Papers Yet</h3>
              <p className="text-gray-600 mb-6">
                Add research papers to enhance Kimi K2's responses with evidence-based insights.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
                <ul className="text-sm text-blue-700 space-y-1 text-left">
                  <li>• Upload or paste research papers</li>
                  <li>• System extracts key findings automatically</li>
                  <li>• Relevant research is included in AI responses</li>
                  <li>• Evidence-based therapeutic insights</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {papers.map((paper) => (
                <div key={paper.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium text-gray-800 text-sm leading-tight">{paper.title}</h3>
                    <button
                      onClick={() => handleDeletePaper(paper.id)}
                      className="text-red-400 hover:text-red-600 text-sm ml-2"
                    >
                      Delete
                    </button>
                  </div>
                  
                  <div className="space-y-2 text-xs text-gray-600">
                    {paper.authors && (
                      <p><span className="font-medium">Authors:</span> {paper.authors}</p>
                    )}
                    {paper.year && (
                      <p><span className="font-medium">Year:</span> {paper.year}</p>
                    )}
                    <p><span className="font-medium">Findings:</span> {paper.findingsCount} extracted</p>
                    <p><span className="font-medium">Added:</span> {new Date(paper.addedDate).toLocaleDateString()}</p>
                  </div>

                  {paper.tags && paper.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {paper.tags.slice(0, 4).map((tag, index) => (
                        <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                      {paper.tags.length > 4 && (
                        <span className="text-xs text-gray-500">+{paper.tags.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Paper Modal */}
        {showAddPaper && (
          <AddPaperModal
            onClose={() => setShowAddPaper(false)}
            onSuccess={() => {
              setShowAddPaper(false);
              loadPapers();
              showMessage('Research paper added successfully');
            }}
            onError={(error) => showMessage(error, true)}
          />
        )}
      </div>
    </div>
  );
}

// Add Paper Modal Component
function AddPaperModal({ onClose, onSuccess, onError }) {
  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    journal: '',
    year: new Date().getFullYear(),
    abstract: '',
    fullText: '',
    url: '',
    doi: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'paste'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      let paperData = { ...formData };

      // If pasting full text, try to parse it automatically
      if (inputMethod === 'paste' && formData.fullText) {
        const parsed = await researchPaperService.parsePaperFromText(formData.fullText);
        paperData = {
          ...parsed,
          // Keep manually entered fields if they exist
          title: formData.title || parsed.title,
          authors: formData.authors || parsed.authors,
          year: formData.year || parsed.year
        };
      }

      if (!paperData.title) {
        throw new Error('Paper title is required');
      }

      const result = await researchPaperService.addPaper(paperData);
      if (result.success) {
        onSuccess();
      } else {
        onError(result.error);
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-5/6 overflow-y-auto mx-4">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Add Research Paper</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
          </div>
          
          {/* Input Method Toggle */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setInputMethod('manual')}
              className={`px-3 py-1 text-sm rounded ${
                inputMethod === 'manual' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Manual Entry
            </button>
            <button
              onClick={() => setInputMethod('paste')}
              className={`px-3 py-1 text-sm rounded ${
                inputMethod === 'paste' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Paste Full Text
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {inputMethod === 'paste' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paste Research Paper Text
                </label>
                <textarea
                  value={formData.fullText}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullText: e.target.value }))}
                  placeholder="Paste the full text of the research paper here. The system will automatically extract title, authors, abstract, and key findings..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              {/* Optional manual overrides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (optional - will auto-extract)
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors (optional - will auto-extract)
                  </label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Authors
                  </label>
                  <input
                    type="text"
                    value={formData.authors}
                    onChange={(e) => setFormData(prev => ({ ...prev, authors: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Journal
                  </label>
                  <input
                    type="text"
                    value={formData.journal}
                    onChange={(e) => setFormData(prev => ({ ...prev, journal: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Abstract
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => setFormData(prev => ({ ...prev, abstract: e.target.value }))}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Text (optional but recommended)
                </label>
                <textarea
                  value={formData.fullText}
                  onChange={(e) => setFormData(prev => ({ ...prev, fullText: e.target.value }))}
                  rows="6"
                  placeholder="Paste the full text of the paper for better key finding extraction..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DOI
                  </label>
                  <input
                    type="text"
                    value={formData.doi}
                    onChange={(e) => setFormData(prev => ({ ...prev, doi: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Add Paper'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 