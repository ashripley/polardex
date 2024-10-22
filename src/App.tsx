import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from './theme';
import { Home } from './pages';
import { NavigationBar, PageFooter } from './components';

const Container = styled.div``;

const Footer = styled.footer``;

const ContainerSpace = styled.div`
  height: 5em;
  position: relative;
`;

export function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <Container>
          <ContainerSpace />
          <NavigationBar />
          <Routes>
            <Route path='/' element={<Home />} />
            {/* <Route path='/gallery' element={<Gallery />} />
              <Route path='/studio' element={<Studio />} />
              <Route path='/dashboard' element={<Dashboard />} /> */}
          </Routes>
          <Footer>
            <PageFooter />
          </Footer>
        </Container>
      </ThemeProvider>
    </Router>
  );
}
