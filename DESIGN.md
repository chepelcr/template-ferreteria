# Ferretería — design plan

**Concept: Plano.** The store is a hardware counter drawn on blueprint paper.
The hero is a blueprint sheet with a 3D hex bolt, washer and nut; scrolling the
page screws the nut up the thread. Search comes first — in the header on wide
screens and in the hero — departments are drawer labels with their own colour
tab, and products read as a dense list with quick quantities (a grid on
phones or on request). Photos sit in frames with crop marks, like parts on a
drawing.

Serves: hardware stores, building-supply yards, plumbing and electrical
shops, paint and tools; counter services such as key cutting or paint mixing.

## Palette

| Token | Hex | Role |
|---|---|---|
| blueprint | `#1F4E8C` | hero, footer, CTA band, chips, service badges |
| blueprint pale | `#C9D8EC` | secondary text on blueprint |
| steel | `#59626B` | secondary text |
| concrete | `#EDECE8` | page |
| white | `#FFFFFF` | header, cards, rows |
| safety orange | `#E8641E` | the store's accent (org primary): add buttons, search button, cart count |
| orange as text | `#B04310` | the accent as text on concrete |
| ink | `#1F252B` | text, headings, text on orange |
| red | `#B3261E` | offers and low stock |

Contrast (computed): ink on concrete 13.1:1 · steel on concrete 5.3:1 · steel
on white 6.2:1 · white on blueprint 8.3:1 · blueprint pale on blueprint
5.8:1 · ink on safety orange 4.6:1 (white fails at 3.4:1, so orange buttons
carry ink) · orange text `#B04310` on concrete 4.9:1 · red on concrete
5.5:1. Dark mode ("after hours"): `#E8ECF1` on `#121820` 15.0:1 · `#A9B4C0`
on the raised `#1C2531` 7.3:1 · orange `#F08A4B` on `#1C2531` 6.2:1.

## Type

**Archivo** only: display at width 125 % and weight 800 (wide, engineered),
text at width 100 %. Prices use 112 % width with tabular figures. Product and
highlight names stay at normal width so long names remain readable. No
all-caps labels, no monospace, no invented part codes.

## Layout

```
HEADER  [nut] Ferretería  [ search ………………… | Buscar ]  (account) (theme) [Pedido 0]
        Inicio  Catálogo  Nosotros  Contacto  Trueque        (wide screens)
HOME
┌ blueprint grid ───────────────────────────────────────────────┐
│ badge                                       ╱ 3D bolt, washer, │
│ Lo que necesitás para la obra…            ╱  nut (scroll screws│
│ subtitle                                     it up); SVG drawing│
│ [ search ………………… | Buscar ]               underneath; the    │
│ [Buscar en el catálogo] [Horario…]         store's photo pinned│
└────────────────────────────────────────────────────────────────┘
 Departamentos: drawer labels (colour tab, photo on drafting paper, name, count)
 Para empezar: dense rows — photo · department/name · price · [– 1 +] [Agregar]
 highlights (3 cells) · story (crop-marked photo) · blueprint CTA band
CATALOG: title, count, list/grid toggle │ search + Filtros (sheet on phones) │
department chips │ one group per department or a flat list/grid
PRODUCT: crop-marked photo, name, price, turnaround chip (services), spec
table (department, type, availability), quantity + add, rows from the same
department
```

## Signature

`scenes/bolt.ts` (three.js, lazy chunk) through the core `LazyScene`: loads
near the viewport on mid/high-tier devices with motion allowed, pauses
offscreen and while the tab is hidden, disposes everything on unmount, and
falls back to `BoltDrawing` (the same part as a white line drawing with
dimension arrows and no figures) under reduced motion, `?webgl=0`, without
WebGL or on failure. The nut's position and rotation follow the page scroll
(thread pitch 0.3); on desktop the part leans toward the pointer. Renders only
when something changed.

Other motion answers an action: the cart icon tightens a quarter turn when
something is added, sheets slide, buttons press.

## Changed from the generic default

- Not "near-black + acid accent": concrete and blueprint with safety orange
  only for actions.
- Departments are drawer labels with real category data, never aisle codes.
- The featured block is a dense list with quantities, not another card grid.
- The 3D part is the only spectacle; everything else is quiet and fast.
