import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '../../utils';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { IconMenu2, IconMoon, IconSun, IconX } from '@tabler/icons-react';
import { useThemeMode } from '../../providers';

const RootContainer = styled.div`
  position: sticky;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
  margin-inline: auto;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background: ${({ theme }) => theme.color.surface.base}cc;
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.muted};
  transition: background-color 200ms ease, border-color 200ms ease;
`;

const NavigationContainer = styled.div`
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  margin-inline: auto;
  width: 100%;
  padding-inline: ${({ theme }) => theme.space[6]};

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
  gap: ${({ theme }) => theme.space[12]};
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
  gap: ${({ theme }) => theme.space[2]};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  font-size: ${({ theme }) => theme.typography.size.md};
  padding: 0;
  text-decoration: none;
  -webkit-text-decoration: none;
`;

const LogoTitle = styled.span`
  color: ${({ theme }) => theme.color.frost.deep};
  display: inline-block;
  font-weight: ${({ theme }) => theme.typography.weight.heavy};
  font-size: ${({ theme }) => theme.typography.size.xl};
  text-align: center;
  background-image: linear-gradient(
    268.67deg,
    ${({ theme }) => theme.color.frost.teal} 3.43%,
    ${({ theme }) => theme.color.frost.sky} 15.69%,
    ${({ theme }) => theme.color.frost.blue} 55.54%,
    ${({ theme }) => theme.color.frost.deep} 99%
  );
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
`;

const List = styled.li`
  text-decoration: none;
  position: relative;
`;

const StyledButton = styled.button`
  flex-direction: column;
  height: 3rem;
  color: ${({ theme }) => theme.color.text.primary};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-size: ${({ theme }) => theme.typography.size.md};
  text-decoration: none;
  text-transform: capitalize;
  padding: 0 ${({ theme }) => theme.space[4]};
  display: flex;
  justify-content: center;
  margin: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: center;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 4px;
  left: ${({ theme }) => theme.space[4]};
  right: ${({ theme }) => theme.space[4]};
  height: 2px;
  background: ${({ theme }) => theme.color.frost.blue};
  border-radius: 1px;
`;

const ImageWrapper = styled.span`
  display: inline-block;
  position: relative;
  width: 10rem;
  overflow: hidden;
`;

const DragoniteImage = styled(motion.img)`
  position: absolute;
  left: 2px;
  top: -100px;
  height: 10rem;
  width: 10rem;
  filter: ${({ theme }) => theme.dropShadow.sm};
`;

const HamburgerButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.color.text.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.color.text.primaryHover};
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.space[2]};
  color: ${({ theme }) => theme.color.text.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.color.text.primaryHover};
  }
`;

const MobileControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
`;

const DesktopControls = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
`;

const MobileMenu = styled(motion.nav)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.color.surface.subtle};
  backdrop-filter: blur(8px);
  padding: ${({ theme }) => theme.space[4]};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.muted};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: ${({ theme }) => `${theme.space[3]} ${theme.space[4]}`};
  color: ${({ theme }) => theme.color.text.primary};
  text-decoration: none;
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  border-radius: ${({ theme }) => theme.radius.md};
  transition: ${({ theme }) => theme.transition.fast};

  &:hover {
    background: ${({ theme }) => theme.color.text.primaryHover};
  }
`;

const navLinks = [
  { to: '/gallery', label: 'Gallery' },
  { to: '/studio', label: 'Studio' },
];

export function NavigationBar() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { isDark, toggle } = useThemeMode();

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <RootContainer>
      <NavigationContainer>
        <NavigationWrapper>
          <NavigationHeader>
            <StyledLink to='/' style={{ display: 'flex' }}>
              <LogoTitle>POLARDEX</LogoTitle>
              <ImageWrapper>
                <DragoniteImage
                  src='https://img.pokemondb.net/sprites/home/normal/dragonite.png'
                  initial={{ y: 80, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.2 }}
                />
              </ImageWrapper>
            </StyledLink>
            {isMobile ? (
              <MobileControls>
                <ThemeToggle
                  onClick={toggle}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <AnimatePresence mode='wait' initial={false}>
                    {isDark ? (
                      <motion.span
                        key='sun'
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconSun stroke={2} size={18} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key='moon'
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconMoon stroke={2} size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </ThemeToggle>
                <HamburgerButton
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label='Toggle menu'
                >
                  <AnimatePresence mode='wait' initial={false}>
                    {menuOpen ? (
                      <motion.span
                        key='close'
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconX stroke={2} size={20} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key='open'
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconMenu2 stroke={2} size={20} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </HamburgerButton>
              </MobileControls>
            ) : (
              <DesktopControls>
                <LayoutGroup>
                  <NavContainer>
                    <NavList>
                      {navLinks.map(({ to, label }) => (
                        <List key={to}>
                          <StyledLink to={to} style={{ display: 'flex' }}>
                            <StyledButton>{label}</StyledButton>
                          </StyledLink>
                          {pathname === to && (
                            <ActiveIndicator layoutId='nav-underline' />
                          )}
                        </List>
                      ))}
                    </NavList>
                  </NavContainer>
                </LayoutGroup>
                <ThemeToggle
                  onClick={toggle}
                  aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  <AnimatePresence mode='wait' initial={false}>
                    {isDark ? (
                      <motion.span
                        key='sun'
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconSun stroke={2} size={18} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key='moon'
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        style={{ display: 'flex' }}
                      >
                        <IconMoon stroke={2} size={18} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </ThemeToggle>
              </DesktopControls>
            )}
          </NavigationHeader>
        </NavigationWrapper>
      </NavigationContainer>
      <AnimatePresence>
        {isMobile && menuOpen && (
          <MobileMenu
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {navLinks.map(({ to, label }, i) => (
              <motion.div
                key={to}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <MobileNavLink to={to} onClick={() => setMenuOpen(false)}>
                  {label}
                </MobileNavLink>
              </motion.div>
            ))}
          </MobileMenu>
        )}
      </AnimatePresence>
    </RootContainer>
  );
}
