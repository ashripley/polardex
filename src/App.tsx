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
    // Wait until the window has fully loaded
    const onLoadHandler = () => {
      // Make the body visible after everything has loaded
      document.body.style.visibility = 'visible';
    };

    window.addEventListener('load', onLoadHandler);

    // Cleanup the event listener when component unmounts
    return () => {
      window.removeEventListener('load', onLoadHandler);
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
