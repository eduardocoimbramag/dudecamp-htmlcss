import { useRef, useState, MouseEvent } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  iconSrc?: string;
  iconAlt?: string;
  title: string;
  titleColor?: string;
  description: string;
}

function SpotlightCard({ iconSrc, iconAlt, title, titleColor, description }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
      } as React.CSSProperties}
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
        {iconSrc && (
          <div className="spotlight-card-icon-wrap">
            <img 
              src={iconSrc}
              alt={iconAlt || ''}
              className="spotlight-card-icon-image"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotlightCard;
