# Guía para Publicar en Render (onrender.com)

Este proyecto está configurado para desplegarse fácilmente en **Render** como un **Static Site** (Sitio Estático), el cual es **100% gratuito, ultra rápido y sin tiempo de inactividad**.

---

### Opción 1: Despliegue Automático mediante Blueprint (Recomendado)
Render detectará automáticamente el archivo `render.yaml` que ya hemos incluido en el proyecto:

1. Ve a tu cuenta en [dashboard.render.com](https://dashboard.render.com/).
2. Haz clic en **New +** y selecciona **Blueprint**.
3. Conecta tu repositorio de GitHub o GitLab.
4. Render leerá `render.yaml` y configurará todo automáticamente (Comando de compilación, directorio de publicación y rutas SPA).
5. Haz clic en **Apply** y ¡listo!

---

### Opción 2: Despliegue Manual (Static Site)
Si prefieres crearlo manualmente desde el panel de Render:

1. En Render, haz clic en **New +** > **Static Site**.
2. Conecta el repositorio de este proyecto.
3. Rellena los siguientes campos:
   - **Name**: `dojorobot-7seg-display` (o el nombre que prefieras).
   - **Branch**: `main` (o tu rama principal).
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. En **Advanced** > **Environment Variables**, añade:
   - `NODE_VERSION`: `20.18.0` (para compatibilidad con Vite 8).
5. En **Redirects / Rewrites** (o a través del archivo `_redirects` ya incluido en `/public`):
   - Type: `Rewrite`
   - Source: `/*`
   - Destination: `/index.html`
6. Haz clic en **Create Static Site**.

---

### Archivos de Configuración Incluidos
- `render.yaml`: Manifiesto de servicio de infraestructura como código de Render.
- `.nvmrc`: Especifica Node 20 para los servidores de compilación de Render.
- `/public/_redirects`: Regla de reescritura para aplicaciones SPA en servidores estáticos.
- `package.json`: Configurado con motor `node: ">=20.0.0"` y script de compilación `npm run build`.
