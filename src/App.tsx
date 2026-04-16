import { useEffect } from 'react'
import './App.css'
import Hero from './components/Hero'
import AsideMenu from './components/AsideMenu'
import SpotlightCard from './components/SpotlightCard'
import ModuleFolder from './components/ModuleFolder'
import FaqItem from './components/FaqItem'
import Certificate3D from './components/Certificate3D'
import CircularText from './components/CircularText'
import TypingCTAButton from './components/TypingCTAButton'

function App() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>('.metric-card');
    cards.forEach((el, i) => {
      el.style.setProperty('--card-delay', `${i * 80}ms`);
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleScrollToEnroll = () => {
    const el = document.getElementById('enroll');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const menuItems = [
    { id: 'about', label: 'Sobre' },
    { id: 'metrics', label: 'Métricas' },
    { id: 'features', label: 'Recursos' },
    { id: 'content', label: 'Conteúdo' },
    { id: 'certificate', label: 'Certificado' },
    { id: 'instructors', label: 'Instrutores' },
    { id: 'faq', label: 'Dúvidas' },
    { id: 'enroll', label: 'Inscrever-se' },
  ];

  const instructorsData = [
    {
      name: 'Eduardo Coimbra',
      role: 'Software Engineer',
      bio: 'Desenvolvedor front-end com anos de experiência em projetos reais, apaixonado por transformar iniciantes em profissionais capazes de construir interfaces modernas e responsivas. Criador do Dudecamp e responsável por toda a estrutura didática do curso.',
      imageSrc: '/eduardofoto.jpeg',
      imageAlt: 'Foto de Eduardo Coimbra',
      circularText: 'EDUARDO COIMBRA * DUDECAMP * ',
    },
    {
      name: 'Nome do Instrutor 2',
      role: 'Instrutor de Desenvolvimento Web',
      bio: 'Placeholder — edite esta bio com a apresentação real do segundo instrutor. Descreva sua experiência, área de atuação e o que ele traz de valor para os alunos do Dudecamp.',
      imageSrc: '/eduardofoto.jpeg',
      imageAlt: 'Foto do segundo instrutor',
      circularText: 'HTML*CSS*DUDECAMP*CURSO*',
    },
    {
      name: 'Nome do Instrutor 3',
      role: 'Instrutor de Desenvolvimento Web',
      bio: 'Placeholder — edite esta bio com a apresentação real do terceiro instrutor. Descreva sua experiência, área de atuação e o que ele traz de valor para os alunos do Dudecamp.',
      imageSrc: '/eduardofoto.jpeg',
      imageAlt: 'Foto do terceiro instrutor',
      circularText: 'HTML*CSS*DUDECAMP*CURSO*',
    },
  ];

  const faqData = [
    {
      question: 'Qualquer pessoa pode fazer o curso?',
      answer: 'Sim! O Dudecamp foi estruturado do zero absoluto ao avançado. Mesmo que você nunca tenha tocado em uma linha de código na vida, vai aprender de forma prática, didática e do seu próprio ritmo.'
    },
    {
      question: 'Quais são os requisitos mínimos do meu computador?',
      answer: <>O <span className="html-color">HTML</span> e <span className="css-color">CSS</span> são tecnologias extremamente leves — você não vai precisar de uma máquina potente. Recomendamos no mínimo: 4GB de RAM, processador dual-core (Intel i3, AMD Ryzen 3 ou equivalente) e conexão com a internet. Qualquer computador comprado nos últimos 8 anos já atende com folga. O editor que utilizamos é o VSCode, gratuito e disponível para Windows, Mac e Linux.</>,
    },
    {
      question: 'O curso tem certificado?',
      answer: 'Sim! Ao concluir o curso você recebe um certificado válido em todo o território nacional, com carga horária de 60 horas, contemplando todo o conteúdo abordado durante a formação.'
    },
    {
      question: 'O curso é presencial ou online?',
      answer: '100% online. Você assiste onde quiser, quando quiser, e pode rever as aulas quantas vezes precisar.'
    },
    {
      question: 'E se eu tiver dúvidas durante o curso?',
      answer: 'Sem problema. Dentro da plataforma você pode enviar sua dúvida diretamente abaixo de cada aula. Nossa equipe de suporte responde o mais rápido possível para que você não fique travado em nenhum conteúdo.'
    },
    {
      question: 'O acesso é liberado logo após o pagamento?',
      answer: 'Sim! Pagamentos via PIX e cartão de crédito são reconhecidos quase instantaneamente. Pagamentos por boleto bancário podem levar até 72 horas para serem identificados pelo banco.'
    },
    {
      question: 'Por quanto tempo tenho acesso ao conteúdo?',
      answer: 'O acesso é vitalício. Você paga uma vez e estuda para sempre.'
    }
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
      title: 'CURSO DO ZERO AO AVANÇADO',
      titleColor: '#FFD600',
      description: 'Nunca programou? Sem problema! Nosso curso é 100% pensado para iniciantes. Cada conceito é explicado de forma simples, didática e progressiva, mesmo que você seja um completo novato.',
    },
    {
      title: 'NECESSIDADE DO MERCADO',
      titleColor: '#FFD600',
      description: '<span class="html-color">HTML</span> + <span class="css-color">CSS</span> é a base que todo desenvolvedor precisa dominar. É o conhecimento fundamental que todas as grandes empresas exigem. Sem isso, você não consegue avançar em nenhuma área do desenvolvimento web.',
    },
    {
      title: '28 HORAS DE CONTEÚDO',
      titleColor: '#FFD600',
      description: 'Conteúdo robusto e abrangente cobrindo tudo o que você precisa saber sobre <span class="html-color">HTML</span> + <span class="css-color">CSS</span>. Estruturado de forma progressiva, com exercícios práticos e projetos reais que você vai fazer do zero até ficarem profissionais.',
    },
    {
      title: 'GITHUB',
      titleColor: '#FFD600',
      description: 'Você vai aprender GitHub, a ferramenta padrão do mercado usada por todas as grandes empresas. Isso é essencial para todo programador que quer trabalhar em equipe ou em empresas de grande porte.',
    },
    {
      title: 'BÔNUS',
      titleColor: '#FFD600',
      description: 'Além do curso, você recebe: Prospecção de Clientes (como encontrar sua primeira venda), Precificação de Serviços (quanto cobrar pelo seu trabalho) e um E-book completo de <span class="html-color">HTML</span> + <span class="css-color">CSS</span> para estudar offline.',
    },
    {
      title: 'PRONTO PARA TUDO',
      titleColor: '#FFD600',
      description: 'Ao final do curso você estará preparado para: conseguir um emprego, empreender por conta própria, fazer freelance ou até abrir sua agência de desenvolvimento. O mercado está aberto pra você.',
    },
  ];

  const metricsData = [
    { headline: '+1.500 Alunos', emoji: '🎮', legend: 'Mais de 1.500 pessoas escolheram transformaram suas carreiras' },
    { headline: '97% de Conclusão', emoji: '🏆', legend: 'Essas pessoas não apenas começaram, elas terminaram e já têm seu certificado em mãos' },
    { headline: '4.8/5 de avaliação', emoji: '⭐', legend: 'Alunos satisfeitos que estão colocando em prática' },
    { headline: '+20 Projetos', emoji: '🛠️', legend: 'Projetos reais que você constrói do zero até o fim e pode faturar com eles' },
    { headline: 'Suporte 24H', emoji: '💬', legend: 'Você nunca vai ficar travado, sempre haverá alguém da nossa equipe para te ajudar' },
    { headline: '100% Vitalício', emoji: '⏳', legend: 'Pague uma vez e estude para o resto da vida, sempre com as atualizações recorrentes' },
  ];

  return (
    <>
      <Hero />

      <AsideMenu menuItems={menuItems} />

      <div className="main-content">
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
                Vou te mostrar como <span className="highlight-yellow">lucrar + de R$10 mil por mês</span> trabalhando no conforto da sua casa, sem ter que investir e com risco zero.
              </p>
              <TypingCTAButton onScroll={handleScrollToEnroll} />
            </div>
            
            <div className="about-image">
              <div className="image-wrapper">
                <img
                  src="/photosec2.webp"
                  alt="Dudecamp - Formação HTML + CSS"
                  loading="lazy"
                  width="1024"
                  height="1024"
                />
                <div className="dev-text-overlay">Você DEV.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="metrics" className="metrics">
        <div className="container">
          <div className="metrics-grid">
            {metricsData.map((metric) => (
              <div key={metric.headline} className="metric-card">
                <span className="metric-emoji">{metric.emoji}</span>
                <span className="metric-headline">{metric.headline}</span>
                <p className="metric-legend">{metric.legend}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

        <section id="features" className="features">
          <div className="container">
            <div className="section-header">
              <h2>Recursos Exclusivos</h2>
              <p>Tudo que você precisa para dominar <span className="html-color">HTML</span> + <span className="css-color">CSS</span></p>
            </div>
            <div className="features-grid">
              {featuresData.map((feature) => (
                <SpotlightCard
                  key={feature.title}
                  title={feature.title}
                  titleColor={feature.titleColor}
                  description={feature.description}
                />
              ))}
            </div>
            <div className="features-cta">
              <button className="cta-button cta-button--compact" onClick={handleScrollToEnroll}>
                <span className="cta-icon">🚀</span>
                <span className="cta-text">Quero me inscrever agora</span>
              </button>
            </div>
          </div>
        </section>

      <section id="content" className="content">
        <div className="container">
          <div className="content-header">
            <h2>Conteúdo do Curso</h2>
            <p>Estrutura completa e organizada do programa</p>
          </div>
          <div className="modules-columns-wrapper">
            <div className="modules-column">
              {modulesData.slice(0, 4).map((module) => (
                <ModuleFolder
                  key={module.number}
                  number={module.number}
                  title={module.title}
                  duration={module.duration}
                  topics={module.topics}
                />
              ))}
            </div>
            <div className="modules-column">
              {modulesData.slice(4, 8).map((module) => (
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
        </div>
      </section>

      <section id="certificate" className="certificate">
        <div className="container">
          <div className="certificate-layout">
            <div className="certificate-text">
              <h2>Certificado de Conclusão</h2>
              <p className="certificate-description">
                Ao concluir o curso, você recebe um certificado oficial de 60 horas comprovando sua formação em <span className="html-color">HTML</span> e <span className="css-color">CSS</span>.
              </p>
              <p className="certificate-description">
                Este documento atesta que você completou uma formação estruturada e prática em duas das tecnologias mais fundamentais para desenvolvimento web. Não é apenas um "certificado de presença" é a documentação oficial de que você domina esses conceitos e sabe aplicá-los em projetos reais.
              </p>
            </div>

            <div className="certificate-visual">
              <Certificate3D />
            </div>
          </div>

          <div className="certificate-tip">
            <p>
              💡 <strong>Dica:</strong> Compartilhe seus certificados no LinkedIn para construir sua credibilidade profissional e atrair oportunidades de trabalho.
            </p>
          </div>
        </div>
      </section>

      <section id="instructors" className="instructors">
        <div className="container">
          <div className="instructors-header">
            <h2>Instrutores</h2>
            <p>Aprenda com profissionais que dominam e ensinam <span className="html-color">HTML</span> + <span className="css-color">CSS</span> do zero ao avançado.</p>
          </div>

          <div className="instructor-list">
            {instructorsData.map((instructor, index) => (
              <div key={index} className="instructor-card">
                <div className="instructor-info">
                  <h3 className="instructor-name">{instructor.name}</h3>
                  <p className="instructor-role">{instructor.role}</p>
                  <p className="instructor-bio">{instructor.bio}</p>
                </div>
                <div className="instructor-photo-wrapper">
                  <CircularText
                    text={instructor.circularText}
                    spinDuration={20}
                    onHover="speedUp"
                    className="instructor-circular-text"
                  />
                  <img
                    src={instructor.imageSrc}
                    alt={instructor.imageAlt}
                    className="instructor-photo"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="faq">
        <div className="container">
          <div className="faq-header">
            <h2>Dúvidas frequentes</h2>
            <p>Tire suas dúvidas antes de começar sua jornada</p>
          </div>

          <div className="faq-list">
            {faqData.map((faq, index) => (
              <FaqItem
                key={index}
                question={faq.question}
                answer={faq.answer}
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

          <div className="value-stacking">
            <h3 className="stacking-title">Tudo que está incluído na sua inscrição:</h3>
            
            <div className="stacking-list">
              <div className="stacking-item featured">
                <div className="item-info">
                  <span className="item-icon">🎓</span>
                  <div className="item-details">
                    <h4 className="item-name">Conteúdo do Curso</h4>
                    <p className="item-description">Formação completa em <span className="html-color">HTML</span> + <span className="css-color">CSS</span></p>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 497,00</span>
                  <span className="current-value paid">R$ 79,00</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">💻</span>
                  <div className="item-details">
                    <h4 className="item-name">Módulo - Github para iniciantes</h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 97,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">📈</span>
                  <div className="item-details">
                    <h4 className="item-name">Módulo - Prospecção de clientes</h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 67,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">💲</span>
                  <div className="item-details">
                    <h4 className="item-name">Módulo - Precificação</h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 67,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">🎨</span>
                  <div className="item-details">
                    <h4 className="item-name">Pack de seções prontas</h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 37,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">✨</span>
                  <div className="item-details">
                    <h4 className="item-name">Pack de efeitos <span className="css-color">CSS</span></h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 37,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>

              <div className="stacking-item">
                <div className="item-info">
                  <span className="item-icon">📚</span>
                  <div className="item-details">
                    <h4 className="item-name">E-book de <span className="html-color">HTML</span> + <span className="css-color">CSS</span></h4>
                  </div>
                </div>
                <div className="item-pricing">
                  <span className="original-value">R$ 37,00</span>
                  <span className="current-value free">GRÁTIS</span>
                </div>
              </div>
            </div>
          </div>

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
              <span className="installment-value">10x <span className="installment-conjunction">de</span> R$ 7,90</span>
              <span className="installment-badge">SEM JUROS</span>
            </div>
          </div>

          <div className="cta-wrapper">
            <a href="#checkout" className="cta-button">
              <span className="cta-text">Quero me inscrever agora</span>
              <span className="cta-icon">🚀</span>
            </a>
            <p className="cta-subtitle">Acesso imediato após a confirmação do pagamento</p>
          </div>

          <div className="guarantee-block">
            <div className="guarantee-text">
              <h3 className="guarantee-headline">Se você não gostar eu devolvo seu dinheiro.</h3>
              <p className="guarantee-description">Se por algum motivo você comprar esse produto e não se sentir satisfeito, é só solicitar que eu devolvo todo o seu investimento sem burocracia.</p>
            </div>
            <div className="guarantee-badge">
              <span className="guarantee-number">7</span>
              <div className="guarantee-info">
                <span className="guarantee-days">Dias de</span>
                <span className="guarantee-label">Garantia</span>
                <div className="guarantee-stars">★★★★★</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer id="footer" className="footer">
        <div className="container">
          <div className="footer-content">

            {/* BLOCO DE MARCA */}
            <div className="footer-column footer-brand">
              <div className="footer-logo">
                <span className="footer-logo-text">Dudecamp</span>
              </div>
              <p className="footer-tagline">
                Formação prática em HTML + CSS para quem quer entrar de vez no desenvolvimento web.
              </p>
            </div>

            {/* BLOCO DE CONTATO */}
            <div className="footer-column footer-contact">
              <h4>Contato</h4>
              <ul>
                <li>
                  <a href="mailto:contato@seudominio.com" className="footer-contact-link">
                    <span className="footer-contact-icon">✉</span>
                    contato@seudominio.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/5500000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-contact-link"
                  >
                    <span className="footer-contact-icon">💬</span>
                    (00) 00000-0000
                  </a>
                </li>
              </ul>
            </div>

            {/* BLOCO DE NAVEGAÇÃO */}
            <div className="footer-column footer-links">
              <h4>Navegação</h4>
              <ul>
                <li><a href="#features">Recursos</a></li>
                <li><a href="#content">Conteúdo</a></li>
                <li><a href="#certificate">Certificado</a></li>
                <li><a href="#enroll">Inscrever-se</a></li>
                <li><a href="#faq">Dúvidas</a></li>
              </ul>
            </div>

            {/* BLOCO DE INFO DO CURSO */}
            <div className="footer-column footer-info">
              <h4>O Curso</h4>
              <ul className="footer-info-list">
                <li><span className="footer-info-dot"></span>Curso 100% online</li>
                <li><span className="footer-info-dot"></span>Acesso vitalício</li>
                <li><span className="footer-info-dot"></span>Certificado de 60 horas</li>
                <li><span className="footer-info-dot"></span>Suporte para dúvidas</li>
                <li><span className="footer-info-dot"></span>Conteúdo 100% prático</li>
              </ul>
            </div>

          </div>

          {/* FAIXA INFERIOR */}
          <div className="footer-bottom">
            <div className="footer-credit">
              <span>Site desenvolvido por</span>
              <img src="/md-blacklogo1.png" alt="Dudecamp" className="footer-credit-logo-img" />
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}

export default App
