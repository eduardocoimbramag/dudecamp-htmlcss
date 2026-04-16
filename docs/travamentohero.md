# Diagnóstico de Performance — Hero Section

> Análise técnica aprofundada das causas do travamento/jank na seção Hero,  
> impacto de cada problema e soluções recomendadas com descrição do impacto visual.

---

## Resumo Executivo

A seção Hero empilha **três sistemas simultâneos de animação pesada**: um loop WebGL (MagicRings), animações CSS de `filter` (glow da logo), e um cursor GSAP com ticker global (TargetCursor). A combinação desses três — sem nenhuma estratégia de throttle, pausa por visibilidade ou promoção de camada GPU — cria uma carga constante de CPU+GPU que resulta em jank, quedas de FPS e heat do dispositivo, especialmente em notebooks e mobile mid-range.

---

## Problemas Identificados

### 🔴 PROBLEMA 1 — CSS `filter` animado por `@keyframes` força repaint a cada frame
**Arquivo:** `Hero.css` — `@keyframes logo-glow-breathe`  
**Impacto na performance: CRÍTICO**

```css
/* Padrão atual — problemático */
@keyframes logo-glow-breathe {
  0%   { filter: drop-shadow(...) drop-shadow(...) drop-shadow(...) drop-shadow(...); }
  45%  { filter: drop-shadow(...) drop-shadow(...) drop-shadow(...) drop-shadow(...); }
  100% { filter: drop-shadow(...) drop-shadow(...) drop-shadow(...) drop-shadow(...); }
}
```

**Por que trava:**  
A propriedade `filter` com valores **que mudam** em keyframes **não é tratada pelo compositor GPU**. A cada frame (60x/s), o browser executa o ciclo completo: **Layout → Paint → Composite**. Isso significa que a CPU recalcula os 4 `drop-shadow` sobre todos os pixels da logo a 60fps, bloqueando a thread principal.

O `transform: scale(1.6)` promote o elemento para uma layer separada (bom), mas o `filter` animado imediatamente cancela esse benefício pois força a re-renderização da camada a cada tick.

**Impacto visual após correção:**  
Nenhum. A solução correta mantém aparência idêntica porém processada inteiramente na GPU.

**Solução recomendada — Separar glow em layer própria:**
```css
/* Adicionar ao .hero-logo */
will-change: filter;

/* OU: abordagem mais eficiente com pseudo-glow desacoplado */
/* Usar um <div> irmão absoluto com background blur pré-computado */
/* que anima apenas opacity (GPU composited) em vez de filter */
```

A melhor abordagem para PNG com transparência é um elemento irmão com `filter: blur` **estático** (computado uma vez) + `opacity` animando (sempre GPU). Isso produz glow de qualidade igual ou superior ao drop-shadow animado.

---

### 🔴 PROBLEMA 2 — MagicRings atualiza 14+ uniforms por frame, incondicionalmente
**Arquivo:** `MagicRings.tsx` — função `animate()`  
**Impacto na performance: CRÍTICO**

```typescript
// Executado 60x por segundo — mesmo quando nada muda
const animate = (t: number) => {
  frameId = requestAnimationFrame(animate);
  const p = propsRef.current;
  uniforms.uTime.value = t * 0.001 * (p.speed ?? 1);
  uniforms.uAttenuation.value = p.attenuation ?? 10;     // nunca muda
  uColor.set(p.color ?? '#ffffff');                       // nunca muda
  uColorTwo.set(p.colorTwo ?? '#ffffff');                 // nunca muda
  uniforms.uLineThickness.value = p.lineThickness ?? 2;  // nunca muda
  uniforms.uBaseRadius.value = p.baseRadius ?? 0.35;     // nunca muda
  uniforms.uRadiusStep.value = p.radiusStep ?? 0.1;      // nunca muda
  uniforms.uScaleRate.value = p.scaleRate ?? 0.1;        // nunca muda
  uniforms.uRingCount.value = p.ringCount ?? 6;          // nunca muda
  uniforms.uOpacity.value = p.opacity ?? 1;              // nunca muda
  uniforms.uNoiseAmount.value = p.noiseAmount ?? 0.1;    // nunca muda
  uniforms.uRotation.value = ...;                        // nunca muda
  uniforms.uRingGap.value = p.ringGap ?? 1.5;            // nunca muda
  uniforms.uFadeIn.value = p.fadeIn ?? 0.7;              // nunca muda
  uniforms.uFadeOut.value = p.fadeOut ?? 0.5;            // nunca muda
  // ...
  renderer.render(scene, camera);
};
```

