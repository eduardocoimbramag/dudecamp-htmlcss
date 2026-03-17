import { useRef, useState, MouseEvent } from 'react';
import './SpotlightCard.css';

interface SpotlightCardProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

function SpotlightCard({ icon, title, description }: SpotlightCardProps) {
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
        {icon && <div className="spotlight-card-icon">{icon}</div>}
        <h3 className="spotlight-card-title">{title}</h3>
        <p className="spotlight-card-description">{description}</p>
      </div>
    </div>
  );
}

export default SpotlightCard;
