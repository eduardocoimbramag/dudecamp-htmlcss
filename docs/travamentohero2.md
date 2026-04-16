# Diagnóstico de Performance — Seções Sobre, Métricas e Recursos

> Análise técnica aprofundada das causas de jank e custo de renderização  
> nas seções `#about`, `#metrics` e `#features` do Dudecamp.  
> Mesmo formato do `travamentohero.md` — impacto, causa-raiz e solução por problema.

---

## Resumo Executivo

As três seções concentram problemas em dois eixos principais:

1. **Re-renders React desnecessários** — O efeito de digitação em `#about` usa `useState` no componente raiz (`App`), forçando re-render de toda a árvore de componentes a cada caractere (a cada 65ms). Isso inclui os 6 `SpotlightCard`, os `ModuleFolder`, o `Certificate3D` e todos os demais filhos — mesmo que nada mude neles visualmente.

2. **SpotlightCard usa React state para rastrear cursor** — Cada pixel de movimento do mouse sobre qualquer card dispara `setMousePosition`, que causa re-render do componente. Com 6 cards na tela, isso pode gerar até **6 re-renders simultâneos por frame**. Combinado com um `@keyframes` de `filter` animado no hover e um `conic-gradient` que repinta a cada atualização, a seção `#features` é a mais cara da página inteira.

---

## Seção: SOBRE (`#about`)

### 🔴 PROBLEMA 1 — `typingText` useState no componente raiz causa re-render de toda a página
**Arquivo:** `App.tsx` — `useState` + `useEffect` (linhas 12-45)  
**Impacto na performance: ALTO**

```typescript
// App.tsx — componente raiz
function App() {
  const [typingText, setTypingText] = useState('');

  useEffect(() => {
    const tick = () => {
      setTypingText(chars.slice(0, charIndex).join(''));
      timeoutId = setTimeout(tick, 65); // dispara a cada 65ms
    };
    // ...
  }, []);
```

**Por que trava:**  
`setTypingText` é um `setState` no componente `App` — o componente raiz que contém toda a página. A cada chamada (a cada 65ms durante a digitação), React re-renderiza `App` e todos os seus filhos não memoizados, incluindo:

- 6 instâncias de `SpotlightCard`
- Todos os `ModuleFolder`
- O `Certificate3D` (que contém animações 3D complexas)
- O `AsideMenu`
- Todas as seções estáticas

Isso acontece **~15 vezes por segundo** durante o efeito de digitação, e **~33 vezes por segundo** durante o efeito de apagamento (`setTimeout(tick, 30)`). É um re-render completo de uma árvore pesada a 15–33fps em background.

**Impacto visual após correção:**  
Nenhum. O efeito de digitação continua idêntico. Apenas o escopo do re-render muda.

**Solução recomendada — extrair para componente isolado:**
```tsx
// Componente separado — só ELE re-renderiza a cada 65ms
function TypingCTAButton({ onScroll }: { onScroll: () => void }) {
  const [typingText, setTypingText] = useState('');
  useEffect(() => {
    // mesma lógica do tick
  }, []);
  return (
    <button className="cta-button about-section-cta" onClick={onScroll}>
      <span className="typing-wrapper">
        <span className="typing-sizer">Quero fazer parte do time !!!</span>
        <span className="typing-live">
          {typingText}<span className="typing-cursor">|</span>
        </span>
      </span>
    </button>
  );
}
```

Em `App`, substituir o bloco `<button>` pelo componente:
```tsx
<TypingCTAButton onScroll={handleScrollToEnroll} />
```

Agora apenas `TypingCTAButton` re-renderiza a cada tick. Todo o restante da página fica estático.

---

### 🟡 PROBLEMA 2 — `<img>` na seção #about sem `width` e `height` explícitos → CLS
**Arquivo:** `App.tsx` — linha 265-269  
**Impacto na performance: MÉDIO (UX/CLS)**

