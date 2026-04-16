import { useState } from 'react';
import './ModuleFolder.css';

interface ModuleFolderProps {
  number: number;
  title: string;
  duration: string;
  topics?: string[];
}

function ModuleFolder({ number, title, duration, topics }: ModuleFolderProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="module-folder">
      <button 
        className="module-header"
        onClick={() => topics && topics.length > 0 && setIsExpanded(!isExpanded)}
        disabled={!topics || topics.length === 0}
      >
        <div className="module-info">
          <span className="module-icon">
            {topics && topics.length > 0 ? (isExpanded ? '📂' : '📁') : '📄'}
          </span>
          <span className="module-number">{number})</span>
          <span className="module-title">{title}</span>
        </div>
        <span className="module-duration">{duration}</span>
      </button>
      
      {topics && topics.length > 0 && isExpanded && (
        <div className="module-topics">
          {topics.map((topic) => (
            <div key={topic} className="topic-item">
              <span className="topic-marker">└─</span>
              <span className="topic-text">{topic}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModuleFolder;
