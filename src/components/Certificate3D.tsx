import { useState, useRef } from 'react';
import './Certificate3D.css';

function Certificate3D() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const currentRotationRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    currentRotationRef.current = rotation;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startXRef.current;
    const rotationChange = deltaX * 0.5;
    setRotation(currentRotationRef.current + rotationChange);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startXRef.current = e.touches[0].clientX;
    currentRotationRef.current = rotation;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startXRef.current;
    const rotationChange = deltaX * 0.5;
    setRotation(currentRotationRef.current + rotationChange);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <div 
      className="certificate-3d-container"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="certificate-wrapper"
        style={{ transform: `rotateY(${rotation}deg)` }}
      >
        <div className="certificate-side certificate-front">
          <div className="cert-inner">
            <div className="cert-border-outer">
              <div className="cert-border-inner">

                <div className="cert-top">
                  <p className="cert-institution">DUDECAMP</p>
                  <h2 className="cert-title">Certificado de Conclusão</h2>
                  <div className="cert-divider">
                    <span className="cert-divider-line"></span>
                    <span className="cert-divider-diamond">◆</span>
                    <span className="cert-divider-line"></span>
                  </div>
                </div>

                <div className="cert-body">
                  <p className="cert-certifies">Certificamos que</p>
                  <p className="cert-name">Nome do Aluno</p>
                  <p className="cert-certifies">concluiu com aproveitamento o curso</p>
                  <p className="cert-course">Formação Completa em HTML + CSS</p>
                  <p className="cert-hours">Carga Horária: 60 horas</p>
                </div>

                <div className="cert-bottom">
                  <div className="cert-sig">
                    <div className="cert-sig-line"></div>
                    <p className="cert-sig-name">Dudecamp</p>
                    <p className="cert-sig-role">Plataforma de Ensino</p>
                  </div>
                  <div className="cert-seal">
                    <div className="cert-seal-circle">
                      <span>✦</span>
                    </div>
                  </div>
                  <div className="cert-sig">
                    <div className="cert-sig-line"></div>
                    <p className="cert-sig-name">__/__/____</p>
                    <p className="cert-sig-role">Data de Conclusão</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="certificate-side certificate-back">
          <div className="cert-back-inner">
            <div className="cert-back-logo">DUDECAMP</div>
            <h4 className="cert-back-title">Parabéns pela sua conquista!</h4>
            <p className="cert-back-text">
              Este certificado representa seu compromisso com o aprendizado e desenvolvimento profissional.
              Você dominou as tecnologias fundamentais da web e está pronto para o mercado.
            </p>
            <p className="cert-back-quote">
              "O sucesso é a soma de pequenos esforços repetidos dia após dia."
            </p>
          </div>
        </div>
      </div>

      <p className="interaction-hint">
        {isDragging ? '↔ Arraste para girar' : '👆 Clique e arraste para girar o certificado'}
      </p>
    </div>
  );
}

export default Certificate3D;