```tsx
<img
  src="/photosec2.webp"
  alt="Dudecamp - Formação HTML + CSS"
  loading="lazy"
  // ❌ sem width e height
/>
```

**Por que causa problema:**  
`loading="lazy"` é ótimo — a imagem não carrega até estar próxima do viewport. Porém, sem `width` e `height` explícitos, o browser não reserva espaço para a imagem antes do carregamento. Quando ela finalmente carrega, o layout empurra todo o conteúdo abaixo (Métricas, Recursos, etc.) para baixo — isso é **CLS (Cumulative Layout Shift)**, uma das métricas Core Web Vitals do Google. Alto CLS prejudica SEO e a experiência do usuário.

**Impacto visual após correção:**  
A página para de "pular" quando a imagem da seção Sobre carrega. Layout estável desde o primeiro frame.

**Solução recomendada:**
```tsx
<img
  src="/photosec2.webp"
  alt="Dudecamp - Formação HTML + CSS"
  loading="lazy"
  width="640"
  height="480"
  style={{ width: '100%', height: 'auto' }}
/>
```

Os valores de `width` e `height` devem corresponder às dimensões reais do arquivo `/photosec2.webp`. Mesmo com `style={{ width: '100%', height: 'auto' }}` para responsividade, o browser usa o `width/height` do atributo para calcular o `aspect-ratio` e reservar o espaço correto antes do carregamento.

---

## Seção: MÉTRICAS (`#metrics`)

### 🟡 PROBLEMA 3 — `key={index}` em lista de métricas
**Arquivo:** `App.tsx` — linha 280  
**Impacto na performance: BAIXO**

```tsx
{metricsData.map((metric, index) => (
  <div key={index} className="metric-card">
```

**Por que é um problema:**  
O `index` como key funciona quando a lista é completamente estática e nunca reordena. Mas se no futuro `metricsData` for reordenada, filtrada ou tiver items adicionados/removidos no meio, o React vai reusar elementos errados causando bugs visuais (transições incorretas, estado incorreto em componentes filhos). É uma dívida técnica que deve ser resolvida agora enquanto o custo é zero.

**Solução recomendada:**
```tsx
{metricsData.map((metric) => (
  <div key={metric.headline} className="metric-card">
```

Usar `metric.headline` como key — é único por card e estável.

---

### 🟡 PROBLEMA 4 — Métricas sem observação de visibilidade para entrada animada
**Arquivo:** `App.css` / `App.tsx` — seção `#metrics`  
**Impacto na performance: BAIXO**

As métricas são elementos estáticos sem animação de entrada. Se no futuro forem adicionadas animações CSS de entrada (`@keyframes slideIn`, `opacity`, etc.), elas devem ser acionadas pelo `IntersectionObserver` e não por CSS puro ativo desde o carregamento da página. Documentado aqui como ponto de atenção para evitar regressão futura.

**Solução recomendada (preventiva):**
```typescript
// Padrão a adotar quando animações de entrada forem adicionadas
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // disparar apenas uma vez
    }
  },
  { threshold: 0.15 }
);
document.querySelectorAll('.metric-card').forEach(el => observer.observe(el));
```

---

## Seção: RECURSOS (`#features` + `SpotlightCard`)

### 🔴 PROBLEMA 5 — `useState` para posição do mouse → re-render React por pixel de movimento
**Arquivo:** `SpotlightCard.tsx` — linhas 13-23  
**Impacto na performance: CRÍTICO**

```typescript
const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
  if (!cardRef.current) return;
  const rect = cardRef.current.getBoundingClientRect();
  setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
};
```

**Por que trava:**  
`setMousePosition` é um `setState`. Cada chamada dispara um re-render completo do `SpotlightCard`. Com 6 cards na grid e o mouse movendo-se a 60+ eventos por segundo:

