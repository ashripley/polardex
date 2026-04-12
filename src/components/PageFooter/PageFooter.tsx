import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { PolarCodeLogo } from '../PolarCodeLogo';

const Container = styled.section`
  width: 100%;
  background-color: ${({ theme }) => theme.color.surface.footer};
  border-top: 1px solid ${({ theme }) => theme.color.surface.border};
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1), border-color 200ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    /* Sit above the fixed bottom tab bar */
    padding-bottom: calc(4rem + env(safe-area-inset-bottom, 0px));
  }
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.breakpoint.lg};
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.space[8]} ${theme.space[6]}`};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[5]};
`;

const NavLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => `${theme.space[1]} ${theme.space[6]}`};

  @media (max-width: ${({ theme }) => theme.breakpoint.mobile}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  text-decoration: none;
  transition: color 150ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    color: ${({ theme }) => theme.color.text.primary};
  }
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[2]};
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
`;

const Dot = styled.span`
  opacity: 0.4;
`;

function HeartSVG() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      style={{ width: '0.75em', height: '0.75em', verticalAlign: 'middle', fill: 'rgb(220, 170, 174)' }}
    >
      <path d='M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21z' />
    </svg>
  );
}

const navLinks = [
  { to: '/collections', label: 'Collection' },
  { to: '/sets', label: 'Sets' },
  { to: '/studio', label: 'Studio' },
  { to: '/overview', label: 'Overview' },
];

export function PageFooter() {
  return (
    <Container>
      <Inner>
        <PolarCodeLogo monochrome />
        <NavLinks>
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to}>{label}</NavLink>
          ))}
        </NavLinks>
        <Meta>
          <span>© 2022–2026 Polar Studio</span>
          <Dot>·</Dot>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Made with <HeartSVG /> in Australia
          </span>
        </Meta>
      </Inner>
    </Container>
  );
}
