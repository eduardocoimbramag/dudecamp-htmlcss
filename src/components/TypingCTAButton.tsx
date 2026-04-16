import { useEffect, useState } from 'react';

interface TypingCTAButtonProps {
  onScroll: () => void;
}

function TypingCTAButton({ onScroll }: TypingCTAButtonProps) {
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    const chars = Array.from('Quero fazer parte do time !!!');
    let charIndex = 0;
    let isErasing = false;
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (!active) return;
      if (!isErasing) {
        setTypingText(chars.slice(0, charIndex).join(''));
        if (charIndex < chars.length) {
          charIndex++;
          timeoutId = setTimeout(tick, 65);
        } else {
          timeoutId = setTimeout(() => { isErasing = true; tick(); }, 7100);
        }
      } else {
        setTypingText(chars.slice(0, charIndex).join(''));
        if (charIndex > 0) {
          charIndex--;
          timeoutId = setTimeout(tick, 30);
        } else {
          isErasing = false;
          timeoutId = setTimeout(tick, 300);
        }
      }
    };

    timeoutId = setTimeout(tick, 800);
    return () => { active = false; clearTimeout(timeoutId); };
  }, []);

  return (
    <button
      className="cta-button about-section-cta"
      onClick={onScroll}
      aria-label="Quero fazer parte do time !!!"
    >
      <span className="typing-wrapper" aria-hidden="true">
        <span className="typing-sizer">Quero fazer parte do time !!!</span>
        <span className="typing-live">
          {typingText}<span className="typing-cursor">|</span>
        </span>
      </span>
    </button>
  );
}

export default TypingCTAButton;