- 6 componentes × 60 eventos/s = até **360 ciclos de reconciliação React por segundo** na seção
- A cada re-render, React recria o objeto `style` inline com os novos valores de `--mouse-x` e `--mouse-y`
- O DOM é atualizado com novos inline styles
- O browser repinta `::after` (radial-gradient) e `.spotlight-card-border` (conic-gradient) com as novas coordenadas

Além disso, `{ x, y }` cria um novo objeto a cada evento (pressão no garbage collector), e `getBoundingClientRect()` é chamado a cada evento (leitura de layout que pode forçar reflow se o CSS estiver dirty).

**Impacto visual após correção:**  
Nenhum. O spotlight continua seguindo o cursor — apenas a implementação muda de React state para manipulação direta de DOM.

**Solução recomendada — remover useState, usar ref diretamente:**
```typescript
// Antes: useState → re-render por pixel
// Depois: ref → DOM direto, zero React re-renders

function SpotlightCard({ title, titleColor, description }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  // ❌ REMOVER: const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      className="spotlight-card"
      onMouseMove={handleMouseMove}
      // ❌ REMOVER: style={{ '--mouse-x': ..., '--mouse-y': ... }}
    >
```

As CSS custom properties (`--mouse-x`, `--mouse-y`) continuam sendo atualizadas no elemento, mas agora via `style.setProperty` diretamente no DOM — sem passar pelo React, sem re-render, sem reconciliação, sem GC.

---

### 🔴 PROBLEMA 6 — `@keyframes border-glow` com `filter` animado no hover
**Arquivo:** `SpotlightCard.css` — linhas 109-116  
**Impacto na performance: ALTO**

```css
@keyframes border-glow {
  0%, 100% {
    filter: blur(1px) brightness(1.2) drop-shadow(0 0 10px rgba(255, 214, 0, 0.55));
  }
  50% {
    filter: blur(1px) brightness(1.4) drop-shadow(0 0 18px rgba(255, 214, 0, 0.80));
  }
}

.spotlight-card:hover .spotlight-card-border {
  opacity: 1;
  animation: border-glow 3s ease-in-out infinite; /* ativa ao hover */
}
```

**Por que trava:**  
Idêntico ao **Problema 1** do `travamentohero.md`: `filter` com valores que mudam em `@keyframes` força repaint CPU a cada frame. `blur(1px)`, `brightness()` e `drop-shadow()` mudam entre keyframes → o browser não pode cachear a layer composited → repaint completo a 60fps durante todo o hover.

Com até 6 cards em hover simultâneo (cursor movendo-se sobre a grid), isso pode ser 6× o custo de um elemento único.

**Impacto visual após correção:**  
Nenhum. Animar apenas `opacity` (GPU compositor) produz o mesmo efeito de "pulsar brilho" sem repaint.

**Solução recomendada:**
```css
/* Substituir a animação de filter por animação de opacity (GPU) */
@keyframes border-glow-opacity {
  0%, 100% { opacity: 0.75; }
  50%       { opacity: 1;    }
}

.spotlight-card:hover .spotlight-card-border {
  /* filter estático — computado UMA vez, cacheado */
  filter: blur(1px) brightness(1.3) drop-shadow(0 0 14px rgba(255, 214, 0, 0.68));
  opacity: 1;
  animation: border-glow-opacity 3s ease-in-out infinite;
}
```

O `filter` com valor **fixo** é computado uma vez no primeiro frame do hover e cacheado. Apenas `opacity` anima — 100% GPU compositor, zero repaint.

---

### 🟠 PROBLEMA 7 — `conic-gradient` com CSS custom props → repaint por pixel de movimento
**Arquivo:** `SpotlightCard.css` — linhas 45-61 e 71-102  
**Impacto na performance: ALTO**

```css
.spotlight-card::after {
  background: radial-gradient(
    400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 214, 0, 0.26), ...
  );
}

.spotlight-card-border {
  background: conic-gradient(
    from 0deg at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 214, 0, 0.90) 0deg, ...
  );
}
```

