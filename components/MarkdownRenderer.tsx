import React from 'react';

interface Props {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<Props> = ({ content, className }) => {
  if (!content) return null;

  // Split by newlines to handle paragraphs
  const lines = content.split('\n');

  return (
    <div className={`space-y-2 text-sm md:text-base leading-relaxed ${className}`}>
      {lines.map((line, index) => {
        const key = `${index}-${line.substring(0, 10)}`;
        
        // Header detection (## or ###)
        if (line.startsWith('### ')) {
          return <h3 key={key} className="text-lg font-semibold text-green-800 mt-4 mb-2">{line.replace('### ', '')}</h3>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={key} className="text-xl font-bold text-green-900 mt-6 mb-3 border-b border-green-200 pb-1">{line.replace('## ', '')}</h2>;
        }
        // Bold text handling (**text**) - simplistic regex replacement for rendering
        const parts = line.split(/(\*\*.*?\*\*)/g);
        
        // List item detection
        if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
           return (
             <div key={key} className="flex items-start ml-4">
               <span className="mr-2 text-green-600">•</span>
               <span>
                 {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                      return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
                    }
                    return <span key={i}>{part}</span>;
                 })}
               </span>
             </div>
           );
        }

        // Standard paragraph
        if (line.trim() === '') return <div key={key} className="h-2" />;

        return (
          <p key={key} className="text-slate-700">
             {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
             })}
          </p>
        );
      })}
    </div>
  );
};
