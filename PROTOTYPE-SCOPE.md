# Q-SENSE prototype scope

The screens are mapped directly to the SIH problem statement and the deliverables in the team deck.

## Included in this build

- Landing/product entry
- Learner dashboard
- Structured learning module
- Visual 2-qubit circuit builder with gate library and drag/drop placement
- Code mode with Qiskit example
- Qiskit Aer backend route in Python
- Local simulator fallback for instant browser feedback
- Measurement probability bars
- Statevector display
- What-if interaction state
- Contextual AI copilot: Explain / Debug / Optimize
- OpenAI and Hugging Face adapter routes with deterministic fallback
- Algorithm library
- Circuit + concept challenges
- Learner progress analytics
- Instructor cohort dashboard
- Supabase/PostgreSQL schema and seed data

## Intentionally prototype-level

- PennyLane and Cirq are adapter-ready but not claimed as fully live cloud executions in this first package.
- Authentication and persistent database calls are prepared through Supabase files/env hooks but use demo data by default.
- Bloch sphere is represented in the product architecture and can be added as the next visual layer after the first manual review.
- Full RAG ingestion, collaborative editing, and real hardware/provider credentials are follow-up implementation items.
