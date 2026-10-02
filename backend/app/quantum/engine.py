from collections import Counter
import math


def simulate_with_qiskit(gates, shots=1024):
    from qiskit import QuantumCircuit
    from qiskit_aer import AerSimulator

    n = 2
    qc = QuantumCircuit(n, n)
    for gate in gates:
        name = gate['name'].upper()
        if name == 'H': qc.h(gate.get('qubit', 0))
        elif name == 'X': qc.x(gate.get('qubit', 0))
        elif name == 'Y': qc.y(gate.get('qubit', 0))
        elif name == 'Z': qc.z(gate.get('qubit', 0))
        elif name == 'CX': qc.cx(gate.get('control',0), gate.get('target',1))
        elif name == 'M': pass
    qc.measure([0,1],[0,1])
    sim = AerSimulator()
    result = sim.run(qc, shots=shots).result()
    counts = result.get_counts(qc)
    histogram = {k: counts.get(k,0) / shots for k in ['00','01','10','11']}

    # Statevector before measurement for the pedagogical display.
    from qiskit.quantum_info import Statevector
    sv_qc = QuantumCircuit(n)
    for gate in gates:
        name = gate['name'].upper()
        if name == 'H': sv_qc.h(gate.get('qubit',0))
        elif name == 'X': sv_qc.x(gate.get('qubit',0))
        elif name == 'Y': sv_qc.y(gate.get('qubit',0))
        elif name == 'Z': sv_qc.z(gate.get('qubit',0))
        elif name == 'CX': sv_qc.cx(gate.get('control',0), gate.get('target',1))
    state = Statevector.from_instruction(sv_qc)
    amps = [{'basis': format(i,'02b'), 're': float(v.real), 'im': float(v.imag), 'probability': float(abs(v)**2)} for i,v in enumerate(state.data)]
    return {'backend':'Qiskit Aer','shots':shots,'counts':counts,'probabilities':histogram,'statevector':amps,'circuit':qc.draw(output='text')}


def local_fallback_simulation(gates, shots=1024):
    # Minimal deterministic 2-qubit simulator used as a prototype fallback.
    amp = [complex(1,0),0j,0j,0j]
    def apply_single(amp, q, m):
        out = amp[:]
        pairs = [(0,2),(1,3)] if q == 0 else [(0,1),(2,3)]
        for a,b in pairs:
            va,vb = amp[a],amp[b]
            out[a] = m[0][0]*va + m[0][1]*vb
            out[b] = m[1][0]*va + m[1][1]*vb
        return out
    s2 = 1/math.sqrt(2)
    mats={'H':((s2,s2),(s2,-s2)), 'X':((0,1),(1,0)), 'Y':((0,-1j),(1j,0)), 'Z':((1,0),(0,-1))}
    for g in gates:
        n=g['name'].upper()
        if n in mats: amp=apply_single(amp, g.get('qubit',0), mats[n])
        elif n=='CX':
            c,t=g.get('control',0),g.get('target',1)
            out=amp[:]
            for i,v in enumerate(amp):
                control=(i >> (1-c)) & 1
                if control: out[i ^ (1 << (1-t))]=v
                else: out[i]=v
            amp=out
    probs=[round((abs(x)**2)*100,3) for x in amp]
    counts={k:round(p/100*shots) for k,p in zip(['00','01','10','11'], probs)}
    return {'backend':'Local preview','shots':shots,'counts':counts,'probabilities':{k:p/100 for k,p in zip(['00','01','10','11'],probs)},'statevector':[{'basis':format(i,'02b'),'re':x.real,'im':x.imag,'probability':abs(x)**2} for i,x in enumerate(amp)]}
