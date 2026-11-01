# Grand Journey v19.1 — Drag origin fix

The floating drag copy inherited the unit-card transform transition while starting at viewport (0,0), making it fly in from the upper-left corner. It now initializes at the source element's bounding rectangle before DOM insertion, keeps its original size, and translates by pointer displacement from the original grab point. Transitions and animations are disabled on the floating copy. Existing drop validation, energy, tap/hold and fusion behavior are unchanged.

Regression checks: `node tests/drag-origin-v19-1.cjs` and `node tests/setup-v19.cjs`. Save schema remains v19; cache revision is 19.1.
