import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Serna Health AI - Medical AI Analysis Platform',
  description: 'Advanced AI-powered medical imaging analysis platform for lung cancer detection, tumor segmentation, and clinical recommendations',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Serna Health AI',
    description: 'Medical AI Analysis Platform',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/serna-logo.svg',
        width: 200,
        height: 200,
        alt: 'Serna Health AI Logo',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <style>{`
:root {
  --font-sans: "Geist", ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  --font-mono: "Geist Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
html { font-family: var(--font-sans); }
        `}</style>
      </head>
      <body className="bg-neutral-950">{children}</body>
    </html>
  )
}
