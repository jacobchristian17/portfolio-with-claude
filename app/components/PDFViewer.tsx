"use client";
import { useState, useEffect } from "react";

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
  className?: string;
  id?: string;
}

export default function PDFViewer({ pdfUrl, title = "PDF Document", className = "", id }: PDFViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  // Add timeout for loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setShowFallback(true);
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timer);
  }, [isLoading]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError("Failed to load PDF document");
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = title.replace(/\s+/g, '_') + '.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id={id} className={`glass-card rounded-2xl p-6 hover-glow ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-royal-gradient">{title}</h3>
        <button
          onClick={handleDownload}
          className="btn-royal flex items-center gap-2  px-6 py-3 max-lg:px-2 max-lg:py-2 max-lg:rounded-full text-sm pdf-viewer" //sm:px-2 sm:py-1
          aria-label={`Download ${title}`}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <span className="hidden lg:inline">Download</span>
        </button>
      </div>
      
      <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ height: '600px' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-royal-purple mx-auto mb-2"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        )}
        
        {(error || showFallback) && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20">
            <div className="text-center p-6">
              <div className="text-blue-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">PDF Viewer</h3>
              <p className="text-blue-600 dark:text-blue-400 mb-4">
                {error ? "Unable to display PDF in browser." : "PDF preview not available in this browser."}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="btn-royal inline-flex items-center gap-2 px-6 py-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download PDF
                </button>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Click to download and view in your default PDF viewer</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <iframe
          src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
          title={title}
          className="w-full h-full border-0"
          onLoad={handleLoad}
          onError={handleError}
          style={{ display: (error || showFallback) ? 'none' : 'block' }}
        />
      </div>
    </div>
  );
}