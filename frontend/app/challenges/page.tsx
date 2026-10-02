import Link from 'next/link'
import Shell from '../../components/Shell'

const challenges = [
  ['Create a Bell State','Build a 2-qubit circuit that produces approximately equal 00 and 11 outcomes.','Beginner','+100 XP'],
  ['Reverse the Circuit','Given a target state, build the gate sequence that creates it.','Intermediate','+180 XP'],
  ['Find the Marked State','Use a Grover-style circuit to amplify one target state.','Intermediate','+220 XP'],
  ['Debug the Circuit','Identify the gate causing the unexpected measurement distribution.','Intermediate','+160 XP'],
]
export default function Challenges(){ return <Shell><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Practice</div><h1 className="mt-2 text-3xl font-semibold">Quantum Challenges</h1><p className="mt-2 text-slate-400">Concept + circuit assessment. Build the answer instead of only selecting it.</p></div><div className="grid lg:grid-cols-2 gap-5 mt-7">{challenges.map(([name,desc,diff,xp],i)=><div key={name} className="panel p-5"><div className="flex items-start justify-between"><div><div className="text-xs text-slate-500">CHALLENGE {String(i+1).padStart(2,'0')}</div><h2 className="mt-1 text-lg font-semibold">{name}</h2></div><div className="text-xs text-amber-200">{xp}</div></div><p className="mt-4 text-sm text-slate-400 leading-6">{desc}</p><div className="mt-5 flex items-center justify-between"><span className="text-[11px] rounded-md border border-slate-700 px-2 py-1 text-slate-400">{diff}</span><Link href="/lab" className="rounded-xl border border-slate-700 px-3 py-2 text-sm">Start →</Link></div></div>)}</div></Shell> }
