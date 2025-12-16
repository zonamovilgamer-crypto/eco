# Guía de Implementación: Prerendering Estático con Vite + React-Snap

## 📋 RESUMEN DE LA SOLUCIÓN

**Problema resuelto:** Contenido HTML vacío en el build de Vite, invisible para Google y SEO tools  
**Solución implementada:** Prerendering estático con `react-snap`  
**Resultado:** HTML estático completo, 100% indexable por Google

---

## 🛠️ CAMBIOS REALIZADOS

### 1. **Instalación de react-snap**
```bash
npm install --save-dev react-snap
```

### 2. **Actualización de package.json**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "postbuild": "react-snap",  // ← Ejecuta prerender después del build
    "preview": "vite preview"
  },
  "reactSnap": {
    "source": "dist",
    "minifyHtml": {
      "collapseWhitespace": false,
      "removeComments": false
    },
    "puppeteerArgs": [
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ],
    "include": [
      "/",
      "/calendario",
      "/calculadora",
      "/recetas",
      "/blog/vermicompost",
      "/blog/huerta-balcon",
      "/blog/compost-departamento",
      "/blog/banco-semillas"
    ]
  }
}
```

**Explicación:**
- `postbuild`: Ejecuta `react-snap` automáticamente después de `vite build`
- `source`: Directorio donde está el build (dist)
- `include`: Lista de todas las rutas a prerenderizar
- `puppeteerArgs`: Configuración para que funcione en Vercel

### 3. **Actualización de main.jsx (Hydration)**

**Antes:**
```javascript
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)
```

**Después:**
```javascript
const rootElement = document.getElementById('root');

