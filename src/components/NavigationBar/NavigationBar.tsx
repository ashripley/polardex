import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import { usePage } from '../../providers';
import { useEffect, useState } from 'react';

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
  color: ${({ theme }) => theme.miscColor.f4};
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
  color: ${({ theme }) => theme.textColor.t1};
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
  filter: drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2))
    drop-shadow(0 1px 1px hsl(210deg 40% 6% / 0.2));
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
            <NavContainer>
              <NavList>
                <List onClick={() => page.setCurrent('gallery')}>
                  <StyledButton>Gallery</StyledButton>
                </List>
                <List onClick={() => page.setCurrent('studio')}>
                  <StyledButton>Studio</StyledButton>
                </List>
                <List onClick={() => page.setCurrent('dashboard')}>
                  <StyledButton>Dashboard</StyledButton>
                </List>
              </NavList>
            </NavContainer>
          </NavigationHeader>
        </NavigationWrapper>
      </NavigationContainer>
    </RootContainer>
  );
}

// export function PolardexLogo({ color }: { color: string }) {
//   return (
//     <svg
//       version='1.1'
//       x='0px'
//       y='0px'
//       viewBox='0 0 211.85136 132.40994'
//       xmlSpace='preserve'
//       id='svg9'
//       width='2em'
//       height='2em'
//       xmlns='http://www.w3.org/2000/svg'
//     >
//       <defs id='defs9' />

//       <g id='OBJECTS' transform='translate(-144.07402,-183.79546)'>
//         <g
//           id='g9'
//           inkscape:export-filename='g9.svg'
//           inkscape:export-xdpi='71.807999'
//           inkscape:export-ydpi='71.807999'
//         >
//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 309.039,230.598 1.16,6.143 c 0.838,4.438 -0.072,9.027 -2.54,12.81 l -4.347,6.662 c -0.919,1.408 -0.72,3.269 0.476,4.451 l 18.393,18.182 c 2.173,2.148 3.132,5.24 2.556,8.241 l -1.726,8.987 1.437,3.467 c 1.723,4.157 1.216,8.905 -1.345,12.605 v 0 L 309.77,299.087 v 0 c 0.757,-4.004 -1.221,-8.026 -4.855,-9.87 L 276.09,274.59 c -4.768,-2.419 -7.617,-7.465 -7.228,-12.797 l 2.553,-34.939'
//             id='path2'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 241.243,267.9 c 5.348,-0.471 10.389,-2.783 14.235,-6.586 l 0.383,-0.384 c 3.594,-3.539 8.427,-5.523 13.468,-5.523'
//             id='path3'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 237.992,236.99 3.158,7.204 c 1.756,4.005 2.348,8.423 1.709,12.749 l -6.399,43.338 c -0.373,2.527 1.251,4.918 3.737,5.503 l 1.855,0.437 c 1.901,0.447 3.43,1.855 4.033,3.713 l 1.221,3.765 h -23.974 c -3.573,0 -6.639,-2.544 -7.299,-6.055 l -3.584,-19.076 c -0.614,-3.267 -2.156,-6.288 -4.441,-8.702 l -14.387,-15.192 c -5.636,-5.952 -8.777,-13.837 -8.777,-22.033 v -12.956'
//             id='path4'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 184.844,235.05 c -3.638,1.281 -6.643,4.482 -9.494,8.15 l -1.808,-10.268 c -0.373,-2.137 -0.23,-4.329 0.416,-6.389 l 1.819,-5.797 c 3.331,-10.586 10.991,-19.265 21.084,-23.889 l 2.137,-0.975 c 9.446,-4.318 19.725,-6.487 30.103,-6.345 l 33.642,0.46 c 2.597,0.033 5.183,-0.34 7.671,-1.107 l 7.484,-2.334 c 8.668,-2.707 18.103,-0.636 24.854,5.424 l 29.346,26.41'
//             id='path5'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 336.767,222.588 7.89,7.101 9.07,22.084 c 0.38,0.925 0.283,1.978 -0.259,2.818 l -1.704,2.641 c -0.693,1.074 -0.951,2.373 -0.721,3.631 l 3.29,17.953 -6.369,5.205 -4.178,-2.055 -7.876,-2.571 c -1.289,-0.421 -2.407,-1.248 -3.187,-2.358 l -6.213,-8.845 c -0.695,-0.99 -1.583,-1.829 -2.61,-2.467 l -19.062,-11.849'
//             id='path6'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 337.348,233.794 c 0,0 0.183,-14.246 -2.192,-16.164 -2.374,-1.918 -11.05,8.493 -12.602,10.41'
//             id='path7'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='M 192.862,264.236 170.66,288.62 c -3.607,3.962 -5.919,8.931 -6.625,14.243 l -0.445,3.348 h 2.763 c 3.434,0 6.441,2.305 7.334,5.622 l 0.748,2.78 H 154.41 c -3.194,0 -6.134,-1.742 -7.669,-4.544 v 0 c -1.098,-2.004 -1.367,-4.359 -0.75,-6.56 l 4.281,-15.27 c 0.157,-0.559 0.278,-1.128 0.362,-1.703 l 4.14,-28.309 c 0.919,-6.287 3.213,-12.295 6.718,-17.595 l 15.775,-23.852'
//             id='path8'
//           />

//           <path
//             style={{
//               fill: 'none',
//               stroke: color,
//               strokeWidth: '6',
//               strokeLinecap: 'round',
//               strokeLinejoin: 'round',
//               strokeMiterlimit: 10,
//             }}
//             d='m 264.724,255.968 -3.4,10.01 c -0.449,1.321 -0.551,2.735 -0.296,4.107 l 6.951,37.484 c 0.492,2.653 2.806,4.577 5.504,4.577 h 23.66 l -2.017,-4.058 c -1.38,-2.777 -3.823,-4.88 -6.774,-5.832 l -1.338,-0.432 c -1.513,-0.488 -2.539,-1.896 -2.539,-3.486 v -9.514 c 0,-1.891 0.496,-3.749 1.438,-5.388 l 1.718,-2.989'
//             id='path9'
//           />
//         </g>
//       </g>
//     </svg>
//   );
// }
