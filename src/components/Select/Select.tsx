import styled from 'styled-components';
import * as RadixSelect from '@radix-ui/react-select';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { type ReactNode } from 'react';

/**
 * Shared Radix Select primitives. Three pages used to define their own
 * SelectTrigger / SelectContent / SelectItem components with identical
 * styling — this module is the single source of truth.
 *
 * Usage: compose with Radix Select directly, e.g.
 *
 *   <RadixSelect.Root value={v} onValueChange={setV}>
 *     <SelectTrigger>
 *       <RadixSelect.Value placeholder='Pick one' />
 *       <SelectChevron />
 *     </SelectTrigger>
 *     <RadixSelect.Portal>
 *       <SelectContent>
 *         <SelectViewport>
 *           <SelectItem value='a'>Option A</SelectItem>
 *         </SelectViewport>
 *       </SelectContent>
 *     </RadixSelect.Portal>
 *   </RadixSelect.Root>
 *
 * Or use <SimpleSelect> below for a single-value list with no extra trimmings.
 */

/**
 * The shared Radix Select trigger. Two visual variants via the `$variant`
 * styled-component prop:
 *   - 'box'  (default) — full-width rectangular dropdown for filter forms
 *   - 'pill'           — auto-width pill-shaped button for inline triggers
 */
export const SelectTrigger = styled(RadixSelect.Trigger)<{ $variant?: 'box' | 'pill' }>`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  height: 2.25rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  outline: none;
  text-transform: capitalize;
  white-space: nowrap;
  transition:
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 180ms cubic-bezier(0.22, 1, 0.36, 1);

  /* box (default): full-width rectangular form-style trigger */
  width: ${({ $variant }) => ($variant === 'pill' ? 'auto' : '100%')};
  border-radius: ${({ theme, $variant }) =>
    $variant === 'pill' ? theme.radius.full : theme.radius.md};

  /* pill variant collapses to md radius on mobile to feel less floaty */
  ${({ $variant, theme }) =>
    $variant === 'pill' &&
    `
    @media (max-width: ${theme.breakpoint.mobile}) {
      width: 100%;
      justify-content: space-between;
      border-radius: ${theme.radius.md};
    }
  `}

  &[data-placeholder] { color: ${({ theme }) => theme.color.text.secondary}; }
  &:hover {
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
  &[data-state='open'] {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
  &:focus-visible {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
  }
`;

export const SelectContent = styled(RadixSelect.Content)`
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.base};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: ${({ theme }) => theme.zIndex.modal};
  min-width: var(--radix-select-trigger-width);
  animation: popIn 130ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }

  @keyframes popIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

export const SelectViewport = styled(RadixSelect.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
  max-height: 280px;
`;

export const SelectItem = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  color: ${({ theme }) => theme.color.text.primary};
  cursor: pointer;
  outline: none;
  user-select: none;
  text-transform: capitalize;
  transition: background 80ms cubic-bezier(0.22, 1, 0.36, 1);

  &[data-highlighted] { background: ${({ theme }) => theme.color.surface.muted}; }
  &[data-state='checked'] {
    color: ${({ theme }) => theme.color.frost.blue};
    font-weight: ${({ theme }) => theme.typography.weight.semibold};
  }
`;

export const SelectCheckIndicator = styled(RadixSelect.ItemIndicator)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.frost.blue};
`;

/** Convenience chevron — use inside <SelectTrigger> */
export function SelectChevron() {
  return (
    <RadixSelect.Icon style={{ display: 'flex', opacity: 0.5 }}>
      <IconChevronDown size={12} stroke={2} />
    </RadixSelect.Icon>
  );
}

// ── Convenience component for the common "single value with options list" case ──

interface SimpleSelectOption {
  value: string;
  label: string;
}

interface SimpleSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly (string | SimpleSelectOption)[];
  placeholder?: string;
  /** When provided, an extra "All …" item is rendered at the top of the list. */
  allLabel?: string;
  ariaLabel?: string;
  /** Optional element rendered before the value text inside the trigger (e.g. an icon) */
  prefix?: ReactNode;
}

const ALL_VALUE = '__all__';

/**
 * Drop-in single-value Radix Select. Pass an array of strings or option objects.
 * Renders an "All …" item at the top when `allLabel` is set; selecting it
 * fires `onValueChange('')`.
 */
export function SimpleSelect({
  value,
  onValueChange,
  options,
  placeholder,
  allLabel,
  ariaLabel,
  prefix,
}: SimpleSelectProps) {
  const normalized: SimpleSelectOption[] = options.map((o) =>
    typeof o === 'string' ? { value: o, label: o } : o,
  );

  return (
    <RadixSelect.Root
      value={value || (allLabel ? ALL_VALUE : '')}
      onValueChange={(v) => onValueChange(v === ALL_VALUE ? '' : v)}
    >
      <SelectTrigger aria-label={ariaLabel}>
        {prefix}
        <RadixSelect.Value placeholder={placeholder} />
        <SelectChevron />
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectContent position='popper' sideOffset={6}>
          <SelectViewport>
            {allLabel && (
              <SelectItem value={ALL_VALUE}>
                <RadixSelect.ItemText>{allLabel}</RadixSelect.ItemText>
              </SelectItem>
            )}
            {normalized.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                <SelectCheckIndicator>
                  <IconCheck size={12} stroke={2.5} />
                </SelectCheckIndicator>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
