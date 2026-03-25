import { useState, type ReactNode } from 'react';
import './FaqItem.css';

interface FaqItemProps {
  question: string;
  answer: ReactNode;
}

function FaqItem({ question, answer }: FaqItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'active' : ''}`}>
      <button 
        className="faq-question"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="question-text">{question}</span>
        <span className="faq-icon">{isOpen ? '−' : '+'}</span>
      </button>
      
      <div className={`faq-answer ${isOpen ? 'open' : ''}`}>
        <div className="answer-content">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default FaqItem;
