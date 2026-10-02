insert into learning_modules (slug,title,description,difficulty) values
('qubits','What is a Qubit?','Understand basis states, amplitudes and measurement.','Beginner'),
('superposition','Superposition','Experiment with the Hadamard gate.','Beginner'),
('measurement','Quantum Measurement','Connect amplitudes to probabilities.','Beginner'),
('entanglement','Entanglement','Build and inspect a Bell state.','Beginner'),
('algorithms','Quantum Algorithms','Explore Grover, VQE, QAOA and more.','Intermediate')
on conflict (slug) do nothing;

insert into challenges (slug,title,difficulty,xp,prompt) values
('bell-state','Create a Bell State','Beginner',100,'Build a 2-qubit circuit that produces approximately equal 00 and 11 outcomes.'),
('reverse-circuit','Reverse the Circuit','Intermediate',180,'Given a target state, build the gate sequence that creates it.'),
('debug-circuit','Debug the Circuit','Intermediate',160,'Identify the gate causing the unexpected measurement distribution.')
on conflict (slug) do nothing;
