import { useActiveSection } from '../hooks/useActiveSection';
import { useEffect, useState } from 'react';
import './AsideMenu.css';

interface MenuItem {
  id: string;
  label: string;
}

interface AsideMenuProps {
  menuItems: MenuItem[];
}

function AsideMenu({ menuItems }: AsideMenuProps) {
  const sectionIds = menuItems.map(item => item.id);
  const activeSection = useActiveSection(sectionIds);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '-10% 0px 0px 0px'
      }
    );

    observer.observe(heroSection);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <aside className={`aside-menu ${isVisible ? 'visible' : ''}`}>
      <nav className="aside-nav">
        <ul className="aside-nav-list">
          {menuItems.map((item) => (
            <li key={item.id} className="aside-nav-item">
              <button
                onClick={() => handleScrollToSection(item.id)}
                className={`aside-nav-link ${activeSection === item.id ? 'active' : ''}`}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                <span className="nav-link-text">{item.label}</span>
                
                {/* CÍRCULO PONTILHADO ANIMADO - aparece apenas no item ativo */}
                {activeSection === item.id && (
                  <span className="active-indicator">
                    <svg 
                      className="dotted-circle" 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray="2 3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default AsideMenu;
