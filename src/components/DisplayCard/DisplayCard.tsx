import styled, { css } from 'styled-components';
import { CSSProperties } from 'react';
import { motion } from 'motion/react';

interface CardProps {
  title: string;
  bg: string;
  imageUrl: string;
  style?: CSSProperties;
  titleSize?: string;
  height?: number;
  width?: number;
  image?: {
    height: string;
    width: string;
  };
  imageRadius?: string;
  display: boolean;
}

const Container = styled(motion.div)<{ height: number; width: number; bg: string }>`
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ bg }) => bg};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.space[4]};
  flex-shrink: 0;
`;

const Header = styled.div`
  display: flex;
  height: 10%;
  width: 100%;
  background-color: inherit;
  justify-content: space-between;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  height: 80%;
  width: 100%;
  background-color: inherit;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => theme.space[2]};
`;

const Footer = styled.div`
  display: flex;
  height: 10%;
  width: 100%;
  background-color: inherit;
`;

export const Title = styled.h2<{ titleSize: string }>`
  font-size: ${({ titleSize }) => titleSize};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.color.surface.base};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${({ theme }) => theme.space[2]};
  margin: 0;
`;

const ImageContainer = styled.div<{ imageRadius: string }>`
  height: 50%;
  width: 100%;
  background-color: ${({ theme }) => theme.color.surface.base};
  border-radius: ${({ imageRadius }) => imageRadius};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Info = styled.div`
  height: 40%;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Image = styled.img<{ height: string; width: string }>`
  ${({ width, height }) => css`
    height: ${height};
    width: ${width};
  `}
`;

const Line = styled.div`
  height: 2px;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.surface.base};
  margin: 8px 0;
  opacity: 0.4;
  width: 100%;
`;

const FooterLine = styled(Line)`
  width: 20%;
  opacity: 0.3;
`;

const Avatar = styled.div`
  height: 1em;
  width: 1em;
  background-color: ${({ theme }) => theme.color.surface.base};
  border-radius: ${({ theme }) => theme.radius.full};
  margin-right: ${({ theme }) => theme.space[2]};
  opacity: 0.6;
`;

export function DisplayCard({
  style,
  height = 550,
  width = 350,
  title,
  titleSize = '0.85em',
  bg,
  imageRadius = '1em',
  imageUrl,
  image = { height: '5em', width: '5em' },
  display = false,
}: CardProps) {
  return (
    <Container height={height} width={width} style={style} bg={bg}>
      <Header>
        <Title titleSize={titleSize}>{title}</Title>
        <Avatar />
      </Header>
      <Content>
        <ImageContainer imageRadius={imageRadius}>
          <Image src={imageUrl} height={image.height} width={image.width} />
        </ImageContainer>
        {display && (
          <Info>
            <Line />
            <Line />
            <Line />
            <Line />
          </Info>
        )}
      </Content>
      {display && (
        <Footer>
          <FooterLine />
          <FooterLine />
          <FooterLine />
        </Footer>
      )}
    </Container>
  );
}
