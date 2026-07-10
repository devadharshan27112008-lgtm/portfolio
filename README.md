# N Devadharshan — Portfolio

A dark, circuit-themed personal portfolio site for an ECE student and robotics enthusiast.
Built with plain HTML/CSS/JS — no framework, no build step, so it deploys anywhere instantly.

## What's inside
- `index.html` — all homepage content (About, Skills, Experience, Projects, Certificates, Contact, Learning: 3D design (Tinkercad) & PCB design (KiCad))
- `style.css` — the PCB/circuit visual theme (dark background, neon cyan/green traces, copper accents)
- `script.js` — animated circuit background, mobile nav, scroll progress trace, contact form
- `projects/` — one detail page per project (opens in a new tab from the homepage project cards)
  - `moon-rover.html`, `bluetooth-car.html` — the two current projects
  - `_template.html` — starting point for adding a new project page (see below)
- `assets/js/project-page.js` — shared JS for the project detail pages (nav toggle, photo lightbox)
- `assets/images/profile.jpg` — **add your photo here** (falls back to an icon if missing)
- `assets/projects/moon-rover-1.jpg`, `-2.jpg`, `-3.jpg` — **add Moon Rover photos here** for the homepage card gallery
- `assets/projects/moon-rover/photo-1.jpg` … `photo-6.jpg` — **add Moon Rover build photos here** for the detail page gallery
- `assets/projects/bluetooth-car/photo-1.jpg` … `photo-6.jpg` — **add Bluetooth Car build photos here** for the detail page gallery
- `assets/circuits/moon-rover.png`, `bluetooth-car.png` — **add circuit diagrams/schematics here**
- `assets/certs/` — put certificate images here, then link them in the Certificates section
- `assets/resume.pdf` — **add your resume PDF here**; the "Resume ↓" button in the nav already points to it

## Project detail pages
Each project card on the homepage now opens a dedicated page in a new tab with: an overview, the
circuit/schematic, a components list with explanations, and a photo gallery (tap a photo to view it
full-size; the browser Back button closes the viewer without leaving the site).

**To add a new project:**
1. Duplicate `projects/_template.html`, rename it to something like `projects/my-project.html`.
2. Open it and replace `PROJECT TITLE`, `PROJECT-SLUG`, the badges, overview text, and component list.
   Each `.editor-note` block marks a spot meant to be edited or deleted once you're done.
3. Create matching folders `assets/projects/my-project/` (for gallery photos) and drop a schematic at
   `assets/circuits/my-project.png` when you have them — until then, the page shows a neat placeholder
   automatically, exactly like the rest of the site.
4. Add a new card to the `<div class="projects-grid">` in `index.html` (copy an existing `<a class="project-card">`
   block) with `href="projects/my-project.html"` pointing at your new page.

Until real photos/circuit diagrams exist for Moon Rover and the Bluetooth Car, their detail pages show
the same kind of "add your image →" placeholder used elsewhere on the site — just drop files into the
folders listed above and they'll appear automatically, no code changes needed.

## Things to finish before/after you push
1. **Photo** — drop a photo into `assets/images/` named `profile.jpg`
2. **Moon Rover gallery** — drop images into `assets/projects/` named `moon-rover-1.jpg`, `moon-rover-2.jpg`, `moon-rover-3.jpg`
3. **Project detail photos & circuits** — see "Project detail pages" above
4. **Resume** — once ready, save it as `assets/resume.pdf`
5. **GitHub link** — open `script.js`, find `GITHUB_USERNAME = ''` near the top, and put your GitHub username in the quotes. This updates both the "GitHub" links on the page automatically.
6. **Certificates** — save your certificate images into `assets/certs/` using these exact filenames (JPG or PNG both work, just keep the name and extension matching, or update the `data-cert-src`/`src` in `index.html` to match your extension):
   - `internship-pray-labs.jpg` — the PRAY LABS internship letter (portrait)
   - `udemy-robotics.jpg` — Udemy course certificate (landscape)
   - `coursera-robotics.jpg` — Coursera course certificate (landscape)

   Tapping a certificate on the live site opens it full-size in a viewer. Pressing the browser's **Back button** while it's open closes the viewer and brings you right back to the page — it won't take you away from the site. The certificate grid is centered, and stays centered even when the number of certificates doesn't fill a full row.

## Push to GitHub

```bash
cd portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/devadharshan27112008-lgtm/portfolio.git
git push -u origin main
```

(Create the empty `portfolio` repo on GitHub first, without a README, so there's no merge conflict.)

## Deploy to Vercel

Since you already have deeptrck on Vercel, this will feel familiar:

1. Go to https://vercel.com/new
2. Import the `portfolio` GitHub repo
3. Framework Preset: choose **"Other"** (it's a static site, no build command needed)
4. Leave Build Command and Output Directory blank
5. Click **Deploy**

Vercel will give you a live URL like `portfolio-yourname.vercel.app` — you can rename it or attach a custom domain in the project's Vercel settings.

Every time you `git push` to `main`, Vercel automatically redeploys.

git add .
git commit -m "describe your change"
git push