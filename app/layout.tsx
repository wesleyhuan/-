import type { Metadata } from 'next'
import './globals.css'
import { InterviewProvider } from '@/context/InterviewContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MockAI — Google Interview Simulator',
  description:
    'Practice Google-style behavioral, technical, and system design interviews with AI. Get instant scored feedback.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <InterviewProvider>
          {/* Minimal top nav — only on non-session pages */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-gray-200/60 dark:border-gray-800/60">
            <Link href="/" className="text-sm font-bold text-gray-900 dark:text-white tracking-tight">
              Mock<span className="text-brand-600">AI</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/interview/setup"
                className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Start Interview
              </Link>
              <ThemeToggle />
            </div>
          </nav>
          <div className="pt-12">{children}</div>
        </InterviewProvider>

        {/* Inline theme init to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || (!saved && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch {}
            `,
          }}
        />
      </body>
    </html>
  )
}
