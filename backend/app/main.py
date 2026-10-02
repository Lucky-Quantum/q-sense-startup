from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
import os

from app.quantum.engine import simulate_with_qiskit, local_fallback_simulation
from app.ai.tutor import tutor_response

load_dotenv()

app = FastAPI(title='Q-SENSE Quantum Backend', version='1.0.0')
origins = [x.strip() for x in os.getenv('CORS_ORIGINS','http://localhost:3000').split(',') if x.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

class Gate(BaseModel):
    name: str
    qubit: Optional[int] = None
    control: Optional[int] = None
    target: Optional[int] = None

class SimRequest(BaseModel):
    gates: List[Gate] = Field(default_factory=list)
    shots: int = 1024
    backend: str = 'Qiskit Aer'

class AIRequest(BaseModel):
    action: str = 'explain'
    gates: List[Gate] = Field(default_factory=list)
    probabilities: List[float] = Field(default_factory=list)
    statevector: List[Dict[str, Any]] = Field(default_factory=list)

@app.get('/health')
def health():
    return {'status':'ok','service':'qsense-backend'}

@app.post('/api/simulate')
def simulate(req: SimRequest):
    payload = [g.model_dump() for g in req.gates]
    if req.backend.lower().startswith('qiskit'):
        try:
            return simulate_with_qiskit(payload, req.shots)
        except Exception as exc:
            result = local_fallback_simulation(payload, req.shots)
            result['notice'] = f'Qiskit backend unavailable in this environment; local preview used: {exc.__class__.__name__}'
            return result
    result = local_fallback_simulation(payload, req.shots)
    result['notice'] = f'{req.backend} adapter is prototype-ready; local preview returned until cloud/provider credentials are connected.'
    return result

@app.post('/api/ai')
def ai(req: AIRequest):
    return tutor_response(
        action=req.action,
        gates=[g.model_dump() for g in req.gates],
        probabilities=req.probabilities,
        statevector=req.statevector,
    )
