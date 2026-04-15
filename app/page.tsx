import Link from 'next/link'
import { BrainCircuit, MessageSquare, Layout, Star, ChevronRight, Zap } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 text-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 to-white dark:from-brand-950/30 dark:to-gray-950 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
            <Zap className="w-3.5 h-3.5" />
            Powered by Claude & GPT-4o
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Ace Your{' '}
            <span className="text-brand-600 dark:text-brand-400">Google Interview</span>
            <br />
            with AI Practice
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
            Simulate real Google interviews with an AI interviewer. Get instant scored feedback, model
            answers, and a session report — all in your browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/interview/setup"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-brand-600/20"
            >
              Start Mock Interview
              <ChevronRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-3.5"
            >
              Learn more ↓
            </a>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section id="features" className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Three Interview Types — One Simulator
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <MessageSquare className="w-6 h-6" />,
                title: 'Behavioral (STAR)',
                desc: 'Practice 30+ Google behavioral questions on leadership, conflict, ownership, and ambiguity using the STAR framework.',
                color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
              },
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                title: 'Technical / Coding',
                desc: '30+ LeetCode-style algorithm problems with an in-browser Monaco code editor. Arrays, trees, graphs, DP, and more.',
                color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
              },
              {
                icon: <Layout className="w-6 h-6" />,
                title: 'System Design',
                desc: '20+ large-scale design problems: YouTube, WhatsApp, URL shortener, distributed caches, and more.',
                color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:-translate-y-1 transition-transform duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback features */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-10">
            Rich AI Feedback After Every Answer
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: '📊', title: 'Scored Rubric', desc: 'Clarity, Depth, Structure, Relevance, Technical Accuracy — each rated 1–5 with comments.' },
              { icon: '💡', title: 'Model Answer', desc: 'See a concise ideal answer to compare against your response.' },
              { icon: '🎙️', title: 'Follow-up Questions', desc: 'The AI probes deeper — just like a real interviewer would.' },
              { icon: '📋', title: 'Session Report', desc: 'End-of-session summary with strengths, improvements, readiness level, and study resources.' },
            ].map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-4 p-5 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
              >
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Voice + dual provider */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Voice + Text. Claude or GPT-4o.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm max-w-lg mx-auto">
            Speak your answers via the browser microphone or type them. The AI interviewer reads responses aloud
            via text-to-speech. Switch between Claude (Anthropic) and GPT-4o (OpenAI) at any time.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/interview/setup"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-brand-600/20"
            >
              <Star className="w-4 h-4" />
              Start Practicing Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-600">
          MockAI — Google Interview Simulator · Built with Next.js, Claude & GPT-4o
        </p>
      </footer>
    </main>
  )
}
