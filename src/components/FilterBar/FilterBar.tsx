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
import { GalleryFilters, defaultFilters, hasActiveFilters } from './filterTypes';
import { useState, type ReactNode } from 'react';

export type ViewMode = 'cards' | 'art';

// Mobile sort row label
const MobileSortLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  color: ${({ theme }) => theme.color.text.secondary};
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: ${({ theme }) => `${theme.space[1]} 0`};
`;

const MobileSortRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[1]};
`;

interface FilterBarProps {
  filters: GalleryFilters;
  onChange: (filters: GalleryFilters) => void;
  typeOptions: string[];
  setOptions: string[];
  conditionOptions: string[];
  totalCount: number;
  filteredCount: number;
  /** Optional sort control rendered inside the mobile filter drawer */
  sortControl?: ReactNode;
}

// ── Shell ─────────────────────────────────────────────────────────────────────

// Control height - everything shares this so the row sits on one baseline
const H = '2.25rem';

const Bar = styled.div`
  width: 100%;
  padding: ${({ theme }) => `${theme.space[5]} 0 ${theme.space[4]}`};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[2]};
`;

// Primary row - search + filters + view toggle
const PrimaryRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
`;

// Mobile-only filter toggle button
const FilterToggleBtn = styled.button<{ $active: boolean }>`
  display: none;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space[1]};
  height: 2.25rem;
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ $active, theme }) =>
    $active ? `${theme.color.frost.blue}18` : theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.surface.border};
  color: ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-family: inherit;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 150ms ease;

  @media (max-width: 759px) {
    display: inline-flex;
  }
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.frost.blue};
  color: #fff;
  font-size: 0.65rem;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
`;

// Filter selects row - hidden on mobile unless open
const FiltersRow = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;
  overflow: hidden;

  @media (max-width: 759px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

// Desktop: always show filter selects inline
const DesktopFilters = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  flex-wrap: wrap;

  @media (max-width: 759px) {
    display: none;
  }
`;

// Meta row - count + clear (only visible when filtered)
const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  min-height: 1.25rem;
`;

// ── Search ────────────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 10rem;
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
  transition: box-shadow 150ms ease, background 200ms ease;

  &::placeholder { color: ${({ theme }) => theme.color.text.secondary}; }
  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
`;

const ClearBtn = styled(motion.button)`
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
  &:hover { background: ${({ theme }) => theme.color.surface.muted}; }
`;


// ── Meta (count + clear) ──────────────────────────────────────────────────────

const CountText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.color.text.secondary};
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

const ClearAllBtn = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px ${({ theme }) => theme.space[2]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => `${theme.color.aurora.red}14`};
  color: ${({ theme }) => theme.color.aurora.red};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  font-family: inherit;
  cursor: pointer;
  &:hover { background: ${({ theme }) => `${theme.color.aurora.red}26`}; }
`;

// ── Radix Select ──────────────────────────────────────────────────────────────

const SelectTrigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  height: ${H};
  padding: 0 ${({ theme }) => theme.space[3]};
  border: none;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.color.surface.subtle};
  box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.surface.border};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-family: inherit;
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  flex-shrink: 0;
  text-transform: capitalize;
  transition: box-shadow 150ms ease, background 150ms ease;

  &[data-placeholder] { color: ${({ theme }) => theme.color.text.secondary}; }
  &:hover {
    box-shadow: 0 0 0 1.5px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }
  &[data-state='open'] {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.color.frost.blue};
    background: ${({ theme }) => theme.color.surface.base};
  }

  @media (max-width: 759px) {
    width: 100%;
    justify-content: space-between;
    border-radius: ${({ theme }) => theme.radius.md};
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
  transition: background 80ms ease;

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

// Active filter dot on trigger
const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.frost.blue};
  flex-shrink: 0;
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
        {value && <ActiveDot />}
        <RadixSelect.Value placeholder={placeholder} />
        <RadixSelect.Icon style={{ display: 'flex', opacity: 0.45 }}>
          <IconChevronDown size={12} stroke={2} />
        </RadixSelect.Icon>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectContent position='popper' sideOffset={6}>
          <SelectViewport>
            <SelectItem value='__all__'>
              <RadixSelect.ItemText>{placeholder}</RadixSelect.ItemText>
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
  totalCount,
  filteredCount,
  sortControl,
}: FilterBarProps) {
  const isFiltered = hasActiveFilters(filters) || filters.search !== '';
  const [searchFocusCount, setSearchFocusCount] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const update = <K extends keyof GalleryFilters>(key: K, value: GalleryFilters[K]) =>
    onChange({ ...filters, [key]: value });

  const countLabel = isFiltered && filteredCount !== totalCount
    ? `${filteredCount} of ${totalCount}`
    : `${totalCount} Card${totalCount !== 1 ? 's' : ''}`;

  const activeFilterCount = [filters.set, filters.condition, filters.type].filter(Boolean).length;

  const filterSelects = (
    <>
      {setOptions.length > 0 && (
        <FilterSelect
          value={filters.set}
          onValueChange={(s) => update('set', s)}
          placeholder='Set'
          options={setOptions}
        />
      )}
      {conditionOptions.length > 0 && (
        <FilterSelect
          value={filters.condition}
          onValueChange={(c) => update('condition', c)}
          placeholder='Condition'
          options={conditionOptions}
        />
      )}
      {typeOptions.length > 0 && (
        <FilterSelect
          value={filters.type}
          onValueChange={(t) => update('type', t)}
          placeholder='Type'
          options={typeOptions}
        />
      )}
    </>
  );

  return (
    <Bar>
      {/* Search + desktop filters + mobile toggle */}
      <PrimaryRow>
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
              <ClearBtn
                key='clear'
                className='icon-close'
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.1 }}
                onClick={() => update('search', '')}
              >
                <IconX size={9} stroke={3} />
              </ClearBtn>
            )}
          </AnimatePresence>
        </SearchWrapper>

        {/* Desktop: inline filters */}
        <DesktopFilters>{filterSelects}</DesktopFilters>

        {/* Mobile: toggle button */}
        <FilterToggleBtn
          $active={activeFilterCount > 0 || mobileFiltersOpen}
          onClick={() => setMobileFiltersOpen((o) => !o)}
          aria-expanded={mobileFiltersOpen}
        >
          <IconAdjustments size={15} stroke={2} />
          Filters
          {activeFilterCount > 0 && (
            <FilterBadge>{activeFilterCount}</FilterBadge>
          )}
        </FilterToggleBtn>
      </PrimaryRow>

      {/* Mobile: expandable filters */}
      <AnimatePresence initial={false}>
        {mobileFiltersOpen && (
          <FiltersRow
            key='mobile-filters'
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {filterSelects}
            {sortControl && (
              <MobileSortRow>
                <MobileSortLabel>Sort by</MobileSortLabel>
                {sortControl}
              </MobileSortRow>
            )}
          </FiltersRow>
        )}
      </AnimatePresence>

      {/* Meta row - only takes space when needed */}
      <MetaRow>
        <CountText>{countLabel}</CountText>
        <AnimatePresence>
          {isFiltered && (
            <ClearAllBtn
              key='clear-all'
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.12 }}
              onClick={() => onChange(defaultFilters)}
              whileTap={{ scale: 0.95 }}
            >
              <IconX size={9} stroke={3} />
              Clear filters
            </ClearAllBtn>
          )}
        </AnimatePresence>
      </MetaRow>
    </Bar>
  );
}
