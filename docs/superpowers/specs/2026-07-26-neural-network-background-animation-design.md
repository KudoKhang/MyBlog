# Neural Network Background Animation — Design

Date: 2026-07-26
Status: Approved

## Context

`themes/Chic/source/js/homepage-animation.js` draws an ambient canvas background behind the homepage and the archive/category/tag listing pages. Today it renders three unrelated visual layers: randomly drifting particles connected by proximity lines, floating geometric outlines (circle/triangle/square/hexagon) rising up the viewport, and a radial glow that follows the pointer.

The blog belongs to an AI Engineer. The user wants the background to instead evoke a neural network propagating signals through its layers — thematically tied to their work — while staying subtle enough that it never competes with the writing. Two design decisions were settled during brainstorming:

1. **Subtlety over literalness** — the layered structure should be genuinely present but rendered faintly; the traveling signal pulses are the only element meant to catch the eye. It should read as "intelligence quietly at work," not as a labeled diagram.
2. **Single metaphor** — the floating geometric shapes are removed entirely rather than kept as a depth layer, so only one motion system is on screen.

## Goals

1. Replace the particle/proximity-line/geometric-shape system with a layered neural network that visibly propagates activation signals left to right.
2. Keep the background subtle: faint nodes and edges, with signal pulses as the primary moving element, and the network sparse enough never to saturate.
3. Preserve all existing ambient behaviors: pointer parallax, radial glow, light/dark palette switching, the `prefers-reduced-motion` opt-out, mobile density reduction, and the same set of pages the animation runs on.

## Non-goals

- Changing which pages show the ambient background (`/`, `/archives`, `/category`, `/tag` and their sub-paths stay as they are).
- Changing the canvas element, its CSS (`.floating-shapes-canvas` in `themes/Chic/source/css/_partial/enhancements.styl`), its opacity, or its stacking context.
- Any interactivity beyond the existing passive pointer parallax — the background stays `pointer-events: none` and non-clickable.
- Scientific accuracy about how real neural networks compute. This is decorative; a signal firing to a random subset of downstream nodes is a deliberate aesthetic choice, not a simulation claim.

## Design

### Network structure

- **Layers:** 5 layers on desktop with a tapering node count of `5 → 7 → 7 → 5 → 3`; 4 layers with roughly half the nodes on mobile (viewport width < 768px). Layers are distributed horizontally across the full viewport width, with the first and last inset from the edges so nodes are never clipped.
- **Node placement:** each node's base position comes from an even vertical distribution within its layer's column, plus a small random offset applied at build time, plus a slow continuous sine drift while animating. The randomness and drift are what keep the network from reading as a rigid, hand-drawn grid.
- **Edges:** every node connects to every node in the next layer (fully connected). Edges are drawn once per frame at very low alpha (~0.05), just enough to suggest structure.

### Signal propagation

- Roughly every 2 seconds, a new activation wave starts from a few randomly chosen nodes in the first layer.
- A signal travels along one edge over ~0.7s, drawn as a small bright dot with a short trailing glow behind it.
- On arrival at a node, the node flashes (a brief brightness and radius increase that decays over time), and then fires onward along **1–2 randomly chosen edges** into the next layer — deliberately not all of them, which is what keeps the visual sparse and prevents an exponential blowup of concurrent signals.
- Signals reaching the final layer flash their node and terminate.

### Retained behavior

Pointer parallax (nodes and signals shift subtly with the pointer, scaled by a per-node depth value), the radial glow, the existing light/dark color palettes, the `prefers-reduced-motion` early return, the page-path gate, and resize handling all carry over from the current implementation.

### Removed

The `Particle` class, the `Shape` class, `drawHexagon`, and `drawConnections` (proximity-based line drawing) are all deleted along with their usage in the animation loop.

## Performance

The current implementation runs an O(n²) proximity check every frame — 64 particles means ~2,016 distance computations per frame before anything is drawn. The layered network replaces this with a fixed edge list (~150 edges on desktop) plus a small number of in-flight signals, so the new version does strictly less per-frame work. Signal objects are created on activation and removed on arrival, keeping the active set small; the 1–2 downstream fan-out cap is what bounds it.

## Testing / Verification

No automated test suite exists for this project (per `AGENTS.md`). Verification is:
- `hexo clean && hexo generate` completes without errors.
- Load `/` in a browser: confirm the canvas renders, nodes/edges are visible but faint, and signal pulses visibly travel left to right through the layers.
- Confirm no console errors during sustained animation.
- Confirm the animation still appears on `/archives/` and is absent on a post page (the page gate is unchanged).
- Confirm dark mode renders with the dark palette (toggle the theme switch).
- Resize the window and confirm the network rebuilds without errors or visual breakage.

## Rollout

A single focused commit against `themes/Chic/source/js/homepage-animation.js`. No CSS change is needed — the existing canvas rule already applies. No deploy is triggered; `hexo deploy` remains a manual step.
