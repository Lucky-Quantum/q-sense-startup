import os, json, requests


def build_prompt(action, gates, probabilities, statevector):
    return f"""You are Q-SENSE, a quantum-learning copilot. Be concise, accurate, and pedagogical. Never claim a quantum circuit ran on hardware unless the provided context proves it.\n\nAction: {action}\nCircuit: {json.dumps(gates)}\nMeasurement probabilities: {json.dumps(probabilities)}\nStatevector: {json.dumps(statevector)}\n\nRespond with a short student-friendly explanation grounded in this exact circuit. For debug, name concrete issues only. For optimize, suggest safe simplifications only. For explain, connect gates to state evolution."""


def local_answer(action, gates, probabilities):
    names=[g.get('name') for g in gates]
    if action == 'debug':
        if 'CX' in names and 'M' in names:
            return {'text':'No obvious structural issue in this small circuit. The controlled-X is followed by measurement, so the output can be inspected directly.','provider':'mock'}
        return {'text':'Try adding a measurement after the gate sequence so the simulator can produce an observable distribution.','provider':'mock'}
    if action == 'optimize':
        return {'text':'For this compact Bell-state pattern, H + CX is already a useful minimal teaching circuit. In larger circuits, remove consecutive self-inverse pairs such as X·X or H·H where they cancel.','provider':'mock'}
    return {'text':'H creates superposition on q0. CX uses q0 as the control and couples q1 to it, turning the single-qubit superposition into correlated two-qubit outcomes. The histogram should therefore be read together with the circuit, not as an isolated chart.','provider':'mock'}


def tutor_response(action, gates, probabilities, statevector):
    provider=os.getenv('AI_PROVIDER','mock').lower()
    if provider == 'openai' and os.getenv('OPENAI_API_KEY'):
        try:
            r=requests.post('https://api.openai.com/v1/chat/completions',headers={'Authorization':f"Bearer {os.getenv('OPENAI_API_KEY')}",'Content-Type':'application/json'},json={'model':os.getenv('OPENAI_MODEL','gpt-4o-mini'),'messages':[{'role':'system','content':'You are a precise quantum computing tutor.'},{'role':'user','content':build_prompt(action,gates,probabilities,statevector)}],'temperature':0.2},timeout=30)
            r.raise_for_status()
            return {'text':r.json()['choices'][0]['message']['content'],'provider':'openai'}
        except Exception:
            pass
    if provider == 'huggingface' and os.getenv('HF_API_KEY'):
        try:
            model=os.getenv('HF_MODEL','HuggingFaceH4/zephyr-7b-beta')
            r=requests.post(f'https://api-inference.huggingface.co/models/{model}',headers={'Authorization':f"Bearer {os.getenv('HF_API_KEY')}",'Content-Type':'application/json'},json={'inputs':build_prompt(action,gates,probabilities,statevector),'parameters':{'max_new_tokens':220,'temperature':0.2}},timeout=45)
            r.raise_for_status(); data=r.json()
            text=data[0].get('generated_text','') if isinstance(data,list) else str(data)
            return {'text':text,'provider':'huggingface'}
        except Exception:
            pass
    return local_answer(action,gates,probabilities)