if (rootElement.hasChildNodes()) {
    // Si ya hay contenido prerenderizado, usar hydrate
    ReactDOM.hydrateRoot(rootElement, 
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // Si no hay contenido, renderizar normalmente
    ReactDOM.createRoot(rootElement).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
```

**Explicación:**
- `hydrateRoot`: Reutiliza el HTML prerenderizado en lugar de reemplazarlo
- Detecta si ya hay contenido en el DOM antes de decidir cómo renderizar
- Mejora el rendimiento y evita el "flash" de contenido

### 4. **Configuración de Vercel (vercel.json)**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/*.html",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    }
  ]
}
```

**Explicación:**
- `rewrites`: Maneja el routing en el lado del servidor
- `headers`: Optimiza el caché (archivos estáticos inmutables, HTML siempre fresco)

### 5. **Actualización de sitemap.xml**

Se agregaron todas las rutas de blog al sitemap:
- `/blog/huerta-balcon`
- `/blog/compost-departamento`
- `/blog/banco-semillas`

---

## 🔍 CÓMO FUNCIONA EL PRERENDERING

### **Proceso de Build**

1. **`npm run build`** ejecuta `vite build`
   - Vite compila el código React a JavaScript
   - Genera el bundle en `/dist`
   - El HTML inicial está vacío (solo `<div id="root"></div>`)

2. **`postbuild`** ejecuta `react-snap` automáticamente
   - Abre un navegador headless (Puppeteer)
   - Navega a cada ruta definida en `include`
   - Espera a que React renderice completamente
   - Captura el HTML final renderizado
   - Guarda cada ruta como archivo HTML estático

3. **Resultado final:**
   ```
   dist/
   ├── index.html          (Home prerenderizada)
   ├── calendario.html     (Calendario prerenderizado)
   ├── calculadora.html
   ├── recetas.html
   └── blog/
       ├── vermicompost.html
       ├── huerta-balcon.html
       ├── compost-departamento.html
       └── banco-semillas.html
   ```

### **¿Por qué es indexable por Google?**

**Antes (SPA):**
```html
<!-- HTML servido por Vercel -->
<body>
  <div id="root"></div>
  <script src="/assets/index-abc123.js"></script>
</body>
```
❌ Google ve HTML vacío

**Después (Prerenderizado):**
```html
<!-- HTML servido por Vercel -->
<body>
  <div id="root">
    <header>...</header>
    <section>
      <h1>Tu Huertita - Guía de Huerta Orgánica</h1>
      <p>Aprende a cultivar tus propios alimentos...</p>
      <!-- TODO EL CONTENIDO VISIBLE -->
    </section>
    <footer>...</footer>
  </div>
  <script src="/assets/index-abc123.js"></script>
</body>
```
✅ Google ve TODO el contenido en el HTML

---

## 🚀 CÓMO HACER BUILD Y DEPLOY

### **Local (Testing)**

```bash
# 1. Build con prerendering
npm run build

# 2. Verificar el HTML generado
# Abrir dist/index.html en un navegador
# Debería verse completamente renderizado SIN JavaScript

# 3. Preview local
npm run preview
```

### **Verificar que funcionó**

1. **Deshabilitar JavaScript en el navegador:**
   - Chrome DevTools → Settings → Debugger → Disable JavaScript
   - Recargar la página
   - ✅ El contenido debe ser visible

2. **Ver el HTML source:**
   - Click derecho → "Ver código fuente de la página"
   - ✅ Debe haber contenido completo, no `<div id="root"></div>` vacío

3. **Test de Google:**
   - [URL Inspection Tool](https://search.google.com/test/rich-results)
   - ✅ Debe detectar todo el texto y estructura

### **Deploy en Vercel**

```bash
# Opción A: Push a GitHub (auto-deploy)
git add .
git commit -m "feat: implementar prerendering estático"
git push origin main

# Opción B: Vercel CLI
vercel --prod
```

**Vercel automáticamente:**
1. Ejecuta `npm run build` (incluye postbuild)
2. React-snap genera HTMLs estáticos
3. Despliega el contenido prerenderizado
4. ✅ Google indexa todo el contenido

---

## 📊 VERIFICACIÓN SEO

### **Google Search Console**

1. Ir a [search.google.com/search-console](https://search.google.com/search-console)
2. URL Inspection → Ingresar tu URL
3. "Test Live URL"
4. Ver "View Crawled Page" → "Screenshot"
5. ✅ Debe mostrarse completamente renderizada

### **Meta Tags verificables**

Cada página prerenderizada incluye:
- `<title>` específico
- `<meta name="description">`
- Open Graph tags
- Schema.org JSON-LD
- ✅ Todo visible en el HTML inicial

---

## 🎯 RUTAS PRERENDERIZADAS

| Ruta | Descripción | Prioridad SEO |
|------|-------------|---------------|
| `/` | Home | 1.0 |
| `/recetas` | Recetario | 0.9 |
| `/calendario` | Calendario siembra | 0.8 |
| `/calculadora` | Calculadora sustrato | 0.8 |
| `/blog/vermicompost` | Post: Vermicompost | 0.7 |
| `/blog/huerta-balcon` | Post: Huerta Balcón | 0.7 |
| `/blog/compost-departamento` | Post: Compost | 0.7 |
| `/blog/banco-semillas` | Post: Semillas | 0.7 |

---

## ⚠️ IMPORTANTE: Agregar Nuevas Rutas

**Cada vez que crees una nueva página/post:**

1. **Actualizar `package.json` → `reactSnap.include`:**
   ```json
   "include": [
     "/",
     "/nueva-ruta"  // ← Agregar aquí
   ]
   ```

2. **Actualizar `sitemap.xml`:**
   ```xml
   <url>
     <loc>https://tuhuertita.ar/nueva-ruta</loc>
     <lastmod>2025-01-XX</lastmod>
     <changefreq>monthly</changefreq>
     <priority>0.7</priority>
   </url>
   ```

3. **Rebuild:**
   ```bash
   npm run build
   ```

---

## 🐛 TROUBLESHOOTING

### **Problema: El build falla con Puppeteer**

**Solución:**
```bash
# Instalar dependencias de Chromium (Linux/Vercel)
npm install --save-dev puppeteer
```

### **Problema: Rutas no se prerrenderizan**

**Verificar:**
1. La ruta está en `reactSnap.include`
2. El Router usa `BrowserRouter` (no `HashRouter`)
3. No hay errores en consola durante el build

**Debug:**
```bash
# Ver logs detallados
DEBUG=react-snap npm run build
```

### **Problema: Contenido dinámico no aparece**

**Solución:**
Agregar `waitForSelector` en package.json:
```json
"reactSnap": {
  "waitFor": 2000,  // Esperar 2 segundos antes de capturar
  "skipThirdPartyRequests": true
}
```

---

## ✅ CHECKLIST FINAL

Antes de hacer deploy, verificar:

- [ ] `npm run build` ejecuta sin errores
- [ ] Archivos HTML generados en `/dist`
- [ ] Contenido visible en `/dist/index.html` (abrir en navegador)
- [ ] JavaScript deshabilitado → contenido sigue visible
- [ ] Todas las rutas en `reactSnap.include`
- [ ] Sitemap actualizado
- [ ] `vercel.json` configurado
- [ ] Test con Google Rich Results

---

## 📚 RECURSOS ADICIONALES

- [React-Snap Docs](https://github.com/stereobooster/react-snap)
- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Vercel Deployment Docs](https://vercel.com/docs)

---

## 🎉 RESULTADO ESPERADO

**Antes:**
- HTML vacío
- Google no indexa contenido
- Pobre SEO

**Después:**
- HTML completo y estático
- Google indexa TODO el contenido
- SEO optimizado
- Tiempo de carga mejorado (First Contentful Paint)

**Diferencia técnica:**
```
SPA: HTML vacío → JS se ejecuta → Contenido aparece
SSG: HTML completo desde el inicio → JS hidrata (mejora interactividad)
```

✅ **Solución definitiva para SEO en Vite + React**

---

**Fecha de implementación:** 16 de Diciembre, 2025  
**Mantenido por:** Tu Huertita Team
