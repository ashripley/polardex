// Only Home is exported from the barrel — everything else is loaded via
// React.lazy in App.tsx with a direct dynamic import. Re-exporting the lazy
// pages here would defeat code-splitting because static and dynamic imports
// of the same module merge into one chunk in Vite.
export * from './Home';
