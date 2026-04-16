# Diagnóstico de Performance — Seções Conteúdo e Certificado

> Análise técnica aprofundada das causas de jank e custo de renderização  
> nas seções `#content` e `#certificate` do Dudecamp.  
> Mesmo formato dos documentos anteriores — impacto, causa-raiz e solução por problema.

---

## Resumo Executivo

As duas seções têm perfis de problema distintos:

1. **`#content` (ModuleFolder)** — Seção relativamente eficiente. Os problemas são de baixo a médio impacto: `key={index}` em topics, `transition: all` no container do módulo e `filter: grayscale` estático no ícone. Nada que trave a página, mas dívida técnica que vale corrigir.

2. **`#certificate` (Certificate3D)** — O componente mais crítico de toda a página fora do Hero. Durante o arrastar do certificado, `setRotation` dispara a cada pixel de movimento do mouse → React re-renderiza o componente inteiro a 60–200fps durante o drag. Combinado com a ausência de throttle por `requestAnimationFrame` e com o CSS `transition` ativo durante o arrasto (criando lag visual), a seção tem o maior potencial de melhoria de fluidez fora do Hero.

---

## Seção: CONTEÚDO (`#content`)

### 🟡 PROBLEMA 1 — `key={index}` em topics.map
**Arquivo:** `ModuleFolder.tsx` — linha 33  
**Impacto na performance: BAIXO**

```tsx
{topics.map((topic, index) => (
  <div key={index} className="topic-item">
```

**Por que é um problema:**  
Idêntico ao Problema 3 do `travamentohero2.md`. Ao usar `index` como `key`, React identifica cada tópico pela posição e não pelo conteúdo. Se tópicos forem reordenados ou inseridos no meio, React reusa elementos errados. Para dados estáticos isso não trava, mas é dívida técnica com risco de bug futuro.

**Impacto visual após correção:**  
Nenhum.

**Solução recomendada:**
```tsx
{topics.map((topic) => (
  <div key={topic} className="topic-item">
```

Usar o próprio texto do tópico como key — são strings únicas dentro de um módulo.

---

### 🟠 PROBLEMA 2 — `transition: all 0.2s ease` em `.module-folder`
**Arquivo:** `ModuleFolder.css` — linha 10  
**Impacto na performance: MÉDIO**

```css
.module-folder {
  transition: all 0.2s ease; /* ❌ transition: all */
}
```

**Por que é um problema:**  
`transition: all` faz o browser monitorar todas as propriedades CSS do elemento a cada frame em que o componente está animando. No hover do módulo, apenas `border-color` e `background` mudam (`.module-folder:hover` nas linhas 14-17). O custo de checar dezenas de outras propriedades é constante e desnecessário.

Com 8 módulos na tela (duas colunas de 4), o custo se multiplica quando o cursor passa pela lista.

**Impacto visual após correção:**  
Nenhum. O efeito de hover continua idêntico.

**Solução recomendada:**
```css
.module-folder {
  transition: border-color 0.2s ease, background 0.2s ease;
}
```

---

### 🟡 PROBLEMA 3 — `filter: grayscale(0.3)` estático no ícone do módulo
**Arquivo:** `ModuleFolder.css` — linha 56  
**Impacto na performance: BAIXO**

```css
.module-icon {
  filter: grayscale(0.3);
}
```

**Por que é relevante:**  
Um `filter` estático (sem animação) é computado pelo browser **uma vez** no primeiro paint e cacheado. Não causa repaint contínuo — ao contrário do `filter` animado por `@keyframes` que vimos no Hero e nos SpotlightCards.

Entretanto, o `filter` cria um novo stacking context e um bloco de formatação independente para o elemento. Em um componente que re-renderiza ao expandir/colapsar (`isExpanded` state), o browser repinta o ícone a cada toggle. Como o ícone também troca de caractere (📁 → 📂 → 📄), o repaint já é inevitável — o filter apenas adiciona um passo extra de compositing nesse momento.

**Impacto visual após correção:**  
O ícone perderia o efeito de dessaturação leve, mas emoji já tem saturação natural. Se o efeito não for perceptível, remover o filter é o caminho mais limpo.

**Solução recomendada (opcional):**
```css
/* Remover completamente, ou reduzir scope */
.module-icon {
  /* filter: grayscale(0.3); — remover se o efeito não for essencial */
}
```

---

