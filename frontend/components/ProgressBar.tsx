export default function ProgressBar({ value, className='' }: { value:number; className?: string }) {
  return <div className={`h-1.5 rounded-full bg-slate-800 overflow-hidden ${className}`}><div className="h-full rounded-full bg-blue-500" style={{width:`${value}%`}} /></div>
}
