import styled from 'styled-components';
import {
  WelcomeSection,
  RecentlyAddedSection,
  FeaturesSection,
  HowItWorksSection,
  DetailSection,
  StudioSection,
} from './sections';

const Main = styled.main`
  background-color: ${({ theme }) => theme.color.surface.base};
  box-sizing: inherit;
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export function Home() {
  return (
    <Main>
      <WelcomeSection />
      <RecentlyAddedSection />
      <FeaturesSection />
      <HowItWorksSection />
      <DetailSection />
      <StudioSection />
    </Main>
  );
}
