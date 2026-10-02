# Q-SENSE — AI-Based Interactive Quantum Algorithm Learning Platform

Prototype for SIH Problem Statement 4 / SIH26140.

## Stack used from the team PPT

- **Frontend & UI:** Next.js + React + TailwindCSS
- **Quantum AI & Backend:** Python + Qiskit + PennyLane + Cirq + Hugging Face / OpenAI
- **Database & Deployment:** Vercel + Supabase + PostgreSQL

### Prototype implementation notes
- **Qiskit Aer** is wired as the live Python simulation backend when the Python dependencies are installed.
- PennyLane and Cirq are represented through adapter-ready backend classes so the same circuit format can be extended to them without changing the UI.
- AI routes support **OpenAI**, **Hugging Face**, or a deterministic local fallback (`mock`) so the prototype still works without API keys.
- Supabase/PostgreSQL schema is included under `supabase/schema.sql`.
- The frontend includes a fully interactive 2-qubit visual circuit lab, local instant simulation for UI feedback, measurement probabilities, statevector display, what-if comparison, contextual AI actions, algorithm library, challenges, progress, and instructor analytics.

## Run

### 1) Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000

### 2) Python backend

```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The frontend will use `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000` when set in `.env.local`.

### Environment

Copy `frontend/.env.example` to `frontend/.env.local` and `backend/.env.example` to `backend/.env`.

## Prototype flow

Landing → Dashboard → Learn → Quantum Lab → Simulate → Visualize → AI Explain/Debug/Optimize → Challenge → Progress.

## Notes for SIH demo

The UI is deliberately kept like a product/quantum IDE rather than a generic AI dashboard. AI appears as a contextual copilot tied to the current circuit and simulation output.
