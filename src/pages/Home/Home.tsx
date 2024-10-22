import styled from 'styled-components';

const Main = styled.main`
  background-color: ${({ theme }) => theme.bgColor.bg1};
  box-sizing: inherit;
`;

const HomeSection = styled.section`
  position: relative;
  display: flex;
  flex-grow: 1;
  height: 500px;
  background-color: ${({ theme }) => theme.bgColor.bg2};
`;

export function Home() {
  return (
    <Main>
      <HomeSection />
    </Main>
  );
}
