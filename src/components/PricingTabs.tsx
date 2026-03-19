import { useState } from 'react';
import './PricingTabs.css';

interface ValueItem {
  name: string;
  price: string;
  isFree?: boolean;
}

interface PricingTabsProps {
  items: ValueItem[];
  totalValue: string;
  finalPrice: string;
  installmentPrice: string;
}

function PricingTabs({ items, totalValue, finalPrice, installmentPrice }: PricingTabsProps) {
  const [activeTab, setActiveTab] = useState<'receive' | 'individual' | 'investment'>('receive');

  return (
    <div className="pricing-tabs">
      <div className="tabs-header">
        <button
          className={`tab-button ${activeTab === 'receive' ? 'active' : ''}`}
          onClick={() => setActiveTab('receive')}
        >
          <span className="tab-icon">📦</span>
          <span className="tab-label">O que você recebe</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'individual' ? 'active' : ''}`}
          onClick={() => setActiveTab('individual')}
        >
          <span className="tab-icon">💰</span>
          <span className="tab-label">Valor individual</span>
        </button>
        <button
          className={`tab-button ${activeTab === 'investment' ? 'active' : ''}`}
          onClick={() => setActiveTab('investment')}
        >
          <span className="tab-icon">✨</span>
          <span className="tab-label">Seu investimento</span>
        </button>
      </div>

      <div className="tabs-content">
        {activeTab === 'receive' && (
          <div className="tab-panel fade-in">
            <h3 className="panel-title">Tudo que está incluído:</h3>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="value-item">
                  <span className="item-check">✓</span>
                  <span className="item-name">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="tab-panel fade-in">
            <h3 className="panel-title">Valor de cada item separadamente:</h3>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="value-item with-price">
                  <span className="item-name">{item.name}</span>
                  <span className="item-price">{item.price}</span>
                </div>
              ))}
            </div>
            <div className="total-value">
              <span className="total-label">Valor total:</span>
              <span className="total-amount">{totalValue}</span>
            </div>
          </div>
        )}

        {activeTab === 'investment' && (
          <div className="tab-panel fade-in">
            <h3 className="panel-title">Veja como funciona sua oferta:</h3>
            <div className="items-list">
              {items.map((item, index) => (
                <div key={index} className="value-item with-price">
                  <span className="item-name">{item.name}</span>
                  <span className={`item-price ${item.isFree ? 'free' : 'paid'}`}>
                    {item.isFree ? 'GRÁTIS' : finalPrice}
                  </span>
                </div>
              ))}
            </div>
            <div className="investment-highlight">
              <p className="highlight-text">
                Você paga apenas pelo conteúdo principal e leva todos os bônus de presente!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PricingTabs;