De 15 uniforms atualizados por frame, **apenas `uTime` e `uMouse` precisam ser atualizados a cada frame**. O restante é estático enquanto o componente está montado com as mesmas props.

**Impacto visual após correção:**  
Nenhum. Os rings animam exatamente igual — só `uTime` dirige a animação.

**Solução recomendada:**
```typescript
// Setar estáticos uma vez no setup
uniforms.uAttenuation.value = attenuation;
uniforms.uLineThickness.value = lineThickness;
// ... todos os estáticos

// No loop, atualizar apenas os dinâmicos:
const animate = (t: number) => {
  frameId = requestAnimationFrame(animate);
  uniforms.uTime.value = t * 0.001 * propsRef.current.speed!;
  if (propsRef.current.followMouse) {
    uMouse.set(smoothMouseRef.current[0], smoothMouseRef.current[1]);
  }
  renderer.render(scene, camera);
};
```

---

### 🔴 PROBLEMA 3 — MagicRings roda sem parar, mesmo fora do viewport e com aba oculta
**Arquivo:** `MagicRings.tsx` — `animate()` loop  
**Impacto na performance: ALTO**

O `requestAnimationFrame` loop roda continuamente sem verificar:
- Se a aba do browser está visível (`document.hidden`)
- Se o componente está no viewport (`IntersectionObserver`)

Isso significa que o WebGL está renderizando a 60fps em segundo plano enquanto o usuário lê o conteúdo abaixo da Hero, usa outra aba, ou com o dispositivo em repouso. Em notebooks, isso drena bateria e mantém a GPU aquecida constantemente.

**Impacto visual após correção:**  
Nenhum. O usuário não vê a Hero quando está em outro lugar — a pausa é imperceptível.

**Solução recomendada:**
```typescript
// Pausar quando aba está oculta
const onVisibilityChange = () => {
  if (document.hidden) {
    cancelAnimationFrame(frameId);
  } else {
    frameId = requestAnimationFrame(animate);
  }
};
document.addEventListener('visibilitychange', onVisibilityChange);

// Pausar quando fora do viewport
const observer = new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting) {
      cancelAnimationFrame(frameId);
    } else {
      frameId = requestAnimationFrame(animate);
    }
  },
  { threshold: 0 }
);
observer.observe(mount);
```

---

### 🟠 PROBLEMA 4 — MagicRings usa `precision highp float` no fragment shader
**Arquivo:** `MagicRings.tsx` — `fragmentShader`  
**Impacto na performance: ALTO em mobile, MÉDIO em desktop**

```glsl
precision highp float;
```

`highp` força cálculos de ponto flutuante de 32 bits em todas as operações do fragment shader. Para um efeito visual de anéis animados, `mediump` (16 bits) é indistinguível a olho nu e pode ser **até 2× mais rápido** em GPUs mobile/integradas (Intel UHD, ARM Mali, Adreno).

**Impacto visual após correção:**  
Imperceptível em telas ≤1080p. Em 4K pode haver levíssima diferença de anti-aliasing nos anéis, mas nada perceptível sem comparação lado a lado.

**Solução recomendada:**
```glsl
/* Para desktop/WebGL2 */
precision mediump float;
/* Manter highp apenas para uTime para evitar drift em sessões longas */
highp float time = uTime;
```

---

### 🟠 PROBLEMA 5 — TargetCursor escuta `mousemove` no `window` sem throttle
**Arquivo:** `TargetCursor.tsx` — `moveHandler`  
**Impacto na performance: MÉDIO**

```typescript
const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
window.addEventListener('mousemove', moveHandler);
```

`mousemove` dispara até **200+ vezes por segundo** em mouses de alta precisão. Cada disparo chama `gsap.to(cursor, { x, y, duration: 0.1 })`. GSAP faz overwrite eficiente, mas a criação de um tween a cada evento ainda tem overhead de alocação de objeto e lookup interno.

**Impacto visual após correção:**  
Nenhum. O cursor continua com o mesmo easing — apenas os eventos intermediários entre frames são descartados, o que o usuário nunca percebe.

