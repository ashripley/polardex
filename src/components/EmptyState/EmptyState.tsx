import styled from 'styled-components';
import { motion } from 'motion/react';
import { type ReactNode } from 'react';
import { easeOut } from '../../theme/motion';

/**
 * Shared empty state. Used wherever a list/grid renders with zero items.
 * Pages used to roll their own — this gives every "no results" moment a
 * consistent visual + tone.
 *
 * Usage:
 *   <EmptyState
 *     icon={<IconCards size={36} />}
 *     title="Your collection is empty"
 *     body="Add your first card from the Sets page to get started."
 *     action={<Button>Browse sets</Button>}
 *   />
 */

const Wrap = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[10]} ${theme.space[6]}`};
  color: ${({ theme }) => theme.color.text.secondary};
  grid-column: 1 / -1;
  min-height: 14rem;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    padding: ${({ theme }) => `${theme.space[16]} ${theme.space[6]}`};
  }
`;

const IconBubble = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.surface.subtle};
  border: 1px solid ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.tertiary};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const Title = styled.p`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.primary};
  margin: 0;
  letter-spacing: -0.01em;
`;

const Body = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin: 0;
  max-width: 22rem;
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
`;

const ActionRow = styled.div`
  margin-top: ${({ theme }) => theme.space[2]};
  display: flex;
  gap: ${({ theme }) => theme.space[3]};
  flex-wrap: wrap;
  justify-content: center;
`;

interface EmptyStateProps {
  /** Optional decorative icon — wrapped in a circular bubble */
  icon?: ReactNode;
  /** Headline (1 line) */
  title: ReactNode;
  /** Optional supporting copy */
  body?: ReactNode;
  /** Primary CTA(s) — buttons or links */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, body, action, className }: EmptyStateProps) {
  return (
    <Wrap
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: easeOut }}
      role='status'
    >
      {icon && <IconBubble>{icon}</IconBubble>}
      <Title>{title}</Title>
      {body && <Body>{body}</Body>}
      {action && <ActionRow>{action}</ActionRow>}
    </Wrap>
  );
}
