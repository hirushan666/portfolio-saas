<div align="center">

# 🚀 DevFolio

### Build Stunning Developer Portfolios in Minutes

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-FF9900?style=for-the-badge&logo=amazons3&logoColor=white)](https://aws.amazon.com/s3/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java 17](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/)

A full-stack SaaS platform where developers sign in with GitHub, import their repositories, pick a theme, and instantly publish a shareable portfolio — no coding required.

<!--
████████████████████████████████████████████████████████████████
██  🎥 ADD YOUR DEMO VIDEO / GIF HERE                         ██
██                                                             ██
██  Record a 1-2 min walkthrough showing:                      ██
██    • Landing page → GitHub login                            ██
██    • Portfolio builder (all 3 steps)                         ██
██    • Published portfolio in each theme                       ██
██    • Dashboard with portfolio cards                          ██
██                                                             ██
██  Save as: docs/demo.gif  (or link a YouTube video)          ██
██                                                             ██
██  YouTube example:                                           ██
██    [![Demo](https://img.youtube.com/vi/ID/0.jpg)]          ██
██    (https://www.youtube.com/watch?v=ID)                     ██
██                                                             ██
██  GIF example:                                               ██
██    ![Demo](./docs/demo.gif)                                 ██
████████████████████████████████████████████████████████████████
-->

> 🎥 **Add a demo video/GIF here** — Save as `docs/demo.gif` or embed a YouTube link

</div>

---

## ✨ What Makes This Special

### 🔐 GitHub OAuth + One-Click Repo Import

Sign in with GitHub using **NextAuth.js v5** and instantly import all your public repositories. Each repo's description, language, stars, forks, and topics are auto-populated — zero manual data entry.

### 🎨 3 Professionally Designed Themes

A guided **3-step builder wizard** lets you create a portfolio in under 5 minutes:

|           Minimal Clean           |           Midnight Dark           |            Vibrant Pop            |
| :-------------------------------: | :-------------------------------: | :-------------------------------: |
| Elegant serif typography on white | Sleek dark mode with neon accents | Bold gradients with frosted glass |

Every theme has its own **dynamic color system** — cards, badges, buttons, and typography all adapt automatically.

### ☁️ AWS S3 Cloud Uploads

Upload custom avatars and project images directly to **Amazon S3** — or use your GitHub avatar with automatic sync.

### 🌐 Shareable Portfolio Pages

Each portfolio gets an **auto-generated SEO-friendly slug** and a public URL. Server-rendered pages with animated transitions, GitHub profile links, project cards with live/repo URLs, and star/fork counts.

### 📊 Built-in Analytics

View counter tracks how many times each portfolio is visited.

### 🔄 Live GitHub Sync

One-click **"Reload from GitHub"** re-fetches all repositories and updates your portfolio with fresh data.

### 🔒 Middleware-Protected Routes

Next.js middleware enforces auth on protected pages (`/dashboard`, `/edit`) while keeping portfolio view pages public. Unauthenticated users get redirected with a callback URL.

---

## 🏗 Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                          │
└──────────────────────────┬───────────────────────────────────┘
                           │
            ┌──────────────▼──────────────┐
            │     Next.js 16 Frontend     │
            │  React 19 · TypeScript      │
            │  NextAuth · Prisma · Radix  │
            │  Tailwind CSS 4             │
            └──────────────┬──────────────┘
                           │ REST API (Axios)
            ┌──────────────▼──────────────┐
            │  Spring Boot 3.5 Backend    │
            │  Java 17 · Spring Security  │
            │  JPA/Hibernate · Lombok     │
            │  AWS SDK · Jackson          │
            └───┬──────────┬──────────┬───┘
                │          │          │
         ┌──────▼───┐ ┌───▼────┐ ┌───▼──────┐
         │PostgreSQL │ │ AWS S3 │ │GitHub API│
         │  (JSONB)  │ │Uploads │ │ Repos    │
         └──────────┘ └────────┘ └──────────┘
```

### Frontend Stack

Next.js 16 (App Router & Server Components) · React 19 · TypeScript · NextAuth.js v5 (JWT) · Prisma ORM · Tailwind CSS 4 · Radix UI · React Hook Form + Zod · Axios · Lucide Icons · Sonner

### Backend Stack

Spring Boot 3.5 · Java 17 · Spring Security · Spring Data JPA / Hibernate · PostgreSQL (JSONB) · AWS SDK v2 (S3) · Lombok · Bean Validation · Jackson

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18 · Java 17 · Maven 3.8+ · PostgreSQL 15+
- [GitHub OAuth App](https://github.com/settings/developers)
- AWS S3 Bucket

### Setup

```bash
# Clone
git clone https://github.com/hirushan666/portfolio-saas.git
cd portfolio-saas

# Create env files (refer to .env.example in each folder)
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
# ✏️ Fill in your database, GitHub OAuth, and AWS credentials

# Start Backend
cd backend
./mvnw spring-boot:run

# Start Frontend (in a new terminal)
cd frontend
npm install
npx prisma generate
npm run dev
```

Frontend runs at `http://localhost:3000` · Backend at `http://localhost:8080`

---

## 🧩 Why This Project Stands Out

<table>
<tr>
<td width="50%">

**🎯 Real SaaS Architecture** — Not a toy CRUD app. Separate frontend & backend services, cloud database, object storage, and OAuth identity management.

**🔗 External API Integration** — Deep GitHub API v3 integration for fetching, syncing, and enriching repository data.

**🏗 Enterprise Backend Patterns** — Layered architecture (Controller → Service → Repository), DTOs, custom exception handling, and input validation.

</td>
<td width="50%">

**⚡ Cutting-Edge Frontend** — React Server Components, server-side rendering, App Router middleware, and the latest Next.js 16 features.

**🎨 Dynamic Theming Engine** — Theme config cascades from data to UI — every component adapts its colors, typography, and styling dynamically.

**☁️ Multi-Service Cloud Stack** — PostgreSQL + AWS S3 + GitHub API all wired together with proper CORS, environment management, and security configuration.

</td>
</tr>
</table>

---

<div align="center">

### Built with ❤️ by [Hirushan](https://github.com/hirushan666)

**If you found this useful, give it a ⭐!**

[![GitHub Stars](https://img.shields.io/github/stars/hirushan666/portfolio-saas?style=social)](https://github.com/hirushan666/portfolio-saas)

</div>
