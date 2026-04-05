import styled, { useTheme } from 'styled-components';
import { ButtonContainer, SectionText, SectionWrapper } from './sectionStyles';
import { Button, CardCollection } from '../../../components';
import { isMobile } from '../../../utils';
import { Link } from 'react-router-dom';
import { usePage } from '../../../providers';

const Container = styled.section`
  position: relative;
  display: flex;
  flex-grow: 1;
  background-color: ${({ theme }) => theme.color.surface.muted};
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
  display: flex;
  flex-direction: column;
  width: 100%;
  text-align: start;
  color: ${({ theme }) => theme.color.text.primary};
`;

const StyledSectionText = styled(SectionText)`
  width: max-content;
  text-align: center;
`;

const StyledLink = styled(Link)`
  display: inline-flex;
  font-size: 1rem;
  padding: 0;
  text-decoration: none;
  -webkit-text-decoration: none;
`;

export function WelcomeSection() {
  const theme = useTheme();
  const page = usePage();

  return (
    <Container>
      <SectionWrapper>
        <Content>
          <CardCollection />
          <TextContainer
            style={{
              ...(isMobile && { alignItems: 'center' }),
            }}
          >
            <StyledSectionText
              style={{
                color: theme.color.text.primary,
                fontSize: isMobile ? '2rem' : '2.5rem',
              }}
            >
              Store your nostalgia.
            </StyledSectionText>
            <ButtonContainer isMobile={isMobile}>
              <StyledLink
                to={'/gallery'}
                onClick={() => page.setCurrent('gallery')}
                style={{ display: 'flex' }}
              >
                <Button buttonType='primary'>Gallery</Button>
              </StyledLink>
            </ButtonContainer>
          </TextContainer>
        </Content>
      </SectionWrapper>
    </Container>
  );
}
