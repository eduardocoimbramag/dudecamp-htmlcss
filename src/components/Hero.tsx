import MagicRings from './MagicRings';

function Hero() {
  return (
    <section
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
    </section>
  );
}

export default Hero;