**Por que trava:**  
CSS custom properties (`var(--mouse-x)`, `var(--mouse-y)`) em gradientes fazem com que o browser **repinte os gradientes sempre que as variáveis mudam**. A cada pixel de movimento do mouse:

- `--mouse-x` e `--mouse-y` são atualizados no DOM (via `setProperty`)
- O browser invalida o cache de paint do `::after` e do `.spotlight-card-border`
- Os dois gradientes são recalculados e repintados

`conic-gradient` é particularmente custoso: exige cálculo angular completo para cada pixel da área do elemento — é mais pesado que `radial-gradient` e muito mais pesado que `linear-gradient`.

**Impacto visual após correção:**  
Nenhum no visual. Mas a fluidez do spotlight melhora visivelmente em mid-range, pois a repaint tem menos trabalho a fazer.

**Solução recomendada — throttle do handleMouseMove com rAF:**
```typescript
let rafPendingCard = false;
const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
  const card = cardRef.current;
  if (!card) return;
  if (!rafPendingCard) {
    rafPendingCard = true;
    const cx = e.clientX;
    const cy = e.clientY;
    requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${cx - rect.left}px`);
      card.style.setProperty('--mouse-y', `${cy - rect.top}px`);
      rafPendingCard = false;
    });
  }
};
```

Isso limita as atualizações dos gradientes a **1 repaint por frame** (60fps máximo) em vez de disparar a cada evento nativo do mouse (que pode ser 200+/s).

**Nota:** `getBoundingClientRect()` também foi movido para dentro do `rAF callback`, garantindo que a leitura de layout ocorra após qualquer mutação de CSS do frame anterior — evitando forced reflow.

---

### 🟠 PROBLEMA 8 — `transition: all 0.3s ease` em `.spotlight-card-content`
**Arquivo:** `SpotlightCard.css` — linha 132  
**Impacto na performance: MÉDIO**

```css
.spotlight-card-content {
  transition: all 0.3s ease; /* ❌ transition: all */
}
```

**Por que é um problema:**  
`transition: all` instrui o browser a monitorar TODAS as propriedades CSS do elemento para mudanças e aplicar transição a qualquer uma delas. Isso tem custo constante — a cada frame em que o elemento está animando (ou potencialmente animando), o browser verifica dezenas de propriedades. No hover do card, apenas o `background` muda (de transparente para `rgba(0,0,0,0.02)`).

**Impacto visual após correção:**  
Nenhum. Apenas `background` faz transição, que é o único que muda no hover.

**Solução recomendada:**
```css
.spotlight-card-content {
  transition: background 0.3s ease;
}
```

---

### 🟡 PROBLEMA 9 — `dangerouslySetInnerHTML` em componente que re-renderiza por mousemove
**Arquivo:** `SpotlightCard.tsx` — linha 48  
**Impacto na performance: BAIXO (será eliminado após Problema 5)**

```tsx
<p
  className="spotlight-card-description"
  dangerouslySetInnerHTML={{ __html: description }}
