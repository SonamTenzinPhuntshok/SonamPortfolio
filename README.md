# STee — 3D UX Portfolio (React + Vite)

Portfolio and CV for **Sonam Tenzin Phuntshok (STee)**.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production files in dist/
npm run preview  # serve the build locally
```

Deploy `dist/` to Vercel, Netlify or GitLab Pages. Routing uses hash URLs (`/#/work/magic-pen`), so it needs no server rewrites.

## What's where

| File | What to edit |
|---|---|
| `src/data/profile.js` | Name, bio, **email**, education **dates**, skills, social links, photos |
| `src/data/caseStudies.js` | The 3 UX case studies (Lam, Tshechu, Menkhang): all 14 sections of text, research data, test results, Figma links |
| `src/screens/lam.jsx`, `tshechu.jsx`, `menkhang.jsx` | The app screens, drawn at real device size (phone 390×844, tablet 834×1112, desktop 1440×900). Web screens are responsive via container queries |
| `src/screens/screens.css` | Styles for the app screens (each app has its own colours) + wireframe mode |
| `src/components/Frame.jsx` / `Carousel.jsx` | Device frame that scales a screen to fit; one-per-swipe carousel with full-size viewer |
| `src/data/projects.js` | Projects you built (Magic Pen, SecureShop, SmartBiz): description, tech, GitLab link |
| `public/img/` | Photos (webp) |
| `public/Sonam-Tenzin-Phuntshok-CV.pdf` | Downloadable CV (see below) |
| `src/three/Scene.jsx` | 3D background: night photos displaced by their depth maps, stars, mist, embers, scroll camera |
| `src/three/sceneConfig.js` | Landmark order, crop focus, and which landmark each page shows |
| `public/scenes/` | Night photos (`*.webp`) + depth/sky/light maps (`*-depth.png`) |
| `tools/make-night-scenes.py` | Script that turned the day photos into night scenes + depth maps (MiDaS) |
| `src/components/Logo.jsx` | Dzong logo mark (also `public/favicon.svg`) |
| `src/styles/global.css` | Brand colours, type and layout |

## Before you share it

1. **Replace the research and test numbers with your real ones.** Survey counts, participant numbers, task success rates, times and SUS scores in `caseStudies.js` are realistic placeholders. Your assessor will expect them to match your actual studies.
2. **Check the project descriptions and tech** in `projects.js` against your GitLab repos.
3. **Add your Figma prototype links** (`prototype: 'https://figma.com/...'`).
4. **Add your email** in `profile.js`, plus the years for GCIT and Yonten Kuenjung.
5. **Screens match your Figma file?** Each screen is coded in `src/screens/`. If your Figma designs differ, edit the matching component (or replace its contents with `<img src="img/your-export.png" style={{width:'100%',height:'100%',objectFit:'cover'}} />`).

## The 3D night background

Five landmark photos (Punakha Dzong, Ta Dzong, Paro Taktsang, Simtokha Dzong, Buddha Dordenma) were converted to night scenes with `tools/make-night-scenes.py`: a MiDaS depth model estimates depth, the sky is replaced with a night sky, walls get warm floodlights, and the rest is moonlit. In the browser each photo is drawn on a finely divided plane pushed forward by its depth, so camera moves give real parallax. Scroll dissolves from one landmark to the next.

**Prayer flags & interaction** (`src/three/PrayerFlags.jsx`, `Lungta.jsx`, `wind.js`): lungta strings and darshing poles are real 3D cloth with lighting from the floodlights and moon. Scrolling raises the wind (scroll direction sets which way the flags fly), moving the pointer ruffles the flags it passes, and tapping empty space on the home page sends paper wind horses (lungta) flying. Windows in each landmark switch on one by one (`tools/make-window-lights.py`). Phones can tilt to move the camera. Everything calms down for people who set "reduce motion".

To swap a photo: put the day photo in a folder, update the `PHOTOS` list in the script, run `python3 tools/make-night-scenes.py public/scenes` (needs `opencv-python`, `onnxruntime`, `scipy` and the MiDaS small ONNX model), then update `src/three/sceneConfig.js`.

**Photo credits:** several of these photos look like Wikimedia Commons images, which usually require attribution. Check each photo's licence and add credits in the footer if needed.

## Regenerating the CV PDF

The PDF is printed from the `/resume` page, so the site and the PDF always match.
Open `/#/resume`, press **Print**, choose *Save as PDF* (A4, margins: none, background graphics: on), and save it over `public/Sonam-Tenzin-Phuntshok-CV.pdf`.

## Portfolio checklist coverage (Google UX)

- Splash / welcome page — `Splash.jsx` ("Welcome to the STeeverse")
- Brand identity + consistent tone of voice — STee wordmark, saffron/orange palette, Syne + Inter
- 3 case studies, each with 14 sections: overview, research (methods, competitive audit, affinity map, insights), define (personas, journey map, problem statement, HMW), ideate (Crazy 8s, impact/effort matrix), IA, wireframes, two rounds of usability testing, before/after iterations, design system with WCAG contrast, hi-fi mockups, responsive desktop/tablet/mobile, clickable in-page prototype, results and reflection
- Images: mobile + web screens, photos
- Short copy, dynamic layout (pinned hero, alternating work rows, horizontal gallery, 3D scroll scene)
- Links to extra info (GitLab, prototypes)
- Clear navigation, résumé link, contact info on every page
- Accessibility: skip link, keyboard focus, alt text, `prefers-reduced-motion` support
