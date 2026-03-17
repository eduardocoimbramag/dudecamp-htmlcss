import './App.css'
import Hero from './components/Hero'
import AsideMenu from './components/AsideMenu'
import SpotlightCard from './components/SpotlightCard'

function App() {
  const menuItems = [
    { id: 'features', label: 'Recursos' },
    { id: 'about', label: 'Sobre' },
    { id: 'cta', label: 'Chamada' },
    { id: 'footer', label: 'Contato' },
  ];

  const featuresData = [
    {
      title: 'Recurso Premium 1',
      description: 'Descrição detalhada do primeiro recurso premium que oferecemos.',
    },
    {
      title: 'Recurso Premium 2',
      description: 'Descrição detalhada do segundo recurso premium que oferecemos.',
    },
    {
      title: 'Recurso Premium 3',
      description: 'Descrição detalhada do terceiro recurso premium que oferecemos.',
    },
    {
      title: 'Recurso Premium 4',
      description: 'Descrição detalhada do quarto recurso premium que oferecemos.',
    },
    {
      title: 'Recurso Premium 5',
      description: 'Descrição detalhada do quinto recurso premium que oferecemos.',
    },
    {
      title: 'Recurso Premium 6',
      description: 'Descrição detalhada do sexto recurso premium que oferecemos.',
    },
  ];

  return (
    <>
      <Hero />

      <AsideMenu menuItems={menuItems} />

      <div className="main-content">
        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <h2>Recursos Exclusivos</h2>
              <p>Descubra tudo o que preparamos para você</p>
            </div>
            <div className="features-grid">
              {featuresData.map((feature, index) => (
                <SpotlightCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2></h2>
              <p></p>
              <div className="about-features">
                <div className="about-feature">
                </div>
                <div className="about-feature">
                </div>
                <div className="about-feature">
                </div>
              </div>
            </div>
            <div className="about-image">
            </div>
          </div>
        </div>
      </section>

      <section id="cta" className="cta">
        <div className="container">
          <div className="cta-content">
            <h2></h2>
            <p></p>
            <div className="cta-buttons">
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
              </div>
              <p></p>
            </div>
            <div className="footer-column">
              <h4></h4>
              <ul>
                <li><a href="#"></a></li>
                <li><a href="#"></a></li>
                <li><a href="#"></a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4></h4>
              <ul>
                <li><a href="#"></a></li>
                <li><a href="#"></a></li>
                <li><a href="#"></a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4></h4>
              <div className="social-links">
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p></p>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}

export default App
