# Directorio de movilidad Uniandes — prototipo

Página estática, adaptable a celular, para orientar consultas de movilidad hacia correo y chat directo de Teams.

## Abrir localmente

Abre `index.html` en Chrome o Edge. No requiere instalar dependencias ni compiladores.

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo, `contactos-movilidad`).
2. Sube `index.html`, `styles.css` y `script.js` a la raíz de la rama `main`.
3. En el repositorio, ve a **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**, `main` y `/ (root)`; guarda.
5. GitHub mostrará la URL de publicación, normalmente `https://TU-USUARIO.github.io/contactos-movilidad/`.

## Antes de compartirlo como directorio oficial

- Validar autorización institucional, especialmente para publicación bajo una cuenta de GitHub ajena a Uniandes.
- Confirmar con el equipo las funciones, responsables y correos definitivos.
- Validar que cada cuenta indicada en `PEOPLE` corresponda efectivamente al usuario principal de Microsoft Teams; algunas direcciones pueden ser buzones compartidos o alias y no abrir chats.
- Comprobar qué públicos pueden escribir por Teams y si requieren cuenta institucional.
- Confirmar que `oiamobilityinfo@uniandes.edu.co` sirva para orientación general y que el acceso a jefatura sea público.
- Solicitar y usar el logo oficial aprobado si se decide mostrarlo. La letra U es un marcador gráfico temporal, no un logo institucional.

## Mantener los datos

Edita `PEOPLE` y `TOPICS` en `script.js`. Los enlaces a Teams se generan con el formato oficial de Microsoft:
`https://teams.microsoft.com/l/chat/0/0?users=usuario@uniandes.edu.co`

Esta página no almacena datos personales ni envía mensajes: solo abre los canales existentes.
