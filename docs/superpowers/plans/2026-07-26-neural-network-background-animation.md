# Neural Network Background Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the ambient background animation's particle/proximity-line/geometric-shape system with a layered neural network that propagates activation signals left to right, rendered subtly.

**Architecture:** A single self-contained IIFE in `themes/Chic/source/js/homepage-animation.js`, unchanged in its outer structure (page gate → reduced-motion gate → canvas creation → resize/animate loop). Inside, `Particle`/`Shape`/`drawHexagon`/`drawConnections` are replaced by a `Neuron` class, a `Signal` class, a `buildNetwork()` layout function, and an `emitWave()` scheduler. No CSS or template change — the existing `.floating-shapes-canvas` rule already styles the canvas.

**Tech Stack:** Vanilla JS, Canvas 2D API, Hexo (static asset — no build step for JS beyond Hexo copying the file).

## Global Constraints

- Only `themes/Chic/source/js/homepage-animation.js` changes. No CSS, no EJS, no config.
- The canvas element keeps its existing class name `floating-shapes-canvas` and `aria-hidden="true"` — the CSS rule in `themes/Chic/source/css/_partial/enhancements.styl:274` is keyed on that class and must keep applying.
- Preserve verbatim: the page-path gate, the `prefers-reduced-motion` early return, the `palette` light/dark color arrays, `themeColors()`, `hexToRgba()`, `drawGlow()`, the pointer parallax easing (`0.055`), the `mousemove` and `resize` listeners, and the `DOMContentLoaded` bootstrap.
- Do not name the neuron class `Node` — that shadows the global DOM `Node` interface. Use `Neuron`.
- No automated test suite exists (per `AGENTS.md`) — verification is `hexo clean && hexo generate` plus browser observation.

---

### Task 1: Rewrite the animation as a layered neural network

**Files:**
- Modify: `themes/Chic/source/js/homepage-animation.js` (full rewrite of the scene internals)

**Interfaces:**
- Consumes: nothing new
- Produces: nothing consumed elsewhere (self-contained IIFE)

- [ ] **Step 1: Replace the file's contents entirely**

Write `themes/Chic/source/js/homepage-animation.js` as:

