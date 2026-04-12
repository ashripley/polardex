import styled from 'styled-components';
import {
  IconSearch,
  IconX,
  IconChevronDown,
  IconCheck,
  IconAdjustments,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
import * as RadixSelect from '@radix-ui/react-select';
import { CollectionsFilters, defaultFilters, hasActiveFilters } from './filterTypes';
import { useState, type ReactNode } from 'react';
import { Popover } from '../Popover';

export type ViewMode = 'cards' | 'art';

interface FilterBarProps {
  filters: CollectionsFilters;
  onChange: (filters: CollectionsFilters) => void;
  typeOptions: string[];
  setOptions: string[];
  conditionOptions: string[];
  /**
   * The total card count and current filtered count are no longer rendered
   * inside the FilterBar — the page-level summary card and the pagination
   * footer already show this. We keep these props in the API for now in case
   * we want to bring back a contextual count indicator later, but they're
   * intentionally unused.
   */
  totalCount?: number;
  filteredCount?: number;
  /** Sort control rendered inside the Sort popover trigger as a Radix Select. */
  sortControl?: ReactNode;
}

// ── Shell ─────────────────────────────────────────────────────────────────────

const H = '2.25rem';

const Bar = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[5]} 0 ${theme.space[2]}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

// ── Search ────────────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1 1 100%;
  min-width: 0;

  @media (min-width: calc(${({ theme }) => theme.breakpoint.mobile} + 1px)) {
    flex: 1 1 auto;
    min-width: 12rem;
  }
`;

const SearchIconWrap = styled(motion.div)`
  position: absolute;
  left: ${({ theme }) => theme.space[3]};
  display: flex;
  pointer-events: none;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const SearchInput = styled.input`
  width: 100%;
  height: ${H};
  padding: 0 2.25rem 0 2.25rem;
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  outline: none;
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  transition:
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 200ms cubic-bezier(0.22, 1, 0.36, 1);

  &::placeholder { color: ${({ theme }) => theme.color.text.secondary}; }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
`;

const SearchClearBtn = styled(motion.button)`
  position: absolute;
  right: ${({ theme }) => theme.space[2]};
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 180ms cubic-bezier(0.22, 1, 0.36, 1);
  &:hover { background: ${({ theme }) => theme.color.surface.muted}; }
`;

// ── Trigger buttons (Filter / Sort) ──────────────────────────────────────────

const PillBtn = styled(motion.button)<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  height: ${H};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) =>
    $active ? `${theme.color.frost.blue}14` : theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.surface.border};
  color: ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition:
    background 180ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    color 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover {
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.1rem;
  height: 1.1rem;
  padding: 0 5px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.frost.blue};
  color: #fff;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-variant-numeric: tabular-nums;
`;

// ── Filters popover content ──────────────────────────────────────────────────

const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `0 ${theme.space[1]} ${theme.space[2]}`};
  border-bottom: 1px solid ${({ theme }) => theme.color.surface.border};
  margin-bottom: ${({ theme }) => theme.space[1]};
`;

const PopoverTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const PopoverClearBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.aurora.red};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: inherit;
  cursor: pointer;
  letter-spacing: 0.06em;
  text-transform: uppercase;

  &:hover { text-decoration: underline; }
`;

const FieldRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[1]}`};
`;

const FieldLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

// ── Active filter chips ──────────────────────────────────────────────────────

const ChipRow = styled(motion.div)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
`;

const Chip = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  height: 1.75rem;
  padding: 0 ${({ theme }) => theme.space[1]} 0 ${({ theme }) => theme.space[3]};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => `${theme.color.frost.blue}14`};
  border: 1.5px solid ${({ theme }) => `${theme.color.frost.blue}55`};
  color: ${({ theme }) => theme.color.frost.blue};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  text-transform: capitalize;
  transition:
    background 180ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover { background: ${({ theme }) => `${theme.color.frost.blue}22`}; }
`;

const ChipKey = styled.span`
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  opacity: 0.7;
  text-transform: uppercase;
  font-size: ${({ theme }) => theme.typography.size.xxs};
  letter-spacing: 0.04em;
`;

const ChipDismiss = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: ${({ theme }) => `${theme.color.frost.blue}22`};
  margin-left: 2px;
`;

const ClearAllPill = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 1.75rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: transparent;
  color: ${({ theme }) => theme.color.text.tertiary};
  font-size: ${({ theme }) => theme.typography.size.xxs};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: color 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &:hover { color: ${({ theme }) => theme.color.aurora.red}; }
`;

// ── Radix Select (used inside the Filters popover and as the Sort trigger) ──

const SelectTrigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  width: 100%;
  height: ${H};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  outline: none;
  text-transform: capitalize;
  transition:
    box-shadow 180ms cubic-bezier(0.22, 1, 0.36, 1),
    background 180ms cubic-bezier(0.22, 1, 0.36, 1);

  &[data-placeholder] { color: ${({ theme }) => theme.color.text.secondary}; }
  &:hover {
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
  &[data-state='open'] {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
`;

const SelectContent = styled(RadixSelect.Content)`
  overflow: hidden;
  background: ${({ theme }) => theme.color.surface.base};
  border: 1.5px solid ${({ theme }) => theme.color.surface.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  z-index: ${({ theme }) => theme.zIndex.modal};
  min-width: var(--radix-select-trigger-width);
  animation: popIn 130ms cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes popIn {
    from { opacity: 0; transform: translateY(-6px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;

const SelectViewport = styled(RadixSelect.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
  max-height: 280px;
`;

