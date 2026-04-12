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
    /* Prevent rubber-band scroll revealing white edges on iOS */
    overscroll-behavior: none;
  }

  /* Native-app feel on mobile */
  @media (max-width: 759px) {
    /* Disable callout on long-press for non-text elements */
    button, a, [role="button"] {
      -webkit-touch-callout: none;
      user-select: none;
    }
    /* Instant touch response — no 300ms click delay */
    * {
      touch-action: manipulation;
    }
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

  /* Arrow right — nudge right */
  .icon-arr-r svg { transform-origin: center; }
  .icon-arr-r:hover:not(:disabled) svg { transform: translateX(3px) !important; }
  .icon-arr-r:active:not(:disabled) svg { transform: translateX(1px) scale(0.9) !important; }

  /* Arrow left — nudge left */
  .icon-arr-l svg { transform-origin: center; }
  .icon-arr-l:hover:not(:disabled) svg { transform: translateX(-3px) !important; }
  .icon-arr-l:active:not(:disabled) svg { transform: translateX(-1px) scale(0.9) !important; }

  /* Arrow down — nudge down */
  .icon-arr-d svg { transform-origin: center; }
  .icon-arr-d:hover:not(:disabled) svg { transform: translateY(3px) !important; }
  .icon-arr-d:active:not(:disabled) svg { transform: translateY(1px) scale(0.9) !important; }

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

  @media (max-width: 759px) {
    padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
  }
`;

const pageVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

// Custom iOS-style easing — snappier than easeInOut
const pageTransition = { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] as const };

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

  // Guest session: sessionStorage is written in Login then navigate() fires.
  // The auth effect above only runs once (on mount), so it never sees the new
  // sessionStorage value. This effect catches it on every pathname change.
  useEffect(() => {
    if (sessionReady) return;
    if (sessionStorage.getItem('polardex_session') === 'true') {
      setSessionReady(true);
    }
  }, [pathname, sessionReady]);

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
