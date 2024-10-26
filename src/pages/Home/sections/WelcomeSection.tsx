import styled, { useTheme } from 'styled-components';
import { ButtonContainer, SectionText, SectionWrapper } from './sectionStyles';
import { Button, CardCollection } from '../../../components';

const Container = styled.section`
  position: relative;
  display: flex;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.bgColor.bg3};
`;

const Content = styled.div`
  display: grid;
  justify-items: center;
  row-gap: 4em;

  @media (min-width: 56.25em) {
    grid-template-columns: 1fr 1fr;
    gap: 8em 2em;
    -webkit-box-align: center;
    align-items: center;
  }
`;

const TextContainer = styled.div`
  text-align: start;
  color: ${({ theme }) => theme.textColor.t1};
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-flow: wrap;
`;

export function WelcomeSection() {
  const theme = useTheme();
  return (
    <Container>
      <SectionWrapper>
        <Content>
          <CardCollection />
          <TextContainer>
            <HeaderContainer>
              <SectionText>Polardex.</SectionText>
              <div style={{ width: '0.5em' }} />
              <SectionText style={{ color: theme.textColor.t2 }}>
                Store your nostalgia.
              </SectionText>
            </HeaderContainer>
            <ButtonContainer>
              {/* <Link to={'/'}> */}
              <Button buttonType='primary'>Get Started</Button>
              {/* </Link> */}
            </ButtonContainer>
          </TextContainer>
        </Content>
      </SectionWrapper>
      {/* <WelcomeDivider /> */}
    </Container>
  );
}
