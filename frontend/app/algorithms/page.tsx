import Link from 'next/link'
import Shell from '../../components/Shell'

const algorithms = [
  ['Deutsch–Jozsa','Decide whether a black-box function is constant or balanced.','Beginner','12 min'],
  ['Grover’s Search','Use amplitude amplification to search an unstructured space.','Intermediate','20 min'],
  ['QAOA','Explore a hybrid approach for combinatorial optimization.','Advanced','30 min'],
  ['VQE','Learn a variational algorithm for estimating ground-state energy.','Advanced','30 min'],
  ['Bell / GHZ States','Build and measure entangled multi-qubit states.','Beginner','15 min'],
  ['Quantum Fourier Transform','See the circuit pattern behind a key quantum subroutine.','Advanced','25 min'],
]
export default function Algorithms(){ return <Shell><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Library</div><h1 className="mt-2 text-3xl font-semibold">Quantum Algorithms</h1><p className="mt-2 text-slate-400">Learn the idea, inspect the circuit, then open the same pattern in the lab.</p></div><div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-7">{algorithms.map(([name,desc,diff,time])=><div key={name} className="panel p-5 flex flex-col"><div className="flex items-start justify-between gap-3"><div><div className="text-xs text-slate-500">ALGORITHM</div><h2 className="mt-1 text-lg font-semibold">{name}</h2></div><span className="text-[11px] rounded-md border border-slate-700 px-2 py-1 text-slate-400">{diff}</span></div><p className="mt-4 text-sm text-slate-400 leading-6 flex-1">{desc}</p><div className="mt-5 flex items-center justify-between text-xs text-slate-500"><span>{time}</span><Link href="/lab" className="text-blue-300">Open in lab →</Link></div></div>)}</div></Shell> }
