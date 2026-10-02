# Q-SENSE Landing Page — Startup Iteration 2

This iteration focuses only on the landing page.

Architecture remains:
- frontend/ — Next.js + React + TailwindCSS + Three.js
- backend/ — untouched
- supabase/ — untouched

Landing flow:
Hero -> Trust bar -> Problem/Solution -> 4 benefit sections -> How it works -> Algorithms -> Impact -> FAQ -> CTA -> Footer

Three.js is used to render a floating laptop and a Q-SENSE product screen.
CSS/SVG handles the orbital chains, glows, scroll reveals, hover states and CTA waves.

Run:
cd frontend
npm install
npm run dev

Then open http://localhost:3000
