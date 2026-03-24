import './Hero.css';
import Particles from './Particles';

function Hero() {
  return (
    <section className="hero-section">
      {/* BACKGROUND IMAGE - Trocar aqui a imagem de fundo */}
      <div 
        className="hero-background"
        style={{
          // Troque '/bghero.png' para outro arquivo em public se desejar
          backgroundImage: "url('/bghero.png')"
        }}
      >
        <div className="hero-overlay"></div>
      </div>

      {/* VINHETA — escurece bordas/cantos, centro limpo */}
      <div className="hero-vignette" aria-hidden="true"></div>

      {/* PARTÍCULAS — frente do bg, atrás do conteúdo */}
      <Particles
        particleColors={["#ffffff"]}
        particleCount={300}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={100}
        moveParticlesOnHover
        alphaParticles
        disableRotation
        pixelRatio={1}
      />

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="hero-content">
        <div className="hero-center">
          
          {/* 1. LOGO DO CURSO - Trocar aqui a logo do curso */}
          <div className="hero-logo">
            <img 
              // Troque '/Dudecamp.png' caso utilize outro arquivo
              src="/Dudecamp.png" 
              alt="Logo do curso"
              className="hero-logo-img"
            />
          </div>

          {/* 3. DESCRIÇÃO - Trocar aqui o texto da descrição */}
          <p className="hero-description">
            Aprenda as melhores técnicas e transforme sua carreira com este curso completo e prático.
          </p>

        </div>
      </div>
    </section>
  );
}

export default Hero;
