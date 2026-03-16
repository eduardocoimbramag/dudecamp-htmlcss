import './Hero.css';

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

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="hero-content">
        <div className="hero-center">
          
          {/* 1. FOTO PESSOAL - Trocar aqui sua foto */}
          <div className="hero-photo-wrapper">
            <div className="hero-photo-glow"></div>
            <img 
              // Troque '/eduardofoto.jpeg' se quiser outra foto em public
              src="/eduardofoto.jpeg" 
              alt="Foto do instrutor"
              className="hero-photo"
            />
          </div>

          {/* 2. LOGO DO CURSO - Trocar aqui a logo do curso */}
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