```js
/**
 * Ambient background animation for homepage and listing pages.
 * A layered neural network that propagates activation signals across its
 * layers, with subtle pointer parallax.
 */

(function () {
    'use strict';

    function createHomepageScene() {
        const path = window.location.pathname.replace(/\/$/, '');
        const isAmbientPage = path === '' ||
            path === '/' ||
            path === '/archives' ||
            path.startsWith('/archives/') ||
            path === '/category' ||
            path.startsWith('/category/') ||
            path.startsWith('/categories/') ||
            path === '/tag' ||
            path.startsWith('/tag/') ||
            path.startsWith('/tags/');

        if (!isAmbientPage) return;

        const prefersReducedMotion = window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'floating-shapes-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        document.body.insertBefore(canvas, document.body.firstChild);

        const ctx = canvas.getContext('2d');

        // Node count per layer, tapering toward the output layer.
        const DESKTOP_LAYERS = [5, 7, 7, 5, 3];
        const MOBILE_LAYERS = [3, 4, 4, 2];

        const SIGNAL_TRAVEL_FRAMES = 42;   // ~0.7s per hop at 60fps
        const WAVE_INTERVAL_FRAMES = 120;  // a new wave roughly every 2s
        const WAVE_SOURCE_COUNT = 2;       // input nodes lit per wave
        const MAX_FANOUT = 2;              // downstream edges a node fires into

        const layers = [];
        const edges = [];
        let signals = [];

        const pointer = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            targetX: window.innerWidth / 2,
            targetY: window.innerHeight / 2
        };

        let width = 0;
        let height = 0;
        let pixelRatio = 1;
        let frame = 0;

        const palette = {
            light: ['#2d96bd', '#18c37e', '#ff6a00', '#8b5cf6'],
            dark: ['#81d6f3', '#18c37e', '#b7a5ff', '#f59e0b']
        };

        function themeColors() {
            return document.body.classList.contains('dark-theme') ? palette.dark : palette.light;
        }

        class Neuron {
            constructor(x, y) {
                this.baseX = x;
                this.baseY = y;
                this.x = x;
                this.y = y;
                this.radius = Math.random() * 1.4 + 1.6;
                this.depth = Math.random() * 0.8 + 0.2;
                this.driftPhase = Math.random() * Math.PI * 2;
                this.driftAmount = Math.random() * 7 + 4;
                this.activation = 0;
                this.outgoing = [];
            }

            update() {
                this.driftPhase += 0.006;
                this.x = this.baseX + Math.cos(this.driftPhase) * this.driftAmount * 0.6;
                this.y = this.baseY + Math.sin(this.driftPhase) * this.driftAmount;

                if (this.activation > 0) {
                    this.activation = Math.max(0, this.activation - 0.014);
                }
            }

            screenX() {
                return this.x + (pointer.x - width / 2) * 0.02 * this.depth;
            }

            screenY() {
                return this.y + (pointer.y - height / 2) * 0.02 * this.depth;
            }

            fire() {
                this.activation = 1;

                if (!this.outgoing.length) return;

                const count = 1 + Math.floor(Math.random() * MAX_FANOUT);
                pickRandom(this.outgoing, count).forEach((edge) => {
                    signals.push(new Signal(edge));
                });
            }

            draw(colors) {
                const x = this.screenX();
                const y = this.screenY();
                const glow = this.activation;

                if (glow > 0) {
                    ctx.beginPath();
                    ctx.fillStyle = hexToRgba(colors[1], glow * 0.15);
                    ctx.arc(x, y, this.radius + 9 * glow, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.beginPath();
                ctx.fillStyle = hexToRgba(colors[0], 0.18 + glow * 0.55);
                ctx.arc(x, y, this.radius + glow * 1.6, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        class Signal {
            constructor(edge) {
                this.edge = edge;
                this.progress = 0;
            }

            update() {
                this.progress += 1 / SIGNAL_TRAVEL_FRAMES;
                return this.progress < 1;
            }

            draw(colors) {
                const from = this.edge.from;
                const to = this.edge.to;
                const ax = from.screenX();
                const ay = from.screenY();
                const bx = to.screenX();
                const by = to.screenY();

                const head = this.progress;
                const tail = Math.max(0, head - 0.18);
                const hx = ax + (bx - ax) * head;
                const hy = ay + (by - ay) * head;
                const tx = ax + (bx - ax) * tail;
                const ty = ay + (by - ay) * tail;

                // Fade in and out at the ends so signals emerge from and settle
                // into their nodes instead of popping.
                const fade = Math.sin(head * Math.PI);

                const gradient = ctx.createLinearGradient(tx, ty, hx, hy);
                gradient.addColorStop(0, hexToRgba(colors[1], 0));
                gradient.addColorStop(1, hexToRgba(colors[1], 0.45 * fade));

                ctx.beginPath();
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 1.6;
                ctx.moveTo(tx, ty);
                ctx.lineTo(hx, hy);
                ctx.stroke();

                ctx.beginPath();
                ctx.fillStyle = hexToRgba(colors[1], 0.7 * fade);
                ctx.arc(hx, hy, 1.9, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function pickRandom(list, count) {
            if (count >= list.length) return list.slice();

            const pool = list.slice();
            const picked = [];

            for (let i = 0; i < count; i += 1) {
                const index = Math.floor(Math.random() * pool.length);
                picked.push(pool.splice(index, 1)[0]);
            }

            return picked;
        }

        function buildNetwork() {
            layers.length = 0;
            edges.length = 0;
            signals = [];

            const counts = width < 768 ? MOBILE_LAYERS : DESKTOP_LAYERS;
            const marginX = width * 0.12;
            const marginY = height * 0.16;
            const usableWidth = width - marginX * 2;
            const usableHeight = height - marginY * 2;

            counts.forEach((count, layerIndex) => {
                const layer = [];
                const x = marginX + (usableWidth * layerIndex) / (counts.length - 1);
                const spacing = usableHeight / Math.max(count - 1, 1);

                for (let i = 0; i < count; i += 1) {
                    const y = count === 1 ? height / 2 : marginY + spacing * i;
                    const jitterX = (Math.random() - 0.5) * usableWidth * 0.05;
                    const jitterY = (Math.random() - 0.5) * spacing * 0.45;
                    layer.push(new Neuron(x + jitterX, y + jitterY));
                }

                layers.push(layer);
            });

            for (let i = 0; i < layers.length - 1; i += 1) {
                layers[i].forEach((from) => {
                    layers[i + 1].forEach((to) => {
                        const edge = { from: from, to: to };
                        edges.push(edge);
                        from.outgoing.push(edge);
                    });
                });
            }
        }

        function emitWave() {
            const inputLayer = layers[0];
            if (!inputLayer || !inputLayer.length) return;

            pickRandom(inputLayer, WAVE_SOURCE_COUNT).forEach((neuron) => neuron.fire());
        }

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(width * pixelRatio);
            canvas.height = Math.floor(height * pixelRatio);
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            buildNetwork();
        }

        function drawEdges(colors) {
            // All edges share one path and one stroke — they are drawn at a
            // single constant alpha, so batching keeps this to one draw call.
            ctx.beginPath();
            ctx.strokeStyle = hexToRgba(colors[0], 0.055);
            ctx.lineWidth = 1;

            edges.forEach((edge) => {
                ctx.moveTo(edge.from.screenX(), edge.from.screenY());
                ctx.lineTo(edge.to.screenX(), edge.to.screenY());
            });

            ctx.stroke();
        }

        function drawGlow(colors) {
            const glowX = width * 0.5 + (pointer.x - width / 2) * 0.04;
            const glowY = height * 0.52 + (pointer.y - height / 2) * 0.04;
            const gradient = ctx.createRadialGradient(glowX, glowY, 20, glowX, glowY, Math.max(width, height) * 0.52);

            gradient.addColorStop(0, hexToRgba(colors[0], 0.052));
            gradient.addColorStop(0.45, hexToRgba(colors[2], 0.024));
            gradient.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);
        }

        function hexToRgba(hex, alpha) {
            const value = hex.replace('#', '');
            const bigint = parseInt(value, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;

            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
        }

        function animate() {
            frame += 1;
            pointer.x += (pointer.targetX - pointer.x) * 0.055;
            pointer.y += (pointer.targetY - pointer.y) * 0.055;

            ctx.clearRect(0, 0, width, height);
            const colors = themeColors();

            drawGlow(colors);

            layers.forEach((layer) => layer.forEach((neuron) => neuron.update()));

            if (frame % WAVE_INTERVAL_FRAMES === 0) emitWave();

            // Split before reassigning: arrived signals fire their target node,
            // and that push must land in the new array, not the one being replaced.
            const travelling = [];
            const arrived = [];

            signals.forEach((signal) => {
                if (signal.update()) travelling.push(signal);
                else arrived.push(signal);
            });

            signals = travelling;
            arrived.forEach((signal) => signal.edge.to.fire());

            drawEdges(colors);
            signals.forEach((signal) => signal.draw(colors));
            layers.forEach((layer) => layer.forEach((neuron) => neuron.draw(colors)));

            requestAnimationFrame(animate);
        }

        document.addEventListener('mousemove', (event) => {
            pointer.targetX = event.clientX;
            pointer.targetY = event.clientY;
        }, { passive: true });

        window.addEventListener('resize', resize);

        resize();
        emitWave();
        animate();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createHomepageScene);
    } else {
        createHomepageScene();
    }
})();
```