### 🟡 PROBLEMA 4 — Seção Conteúdo sem IntersectionObserver para entrada animada
**Arquivo:** `App.tsx` / `App.css` — seção `#content`  
**Impacto na performance: BAIXO (preventivo)**

Os `ModuleFolder` são renderizados e pintados completamente ao carregar a página, mesmo que estejam fora do viewport. Não existe atualmente nenhuma animação de entrada — este problema é preventivo para quando animações forem adicionadas.

**Solução recomendada (preventiva):**  
Seguir o mesmo padrão implementado para `.metric-card` em `travamentohero2.md`:

```typescript
useEffect(() => {
  const folders = document.querySelectorAll<HTMLElement>('.module-folder');
  folders.forEach((el, i) => {
    el.style.setProperty('--folder-delay', `${i * 50}ms`);
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
    { threshold: 0.1 }
  );
  folders.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}, []);
```

---

## Seção: CERTIFICADO (`#certificate`)

### 🔴 PROBLEMA 5 — `setRotation` em cada `mousemove` → re-render React a cada pixel de drag
**Arquivo:** `Certificate3D.tsx` — linhas 16-22  
**Impacto na performance: CRÍTICO**

```typescript
const [rotation, setRotation] = useState(0);

const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDragging) return;
  const deltaX = e.clientX - startXRef.current;
  const rotationChange = deltaX * 0.5;
  setRotation(currentRotationRef.current + rotationChange); // ← setState a cada pixel
};
```

**Por que trava:**  
`setRotation` é um `setState`. Durante o drag do certificado, o evento `mousemove` é disparado a **60–200 vezes por segundo** dependendo do hardware. Cada chamada:

1. Dispara re-render completo de `Certificate3D`
2. React reconcilia o JSX (todo o certificado: frente + verso + hint)
3. Atualiza o `style={{ transform: \`rotateY(${rotation}deg)\` }}` no DOM
4. O browser recalcula o layout do elemento com `transform-style: preserve-3d`
5. Composta a cena 3D com os dois lados (`certificate-front` + `certificate-back`)

O mesmo problema ocorre em `handleTouchMove`:
```typescript
const handleTouchMove = (e: React.TouchEvent) => {
  if (!isDragging) return;
  const rotationChange = (e.touches[0].clientX - startXRef.current) * 0.5;
  setRotation(currentRotationRef.current + rotationChange); // ← mesmo problema
};
```

**Impacto visual após correção:**  
Nenhum. O drag continua idêntico — mais suave na prática porque não há overhead de reconciliação React.

**Solução recomendada — eliminar `rotation` e `isDragging` como state, usar refs + DOM direto:**
```typescript
function Certificate3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const rotationRef = useRef(0);          // rotação atual
  const baseRotationRef = useRef(0);      // rotação no momento do mousedown

  const applyRotation = (deg: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.style.transform = `rotateY(${deg}deg)`;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    baseRotationRef.current = rotationRef.current;
    if (wrapperRef.current) wrapperRef.current.style.transition = 'none';
    if (hintRef.current) hintRef.current.textContent = '↔ Arraste para girar';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    rotationRef.current = baseRotationRef.current + (e.clientX - startXRef.current) * 0.5;
    applyRotation(rotationRef.current);
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    if (wrapperRef.current) wrapperRef.current.style.transition = '';
    if (hintRef.current) hintRef.current.textContent = '👆 Clique e arraste para girar o certificado';
  };

  // Touch equivalentes com a mesma lógica
}
```

Resultado: **zero React re-renders durante o drag** — a rotação é aplicada diretamente no DOM via `style.transform`.

---

### 🔴 PROBLEMA 6 — Sem `requestAnimationFrame` throttle em `handleMouseMove` e `handleTouchMove`
**Arquivo:** `Certificate3D.tsx` — linhas 16-22 e 34-40  
**Impacto na performance: ALTO**

```typescript
const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDragging) return;
  // Disparado até 200x/s em mouses de alta frequência, sem throttle
  setRotation(currentRotationRef.current + (e.clientX - startXRef.current) * 0.5);
};
```

**Por que é um problema:**  
Mouses modernos com polling de 125Hz a 1000Hz disparam `mousemove` muito mais rápido do que o browser renderiza (60fps = 16,6ms por frame). Sem throttle por `requestAnimationFrame`, o componente tenta aplicar 200 transformações por segundo num pipeline que renderiza a 60fps. O excesso de trabalho cria fila na main thread e contribui para jank.