/>
```

**Por que é relevante:**  
Com o bug do Problema 5 (useState para mouse), cada re-render força React a comparar o `__html` atual com o novo para decidir se precisa atualizar o DOM. `dangerouslySetInnerHTML` bypassa o virtual DOM — React faz a comparação como string (`newHTML !== currentHTML`). Para HTML estático isso é rápido, mas é trabalho desnecessário acontecendo 60× por segundo durante o movimento do mouse.

**Após a correção do Problema 5** (remover useState, usar ref direto), o componente para de re-renderizar durante o mousemove — e este problema desaparece automaticamente.

**Solução recomendada (se as strings de description fossem JSX puro, evitar `dangerouslySetInnerHTML`):**  
Como as descriptions contêm HTML real com `<span>` de cor, `dangerouslySetInnerHTML` é necessário aqui. A solução é resolver o Problema 5 para que ele nunca seja chamado desnecessariamente.

---

## Tabela de Impacto e Prioridade

| # | Seção | Problema | Impacto | Prioridade | Impacto Visual | Esforço |
|---|-------|----------|---------|-----------|----------------|---------|
| 1 | Sobre | `typingText` useState em App raiz | 🔴 Alto | Imediata | Nenhum | Baixo |
| 2 | Sobre | `<img>` sem width/height (CLS) | 🟠 Médio | Alta | Layout não pula | Muito baixo |
| 3 | Métricas | `key={index}` em map | 🟡 Baixo | Baixa | Nenhum | Muito baixo |
| 4 | Métricas | Sem IntersectionObserver preventivo | 🟡 Baixo | Baixa | Nenhum | Preventivo |
| 5 | Recursos | `useState` mousePosition → re-renders | 🔴 Crítico | Imediata | Nenhum | Baixo |
| 6 | Recursos | `@keyframes border-glow` com filter | 🔴 Alto | Imediata | Nenhum | Baixo |
| 7 | Recursos | `conic-gradient` sem throttle rAF | 🟠 Alto | Alta | Nenhum | Baixo |
| 8 | Recursos | `transition: all` em card-content | 🟠 Médio | Média | Nenhum | Muito baixo |
| 9 | Recursos | `dangerouslySetInnerHTML` no re-render | 🟡 Baixo | Resolvido com P5 | Nenhum | — |

---

## Estimativa de Ganho por Grupo de Fixes

### Fix Grupo A — Críticos (Problemas 1, 5, 6)
- **Ganho estimado: 50–70% de redução de carga CPU na página inteira**
- Problema 1: Elimina re-render de toda a árvore 15–33× por segundo
- Problema 5: Elimina 360 ciclos de reconciliação React/s na grid de features
- Problema 6: Elimina repaint CPU 60×/s no hover dos cards

### Fix Grupo B — Importantes (Problemas 2, 7, 8)
- **Ganho estimado: 10–20% adicional**
- Problema 2: Elimina CLS e melhora Core Web Vitals / SEO
- Problema 7: Reduz repaints de gradiente de 200×/s para 60×/s
- Problema 8: Elimina overhead de `transition: all`

### Fix Grupo C — Higiene (Problemas 3, 4, 9)
- **Ganho estimado: negligível em runtime**
- Reduz dívida técnica e prepara para escala futura

---

## Ordem de Implementação Recomendada

1. **SpotlightCard — remover useState, usar ref + setProperty** *(10 min, P5 + P9 de uma vez)*
2. **SpotlightCard — throttle handleMouseMove com rAF** *(5 min, P7)*
3. **SpotlightCard.css — substituir border-glow filter animado por opacity** *(5 min, P6)*
4. **SpotlightCard.css — `transition: all` → `transition: background`** *(1 min, P8)*
5. **App.tsx — extrair TypingCTAButton para componente isolado** *(15 min, P1)*
6. **App.tsx — adicionar width/height na `<img>` do about** *(2 min, P2)*
7. **App.tsx — substituir `key={index}` por `key={metric.headline}`** *(1 min, P3)*

---

## O Que Muda Visualmente Após Cada Fix?

| Fix | O que parece igual | O que pode mudar |
|-----|-------------------|-----------------|
| Remover useState no SpotlightCard | Spotlight segue o cursor idêntico | Fluidez melhora visivelmente em mid-range |
| throttle handleMouseMove rAF | Spotlight segue o cursor idêntico | Nada perceptível em 60fps |
| border-glow opacity em vez de filter | Brilho da borda pulsa igual | Suavidade pode parecer levemente diferente |
| transition: background | Card hover idêntico | Nada |
| TypingCTAButton isolado | Efeito de digitação idêntico | Nada |
| img width/height | Layout idêntico após carga | Página para de pular quando imagem carrega |

---

*Documento gerado em: Abril 2026*  
*Projeto: Dudecamp HTML+CSS — `dudecamp-htmlcss`*
