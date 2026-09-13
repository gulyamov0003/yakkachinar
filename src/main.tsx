import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/cormorant/index.css';
import '@fontsource-variable/cormorant/wght-italic.css';
import '@fontsource-variable/inter-tight/index.css';
import 'lenis/dist/lenis.css';
import './styles/global.css';
import App from './App';
import { isMotionForcedOff } from './lib/motion';

if (isMotionForcedOff()) document.documentElement.dataset.motion = 'reduce';

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
