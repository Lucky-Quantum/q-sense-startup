'use client'

import { useMemo, useState } from 'react'
import Shell from '../../components/Shell'
import { Gate, GateName, simulate2Q, formatComplex } from '../../lib/quantum'

const gateItems: {name:GateName; label:string; help:string}[] = [
  {name:'H',label:'H',help:'Hadamard · creates superposition'},
  {name:'X',label:'X',help:'Pauli-X · bit flip'},
  {name:'Y',label:'Y',help:'Pauli-Y · rotation with phase'},
  {name:'Z',label:'Z',help:'Pauli-Z · phase flip'},
  {name:'CX',label:'CX',help:'Controlled-X · entangling operation'},
  {name:'M',label:'M',help:'Measurement'},
]
const labels = ['0','1','2','3','4','5']
const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

type PositionedGate = Gate & { col:number }
type BackendResult = { probabilities: Record<string, number>; statevector: {basis:string; re:number; im:number; probability:number}[]; notice?:string }

export default function Lab(){
  const [gates,setGates] = useState<PositionedGate[]>([
    {name:'H',qubit:0,col:1},{name:'CX',control:0,target:1,col:2},{name:'M',qubit:0,col:4},{name:'M',qubit:1,col:4}
  ])
  const [selectedCol,setSelectedCol] = useState(1)
  const [backend,setBackend] = useState('Qiskit Aer')
  const [shots,setShots] = useState(1024)
  const [mode,setMode] = useState<'Visual'|'Code'>('Visual')
  const [ai,setAi] = useState('Circuit insight')
  const [whatIf,setWhatIf] = useState(false)
  const [running,setRunning] = useState(false)
  const [backendResult,setBackendResult] = useState<BackendResult | null>(null)
  const [aiProvider,setAiProvider] = useState<string>('mock')

  const logicalGates = useMemo(()=>gates.map(({col,...g})=>g),[gates])
  const local = useMemo(()=>simulate2Q(logicalGates),[logicalGates])
  const probs = backendResult ? ['00','01','10','11'].map(k=>Math.round((backendResult.probabilities[k] || 0)*1000)/10) : local.probabilities.map(p=>Math.round(p*1000)/10)
  const stateText = backendResult ? backendResult.statevector.filter(x=>x.probability>0.001) : local.state.map((c:any,i)=>({i,label:`|${i.toString(2).padStart(2,'0')}⟩`,probability:c.re*c.re+c.im*c.im,c})).filter((x:any)=>x.probability>0.001)

  function addGate(name:GateName){
    const col=selectedCol
    setGates(g=> name==='CX'
      ? [...g.filter(x=>x.col!==col), {name:'CX',control:0,target:1,col}]
      : [...g.filter(x=>!(x.col===col && x.qubit===0)), {name,qubit:0,col}]
    )
    setBackendResult(null)
  }

  function dropGate(name:GateName,col:number,q:number){
    setSelectedCol(col)
    setGates(g=> name==='CX'
      ? [...g.filter(x=>x.col!==col), {name:'CX',control:0,target:1,col}]
      : [...g.filter(x=>!(x.col===col && x.qubit===q)), {name,qubit:q,col}]
    )
    setBackendResult(null)
  }

  async function runSimulation(){
    setRunning(true)
    try {
      const res=await fetch(`${API}/api/simulate`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({gates:logicalGates,shots,backend})})
      if(!res.ok) throw new Error('backend not reachable')
      const data=await res.json(); setBackendResult(data)
      setAi('Explain')
    } catch {
      setBackendResult(null)
      setAi('Explain')
    } finally { setRunning(false) }
  }

  async function askAI(action:string){
    setAi(action)
    try {
      const res=await fetch(`${API}/api/ai`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:action.toLowerCase(),gates:logicalGates,probabilities:probs,statevector:stateText})})
      if(!res.ok) throw new Error('AI backend unavailable')
      const data=await res.json(); setAiProvider(data.provider || 'mock'); setAiMessage(data.text || '')
    } catch { setAiProvider('mock') }
  }

  const [aiMessage,setAiMessage] = useState('Select a gate or use Explain, Debug, or Optimize to get circuit-aware guidance.')

  return <Shell>
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
      <div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Workspace</div><h1 className="mt-2 text-3xl font-semibold">Quantum Lab</h1><p className="mt-2 text-slate-400">Build visually, inspect the code, simulate, and connect the result to the underlying quantum state.</p></div>
      <div className="flex items-center gap-2"><button onClick={()=>setWhatIf(v=>!v)} className={`rounded-xl px-3 py-2 text-sm border ${whatIf ? 'border-amber-500/30 bg-amber-500/10 text-amber-200' : 'border-slate-700 text-slate-300'}`}>What-if</button><button onClick={()=>{setGates([]);setBackendResult(null)}} className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-300">Clear</button></div>
    </div>

    <div className="panel mt-7 overflow-hidden">
      <div className="border-b border-slate-800 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3"><div className="flex items-center gap-1 rounded-lg bg-slate-900/80 p-1 w-fit">{(['Visual','Code'] as const).map(m=><button key={m} onClick={()=>setMode(m)} className={`px-3 py-1.5 rounded-md text-sm ${mode===m?'bg-slate-800 text-white':'text-slate-500'}`}>{m}</button>)}</div><div className="flex items-center gap-2"><select value={backend} onChange={e=>setBackend(e.target.value)} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300"><option>Qiskit Aer</option><option>PennyLane</option><option>Cirq</option></select><select value={shots} onChange={e=>setShots(Number(e.target.value))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300"><option>256</option><option>512</option><option>1024</option><option>2048</option></select></div></div>

      {mode==='Visual' ? <div className="grid xl:grid-cols-[150px_1fr_330px] min-h-[540px]">
        <div className="border-r border-slate-800 p-4 bg-slate-950/40"><div className="text-[10px] uppercase tracking-[.2em] text-slate-500 mb-3">Gate library</div><div className="space-y-2">{gateItems.map(g=><button key={g.name} title={g.help} onClick={()=>addGate(g.name)} draggable onDragStart={e=>e.dataTransfer.setData('gate',g.name)} className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-left hover:border-blue-500/30 hover:bg-blue-500/5 transition"><div className="font-mono text-sm text-blue-200">{g.label}</div><div className="mt-1 text-[10px] text-slate-500">{g.help.split('·')[0].trim()}</div></button>)}</div><div className="mt-5 text-[10px] text-slate-600 leading-5">Click a gate to place it in the selected column. Drag it onto a wire to place it there.</div></div>
        <div className="p-5 overflow-auto scrollbar-thin"><div className="flex justify-between items-center mb-4"><div><div className="text-xs text-slate-500">CIRCUIT</div><div className="mt-1 text-sm text-slate-300">2 qubits • depth {gates.length ? Math.max(0,...gates.map(g=>g.col))+1 : 0}</div></div><div className="flex gap-2 text-xs"><span className="px-2 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-500">{gates.length} gates</span><span className="px-2 py-1 rounded-md bg-emerald-500/5 border border-emerald-500/15 text-emerald-300">ready</span></div></div>
          <div className="min-w-[720px] rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="grid grid-cols-[36px_repeat(6,1fr)] gap-2 mb-3"><div></div>{labels.map(l=><button key={l} onClick={()=>setSelectedCol(Number(l))} className={`rounded-md px-2 py-1 text-[11px] ${selectedCol===Number(l)?'bg-blue-500/10 text-blue-200 border border-blue-500/20':'text-slate-600 border border-transparent'}`}>c{l}</button>)}</div>
            {[0,1].map(q=><div key={q} className="grid grid-cols-[36px_repeat(6,1fr)] gap-2 items-center mb-5"><div className="text-xs text-slate-500 font-mono">q{q}</div>{labels.map(l=>{const col=Number(l); const g=gates.find(x=>x.col===col && (x.qubit===q || x.control===q || x.target===q)); return <button key={l} onDragOver={e=>e.preventDefault()} onDrop={e=>{const name=e.dataTransfer.getData('gate') as GateName; if(name) dropGate(name,col,q)}} onClick={()=>setSelectedCol(col)} className={`h-14 rounded-xl border relative ${selectedCol===col?'border-blue-500/30 bg-blue-500/[.035]':'border-slate-800 bg-slate-900/35'}`}><span className="absolute left-1 right-1 top-1/2 h-px bg-slate-700" />{g && <span className={`relative z-10 inline-flex h-9 min-w-9 px-2 items-center justify-center rounded-lg border text-xs font-mono ${g.name==='CX' ? 'border-indigo-400/40 bg-indigo-500/10 text-indigo-200' : g.name==='M' ? 'border-slate-600 bg-slate-800 text-slate-200' : 'border-blue-400/40 bg-blue-500/10 text-blue-200'}`}>{g.name==='CX' ? '⊕' : g.name}</span>}</button>})}</div>)}
            <div className="mt-7 border-t border-slate-800 pt-5"><div className="text-[11px] uppercase tracking-[.18em] text-slate-600">Tip</div><div className="mt-2 text-xs text-slate-500">Select a column, then click a gate. Try H on q0 followed by CX to build the Bell state.</div></div>
          </div>
        </div>
        <div className="border-l border-slate-800 bg-[#080d17] p-5 flex flex-col"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">AI Quantum Copilot</div><div className="mt-1 text-sm font-medium">Context-aware assistance</div></div><span className="text-[10px] text-emerald-300">{aiProvider.toUpperCase()}</span></div><div className="grid grid-cols-3 gap-2 mt-5">{['Explain','Debug','Optimize'].map(a=><button key={a} onClick={()=>askAI(a)} className="rounded-lg border border-slate-800 bg-slate-950/60 px-2 py-2 text-xs text-slate-300 hover:border-blue-500/20">{a}</button>)}</div><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300 leading-6 flex-1">{aiMessage}</div>{whatIf && <div className="mt-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs leading-5 text-amber-100">What-if mode: change one gate and re-run to compare the probability distribution and statevector.</div>}<div className="mt-4"><div className="text-[11px] text-slate-500 mb-2">Generated Qiskit code</div><pre className="rounded-xl border border-slate-800 bg-[#050911] p-3 text-[11px] leading-5 text-slate-400 overflow-auto">{`from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()`}</pre></div></div>
      </div> : <div className="grid lg:grid-cols-2 gap-0 min-h-[540px]"><div className="p-5 border-r border-slate-800"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Qiskit code</div><textarea className="mt-4 w-full h-[430px] rounded-2xl border border-slate-800 bg-slate-950 p-5 font-mono text-sm text-slate-300 outline-none" defaultValue={`from qiskit import QuantumCircuit\n\nqc = QuantumCircuit(2)\n\nqc.h(0)\nqc.cx(0, 1)\nqc.measure_all()\n\nprint(qc)`}/></div><div className="p-5"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Live preview</div><div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950 p-6 font-mono text-sm text-slate-300">q0 ── H ──●── M<br/>q1 ───────⊕── M</div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl border border-slate-800 p-4"><div className="text-xs text-slate-500">00 / 11</div><div className="mt-2 text-lg">{probs[0]}% / {probs[3]}%</div></div><div className="rounded-xl border border-slate-800 p-4"><div className="text-xs text-slate-500">Backend</div><div className="mt-2 text-lg">{backend}</div></div></div></div></div>}

      <div className="border-t border-slate-800 p-4 bg-slate-950/80 flex flex-col md:flex-row md:items-center md:justify-between gap-3"><div className="text-xs text-slate-500">{backend} • {shots.toLocaleString()} shots • {backendResult?.notice || 'local preview updates instantly'}</div><div className="flex gap-2"><button onClick={()=>askAI('Explain')} className="rounded-xl border border-slate-700 px-4 py-2 text-sm">Explain circuit</button><button onClick={runSimulation} disabled={running} className="rounded-xl bg-blue-500 px-4 py-2 text-sm font-medium text-slate-950 disabled:opacity-60">{running ? 'Running…' : 'Run simulation ▶'}</button></div></div>
    </div>

    <div className="grid xl:grid-cols-[1fr_1fr] gap-5 mt-5">
      <div className="panel p-6"><div className="flex items-center justify-between"><div><div className="text-xs uppercase tracking-[.18em] text-slate-500">Measurement probabilities</div><h2 className="mt-1 text-lg font-semibold">Simulation result</h2></div><span className="text-[10px] text-emerald-300">{backend.toUpperCase()}</span></div><div className="mt-5 space-y-3">{['00','01','10','11'].map((b,i)=><div key={b} className="flex items-center gap-3"><div className="w-8 font-mono text-xs text-slate-500">{b}</div><div className="h-3 flex-1 rounded-full bg-slate-900 overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{width:`${probs[i]}%`}} /></div><div className="w-12 text-right text-xs text-slate-400">{probs[i]}%</div></div>)}</div></div>
      <div className="panel p-6"><div className="text-xs uppercase tracking-[.18em] text-slate-500">Statevector</div><h2 className="mt-1 text-lg font-semibold">Non-zero amplitudes</h2><div className="mt-5 space-y-2">{stateText.map((x:any)=><div key={x.basis || x.label} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 font-mono text-xs"><span>|{x.basis || x.label?.replaceAll('|','').replace('⟩','')}⟩</span><span className="text-slate-400">{formatComplex(x.c || x)}</span><span className="text-blue-200">p={Math.round((x.probability || x.v)*1000)/1000}</span></div>)}</div><div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-500">Statevector is shown before measurement, so amplitudes explain why the observed histogram looks the way it does.</div></div>
    </div>
  </Shell>
}
