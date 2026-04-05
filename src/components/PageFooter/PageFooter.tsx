import styled from 'styled-components';
import { PolarCodeLogo } from '../PolarCodeLogo';

const Container = styled.section`
  width: 100%;
  margin: 0px auto;
  padding: 2.5em 1.5em;

  @media (min-width: 75em) {
    max-width: 75em;
    padding: unset;
  }

  @media (min-width: 56.25em) {
    padding-top: 5em;
    padding-bottom: 5em;
  }
`;

const Studio = styled.div`
  display: flex;
  flex-direction: column;
  -webkit-box-align: center;
  align-items: center;
  box-sizing: inherit;
  justify-content: center;
`;

const StudioHeader = styled.div`
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  margin-bottom: 1em;
  box-sizing: inherit;

  path {
    fill: ${({ theme }) => theme.color.text.primary};
  }
`;

const StudioContent = styled.div``;

const StudioTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  font-size: 0.8em;
  transition: color 0.3s ease-in-out;
  margin-top: 1.125em;
  color: ${({ theme }) => theme.color.text.secondary};

  @media (min-width: 56.25em) {
    display: block;
  }
`;

function HeartSVG() {
  const HeartStyles = {
    width: '0.8em',
    height: '0.8em',
    verticalAlign: 'middle',
    fill: 'rgb(220, 170, 174)',
    transition: 'fill 0.3s ease-in-out',
  };

  return (
    <svg
      data-name='Heart Logo'
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      preserveAspectRatio='none'
      style={{ ...HeartStyles }}
    >
      <path d='M12 21a1 1 0 0 1-.71-.29l-7.77-7.78a5.26 5.26 0 0 1 0-7.4 5.24 5.24 0 0 1 7.4 0L12 6.61l1.08-1.08a5.24 5.24 0 0 1 7.4 0 5.26 5.26 0 0 1 0 7.4l-7.77 7.78A1 1 0 0 1 12 21z'></path>
    </svg>
  );
}

export function PageFooter() {
  return (
    <Container>
      <Studio>
        <StudioHeader>
          <PolarCodeLogo />
        </StudioHeader>
        <StudioContent>
          <StudioTextContainer>
            <div>© 2022-2025 Polar Code Studio</div>
            <div style={{ display: 'inline-flex', alignItems: 'center' }}>
              <div style={{ marginRight: 5 }}>Made with</div>
              <HeartSVG />
              <div style={{ marginLeft: 5 }}>in Australia</div>
            </div>
            <div>v1.0.0</div>
          </StudioTextContainer>
        </StudioContent>
      </Studio>
    </Container>
  );
}
