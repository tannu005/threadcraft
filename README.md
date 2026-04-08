# THREADCRAFT — AI-Powered 3D Product Customizer

A cinematic, premium product customization platform with real-time 3D rendering, AI texture generation, and a sleek dark aesthetic inspired by Nike React, Hello Monday, and Active Theory.

---

## ✦ Stack

| Layer     | Tech                                                      |
|-----------|-----------------------------------------------------------|
| Frontend  | React 18 + Vite, TailwindCSS, Framer Motion               |
| 3D Engine | React Three Fiber, Drei, Three.js                         |
| State     | Zustand                                                   |
| Backend   | Express.js, Multer, OpenAI SDK                            |
| Deploy    | Vercel (frontend) + Render (backend)                      |

---

## ✦ Project Structure

```
threadcraft/
├── public/
│   ├── favicon.svg
│   └── models/
│       └── tshirt.glb          ← Place your GLB model here
├── src/
│   ├── components/
│   │   ├── CustomCursor.jsx    ← Animated custom cursor
│   │   ├── GrainOverlay.jsx    ← Film grain texture overlay
│   │   ├── Loader.jsx          ← Cinematic intro loader
│   │   ├── Navbar.jsx          ← Top navigation
│   │   ├── Scene.jsx           ← R3F 3D canvas + lighting
│   │   ├── Sidebar.jsx         ← Tab-based tool sidebar
│   │   ├── ShareModal.jsx      ← Share/download modal
│   │   └── panels/
│   │       ├── ColorPanel.jsx  ← Color & material controls
│   │       ├── TexturePanel.jsx← File upload panel
│   │       └── AIPanel.jsx     ← DALL-E AI generation
│   ├── context/
│   │   └── store.js            ← Zustand global state
│   ├── pages/
│   │   ├── Home.jsx            ← Landing page
│   │   └── Customizer.jsx      ← Customizer page
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── routes/
│   │   ├── generate.js         ← POST /api/generate (DALL-E)
│   │   └── upload.js           ← POST /api/upload (multer)
│   ├── server.js
│   └── package.json
├── vercel.json
├── render.yaml
└── package.json
```

---

## ✦ Quick Start (Local)

### 1. Clone & install frontend

```bash
# From project root
npm install
```

### 2. Configure frontend env

```bash
cp .env.example .env
# .env content:
# VITE_API_URL=http://localhost:3001
```

### 3. Install & configure backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-openai-key-here
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3001
PORT=3001
```

> **No OpenAI key?** The backend falls back to placeholder images from picsum.photos so you can test the full UI flow without an API key.

### 4. Add your 3D model (optional)

Place a `tshirt.glb` file in `public/models/`. See `public/models/README.md` for free model sources. The app works without it using a built-in fallback shape.

### 5. Run both servers

**Terminal 1 — Frontend:**
```bash
npm run dev
# → http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd backend
npm run dev
# → http://localhost:3001
```

Open `http://localhost:5173` in your browser.

---

## ✦ Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# From project root
vercel

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend.onrender.com
```

Or connect your GitHub repo to Vercel and set:
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API_URL=https://your-backend.onrender.com`

Update `vercel.json` → replace `your-backend.onrender.com` with your actual backend URL.

---

### Backend → Render

1. Push your project to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo
4. Set **Root Directory** to `backend`
5. Set **Build Command:** `npm install`
6. Set **Start Command:** `npm start`
7. Add environment variables:
   - `OPENAI_API_KEY` = your OpenAI key
   - `FRONTEND_URL` = your Vercel URL (e.g. `https://threadcraft.vercel.app`)
   - `BACKEND_URL` = your Render URL (e.g. `https://threadcraft-backend.onrender.com`)

Alternatively, use the `render.yaml` in this repo for one-click deploy.

---

### Backend → Railway (alternative)

```bash
npm i -g @railway/cli
railway login
cd backend
railway init
railway up
# Set env vars in Railway dashboard
```

---

## ✦ Features

### Homepage
- Cinematic intro loader with progress bar and particle burst
- Parallax hero with layered depth and animated orbs
- Animated rotating word cycle (DESIGN → GENERATE → WEAR)
- Scrolling marquee feature strip
- Feature cards with glassmorphism and hover glow
- Process steps section
- Full-bleed CTA section
- Custom cursor with magnetic follower effect
- Film grain overlay for premium tactility

### Customizer
- **Color Panel:** 28-color palette + custom color picker + material sliders (roughness, metalness, env intensity)
- **Texture Panel:** Drag-and-drop file upload with live preview and Three.js texture application
- **AI Panel:** DALL-E 3 integration with 5 style presets (streetwear, minimal, luxury, cyber, vintage), prompt history, one-click re-apply
- **3D Canvas:** React Three Fiber scene with Float animation, ambient particles, contact shadows, HDRI environment, orbit controls
- **Toolbar:** Auto-rotate toggle, clear texture, share button
- **Share Modal:** PNG download (canvas capture) + social share links

### Backend
- POST `/api/generate` — DALL-E 3 image generation with demo fallback
- POST `/api/upload` — Multer file upload with type/size validation
- DELETE `/api/upload/:filename` — Cleanup uploaded files
- GET `/api/health` — Health check
- Rate limiting (50 req/15min global, 5 AI req/min)
- CORS, Helmet security headers

---

## ✦ Customization

### Add a new color palette
Edit `src/components/panels/ColorPanel.jsx` → `PALETTE` array.

### Add a new AI style
Edit `src/components/panels/AIPanel.jsx` → `STYLES` and `STYLE_MODIFIERS` objects.

### Swap the 3D model
Replace `public/models/tshirt.glb` with any GLB. Update the mesh name lookup in `src/components/Scene.jsx` if needed.

### Change HDRI environment
Edit `src/components/Scene.jsx` → `<Environment preset="..." />`. Options: `apartment`, `city`, `dawn`, `forest`, `lobby`, `night`, `park`, `studio`, `sunset`, `warehouse`.

---

## ✦ Environment Variables Reference

| Variable         | Where     | Description                            |
|-----------------|-----------|----------------------------------------|
| `VITE_API_URL`  | Frontend  | Backend URL for API calls              |
| `OPENAI_API_KEY`| Backend   | OpenAI API key for DALL-E              |
| `FRONTEND_URL`  | Backend   | Allowed CORS origin                    |
| `BACKEND_URL`   | Backend   | Self URL (for returning upload URLs)   |
| `PORT`          | Backend   | Server port (default: 3001)            |

---

## ✦ Performance Tips

- Compress your GLB model with [gltf-transform](https://gltf-transform.donmccurdy.com/) or [Draco compression](https://google.github.io/draco/)
- Use `dpr={[1, 1.5]}` in Canvas for lower-end devices
- Enable `frameloop="demand"` in Canvas when autoRotate is off
- Lazy-load the Customizer page (already configured with React.lazy)

---

## ✦ License

MIT — use freely, attribution appreciated.

Built with ♥ using React Three Fiber, Framer Motion, and OpenAI.
"# threadcraft" 
