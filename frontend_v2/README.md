# 🏥 Serna Health AI - Frontend

Modern Next.js frontend for medical AI analysis platform

## 🎯 Overview

Serna Health AI Frontend is a Next.js 15 application that provides:

- 🔐 User authentication (Login/Register)
- 🧠 Tumor segmentation visualization
- 🎯 Cancer stage classification
- 🫁 Lung cancer risk prediction
- 🤖 AI-powered medical recommendations
- 📱 Responsive design
- ⚡ Optimized performance (37% faster animations)
- 🔄 Loading indicators

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18
- npm or yarn
- Backend API running at `http://localhost:5001`

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your configuration
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home

# Run development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

## 📁 Project Structure

```
frontend_v2/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── login/                   # Login page
│   ├── register/                # Register page
│   └── home/                    # Main application
│       ├── page.tsx
│       └── components/
│           ├── Recommendations.tsx
│           ├── ImageUpload.tsx
│           └── ResultsDisplay.tsx
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── button.tsx
│   │   ├── spinner.tsx
│   │   └── ...
│   ├── reveal-on-view.tsx       # Animation component
│   ├── user-menu.tsx            # User menu
│   └── ...
├── lib/                         # Utilities
│   ├── supabase/               # Supabase client
│   ├── utils.ts                # Helper functions
│   └── i18n.ts                 # Internationalization
├── hooks/                       # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
├── styles/                      # Global styles
├── public/                      # Static assets
├── package.json
├── tsconfig.json
└── next.config.mjs
```

## ✨ Features

### 🔐 Authentication

- User registration with email/password
- Secure login with Supabase
- Session management
- User profile management

### 🧠 Tumor Segmentation

- Upload CT scan images
- Real-time tumor detection
- Adjustable threshold (0.1-0.9)
- Visualization of segmentation mask
- Confidence score display

### 🎯 Cancer Stage Classification

- Automatic image classification
- Three categories: Normal / Benign / Malignant
- Confidence scores
- Detailed analysis

### 🫁 Lung Cancer Risk Prediction

- 23-parameter patient form
- Risk level: Low / Medium / High
- Probability analysis
- Risk factors breakdown

### 🤖 AI Recommendations

- Automatic recommendation generation
- Detailed medical analysis
- Clinical assessment
- Important notes and warnings
- Formatted output with proper indentation

### 🎨 UI/UX Improvements

- ⚡ 37% faster form animations
- 🔄 Loading spinners on buttons
- 📱 Fully responsive design
- 🌙 Dark mode support
- 🎯 Proper nested bullet points
- 🎨 Modern gradient design


## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Authentication**: Supabase
- **Animations**: Motion
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Database**: Supabase PostgreSQL

## 📦 Key Dependencies

```json
{
  "next": "15.2.4",
  "react": "19.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.4.0",
  "@supabase/supabase-js": "^2.0.0",
  "framer-motion": "^11.0.0",
  "@radix-ui/react-*": "latest"
}
```

## 🚀 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### Deployment to Vercel

```bash
# Push to GitHub
git push origin main

# Vercel will automatically deploy
```

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/home
```

### Tailwind Configuration

Edit `tailwind.config.ts` to customize:

- Colors
- Fonts
- Spacing
- Breakpoints

## 📝 Component Documentation

### RevealOnView Component

Animated reveal effect on scroll:

```tsx
<RevealOnView>
  <div>Content that reveals on scroll</div>
</RevealOnView>
```

### Button Component

Enhanced button with loading state:

```tsx
<Button isLoading={isLoading}>
  Submit
</Button>
```

### Spinner Component

Loading indicator:

```tsx
<Spinner className="size-4" />
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 📊 Performance

- ⚡ 37% faster animations (0.95s → 0.6s)
- 🔄 Optimized re-renders
- 📦 Code splitting
- 🖼️ Image optimization
- 🎯 Lazy loading

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Use different port
npm run dev -- -p 3001
```

### Backend connection error

- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure backend is running on port 5001
- Check CORS settings in backend

### Supabase authentication error

- Verify Supabase credentials
- Check Supabase project settings
- Ensure authentication is enabled

## 📄 License

MIT License

## 👥 Contributors

Serna Health AI Team

## 🎉 Ready to Use

Start analyzing medical images with Serna Health AI!

