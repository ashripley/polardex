import styled, { css, keyframes } from 'styled-components';
import {
  BaseCardWrapper,
  BaseCardInnerWrapper,
} from '../BaseCard';

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const shimmerStyle = css`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.color.surface.muted} 25%,
    ${({ theme }) => theme.color.surface.subtle} 50%,
    ${({ theme }) => theme.color.surface.muted} 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`;

const SkeletonBlock = styled.div<{ width?: string; height?: string; radius?: string }>`
  ${shimmerStyle}
  width: ${({ width }) => width ?? '100%'};
  height: ${({ height }) => height ?? '1rem'};
  border-radius: ${({ radius, theme }) => radius ?? theme.radius.sm};
`;

const SkeletonCircle = styled.div`
  ${shimmerStyle}
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.radius.full};
  margin-inline: auto;
  border: 3px solid transparent;
`;

const ImageArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${({ theme }) => theme.space[4]};
  position: relative;
  z-index: 1;
`;

const TextArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  margin-top: ${({ theme }) => theme.space[4]};
  padding: 0 ${({ theme }) => theme.space[4]};
`;

const Row = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[4]};
  width: 100%;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-grow: 1;
  padding: 1em;
  border-radius: ${({ theme }) => theme.radius.xl};
  min-width: 18rem;
`;

export function SkeletonCard() {
  return (
    <Container>
      <BaseCardWrapper>
        <BaseCardInnerWrapper>
          <ImageArea>
            <SkeletonCircle />
          </ImageArea>
          <TextArea>
            <SkeletonBlock width='60%' height='1.2rem' radius='4px' />
            <SkeletonBlock width='40%' height='1rem' radius='4px' />
            <Row>
              <SkeletonBlock width='25%' height='0.9rem' radius='4px' />
              <SkeletonBlock width='25%' height='0.9rem' radius='4px' />
              <SkeletonBlock width='25%' height='0.9rem' radius='4px' />
            </Row>
          </TextArea>
        </BaseCardInnerWrapper>
      </BaseCardWrapper>
    </Container>
  );
}
