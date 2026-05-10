# EduShare

EduShare is a modern, full-stack educational resource sharing platform built to foster a collaborative learning community. Designed with a sleek, vibrant, and minimalist UI, EduShare empowers users to discover, share, and curate high-quality educational materials including articles, PDFs, videos, and links.

## 🚀 About the Project

EduShare aims to democratize learning by providing a centralized hub where students, contributors, and administrators can interact. Key features include:

- **Resource Library:** A rich catalog of educational content with advanced filtering, tagging, and voting mechanics.
- **Community Engagement:** Users can upvote, downvote, bookmark, and comment on resources. The platform tracks engagement to calculate dynamic "Quality Scores."
- **Leaderboard:** A gamified community leaderboard that ranks top contributors based on the quality and reach of their shared materials.
- **Role-Based Access:** Dedicated dashboards and interfaces for Users, Contributors, and Administrators.
- **Premium Subscriptions:** Integrated with Razorpay to offer 'Pro' tiers and advanced feature sets.
- **AI Integration:** Built-in capabilities to interface with OpenAI for smart content summarization and metadata tagging.

## 💻 Tech Stack

- **Framework:** Next.js 16 (App Router + Turbopack)
- **Language:** TypeScript
- **Authentication:** NextAuth.js v5 (Edge-compatible Auth Config)
- **Database:** PostgreSQL (Hosted on Railway)
- **ORM:** Prisma 7 with the native `pg` Driver Adapter
- **Styling:** Vanilla CSS + Tailwind CSS utilities
- **Payments:** Razorpay API & Webhooks
- **Media Storage:** Cloudinary

## 🛠 Getting Started

First, ensure you have your `.env` configured with the required database, OAuth, and Razorpay credentials.

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚢 Deployment

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new). Make sure to include all environment variables and Prisma driver build steps in your deployment configuration.
