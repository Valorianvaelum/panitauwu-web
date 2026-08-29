# Panita UwU

Una microexperiencia web afectiva, visual y deliberadamente simple: una pantalla de entrada da paso a una rosa construida con pétalos en forma de corazón, desde cuyo centro nace una lluvia de `te quiero` y `te amo`.

## Dirección del producto

- Una sola experiencia, sin navegación ni distracciones.
- Loader breve y con intención, no un spinner genérico.
- Rosa central compuesta con SVG y pétalos reales; el contorno exterior forma un corazón.
- Lluvia tipográfica que nace en el centro de la flor.
- Interacción por click/tap para disparar una ráfaga adicional.
- Responsive, accesible por teclado y compatible con `prefers-reduced-motion`.
- Sin dependencias, frameworks ni assets remotos.

## Ejecutar localmente

No requiere build. Se puede abrir `index.html` directamente o servir la carpeta con cualquier servidor HTTP estático.

Ejemplo con Python:

```bash
python -m http.server 4173
```

Luego abrir `http://localhost:4173`.

## Deploy

El workflow de GitHub Pages publica el contenido estático de la rama `main` cuando recibe un push o puede ejecutarse manualmente desde Actions.
