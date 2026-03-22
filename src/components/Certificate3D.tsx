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

  const showFront = Math.abs((rotation % 360 + 360) % 360 - 180) > 90;

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
          <div className="certificate-content">
            <div className="certificate-header">
              <h3>CERTIFICADO DE CONCLUSÃO</h3>
            </div>
            <div className="certificate-body">
              <p className="certificate-text">Certificamos que</p>
              <p className="certificate-name">Nome do Aluno</p>
              <p className="certificate-text">concluiu com êxito o curso</p>
              <p className="certificate-course">Formação HTML + CSS</p>
              <p className="certificate-hours">Carga horária: 60 horas</p>
            </div>
            <div className="certificate-footer">
              <div className="certificate-signature">
                <div className="signature-line"></div>
                <p>Dudecamp</p>
              </div>
              <div className="certificate-date">
                <p>Data de conclusão</p>
                <p className="date-value">__/__/____</p>
              </div>
            </div>
          </div>
        </div>

        <div className="certificate-side certificate-back">
          <div className="certificate-back-content">
            <h4>Parabéns pela sua conquista!</h4>
            <p>
              Este certificado representa seu compromisso com o aprendizado e desenvolvimento profissional. 
              Você deu um passo importante rumo ao domínio das tecnologias fundamentais da web.
            </p>
            <p>
              Continue praticando, construindo projetos e expandindo seus conhecimentos. 
              O mercado de tecnologia está cheio de oportunidades para quem se dedica.
            </p>
            <p className="motivational-quote">
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
