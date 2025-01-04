import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Gallery, Home, Studio } from './pages';
import { NavigationBar, PageFooter } from './components';
import { useEffect } from 'react';

const Container = styled.div``;

const Footer = styled.footer``;

const ContainerSpace = styled.div`
  scroll-margin-top: 64px;
  contain: none;
`;

export function App() {
  useEffect(() => {
    // Function to handle visibility toggle
    const handleVisibility = () => {
      document.body.style.visibility = 'hidden';

      // Check document readiness
      if (document.readyState === 'complete') {
        document.body.style.visibility = 'visible';
      } else {
        window.addEventListener('load', () => {
          document.body.style.visibility = 'visible';
        });
      }
    };

    handleVisibility();

    // Cleanup
    return () => {
      window.removeEventListener('load', () => {
        document.body.style.visibility = 'visible';
      });
    };
  }, []);

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Container>
          <NavigationBar />
          <ContainerSpace />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/gallery' element={<Gallery />} />
            <Route path='/studio' element={<Studio />} />
          </Routes>
          <Footer>
            <PageFooter />
          </Footer>
        </Container>
      </ThemeProvider>
    </Router>
  );
}
