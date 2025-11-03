import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './Carteirinha.css'; // Criaremos este CSS para a mágica da rotação

export default function Carteirinha() {
  // 1. State para controlar se o cartão está virado
  const [isFlipped, setIsFlipped] = useState(false);

  // 2. Dados do Aluno (Mock)
  const dadosAluno = {
    nome: "Nome Usuário Genérico",
    curso: "Engenharia de Software",
    ra: "123456789",
    fotoUrl: "/imagens/usuario-generico.png", // Imagem que você já tem
    logoUrl: "/imagens/logo-educonnect.png", // Logo que você já tem
    validade: "12/2026"
  };

  // 3. O que será codificado no QR Code (pode ser o RA, um link, etc.)
  const qrCodeValue = `https://meuportal.com/validar?ra=${dadosAluno.ra}`;

  return (
    <>
      <h2 className="mb-4">Carteirinha Virtual</h2>

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* O "Palco" 3D que permite a perspectiva */}
          <div className="carteirinha-scene">
            
            {/* O Cartão, que vai girar */}
            <div className={`carteirinha-card ${isFlipped ? 'is-flipped' : ''}`}>
              
              {/* --- FRENTE DO CARTÃO --- */}
              <div className="carteirinha-face carteirinha-frente">
                <div className="header-frente">
                  <img src={dadosAluno.logoUrl} alt="Logo" className="logo-carteirinha" />
                </div>
                <div className="corpo-frente d-flex align-items-center p-3">
                  <div className="flex-shrink-0">
                    <img src={dadosAluno.fotoUrl} alt="Foto" className="foto-carteirinha" />
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <h5 className="mb-1">{dadosAluno.nome}</h5>
                    <p className="mb-1 small text-muted">{dadosAluno.curso}</p>
                    <p className="mb-0 small"><strong>RA:</strong> {dadosAluno.ra}</p>
                  </div>
                </div>
                <div className="footer-frente">
                  CARTEIRINHA DE ESTUDANTE
                </div>
              </div>

              {/* --- VERSO DO CARTÃO --- */}
              <div className="carteirinha-face carteirinha-verso">
                <div className="corpo-verso p-3 text-center">
                  <p className="mb-2">Apresente este QR Code para acesso:</p>
                  {/* O Componente que gera o QR Code */}
                  <div className="qr-code-container">
                    <QRCodeSVG
                      value={qrCodeValue}
                      size={160} // Tamanho em pixels
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="L" // Nível de correção de erro
                    />
                  </div>
                  <p className="mt-3 mb-0 small">Válido até: {dadosAluno.validade}</p>
                </div>
                {/* Simulação de uma tarja magnética (visual) */}
                <div className="tarja-magnetica"></div>
                <div className="barcode-simulado small">
                  || ||| || ||| ||| | ||||| |||
                </div>
              </div>
            </div>
          </div>
          
          {/* Botão para Virar o Cartão */}
          <div className="text-center mt-3">
            <button 
              className="btn btn-outline-primary"
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              {isFlipped ? 'Ver Frente' : 'Ver Verso (QR Code)'}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}