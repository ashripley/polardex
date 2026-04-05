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
