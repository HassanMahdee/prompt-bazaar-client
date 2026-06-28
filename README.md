# Prompt Bazaar

An AI Prompt Sharing & Marketplace Platform built with Next.js, React, and Tailwind CSS. This platform allows users to discover, share, and monetize AI prompts across various AI tools like ChatGPT, Claude, Gemini, and Midjourney.

## Features

- **Homepage**: Featured prompts and top creators with Framer Motion animations
- **All Prompts Page**: Server-side filtering, sorting, and pagination
- **Prompt Details**: View prompt content, copy to clipboard, bookmark, and report functionality
- **User Dashboard**: Profile management, saved prompts, and subscription status
- **Creator Dashboard**: Analytics charts, prompt management, and performance tracking
- **Admin Dashboard**: User management, prompt moderation, and reports handling
- **Payment Integration**: Stripe integration for premium subscriptions
- **Authentication**: Better-auth integration with role-based access control

## Tech Stack

- **Frontend**: Next.js (App Router), React
- **Styling**: Tailwind CSS, DaisyUI
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Charts**: Recharts
- **Notifications**: React Toastify
- **Authentication**: Better-auth
- **API**: Native fetch with custom helper utilities

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running on `http://localhost:5000`
- Environment variables configured

### Installation

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

```
src/
├── app/                      # Next.js app directory
│   ├── all-prompts/          # All prompts listing page
│   ├── dashboard/            # User, creator, and admin dashboards
│   ├── payment/              # Stripe payment integration
│   ├── profile/              # User profile page
│   ├── prompts/[id]/         # Prompt details page
│   ├── error.js              # Error boundary
│   ├── not-found.js          # 404 page
│   ├── layout.js             # Root layout with ToastContainer
│   └── page.js               # Homepage
├── components/              # React components
│   ├── all-prompts/          # All prompts components
│   ├── homepage/             # Homepage components
│   └── shared/               # Shared components (navbar, etc.)
├── lib/                      # Utilities
│   ├── api.js                # API helper utilities
│   └── auth-client.js        # Authentication client
└── app/
    └── globals.css           # Global styles
```

## API Integration

The application uses a custom API helper (`src/lib/api.js`) that wraps native fetch with error handling and JSON parsing:

```javascript
import { get, post, patch, del } from "@/lib/api";

// GET request
const data = await get("/prompts");

// POST request
const result = await post("/bookmarks", { promptId: "123" });

// PATCH request
await patch("/prompts/123/status", { status: "published" });

// DELETE request
await del("/bookmarks/123");
```

## Authentication

The application uses Better-auth for authentication. Session management is handled through the `useSession` hook:

```javascript
import { useSession } from "@/lib/auth-client";

const { data: session, isPending } = useSession();
```

## Available Routes

- `/` - Homepage
- `/all-prompts` - Browse all prompts with filters
- `/prompts/[id]` - View prompt details
- `/dashboard` - User dashboard
- `/dashboard/creator` - Creator dashboard
- `/dashboard/admin` - Admin dashboard
- `/payment` - Upgrade to premium
- `/profile` - User profile
- `/login` - Login page
- `/register` - Registration page

## Role-Based Access

- **User**: Can browse prompts, save bookmarks, and upgrade to premium
- **Creator**: Can create and manage prompts, view analytics
- **Admin**: Can manage users, moderate prompts, and handle reports

## Premium Features

Premium users get:

- Access to all prompts (including private/premium prompts)
- Unlimited bookmarks
- Priority support
- Ad-free experience

## Deployment

The easiest way to deploy is using [Vercel](https://vercel.com/new):

```bash
npm run build
```

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is part of an assignment for educational purposes.