**Solução recomendada:**
```typescript
// Throttle para 1 update por frame via rAF
let pendingX = 0, pendingY = 0, rafPending = false;
const moveHandler = (e: MouseEvent) => {
  pendingX = e.clientX;
  pendingY = e.clientY;
  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      moveCursor(pendingX, pendingY);
      rafPending = false;
    });
  }
};
```

---

### 🟠 PROBLEMA 6 — TargetCursor usa `gsap.ticker` para atualizar 4 corners por tick durante hover
**Arquivo:** `TargetCursor.tsx` — `tickerFn`  
**Impacto na performance: MÉDIO**

```typescript
const tickerFn = () => {
  // Executado a cada tick do GSAP (~60fps) durante hover
  const corners = Array.from(cornersRef.current) as HTMLElement[];
  corners.forEach((corner, i) => {
    // 4x gsap.to() por tick = 4 tweens criados por frame durante hover
    gsap.to(corner, { x: finalX, y: finalY, duration, ease, overwrite: 'auto' });
  });
};
gsap.ticker.add(tickerFnRef.current!);
```

A cada tick do GSAP (60fps), 4 novas chamadas `gsap.to()` são geradas. Com `overwrite: 'auto'`, GSAP gerencia bem, mas ainda é trabalho de bookkeeping desnecessário. Uma abordagem com `gsap.quickSetter` ou `gsap.set` direto seria mais eficiente.

**Impacto visual após correção:**  
Nenhum. O hover do cursor continua com o mesmo comportamento.

**Solução recomendada:**
```typescript
// Substituir gsap.to() no ticker por gsap.quickSetter
const setCornerX = corners.map(c => gsap.quickSetter(c, 'x', 'px'));
const setCornerY = corners.map(c => gsap.quickSetter(c, 'y', 'px'));

const tickerFn = () => {
  corners.forEach((_, i) => {
    setCornerX[i](lerp(currentX, targetX, strength));
    setCornerY[i](lerp(currentY, targetY, strength));
  });
};
```

---

### 🟡 PROBLEMA 7 — MagicRings tem double-listener de resize (ResizeObserver + window)
**Arquivo:** `MagicRings.tsx`  
**Impacto na performance: BAIXO**

```typescript
window.addEventListener('resize', resize);  // listener 1
const ro = new ResizeObserver(resize);       // listener 2
ro.observe(mount);
```

Quando a janela redimensiona, `resize()` é chamada **duas vezes**: uma pelo `window resize` e outra pelo `ResizeObserver` (que observa o mesmo elemento que vai redimensionar junto). Cada call faz `renderer.setSize()` e `renderer.setPixelRatio()` desnecessariamente. Não causa jank visível mas é trabalho duplicado.

**Impacto visual após correção:**  
Nenhum.

**Solução recomendada:** Remover o `window.addEventListener('resize', resize)` — o `ResizeObserver` já cobre todos os casos incluindo resize de janela.

---

### 🟡 PROBLEMA 8 — `::before` halo grande animando numa layer composited desnecessariamente pesada
**Arquivo:** `Hero.css` — `.hero-logo-wrap::before`  
**Impacto na performance: BAIXO-MÉDIO**

```css
.hero-logo-wrap::before {
  width: 220%;   /* ~462px de diâmetro */
  height: 220%;
  animation: logo-halo-pulse 3.5s ease-in-out infinite;
  /* anima opacity + transform — ambos GPU composited ✓ */
}
```

`opacity` e `transform` são composited (bom). Mas o elemento tem `220% × 220%` do wrapper (`~460px × 460px`). Uma layer composited grande consome VRAM. Em conjunto com as outras layers (WebGL canvas, logo escalada), isso aumenta a pressão de memória de vídeo, especialmente em iGPUs.

**Impacto visual após correção:**  
Nenhum se mantido o mesmo design visual. Pode-se reduzir para `180%` sem diferença perceptível.

---

### 🟡 PROBLEMA 9 — WebGL sem `antialias: false` explícito, aumentando custo de rasterização
**Arquivo:** `MagicRings.tsx`  
**Impacto na performance: BAIXO-MÉDIO em mobile**

