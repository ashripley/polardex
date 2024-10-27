import styled from 'styled-components';
import { DetailSection, StudioSection, WelcomeSection } from './sections';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg1};
  box-sizing: inherit;
`;

export function Home() {
  return (
    <Main>
      <WelcomeSection />
      <DetailSection />
      <StudioSection />
    </Main>
  );
}
