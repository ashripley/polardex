import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Gallery, Home } from './pages';
import { NavigationBar, PageFooter } from './components';
import { Studio } from './pages/Studio';

const Container = styled.div``;

const Footer = styled.footer``;

const ContainerSpace = styled.div`
  scroll-margin-top: 64px;
  contain: none;
`;

export function App() {
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
