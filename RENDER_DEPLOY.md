# Guía para Publicar en Render (onrender.com)

Este proyecto está configurado para desplegarse fácilmente en **Render** como un **Static Site** (Sitio Estático), el cual es **100% gratuito, ultra rápido y sin tiempo de inactividad**.

---

### Opción 1: Despliegue Automático mediante Blueprint (Recomendado)
Render detectará automáticamente el archivo `render.yaml` que ya hemos incluido en el proyecto:

1. Ve a tu cuenta en [dashboard.render.com](https://dashboard.render.com/).
2. Haz clic en **New +** y selecciona **Blueprint**.
3. Conecta tu repositorio de GitHub: `https://github.com/FivelMttz/Display-7-Segmentos-DOJOROBOT`.
4. Render leerá `render.yaml` y ejecutará `npm install && npm run build` automáticamente.
5. Haz clic en **Apply** y ¡listo!

---

### Opción 2: Despliegue Manual (Static Site)
Si creaste el servicio manualmente desde el panel de Render:

1. En Render, ve a la configuración de tu sitio (**Settings**).
2. Asegúrate de configurar los siguientes campos:
   - **Build Command**: `npm install && npm run build` *(¡Muy importante! En sitios estáticos, Render requiere `npm install` antes de `npm run build`)*
   - **Publish Directory**: `dist`
3. En **Environment Variables**:
   - `NODE_VERSION`: `20.18.0`
4. En **Redirects / Rewrites** (o mediante `/public/_redirects` ya incluido):
   - Type: `Rewrite`
   - Source: `/*`
   - Destination: `/index.html`
5. Haz clic en **Save Changes** y luego en **Manual Deploy > Clear build cache & deploy**.

---

### ¿Por qué ocurrió el error `vite: not found`?
En los sitios estáticos (*Static Sites*), Render no ejecuta `npm install` automáticamente a menos que se lo indiques en el comando de construcción. Al cambiar el **Build Command** a:
```bash
npm install && npm run build
```
Render descargará las dependencias (incluyendo Vite) y compilará el proyecto con éxito. Además, hemos añadido un script `prebuild` en `package.json` para auto-instalar paquetes en caso de que solo se llame a `npm run build`.
