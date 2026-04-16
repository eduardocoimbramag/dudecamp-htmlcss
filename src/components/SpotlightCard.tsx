import { useRef } from 'react';
import type { MouseEvent } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  title: string;
  titleColor?: string;
  description: string;
}

function SpotlightCard({ title, titleColor, description }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rafPendingRef = useRef(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card || rafPendingRef.current) return;
    rafPendingRef.current = true;
    const cx = e.clientX;
    const cy = e.clientY;
    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${cx - rect.left}px`);
      card.style.setProperty('--mouse-y', `${cy - rect.top}px`);
      rafPendingRef.current = false;
    });
  };

  return (
    <div
      ref={cardRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
    >
      <div className="spotlight-card-border"></div>
      <div className="spotlight-card-content">
        <h3 
          className="spotlight-card-title"
          style={{
            color: titleColor,
            textShadow: titleColor ? `0 0 20px ${titleColor}80, 0 0 40px ${titleColor}40` : undefined
          }}
        >
          {title}
        </h3>
        <p 
          className="spotlight-card-description"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>
    </div>
  );
}

export default SpotlightCard;
