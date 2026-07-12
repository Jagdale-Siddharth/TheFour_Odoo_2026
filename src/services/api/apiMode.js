// Flip this ONE flag (or set VITE_USE_MOCK=false in .env) once a teammate's
// real endpoint is live. Every service file below already branches on it,
// so no component code has to change when the swap happens.
export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'true') === 'true';

// Simulates network latency for mock responses so loading states / skeletons
// can be built and tested honestly before the backend exists.
export const mockDelay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve({ success: true, data }), ms));
