# MentorLagbe — Smart Tuition & Mentorship Platform (Client)

MentorLagbe is a full-stack, role-based EdTech tuition finder and mentorship booking platform built with Next.js (App Router), TypeScript, Tailwind CSS, BetterAuth, JWT, MongoDB, Stripe, and ImgBB.

## Live Site & Repositories
- **Live URL:** `https://your-client-url.vercel.app` (Vercel-এ ডিপ্লয় করার পর আপডেট করুন)
- **GitHub (Client):** `https://github.com/hmohabbot-oss/mentorlagbe-client`
- **GitHub (Server):** `https://github.com/hmohabbot-oss/mentorlagbe-server`

## Key Features
- **Role-Based Ecosystem:** Separate dashboards and privileges for **Student**, **Tutor**, and **Admin**.
- **Server-Side Search, Filter & Pagination:** Search approved tuitions by title/subject, filter by class level & Online/Offline mode, and navigate pages via MongoDB `.skip()` / `.limit()`.
- **BetterAuth + JWT Security:** Secure session hydration with custom Express middlewares (`verifyToken`, `verifyStudent`, `verifyTutor`, `verifyAdmin`).
- **Stripe Pro Subscriptions:** One-time Stripe Checkout upgrade for **Pro Tutor ($15)** and **Pro Student ($10)** with Webhook & session verification.
- **Direct ImgBB Uploads:** Upload profile avatars and tuition banners directly via the ImgBB API.
- **Dark / Light Theme & Toast Alerts:** Smooth theme toggle and real-time `sonner` notifications.

## NPM Packages Used
- `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `better-auth`, `lucide-react`, `sonner`

