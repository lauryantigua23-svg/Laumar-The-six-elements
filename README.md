# LAUMAR: THE SIX ELEMENTS

Nivel 1 jugable (Laboratorio Abandonado) con jefe Guardián del Laboratorio.

## Cómo ejecutarlo
Abre `index.html` en el navegador. También funciona con Live Server de VS Code o con `python3 -m http.server`.

## Controles
A/D o flechas: mover · Espacio: saltar · Shift: correr · S: agacharse
1-6: Uranio, Cobre, Curio, Radón, Polonio, Torio · Z: usar poder · F: Fusión · Esc: pausa

## Estructura
- `index.html`: página y canvas
- `css/style.css`: estilos de menús
- `js/game.js`: motor, Laumar, enemigos, jefe, poderes, HUD y menús
- `assets/characters/laumar.jpg`: imagen de referencia (pantalla de inicio)

## Limitaciones
Solo está el nivel 1. Faltan los niveles 2-4, las demás criaturas y la música. Todo el arte del juego se dibuja con Canvas, sin spritesheets.
