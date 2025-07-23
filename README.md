# SecureSight Dashboard

A comprehensive security dashboard for monitoring CCTV feeds and managing security incidents, built with the Next.js App Router and Prisma.

## Deployment Instructions

### 1. Prerequisites

- Node.js (v18 or later)
- A GitHub account
- A Vercel account
- A free Postgres database from Neon

### 2. Database Setup

This project uses a Postgres database. The local SQLite database is for development only and will not work in production.

1. Sign up for a free account on **Neon** and create a new project.
2. On your Neon project dashboard, locate the **Connection Details** widget.
3. Copy the **Postgres URL**. This will be your `DATABASE_URL` environment variable.

### 3. Project Setup & Deployment

1. **Push to GitHub:** Ensure your project code is pushed to a GitHub repository.

2. **Import to Vercel:**
   - On your Vercel dashboard, click **Add New...** > **Project**.
   - Import your project's GitHub repository.

3. **Configure Vercel Project:**
   - In the **Environment Variables** section, add the following:
     - **Name:** `DATABASE_URL`
     - **Value:** Paste the Postgres URL you copied from Neon.
   - Expand the **Build & Development Settings** and set the **Build Command** to:
     ```bash
     prisma generate && next build
     ```
   - Click **Deploy**.

4. **Sync Production Database:** After the first deployment succeeds, you need to push your database schema to Neon.
   - In your `prisma/schema.prisma` file, ensure the provider is set to `postgresql`.
   - In your **local terminal**, temporarily set your `DATABASE_URL` to the Neon URL and run:
     ```bash
     npx prisma db push
     npx prisma db seed
     ```
   - This will create the tables and seed your live database. You can now revert your local `.env` file.

## Tech Decisions

- **Framework:** **Next.js 15 (App Router)** was chosen for its modern architecture, including Server Components, simplified data fetching, and a robust file-based routing system ideal for full-stack applications.

- **Database & ORM:** **Prisma** was selected as the ORM for its excellent type safety, which prevents common data-related errors, and its intuitive schema management. **Postgres** (hosted on Neon) was chosen as the database for its reliability and the serverless compatibility that Neon provides.

- **Styling:** **Tailwind CSS** was used for its utility-first approach, allowing for rapid development and easy maintenance of a consistent design system without writing custom CSS files.

- **State Management:** We relied on **React Hooks** (`useState`, `useEffect`, `useRef`) and **prop drilling**. For the level of interactivity required between the player and timeline, lifting state to the parent page component was a simple and effective solution that avoided the overhead of a dedicated state management library like Redux or Zustand.

- **Interactive Timeline:** **SVG** was chosen over HTML Canvas for rendering the timeline. For this use case, SVG's declarative, DOM-based nature makes it easier to manage interactivity (like click/drag events on the scrubber) and scale graphics without losing quality.

## If I had more time…

- **Real-time Updates:** Implement WebSockets to push new incidents to the dashboard in real-time, so the operator doesn't need to refresh the page.

- **Authentication:** Add a login system (e.g., with NextAuth.js) to secure the dashboard and create different user roles.

- **Advanced Filtering:** Allow users to filter the incident list and timeline by date range, camera, or incident type.

- **Testing:** Add unit and integration tests using Jest and React Testing Library to ensure the application is reliable and bug-free.

- **Accessibility (a11y):** Perform a full accessibility audit, adding ARIA attributes and ensuring all interactive elements are keyboard-navigable.
