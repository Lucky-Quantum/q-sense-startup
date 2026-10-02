import Link from 'next/link'
import Shell from '../../components/Shell'
import ProgressBar from '../../components/ProgressBar'

const lessons = [
  ['What is a Qubit?', true], ['Classical vs Quantum Bits', true], ['Superposition', true], ['Quantum Measurement', true], ['Entanglement', false], ['Quantum Gates', false]
]

export default function Dashboard(){
  return <Shell>
    <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-4"><div><div className="text-xs uppercase tracking-[.2em] text-slate-500">Student workspace</div><h1 className="mt-2 text-3xl font-semibold">Good evening, Lucky.</h1><p className="mt-2 text-slate-400">You are one concept away from unlocking the next circuit challenge.</p></div><Link href="/lab" className="rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-medium text-slate-950">Open Quantum Lab ↗</Link></div>

    <div className="grid xl:grid-cols-[1.3fr_.7fr] gap-5 mt-7">
      <div className="panel p-6">
        <div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Continue learning</div><h2 className="mt-1 text-xl font-semibold">Quantum Fundamentals</h2></div><span className="text-sm text-blue-200">72%</span></div>
        <div className="mt-5"><ProgressBar value={72}/></div>
        <div className="mt-5 grid md:grid-cols-2 gap-2">{lessons.map(([l,done],i)=><div key={l as string} className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${done ? 'border-slate-800 bg-slate-950/40' : 'border-blue-500/20 bg-blue-500/5'}`}><span className={`h-6 w-6 rounded-full text-xs flex items-center justify-center ${done ? 'bg-emerald-500/10 text-emerald-300' : 'bg-blue-500/10 text-blue-200'}`}>{done ? '✓' : i+1}</span><span className="text-sm">{l}</span></div>)}</div>
        <div className="mt-6"><Link href="/learn" className="text-sm text-blue-300 hover:text-blue-200">Continue: Quantum Measurement →</Link></div>
      </div>

      <div className="panel p-6"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Quick lab</div><div className="mt-2 text-lg font-semibold">Build your first Bell state</div><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 p-4 font-mono text-sm text-slate-300">q0 ── H ──●── M<br/>q1 ───────⊕── M</div><div className="mt-4 flex gap-3 text-xs"><span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">2 qubits</span><span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-400">4 gates</span></div><Link href="/lab" className="mt-5 inline-block text-sm text-blue-300">Open circuit →</Link></div>
    </div>

    <div className="grid lg:grid-cols-3 gap-5 mt-5">
      <div className="panel p-5"><div className="text-xs text-slate-500">SIMULATIONS</div><div className="mt-1 text-2xl font-semibold">17</div><div className="text-xs text-slate-500 mt-1">this month</div></div>
      <div className="panel p-5"><div className="text-xs text-slate-500">CHALLENGES</div><div className="mt-1 text-2xl font-semibold">8</div><div className="text-xs text-slate-500 mt-1">completed</div></div>
      <div className="panel p-5"><div className="text-xs text-slate-500">STREAK</div><div className="mt-1 text-2xl font-semibold">6 days</div><div className="text-xs text-slate-500 mt-1">keep the momentum</div></div>
    </div>

    <div className="grid xl:grid-cols-[.9fr_1.1fr] gap-5 mt-5">
      <div className="panel p-6"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Your learning path</div><h2 className="mt-1 text-lg font-semibold">From intuition to algorithms</h2><div className="mt-5 space-y-4">{[['Foundations',100],['Circuit Design',68],['Algorithms',35],['Quantum Programming',48]].map(([n,v])=><div key={n as string}><div className="flex justify-between text-sm"><span>{n}</span><span className="text-slate-500">{v}%</span></div><ProgressBar value={v as number} className="mt-2"/></div>)}</div></div>
      <div className="panel p-6"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Recommended next step</div><div className="mt-2 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold">Entanglement → Bell State</h2><p className="mt-2 text-sm text-slate-400 leading-6">You have finished superposition. Build the Bell state next and compare how a CNOT changes the two-qubit measurement distribution.</p></div><div className="text-xs rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-200 px-2 py-1">15 min</div></div><div className="mt-5 flex gap-3"><Link href="/learn" className="rounded-xl border border-slate-700 px-4 py-2 text-sm">Review concept</Link><Link href="/lab" className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-slate-950">Practice in lab</Link></div></div>
    </div>
  </Shell>
}