**Após a correção do Problema 5** (usar refs + DOM direto), o DOM update é barato o suficiente para não precisar de throttle tão rígido. Mas adicionar um rAF throttle garante que `applyRotation` seja chamado no máximo 1x por frame:

```typescript
const rafPendingRef = useRef(false);

const handleMouseMove = (e: React.MouseEvent) => {
  if (!isDraggingRef.current || rafPendingRef.current) return;
  rafPendingRef.current = true;
  const cx = e.clientX;
  requestAnimationFrame(() => {
    rotationRef.current = baseRotationRef.current + (cx - startXRef.current) * 0.5;
    applyRotation(rotationRef.current);
    rafPendingRef.current = false;
  });
};
```

**Impacto visual após correção:**  
Nenhum em monitores de 60Hz. Em displays de 120Hz ou 144Hz, o rAF se sincroniza com a taxa do display automaticamente.

---

### 🟠 PROBLEMA 7 — `transition: transform 0.08s linear` ativo durante drag
**Arquivo:** `Certificate3D.css` — linha 24  
**Impacto na performance: MÉDIO (UX + performance)**

```css
.certificate-wrapper {
  transition: transform 0.08s linear; /* ativo durante drag */
}
```

**Por que é um problema:**  
Durante o arrasto, a cada frame o browser aplica o novo `rotateY()` e imediatamente inicia uma transição CSS de 0.08s para alcançá-lo. Como o próximo frame aplica outro valor antes da transição anterior terminar, o certificado fica sempre "atrás" da mão — sensação de lag/grudento.

Além disso, cada atualização de `transform` com `transition` ativa obriga o browser a compositar a layer 3D com interpolação — custo extra por frame durante o drag.

**Impacto visual após correção:**  
O arraste fica **instantâneo e preciso** (sem lag), o que é a experiência esperada numa interação de drag. A transição pode ser re-ativada no `mouseup` para suavizar a desaceleração final.

**Solução recomendada:**  
Desativar a transição no `mousedown` e restaurar no `mouseup` (já incorporado na solução do Problema 5):

```typescript
// mousedown:
if (wrapperRef.current) wrapperRef.current.style.transition = 'none';

// mouseup:
if (wrapperRef.current) wrapperRef.current.style.transition = '';
```

Com a transição removida inline durante o drag e restaurada ao soltar, o elemento desacelera suavemente ao liberar e responde imediatamente ao arrastar.

---

### 🟡 PROBLEMA 8 — `will-change: transform` ausente em `.certificate-wrapper`
**Arquivo:** `Certificate3D.css` — linha 19  
**Impacto na performance: BAIXO**

```css
.certificate-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.08s linear;
  /* ❌ sem will-change: transform */
}
```

**Por que é relevante:**  
O elemento `.certificate-wrapper` usa `transform-style: preserve-3d` com dois filhos 3D (`certificate-front` e `certificate-back`). O browser precisa compositar esta cena 3D em uma GPU layer separada. Sem `will-change: transform`, o browser pode não promover o elemento para sua própria camada de compositing até o primeiro frame de animação — causando um "flash" ou jank no primeiro drag.

Com `will-change: transform`, o browser promove a layer na criação do elemento, antes do primeiro drag, eliminando esse custo inicial.

**Impacto visual após correção:**  
Nenhum na aparência. O primeiro arraste pode parecer ligeiramente mais suave.

**Solução recomendada:**
```css
.certificate-wrapper {
  transform-style: preserve-3d;
  transition: transform 0.08s linear;
  will-change: transform;
}
```

**Nota:** `will-change` tem um custo de memória (VRAM) — o browser mantém a layer texturizada na GPU permanentemente. Para um único certificado numa seção estática, o trade-off é positivo.

---

### 🟡 PROBLEMA 9 — `isDragging` state causa re-render duplo por sessão de drag
**Arquivo:** `Certificate3D.tsx` — linhas 6, 11, 26  
**Impacto na performance: BAIXO (resolvido automaticamente com P5)**

```typescript
const [isDragging, setIsDragging] = useState(false);

const handleMouseDown = () => setIsDragging(true);   // re-render
const handleMouseUp = () => setIsDragging(false);     // re-render
```

