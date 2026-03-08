# SalesIQ - Smart Sales Dashboard

SalesIQ is a professional sales intelligence dashboard designed for strategy consultants and business analysts. It provides a comprehensive view of sales performance through intuitive data visualizations, regional analysis, and real-time data management.

## 🚀 Features

- **Personalized Onboarding**: Tailored experience with industry-specific templates (e.g., SaaS, Retail, Manufacturing).
- **Interactive KPI Dashboard**: Real-time tracking of Gross Sales, Units Sold, and Profit Margins.
- **Multi-Dimensional Analysis**:
    - **Overview**: High-level performance trends.
    - **Regional**: Geographical breakdown of sales performance.
    - **Products**: Detailed analysis of product-wise performance.
    - **Reps**: Insights into sales representative performance.
- **Data Management**: Full CRUD capabilities for sale records with seamless Firestore integration.
- **Authentication**: Secure user sign-in and protected routes using Firebase Authentication.
- **Modern UI/UX**: Built with Radix UI and Tailwind CSS, featuring dark mode support and responsive design.

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Radix UI](https://www.radix-ui.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database**: [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Authentication**: [Firebase Auth](https://firebase.google.com/docs/auth)
- **Deployment**: [Vercel](https://vercel.com/)
- **Analytics**: [@vercel/analytics](https://vercel.com/analytics)

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or pnpm
- A Firebase project

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Aryadeshmukh19/salesiq-dashboard.git
   cd salesiq-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory and add your Firebase credentials (refer to `.env.local.example`):
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: Reusable UI components (Dashboard, KPI Bar, Tabs, etc.).
- `context/`: Application state management (Auth Context).
- `lib/`: Utility functions, Firebase configuration, and core logic.
- `public/`: Static assets (icons, images).
- `styles/`: Global styles and CSS configurations.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
