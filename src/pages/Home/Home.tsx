import styled from 'styled-components';
import {
  WelcomeSection,
  FeaturesSection,
  HowItWorksSection,
  DetailSection,
  StudioSection,
} from './sections';

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.base};
  box-sizing: inherit;
  transition: background-color 200ms ease;
`;

export function Home() {
  return (
    <Main>
      <WelcomeSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DetailSection />
      <StudioSection />
    </Main>
  );
}
