import styled, { useTheme } from 'styled-components';
import { Link } from 'react-router-dom';
import { pxToRem } from '../helpers';
import { usePage } from '../../providers';

const NavigationHeader = styled.header`
  display: flex;
  position: fixed;
  top: 0px;
  height: 5em;
  width: 100%;
  z-index: 3;
  transition: height 250ms ease-in-out, box-shadow 250ms ease-in-out;
  user-select: none;
`;

const Container = styled.div`
  background-color: ${({ theme }) => theme.bgColor.bg2};
  width: auto;
  padding: 1em;
  border-radius: 25px;
  width: auto;
  margin: auto;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (min-width: 75em) {
    max-width: 75em;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
`;

const StyledLogoText = styled.span`
  color: inherit;
  font-family: inherit;
  margin-left: ${pxToRem('xxs')};
  font-size: ${pxToRem('xs')};
  color: ${({ theme }) => theme.textColor.t1};
  font-weight: 500;
  z-index: 10;
  transition: opacity 400ms ease-in-out;
`;

const NavContainer = styled.nav`
  display: flex;
`;

const NavList = styled.div`
  display: flex;
  -webkit-box-pack: justify;
  justify-content: space-between;
  color: ${({ theme }) => theme.textColor.t1};
  font-size: ${pxToRem('xs')};
  font-weight: 500;
`;

const NavOptionText = styled.span`
  margin: 0px 0.5rem;
  color: inherit;
  cursor: pointer;
  text-decoration: none;
  border-radius: 0.25em;
  padding: 0.15em 0.5em;
  transition: background-color 400ms ease-in-out;
  outline: none;
  letter-spacing: ${pxToRem('xxxxs')};

  &:hover {
    background-color: ${({ theme }) => theme.textColor.t1Hover};
  }
`;

const StartNavText = styled(NavOptionText)`
  margin-left: 0px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

export function NavigationBar() {
  const page = usePage();
  const theme = useTheme();

  return (
    <NavigationHeader>
      <Container>
        <LogoContainer>
          <StyledLink
            to={'/'}
            onClick={() => page.setCurrent('home')}
          ></StyledLink>
          <StyledLogoText>POLARDEX</StyledLogoText>
        </LogoContainer>
        <NavContainer>
          <NavList>
            <StyledLink
              to={'/gallery'}
              onClick={() => page.setCurrent('gallery')}
              style={{ textDecoration: 'none', color: theme.textColor.t1 }}
            >
              <StartNavText>Gallery</StartNavText>
            </StyledLink>
            <StyledLink
              to={`/studio`}
              onClick={() => page.setCurrent('studio')}
              style={{ textDecoration: 'none', color: theme.textColor.t1 }}
            >
              <NavOptionText>Studio</NavOptionText>
            </StyledLink>
            <StyledLink
              to={'/dashboard'}
              onClick={() => page.setCurrent('dashboard')}
              style={{ textDecoration: 'none', color: theme.textColor.t1 }}
            >
              <NavOptionText>Dashboard</NavOptionText>
            </StyledLink>
          </NavList>
        </NavContainer>
      </Container>
    </NavigationHeader>
  );
}
