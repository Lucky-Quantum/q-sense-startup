import Link from 'next/link'
import Shell from '../../components/Shell'

export default function Learn(){
  return <Shell>
    <div className="max-w-4xl"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Module 04</div><h1 className="mt-2 text-3xl font-semibold">Quantum Measurement</h1><p className="mt-2 text-slate-400 leading-7">See how a quantum state becomes an observable result — and why repeated shots produce a probability distribution.</p></div>
    <div className="grid xl:grid-cols-[1.1fr_.9fr] gap-5 mt-7">
      <div className="panel p-6">
        <div className="text-xs uppercase tracking-[.18em] text-slate-500">Concept</div>
        <h2 className="mt-2 text-xl font-semibold">From amplitudes to measurement</h2>
        <p className="mt-4 text-sm leading-7 text-slate-400">A qubit can hold a superposition of basis states. Measurement samples from the associated probabilities and collapses the state to an outcome.</p>
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-6 text-center font-mono text-xl">|ψ⟩ = α|0⟩ + β|1⟩</div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4"><div className="rounded-xl border border-slate-800 p-4"><div className="text-xs text-slate-500">Probability of 0</div><div className="mt-1 font-mono text-lg">|α|²</div></div><div className="rounded-xl border border-slate-800 p-4"><div className="text-xs text-slate-500">Probability of 1</div><div className="mt-1 font-mono text-lg">|β|²</div></div></div>
      </div>
      <div className="panel p-6"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Interactive experiment</div><h2 className="mt-2 text-xl font-semibold">Create a 50 / 50 qubit</h2><div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5"><div className="font-mono text-sm text-slate-300">|0⟩ <span className="text-slate-600">→</span> <span className="text-blue-300">H</span> <span className="text-slate-600">→</span> (|0⟩ + |1⟩) / √2</div><div className="mt-5 h-3 rounded-full bg-slate-800 overflow-hidden flex"><div className="w-1/2 bg-blue-500"/><div className="w-1/2 bg-indigo-400"/></div><div className="mt-2 grid grid-cols-2 text-xs text-slate-500"><span>0 • 50%</span><span className="text-right">1 • 50%</span></div></div><button className="mt-5 rounded-xl border border-slate-700 px-4 py-2 text-sm">Run experiment</button><Link href="/lab" className="mt-5 block text-sm text-blue-300">Build this yourself in Quantum Lab →</Link></div>
    </div>
    <div className="panel p-6 mt-5"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Gate-by-gate insight</div><h2 className="mt-1 text-lg font-semibold">What changed?</h2></div><span className="text-xs rounded-lg border border-blue-500/20 bg-blue-500/5 px-2 py-1 text-blue-200">AI ready</span></div><p className="mt-4 text-sm leading-7 text-slate-400">The Hadamard gate rotates |0⟩ to an equal superposition. The important idea is not just the gate symbol — it is how the operation changes the state you will measure.</p></div>
  </Shell>
}
