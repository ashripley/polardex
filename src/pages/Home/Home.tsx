import styled from 'styled-components';
import { WelcomeSection } from './sections';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg1};
  box-sizing: inherit;
`;

export function Home() {
  return (
    <Main>
      <WelcomeSection />
    </Main>
  );
}
