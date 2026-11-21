# MentorLagbe — Smart Tuition & Mentorship Platform (Client)

MentorLagbe is a full-stack, role-based EdTech tuition finder and mentorship booking platform built with Next.js (App Router), TypeScript, Tailwind CSS, BetterAuth, JWT, MongoDB, Stripe, and ImgBB.

## Live Site & Repositories
- **Live Site:** https://mentorlagbe-client-lilac.vercel.app
- **Backend API:** https://mentorlagbe-server-gold.vercel.app
- **GitHub (Client):** https://github.com/hmohabbot-oss/mentorlagbe-client
- **GitHub (Server):** https://github.com/hmohabbot-oss/mentorlagbe-server

## Key Features
- **Role-Based Dashboards:** Dedicated workspaces and access controls for **Student**, **Tutor**, and **Admin**.
- **Authentication & Recovery:** Email/Password sign-up with role selection, Google Social Login via BetterAuth, and Forgot/Reset Password via email.
- **Server-Side Search, Filter & Pagination:** Search approved tuitions by title/subject/tutor, filter by subject, class level, and Online/Offline mode with MongoDB `.skip()` & `.limit()` pagination.
- **Tutor Schedule Slots & Booking:** Tutors assign preset or custom time slots when posting tuitions; Students choose from available slots when applying.
- **Saved Tuitions (Bookmarks):** Students can bookmark favorite tuition listings and manage them from their dashboard.
- **Stripe Pro Subscriptions:** One-time Stripe Checkout upgrade for **Pro Tutor ($15)** (unlimited posts & verified badge) and **Pro Student ($10)** (priority booking).
- **Direct ImgBB Uploads:** Upload profile avatars and tuition banners directly via the ImgBB API.
- **Dark / Light Theme & Toast Alerts:** Smooth theme switcher and real-time `sonner` notifications.

## NPM Packages Used
- `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `better-auth`, `lucide-react`, `sonner`

## Admin & Demo Credentials (For Quick Testing)
- **Admin:** `admin@mentorlagbe.com` / `Password123!`
- **Tutor:** `fatema@gmail.com` / `P@ss321#`
- **Student:** `alimurtaza@gmail.com` / `P@ss321#`