import './App.css'
import Hero from './components/Hero'

function App() {
  return (
    <>
      <Hero />

      <section id="features" className="features">
        <div className="container">
          <div className="section-header">
            <h2></h2>
            <p></p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
              </div>
              <h3></h3>
              <p></p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
              </div>
              <h3></h3>
              <p></p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
              </div>
              <h3></h3>
              <p></p>
            </div>
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
    </>
  )
}

export default App
