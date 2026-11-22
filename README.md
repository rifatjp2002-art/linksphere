# ⚡ LinkSphere — Bio Link & Personal Brand Builder

A modern, mobile-first bio link & personal brand page builder (inspired by Linktree) built with **React 19, TypeScript, Tailwind CSS v4, and Firebase (Auth + Firestore)**.

## ✨ Key Features

- **Creator Dashboard & Live Preview:** Manage links, icons, badges, animations (`pulse`, `glow`, `bounce`), social channels, profile photo, and header banner with instant desktop/mobile preview.
- **Theme Studio:** Curated dark, light, pastel, and neon themes with customizable corner radii, glassmorphism surfaces, and English + Bengali font pairings (`Plus Jakarta Sans`, `Hind Siliguri`, `Lora`, `JetBrains Mono`).
- **Google Login & Cloud Sync:** Creators sign in with Google (`signInWithPopup`) to claim a custom `@username` and publish changes to Cloud Firestore.
- **Public Bio Pages (No Login Required for Visitors):** Visitors opening `?u=username` view the published bio page immediately with zero sign-in walls.
- **Real Cross-Device Analytics:** Public visitor views, link clicks, 7-day trends, top referrers, and device breakdowns (Mobile / Desktop / Tablet) sync in real time via Firestore.
- **Interactive Widgets:** Direct Contact Form (via FormSubmit + `mailto:` fallback), Buy Me a Coffee button, Spotify featured track card, QR Code generator (PNG download), and `.vcf` vCard export.
- **GitHub Pages Ready:** Includes `vite.config.ts` relative base paths (`base: './'`), standalone `index.html` export, and an automated GitHub Actions deployment workflow.

---

## 🚀 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (http://localhost:3000)
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```

---

## 🌐 Deploying to GitHub Pages (ফ্রি হোস্টিং)

এই প্রজেক্টে `.github/workflows/deploy.yml` আগে থেকেই সেটআপ করা আছে।

1. প্রজেক্টটি আপনার GitHub Repository-র `main` (অথবা `master`) ব্রাঞ্চে পুশ করুন:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: LinkSphere"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo>.git
   git push -u origin main
   ```
2. GitHub Repository-তে গিয়ে **Settings → Pages → Build and deployment → Source** থেকে **GitHub Actions** সিলেক্ট করুন।
3. কয়েক মিনিটের মধ্যেই আপনার সাইট `https://<your-username>.github.io/<your-repo>/` এ লাইভ হয়ে যাবে।

### 🔥 Firebase Google Login সেটআপ নোট (GitHub Pages-এর জন্য)
আপনার GitHub Pages ডোমেইনে **Google Login** চালু রাখতে **Firebase Console → Authentication → Settings → Authorized domains** অপশনে গিয়ে আপনার GitHub Pages ডোমেইনটি (`<your-username>.github.io`) যোগ করে দিন।

---

## 🔒 Security & Database

- `firebase-blueprint.json` — Entity and collection definitions (`/users`, `/profiles`, `/profiles/{username}/events`).
- `firestore.rules` — Hardened Firestore security rules enforcing PII isolation, owner-only edits, and schema-validated public analytics writes.
- `security_spec.md` — Security invariants and adversarial payload checks.
