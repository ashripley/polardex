import styled, { css } from 'styled-components';
import { motion } from 'motion/react';

export const BaseCardWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  flex-basis: 250px;
  margin-inline: auto;
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms cubic-bezier(0.22, 1, 0.36, 1);
`;

export const BaseCardInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.base};
  position: relative;
  justify-items: center;
  padding: ${({ theme }) => theme.space[4]};
  transition: ${({ theme }) => theme.transition.normal}, background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 130px;
    border-radius: ${({ theme }) => theme.radius.md} ${({ theme }) => theme.radius.md} 0 0;
    background: ${({ theme }) => theme.color.surface.muted};
    transition: background-color 200ms cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

export const BaseCardImageContainer = styled.div<{ expanded?: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 150px;
  height: 150px;
  border-radius: ${({ theme }) => theme.radius.full};
  background-color: ${({ theme }) => theme.color.surface.base};
  overflow: visible;
  justify-content: flex-end;
  border: 3px solid ${({ theme }) => theme.color.surface.muted};
  margin-inline: auto;
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), outline 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 200ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 200ms cubic-bezier(0.22, 1, 0.36, 1);

  ${({ expanded }) =>
    expanded &&
    css`
      outline: 6px solid ${({ theme }) => theme.color.surface.muted};
      transform: translateY(-24px);
      z-index: 2;
    `}
`;

export const BaseCardTitleContainer = styled.p`
  position: relative;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: ${({ theme }) => theme.space[2]} 0;
`;