```typescript
renderer = new THREE.WebGLRenderer({ alpha: true });
// antialias: default = false em WebGLRenderer — OK
// mas não está explícito; verificar se browser override está ocorrendo
```

Por padrão `THREE.WebGLRenderer` não habilita MSAA. Entretanto, alguns browsers com `hardware acceleration` forçado podem ativar SSAA implícito. Confirmar `powerPreference: 'default'` vs `'high-performance'` pode ajudar em laptops dual-GPU.

**Impacto visual após correção:**  
Nenhum perceptível.

**Solução recomendada:**
```typescript
renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: false,
  powerPreference: 'high-performance',
});
```

---

## Tabela de Impacto e Prioridade

| # | Problema | Impacto | Prioridade | Impacto Visual | Esforço |
|---|----------|---------|-----------|----------------|---------|
| 1 | `filter` CSS animado por keyframes | 🔴 Crítico | Imediata | Nenhum | Médio |
| 2 | 14 uniforms atualizados por frame no MagicRings | 🔴 Crítico | Imediata | Nenhum | Baixo |
| 3 | WebGL loop sem pausa por visibilidade/viewport | 🔴 Alto | Alta | Nenhum | Baixo |
| 4 | `precision highp float` no shader | 🟠 Alto (mobile) | Alta | Imperceptível | Muito baixo |
| 5 | `mousemove` no window sem throttle | 🟠 Médio | Média | Nenhum | Baixo |
| 6 | `gsap.ticker` com 4x `gsap.to()` por frame | 🟠 Médio | Média | Nenhum | Médio |
| 7 | Double-listener de resize | 🟡 Baixo | Baixa | Nenhum | Muito baixo |
| 8 | Layer `::before` halo muito grande | 🟡 Baixo | Baixa | Imperceptível | Muito baixo |
| 9 | WebGL sem `powerPreference` explícito | 🟡 Baixo | Baixa | Nenhum | Muito baixo |

---

## Estimativa de Ganho por Grupo de Fixes

### Fix Grupo A (Problemas 1, 2, 3) — Críticos
- **Ganho estimado: 40–60% de redução de carga CPU**
- Elimina repaint CSS frame-a-frame
- Reduz GPU driver calls de ~15/frame para ~2/frame no MagicRings
- Elimina render WebGL quando invisível

### Fix Grupo B (Problemas 4, 5, 6) — Importantes
- **Ganho estimado: 15–25% adicional** (principalmente em mobile e integradas)
- Reduz pressão de GPU shader em dispositivos mid-range
- Elimina overhead de tween allocation no cursor

### Fix Grupo C (Problemas 7, 8, 9) — Higiene
- **Ganho estimado: 5–10%**
- Pequenas melhorias de robustez e uso de memória

---

## O Que Muda Visualmente Após Cada Fix?

| Fix | O que parece igual | O que pode mudar |
|-----|-------------------|-----------------|
| Substituir `filter` animado por layer opacity | Glow da logo idêntico ou melhor | Suavidade levemente diferente dependendo da abordagem |
| Throttle uniforms MagicRings | Anéis animam exatamente igual | Nada |
| Pausa por visibilidade | Nada visível para o usuário | Anéis recomeçam do mesmo ponto quando a Hero volta ao viewport |
| `mediump` no shader | Indistinguível em ≤1080p | Em 4K ultra, anti-aliasing dos anéis muda imperceptivelmente |
| Throttle mousemove | Cursor se move igualmente fluído | Nada |
| `quickSetter` no ticker | Corners do cursor respondem igual | Nada |

---

## Ordem de Implementação Recomendada

1. **MagicRings — throttle uniforms** *(10 min, zero risco de regressão visual)*
2. **MagicRings — pausa por `document.visibilitychange` e `IntersectionObserver`** *(15 min, zero risco)*
3. **Hero.css — substituir glow animado por abordagem GPU-only** *(30 min, risco baixo, testar visual)*
4. **MagicRings — remover double-listener resize + `precision mediump`** *(5 min)*
5. **TargetCursor — throttle `mousemove` com rAF** *(15 min)*
6. **TargetCursor — `quickSetter` no ticker** *(20 min)*
7. **MagicRings — `powerPreference: 'high-performance'`** *(2 min)*

---

*Documento gerado em: Abril 2026*  
*Projeto: Dudecamp HTML+CSS — `dudecamp-htmlcss`*