const SelectItem = styled(RadixSelect.Item)`
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

const CheckIndicator = styled(RadixSelect.ItemIndicator)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.frost.blue};
`;

function FilterSelect({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <RadixSelect.Root
      value={value || ''}
      onValueChange={(v) => onValueChange(v === '__all__' ? '' : v)}
    >
      <SelectTrigger>
        <RadixSelect.Value placeholder={`All ${placeholder.toLowerCase()}s`} />
        <RadixSelect.Icon style={{ display: 'flex', opacity: 0.5 }}>
          <IconChevronDown size={12} stroke={2} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectContent position='popper' sideOffset={6}>
          <SelectViewport>
            <SelectItem value='__all__'>
              <RadixSelect.ItemText>{`All ${placeholder.toLowerCase()}s`}</RadixSelect.ItemText>
            </SelectItem>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                <RadixSelect.ItemText>{opt}</RadixSelect.ItemText>
                <CheckIndicator><IconCheck size={12} stroke={2.5} /></CheckIndicator>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function FilterBar({
  filters,
  onChange,
  typeOptions,
  setOptions,
  conditionOptions,
  sortControl,
}: FilterBarProps) {
  const [searchFocusCount, setSearchFocusCount] = useState(0);

  const update = <K extends keyof CollectionsFilters>(key: K, value: CollectionsFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const activeFilterCount = [filters.set, filters.condition, filters.type].filter(Boolean).length;
  const hasFilters = hasActiveFilters(filters);

  // Active filter list for the chip row
  const activeChips: { key: keyof CollectionsFilters; label: string; value: string }[] = [];
  if (filters.set) activeChips.push({ key: 'set', label: 'Set', value: filters.set });
  if (filters.condition) activeChips.push({ key: 'condition', label: 'Condition', value: filters.condition });
  if (filters.type) activeChips.push({ key: 'type', label: 'Type', value: filters.type });

  return (
    <Bar>
      <ControlsRow>
        <SearchWrapper>
          <SearchIconWrap
            key={searchFocusCount}
            animate={{ rotate: searchFocusCount > 0 ? [0, -12, 10, -6, 0] : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <IconSearch size={14} stroke={2} />
          </SearchIconWrap>
          <SearchInput
            type='text'
            placeholder='Search Pokémon...'
            value={filters.search}
            onChange={(e) => update('search', e.target.value)}
            onFocus={() => setSearchFocusCount((n) => n + 1)}
          />
          <AnimatePresence>
            {filters.search && (
              <SearchClearBtn
                key='clear'
                className='icon-close'
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.12 }}
                onClick={() => update('search', '')}
              >
                <IconX size={9} stroke={3} />
              </SearchClearBtn>
            )}
          </AnimatePresence>
        </SearchWrapper>

        {/* Filters button — opens a popover with all available filter selects */}
        {(setOptions.length > 0 || conditionOptions.length > 0 || typeOptions.length > 0) && (
          <Popover
            align='left'
            maxWidth='18rem'
            trigger={({ onClick, isOpen }) => (
              <PillBtn
                $active={activeFilterCount > 0 || isOpen}
                onClick={onClick}
                whileTap={{ scale: 0.96 }}
                aria-haspopup='dialog'
                aria-expanded={isOpen}
              >
                <IconAdjustments size={14} stroke={2} />
                Filters
                {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
              </PillBtn>
            )}
          >
            <PopoverHeader>
              <PopoverTitle>Filter by</PopoverTitle>
              {hasFilters && (
                <PopoverClearBtn
                  onClick={() => onChange({ ...defaultFilters, search: filters.search })}
                >
                  Reset
                </PopoverClearBtn>
              )}
            </PopoverHeader>
            {setOptions.length > 0 && (
              <FieldRow>
                <FieldLabel>Set</FieldLabel>
                <FilterSelect
                  value={filters.set}
                  onValueChange={(s) => update('set', s)}
                  placeholder='Set'
                  options={setOptions}
                />
              </FieldRow>
            )}
            {conditionOptions.length > 0 && (
              <FieldRow>
                <FieldLabel>Condition</FieldLabel>
                <FilterSelect
                  value={filters.condition}
                  onValueChange={(c) => update('condition', c)}
                  placeholder='Condition'
                  options={conditionOptions}
                />
              </FieldRow>
            )}
            {typeOptions.length > 0 && (
              <FieldRow>
                <FieldLabel>Type</FieldLabel>
                <FilterSelect
                  value={filters.type}
                  onValueChange={(t) => update('type', t)}
                  placeholder='Type'
                  options={typeOptions}
                />
              </FieldRow>
            )}
          </Popover>
        )}

        {/* Sort — owned by the parent and rendered as a Radix Select pill */}
        {sortControl}
      </ControlsRow>

      {/* Active filter chips — only render when at least one filter is set */}
      <AnimatePresence initial={false}>
        {activeChips.length > 0 && (
          <ChipRow
            key='chip-row'
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {activeChips.map((chip) => (
              <Chip
                key={chip.key}
                onClick={() => update(chip.key, '' as never)}
                whileTap={{ scale: 0.96 }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                aria-label={`Remove ${chip.label} filter`}
              >
                <ChipKey>{chip.label}</ChipKey>
                {chip.value}
                <ChipDismiss>
                  <IconX size={9} stroke={3} />
                </ChipDismiss>
              </Chip>
            ))}
            <ClearAllPill
              onClick={() => onChange({ ...defaultFilters, search: filters.search })}
              whileTap={{ scale: 0.96 }}
            >
              Clear all
            </ClearAllPill>
          </ChipRow>
        )}
      </AnimatePresence>
    </Bar>
  );
}
