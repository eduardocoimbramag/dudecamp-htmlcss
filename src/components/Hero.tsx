import { useRef } from 'react';
import MagicRings from './MagicRings';
import TargetCursor from './TargetCursor';
import './Hero.css';

function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={heroRef}
      className="hero-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        background: '#000000',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <MagicRings
          color="#ffd600"
          colorTwo="#ffd600"
          ringCount={4}
          speed={0.6}
          attenuation={20}
          lineThickness={2}
          baseRadius={0.45}
          radiusStep={0.13}
          scaleRate={0.1}
          opacity={1}
          blur={0}
          noiseAmount={0.1}
          rotation={0}
          ringGap={1.5}
          fadeIn={0.7}
          fadeOut={0.5}
          followMouse={false}
          mouseInfluence={0.2}
          hoverScale={1}
          parallax={0.05}
          clickBurst={false}
        />
      </div>

      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-logo-wrap">
            <img
              src="/LogoPalletPNG.png"
              alt="Dudecamp"
              className="hero-logo"
              draggable={false}
            />
          </div>

          <p className="hero-subtitle cursor-target">
            Aprenda <span className="html-color">HTML</span> + <span className="css-color">CSS</span> do zero e construa projetos com visual profissional.
          </p>

          <div className="hero-cta-group">
            <button
              className="hero-btn hero-btn--primary cursor-target"
              onClick={() => scrollTo('enroll')}
            >
              Quero me inscrever agora
            </button>
            <button
              className="hero-btn hero-btn--ghost cursor-target"
              onClick={() => scrollTo('about')}
            >
              Ver conteúdo do curso
            </button>
          </div>
        </div>
      </div>

      <TargetCursor
        containerRef={heroRef}
        spinDuration={2}
        hideDefaultCursor={true}
        parallaxOn={false}
        hoverDuration={0.2}
      />
    </section>
  );
}

export default Hero;
