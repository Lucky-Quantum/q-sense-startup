'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  ['Dashboard','/dashboard','⌂'],
  ['Learn','/learn','◈'],
  ['Quantum Lab','/lab','⚛'],
  ['Algorithms','/algorithms','∿'],
  ['Challenges','/challenges','◇'],
  ['Progress','/progress','▥'],
  ['Instructor','/instructor','▦'],
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-[#060912] grid-bg">
      <div className="flex">
        <aside className="hidden lg:flex w-64 min-h-screen border-r border-slate-900 bg-[#070b14]/90 px-4 py-6 flex-col sticky top-0">
          <Link href="/" className="px-3 mb-8 flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl border border-blue-400/30 bg-blue-500/10 flex items-center justify-center text-blue-300">Q</div>
            <div>
              <div className="font-semibold tracking-wide">Q-SENSE</div>
              <div className="text-[10px] uppercase tracking-[.22em] text-slate-500">Quantum Learning Lab</div>
            </div>
          </Link>
          <nav className="space-y-1">
            {items.map(([label, href, icon]) => {
              const active = pathname === href
              return <Link key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[.03]'}`}>
                <span className="w-5 text-center text-slate-300">{icon}</span><span>{label}</span>
              </Link>
            })}
          </nav>
          <div className="mt-auto panel p-4">
            <div className="text-xs text-slate-500 mb-2">CURRENT PATH</div>
            <div className="font-medium text-sm">Quantum Fundamentals</div>
            <div className="mt-3 h-1.5 rounded-full bg-slate-800 overflow-hidden"><div className="h-full w-[72%] bg-blue-500 rounded-full" /></div>
            <div className="mt-2 flex justify-between text-[11px] text-slate-500"><span>4 / 6 lessons</span><span>72%</span></div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <header className="h-16 border-b border-slate-900 bg-[#070b14]/75 backdrop-blur flex items-center justify-between px-5 lg:px-8 sticky top-0 z-30">
            <div className="lg:hidden flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-300">Q</span><b>Q-SENSE</b></div>
            <div className="hidden md:block text-xs text-slate-500">Interactive quantum education • simulation • intelligent tutoring</div>
            <div className="flex items-center gap-3">
              <button className="h-9 w-9 rounded-lg border border-slate-800 text-slate-400">⌘</button>
              <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-sm">L</div>
            </div>
          </header>
          <div className="p-5 md:p-8 max-w-[1500px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}
