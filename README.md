# 🌻 SFL Farm Dashboard

Dashboard para monitorear tu farm de Sunflower Land con análisis IA de qué vender.

## Estructura del proyecto

```
sfl-dashboard/
├── index.html                  # Frontend del dashboard
├── api/
│   └── farm.js                 # Proxy serverless para Vercel
├── netlify/
│   └── functions/
│       └── farm.js             # Proxy serverless para Netlify
├── netlify.toml                # Config de Netlify
├── vercel.json                 # Config de Vercel
└── package.json
```

---

## 🚀 Deploy en Vercel (recomendado)

### Opción A — GitHub + Vercel (más fácil)

1. Subí esta carpeta a un repo de GitHub
2. Entrá a [vercel.com](https://vercel.com) → **Add New Project**
3. Importá tu repo
4. Vercel detecta automáticamente el `vercel.json`
5. Click en **Deploy** ✅

### Opción B — Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 🚀 Deploy en Netlify

### Opción A — GitHub + Netlify (más fácil)

1. Subí esta carpeta a un repo de GitHub
2. Entrá a [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Seleccioná tu repo
4. Build settings:
   - **Publish directory:** `.` (un solo punto)
   - **Functions directory:** `netlify/functions`
5. Click en **Deploy site** ✅

### Opción B — Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 🛠️ Desarrollo local

### Con Vercel:
```bash
npm install
npx vercel dev
# Abre http://localhost:3000
```

### Con Netlify:
```bash
npm install
npx netlify dev
# Abre http://localhost:8888
```

---

## ¿Cómo funciona el proxy?

El browser no puede llamar directamente a `api.sunflower-land.com` por restricciones CORS.
La solución es un **proxy serverless**:

```
Browser → /api/farm?farmId=441 → [Serverless Function] → api.sunflower-land.com → respuesta
```

Vercel y Netlify ejecutan la función en sus servidores (sin CORS), y retornan los datos al browser.

---

## Cambiar Farm ID

Podés cambiar el Farm ID directamente en el dashboard desde el input en la parte superior.
