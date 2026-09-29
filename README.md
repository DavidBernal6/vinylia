# VINYLIA
Reproductor web funcional para el álbum homónimo de Black Sabbath. HTML, Tailwind CDN, CSS y JavaScript vanilla. No contiene los medios.

## Añade aquí tus archivos
**Portada:** copia una imagen JPG/PNG a `assets/images/album-cover.jpg`. Se recorta en el sello central del disco.

**MP3:** coloca las canciones con estos nombres:
- `assets/audio/side-a/01-black-sabbath.mp3`
- `assets/audio/side-a/02-the-wizard.mp3`
- `assets/audio/side-a/03-behind-the-wall-of-sleep.mp3`
- `assets/audio/side-a/04-nib.mp3`
- `assets/audio/side-b/05-evil-woman.mp3`
- `assets/audio/side-b/06-sleeping-village.mp3`
- `assets/audio/side-b/07-warning.mp3`

**Letras opcionales:** guarda texto UTF-8 en `assets/lyrics/` con el mismo nombre base, por ejemplo `01-black-sabbath.txt`, `02-the-wizard.txt`, etc. El panel muestra las letras de la pista seleccionada.

## Ejecutar con XAMPP
Copia esta carpeta a `C:\xampp\htdocs\vinylia`, inicia Apache y abre `http://localhost/vinylia/`. Las letras usan fetch, así que abre la página por localhost, no como archivo directo. Google Fonts y Tailwind Play CDN requieren conexión. Los controles usan audio HTML5 real y reportan cuando un archivo no está todavía.

## Publicar en GitHub Pages
Sube el contenido de esta carpeta conservando la estructura (index.html, assets/, css/, js/). En GitHub, abre Settings → Pages, selecciona la rama y la carpeta que contienen index.html y guarda. Pages servirá las letras y el audio por HTTPS; las rutas relativas del reproductor funcionan también bajo la URL de proyecto usuario.github.io/nombre-del-repo/. Tras publicar, revisa los nombres exactos y mayúsculas/minúsculas de cada archivo, porque GitHub Pages sí distingue esas diferencias. Tailwind CDN y Google Fonts necesitan internet.