- [ ] **Step 2: Build**

```bash
hexo clean && hexo generate 2>&1 | tail -5
```

Expected: no errors, `INFO  N files generated`.

- [ ] **Step 3: Verify in the browser**

Start the dev server (check `lsof -i :4000` first; reuse if already running) and load `http://localhost:4000/`. Verify:

1. The canvas renders — nodes and faint edges are visible in a layered left-to-right arrangement.
2. Signal pulses visibly travel along edges from left to right, and nodes flash when a signal arrives. Watch for at least 5 seconds to see multiple waves.
3. `read_console_messages` shows no errors after ~10 seconds of animation.
4. Toggle dark mode (the header theme switch) — the network re-renders in the dark palette.
5. Resize the viewport (`resize_window` to mobile preset, then back to desktop) — the network rebuilds, no errors, fewer nodes on mobile.
6. Load `http://localhost:4000/archives/` — animation present.
7. Load any post page — no `.floating-shapes-canvas` element in the DOM (page gate still works). Verify with `javascript_tool`: `!!document.querySelector('.floating-shapes-canvas')` should be `false`.

Record actual results for each of the 7 checks.

- [ ] **Step 4: Commit**

```bash
git add themes/Chic/source/js/homepage-animation.js
git commit -m "feat(homepage): replace ambient shapes with a signal-propagating neural network"
```

---

## Explicitly out of scope

- Any CSS change (canvas opacity, z-index, mobile opacity) — the existing rule stays as is.
- Changing which pages the ambient background appears on.
- Making the network interactive (click/hover on nodes).
