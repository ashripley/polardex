import { Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Gallery, Home, Studio, Sets, Overview, Login } from './pages';
import { NavigationBar, PageFooter } from './components';
import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase.config';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.color.surface.base};
    color: ${({ theme }) => theme.color.text.primary};
    font-family: ${({ theme }) => theme.typography.family.primary};
    transition: background-color 200ms ease, color 200ms ease;
  }

  /* ── SVG icon micro-interactions ───────────────────────────────────────── */
  button svg,
  a svg,
  [role="button"] svg,
  label[for] svg {
    transition: transform 180ms cubic-bezier(0.34, 1.56, 0.64, 1);
    will-change: transform;
    transform-origin: center;
  }

  /* Default: subtle scale */
  button:hover svg,
  a:hover svg,
  [role="button"]:hover svg {
    transform: scale(1.1);
  }

  button:active svg,
  a:active svg,
  [role="button"]:active svg {
    transform: scale(0.88);
    transition: transform 80ms ease;
  }

  button:disabled svg {
    transform: none !important;
    transition: none !important;
  }

  /* Arrow right — stretch toward the right */
  .icon-arr-r svg { transform-origin: left center; }
  .icon-arr-r:hover svg { transform: scaleX(1.6) !important; }
  .icon-arr-r:active svg { transform: scaleX(0.8) !important; }

  /* Arrow left — stretch toward the left */
  .icon-arr-l svg { transform-origin: right center; }
  .icon-arr-l:hover svg { transform: scaleX(1.6) !important; }
  .icon-arr-l:active svg { transform: scaleX(0.8) !important; }

  /* Arrow down — stretch downward */
  .icon-arr-d svg { transform-origin: top center; }
  .icon-arr-d:hover svg { transform: scaleY(1.6) !important; }
  .icon-arr-d:active svg { transform: scaleY(0.8) !important; }

  /* Close / X — rotate 90° */
  .icon-close:hover svg { transform: rotate(90deg) !important; }
  .icon-close:active svg { transform: rotate(90deg) scale(0.82) !important; }
`;

const AppContainer = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.surface.base};
  transition: background-color 200ms ease;
`;

const Main = styled.main`
  flex: 1;
`;

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const pageTransition = { duration: 0.2, ease: 'easeInOut' as const };

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={pageTransition}
      >
        <Routes location={location}>
          <Route path='/'        element={<Home />} />
          <Route path='/home'    element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/studio'  element={<Studio />} />
          <Route path='/sets'    element={<Sets />} />
          <Route path='/overview' element={<Overview />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isStandalone = pathname === '/login';

  // Session check: guest flag (sessionStorage) or Firebase auth
  const hasGuestSession = sessionStorage.getItem('polardex_session') === 'true';
  const [sessionReady, setSessionReady] = useState(isStandalone || hasGuestSession);

  useEffect(() => {
    if (sessionReady) return;

    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSessionReady(true);
      } else {
        navigate('/login', { replace: true });
      }
      unsub();
    });

    return unsub;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleLoad = () => {
      document.body.style.visibility = 'visible';
    };

    if (document.readyState === 'complete') {
      document.body.style.visibility = 'visible';
    } else {
      document.body.style.visibility = 'hidden';
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  if (isStandalone) {
    return (
      <MotionConfig reducedMotion='user'>
        <GlobalStyle />
        <Routes>
          <Route path='/login' element={<Login />} />
        </Routes>
      </MotionConfig>
    );
  }

  if (!sessionReady) return null;

  return (
    <MotionConfig reducedMotion='user'>
      <GlobalStyle />
      <AppContainer>
        <NavigationBar />
        <Main>
          <AnimatedRoutes />
        </Main>
        <PageFooter />
      </AppContainer>
    </MotionConfig>
  );
}

export function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
