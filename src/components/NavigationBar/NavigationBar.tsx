import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { usePage } from '../../providers';
import { useEffect, useState } from 'react';
import { isMobile } from '../../utils';

const bounce = keyframes`
  0% {
    transform: translateY(-100%);
  }
  50% {
    transform: translateY(10%);
  }
  75% {
    transform: translateY(-5%);
  }
  100% {
    transform: translateY(0);
  }
`;

const RootContainer = styled.div`
  position: sticky;
  z-index: 5;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  margin-inline: auto;
  mask-image: linear-gradient(
    to bottom,
    #000 0,
    #000 calc(100% - 0px),
    transparent calc(100% - 0px)
  );
  backdrop-filter: blur(8px);
  background: transparent;
`;

const NavigationContainer = styled.div`
  padding: unset;
  z-index: 3;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  margin-inline: auto;
  width: 100%;
  padding-inline: 1.5rem;

  @media (min-width: 75em) {
    max-width: 75em;
    padding: unset;
  }
`;

const NavigationWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 5rem;
`;

const NavigationHeader = styled.header`
  flex: 1 1;
  justify-content: space-between;
  gap: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
`;

const NavContainer = styled.nav`
  position: relative;
`;

const NavList = styled.ul`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  font-size: 1rem;
  padding: 0;
  text-decoration: none;
  -webkit-text-decoration: none;
`;

const LogoTitle = styled.span`
  color: ${({ theme }) => theme.color.frost.deep};
  display: inline-block;
  font-weight: 900;
  font-size: 1.5rem;
  text-align: center;
  background-color: rgb(255, 178, 62);
  background-image: linear-gradient(
    268.67deg,
    #8fbcbb 3.43%,
    #88c0d0 15.69%,
    #81a1c1 55.54%,
    #5e81ac 99%
  );
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.05rem;
`;

const List = styled.li`
  text-decoration: none;
  position: relative;
`;

const StyledButton = styled.button`
  flex-direction: column;
  height: 3rem;
  color: ${({ theme }) => theme.color.text.primary};
  font-weight: 500;
  font-size: 1rem;
  text-decoration: none;
  text-transform: capitalize;
  padding: 0 1rem;
  display: flex;
  justify-content: center;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: center;
`;

const ImageWrapper = styled.span<{ isVisible: boolean }>`
  display: inline-block;
  position: relative;
  width: 10rem;
  transform: ${({ isVisible }) =>
    isVisible ? 'translateY(0)' : 'translateY(100%)'};
  transition: transform 1s ease-in-out;
  animation: ${bounce} 1s ease-out;
`;

const StyledImage = styled.img`
  position: absolute;
  left: 2px;
  top: -100px;
  transform: rotateZ(180deg);
  height: 10rem;
  width: 10rem;
  filter: ${({ theme }) => theme.dropShadow.sm};
`;

export function NavigationBar() {
  const page = usePage();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => setIsVisible(true), []);

  return (
    <RootContainer>
      <NavigationContainer>
        <NavigationWrapper>
          <NavigationHeader>
            <StyledLink
              to={'/'}
              onClick={() => page.setCurrent('home')}
              style={{ display: 'flex' }}
            >
              <LogoTitle>POLARDEX</LogoTitle>
              <ImageWrapper isVisible={isVisible}>
                <StyledImage src='https://img.pokemondb.net/sprites/home/normal/dragonite.png' />
              </ImageWrapper>
            </StyledLink>
            {!isMobile && (
              <NavContainer>
                <NavList>
                  <StyledLink
                    to={'/gallery'}
                    onClick={() => page.setCurrent('gallery')}
                    style={{ display: 'flex' }}
                  >
                    <List>
                      <StyledButton>Gallery</StyledButton>
                    </List>
                  </StyledLink>
                  <StyledLink
                    to={'/studio'}
                    onClick={() => page.setCurrent('studio')}
                    style={{ display: 'flex' }}
                  >
                    <List>
                      <StyledButton>Studio</StyledButton>
                    </List>
                  </StyledLink>
                </NavList>
              </NavContainer>
            )}
          </NavigationHeader>
        </NavigationWrapper>
      </NavigationContainer>
    </RootContainer>
  );
}