**Por que é relevante:**  
`isDragging` state causa 2 re-renders por sessão de drag (um no mousedown, um no mouseup). Cada re-render recria o certificado inteiro via React. Esses 2 re-renders são aceitáveis em frequência — o problema real é que eles co-existem com os 200 re-renders/s do `rotation` state (Problema 5).

**Após a correção do Problema 5**, o `isDragging` pode ser migrado para um `useRef` para eliminar esses 2 re-renders restantes e tornar o componente completamente livre de estado. A hint text pode ser atualizada diretamente via `hintRef.current.textContent` (já demonstrado na solução do Problema 5).

---

## Tabela de Impacto e Prioridade

| # | Seção | Problema | Impacto | Prioridade | Impacto Visual | Esforço |
|---|-------|----------|---------|-----------|----------------|---------|
| 1 | Conteúdo | `key={index}` em topics.map | 🟡 Baixo | Baixa | Nenhum | Muito baixo |
| 2 | Conteúdo | `transition: all` em `.module-folder` | 🟠 Médio | Média | Nenhum | Muito baixo |
| 3 | Conteúdo | `filter: grayscale` estático no ícone | 🟡 Baixo | Baixa | Sutil | Muito baixo |
| 4 | Conteúdo | Sem IntersectionObserver preventivo | 🟡 Baixo | Baixa | Nenhum | Preventivo |
| 5 | Certificado | `setRotation` state → re-render por pixel | 🔴 Crítico | Imediata | Drag mais suave | Médio |
| 6 | Certificado | Sem rAF throttle em mousemove/touchmove | 🔴 Alto | Imediata | Nenhum | Baixo |
| 7 | Certificado | `transition` ativo durante drag (lag) | 🟠 Médio | Alta | Drag imediato | Baixo |
| 8 | Certificado | `will-change: transform` ausente | 🟡 Baixo | Baixa | Primeiro drag mais suave | Muito baixo |
| 9 | Certificado | `isDragging` state (2 re-renders/sessão) | 🟡 Baixo | Resolvido com P5 | Nenhum | — |

---

## Estimativa de Ganho por Grupo de Fixes

### Fix Grupo A — Crítico (Problemas 5 + 6)
- **Ganho estimado: 95% de redução de carga durante drag do certificado**
- Elimina completamente os re-renders React durante drag (de 200/s para 0/s)
- Elimina fila de transformações na main thread durante arrasto

### Fix Grupo B — Importante (Problemas 2, 7, 8)
- **Ganho estimado: experiência perceptivelmente melhor no drag**
- P7 elimina o lag do transition durante drag — o certificado responde instantaneamente
- P2 reduz overhead de hover nos módulos
- P8 elimina custo de promoção de layer no primeiro drag

### Fix Grupo C — Higiene (Problemas 1, 3, 4, 9)
- **Ganho estimado: negligível em runtime**
- Reduz dívida técnica e prepara para escala futura

---

## Ordem de Implementação Recomendada

1. **Certificate3D.tsx — eliminar `rotation` e `isDragging` state, usar refs + DOM direto** *(20 min, P5 + P9 + P7)*
2. **Certificate3D.tsx — adicionar rAF throttle em handleMouseMove e handleTouchMove** *(5 min, P6)*
3. **Certificate3D.css — adicionar `will-change: transform`** *(1 min, P8)*
4. **ModuleFolder.css — `transition: all` → propriedades específicas** *(1 min, P2)*
5. **ModuleFolder.tsx — `key={index}` → `key={topic}` em topics.map** *(1 min, P1)*
6. **ModuleFolder.css — avaliar remoção de `filter: grayscale`** *(opcional, P3)*

---

## O Que Muda Visualmente Após Cada Fix?

| Fix | O que parece igual | O que melhora |
|-----|-------------------|---------------|
| Eliminar rotation state (P5) | Certificado rota identicamente | Drag extremamente mais fluido |
| rAF throttle (P6) | Rotação idêntica em 60Hz | Nada perceptível em 60Hz |
| Transition off durante drag (P7) | Certificado rota igual após soltar | **Drag instantâneo sem lag** — maior melhoria percebida |
| will-change (P8) | Aparência idêntica | Primeiro arraste mais suave |
| transition: all → específico (P2) | Hover dos módulos idêntico | Nada |
| key por texto (P1) | Lista de tópicos idêntica | Nada |

---

*Documento gerado em: Abril 2026*  
*Projeto: Dudecamp HTML+CSS — `dudecamp-htmlcss`*
