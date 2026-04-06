import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { Gallery, Home, Studio } from './pages';
import { NavigationBar, PageFooter } from './components';
import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.color.surface.base};
    color: ${({ theme }) => theme.color.text.primary};
    font-family: ${({ theme }) => theme.typography.family.primary};
    transition: background-color 200ms ease, color 200ms ease;
  }
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
          <Route path='/' element={<Home />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/studio' element={<Studio />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
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
