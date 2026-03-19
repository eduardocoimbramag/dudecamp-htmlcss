import './App.css'
import Hero from './components/Hero'
import AsideMenu from './components/AsideMenu'
import SpotlightCard from './components/SpotlightCard'
import ModuleFolder from './components/ModuleFolder'
import PricingTabs from './components/PricingTabs'

function App() {
  const menuItems = [
    { id: 'features', label: 'Recursos' },
    { id: 'about', label: 'Sobre' },
    { id: 'content', label: 'Conteúdo' },
    { id: 'enroll', label: 'Inscrever-se' },
    { id: 'footer', label: 'Contato' },
  ];

  const valueStackingItems = [
    { name: 'Conteúdo do Curso', price: 'R$ 497,00', isFree: false },
    { name: 'Módulo - Github para iniciantes', price: 'R$ 97,00', isFree: true },
    { name: 'Módulo - Prospecção de clientes', price: 'R$ 67,00', isFree: true },
    { name: 'Módulo - Precificação', price: 'R$ 67,00', isFree: true },
    { name: 'Pack de seções prontas', price: 'R$ 37,00', isFree: true },
    { name: 'Pack de efeitos CSS', price: 'R$ 37,00', isFree: true },
    { name: 'E-book de HTML + CSS', price: 'R$ 37,00', isFree: true }
  ];

  const modulesData = [
    {
      number: 1,
      title: 'Boas vindas',
      duration: '1H',
      topics: ['Apresentação', 'Download IDE', 'Extensões Necessárias']
    },
    {
      number: 2,
      title: 'Introdução ao HTML',
      duration: '1H',
      topics: [
        'Criação de pastas e arquivos',
        'Estrutura padrão de projeto',
        'Como funciona um arquivo HTML',
        'TAGS'
      ]
    },
    {
      number: 3,
      title: 'TAGS',
      duration: '2H',
      topics: [
        'Tags de texto',
        'Tags de estruturação',
        'Tags de mídia',
        'Tags de formulário',
        'Tags de formatação'
      ]
    },
    {
      number: 4,
      title: 'Atributos Globais',
      duration: '1H'
    },
    {
      number: 5,
      title: 'Introdução CSS',
      duration: '1H'
    },
    {
      number: 6,
      title: 'Propriedades CSS',
      duration: '2H',
      topics: [
        'Propriedade de espaçamento',
        'Propriedade de estilização',
        'Propriedade de texto',
        'Mais estilizações',
        'Animações'
      ]
    },
    {
      number: 7,
      title: 'Projetos básicos',
      duration: '3H'
    },
    {
      number: 8,
      title: 'Projetos avançados',
      duration: '8H'
    }
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
              <div className="about-headline">
                FORMAÇÃO COMPLETA EM DESENVOLVIMENTO WEB COM CERTIFICAÇÃO.
              </div>
              
              <h2 className="about-subheadline">
                Aprenda <span className="html-color">HTML</span> + <span className="css-color">CSS</span> do zero e se torne um desenvolvedor pronto para empreender e para o mercado de trabalho.
              </h2>
              
              <p className="about-promise">
                Vou te mostrar como <span className="highlight-red">lucrar + de R$10 mil por mês</span> trabalhando no conforto da sua casa, sem ter que investir e com risco zero.
              </p>
            </div>
            
            <div className="about-video">
              <div className="video-wrapper">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="Vídeo de exemplo"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="content" className="content">
        <div className="container">
          <div className="content-header">
            <h2>Conteúdo do Curso</h2>
            <p>Estrutura completa e organizada do programa</p>
          </div>
          <div className="modules-list">
            {modulesData.map((module) => (
              <ModuleFolder
                key={module.number}
                number={module.number}
                title={module.title}
                duration={module.duration}
                topics={module.topics}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="enroll" className="enroll">
        <div className="container">
          <div className="enroll-header">
            <h2>Garanta Sua Vaga Agora</h2>
            <p>Veja tudo que você vai receber por um investimento mínimo</p>
          </div>

          <PricingTabs
            items={valueStackingItems}
            totalValue="R$ 839,00"
            finalPrice="R$ 79,00"
            installmentPrice="R$ 6,50"
          />

          <div className="price-reveal">
            <div className="price-comparison">
              <div className="original-price">
                <span className="price-label">DE</span>
                <span className="price-value strikethrough">R$ 839,00</span>
              </div>
              <div className="arrow-divider">→</div>
              <div className="final-price">
                <span className="price-label">POR APENAS</span>
                <span className="price-value highlight">R$ 79,00</span>
              </div>
            </div>

            <div className="installment-highlight">
              <span className="installment-label">ou em</span>
              <span className="installment-value">12x de R$ 6,50</span>
              <span className="installment-badge">SEM JUROS</span>
            </div>
          </div>

          <div className="cta-wrapper">
            <a href="#checkout" className="cta-button">
              <span className="cta-icon">🚀</span>
              <span className="cta-text">Quero me inscrever agora</span>
            </a>
            <p className="cta-subtitle">Acesso imediato após a confirmação do pagamento</p>
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
