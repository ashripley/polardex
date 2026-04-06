import styled from 'styled-components';
import { IconSearch, IconX, IconAdjustmentsHorizontal, IconChevronDown, IconCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as RadixSelect from '@radix-ui/react-select';
import { GalleryFilters, defaultFilters, hasActiveFilters } from './filterTypes';

interface FilterBarProps {
  filters: GalleryFilters;
  onChange: (filters: GalleryFilters) => void;
  typeOptions: string[];
  setOptions: string[];
  conditionOptions: string[];
  totalCount: number;
  filteredCount: number;
}

// ── Layout ────────────────────────────────────────────────────────────────────

const Bar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  padding: ${({ theme }) => `${theme.space[4]} 0`};
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[3]};
`;

// ── Search ────────────────────────────────────────────────────────────────────

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.space[3]};
  color: ${({ theme }) => theme.color.text.secondary};
  display: flex;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) =>
    `${theme.space[2]} ${theme.space[4]} ${theme.space[2]} ${theme.space[8]}`};
  border: 1.5px solid ${({ theme }) => theme.color.surface.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  outline: none;
  transition: border-color 150ms ease, background-color 200ms ease;

  &::placeholder {
    color: ${({ theme }) => theme.color.text.secondary};
  }

  &:focus {
    border-color: ${({ theme }) => theme.color.frost.blue};
    background-color: ${({ theme }) => theme.color.surface.base};
  }
`;

const ClearInputButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.space[2]};
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text.secondary};
  padding: ${({ theme }) => theme.space[1]};
  border-radius: ${({ theme }) => theme.radius.full};
  transition: color 150ms ease, background-color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.color.text.primary};
    background-color: ${({ theme }) => theme.color.text.primaryHover};
  }
`;

// ── Mobile toggle ─────────────────────────────────────────────────────────────

const FilterToggle = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[1]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.frost.blue : theme.color.surface.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ $active, theme }) =>
    $active ? `${theme.color.frost.blue}18` : theme.color.surface.subtle};
  color: ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ theme }) => theme.color.frost.blue};
  }

  @media (min-width: ${({ theme }) => theme.breakpoint.sm}) {
    display: none;
  }
`;

// ── Filters body ──────────────────────────────────────────────────────────────

const FiltersContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};
  overflow: hidden;
`;

const TypeRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space[2]};
  overflow-x: auto;
  padding-bottom: ${({ theme }) => theme.space[1]};
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TypePill = styled.button<{ $active: boolean }>`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.full};
  border: 1.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.frost.blue : theme.color.surface.muted};
  background-color: ${({ $active, theme }) =>
    $active ? theme.color.frost.blue : theme.color.surface.subtle};
  color: ${({ $active, theme }) =>
    $active ? '#ffffff' : theme.color.text.secondary};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  text-transform: capitalize;
  transition: border-color 150ms ease, background-color 150ms ease, color 150ms ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    color: ${({ $active }) => ($active ? '#ffffff' : undefined)};
  }
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space[2]};
  align-items: center;
`;

// ── Radix Custom Select ───────────────────────────────────────────────────────

const SelectTrigger = styled(RadixSelect.Trigger)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border: 1.5px solid ${({ theme }) => theme.color.surface.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
  background-color: ${({ theme }) => theme.color.surface.subtle};
  color: ${({ theme }) => theme.color.text.primary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  cursor: pointer;
  outline: none;
  white-space: nowrap;
  transition: border-color 150ms ease, background-color 150ms ease;
  font-family: inherit;

  &[data-placeholder] {
    color: ${({ theme }) => theme.color.text.secondary};
  }

  &:hover {
    border-color: ${({ theme }) => theme.color.frost.blue};
    background-color: ${({ theme }) => theme.color.surface.base};
  }

  &[data-state='open'] {
    border-color: ${({ theme }) => theme.color.frost.blue};
    background-color: ${({ theme }) => theme.color.surface.base};
  }
`;

const SelectChevron = styled(RadixSelect.Icon)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.text.secondary};
  transition: transform 200ms ease;

  [data-state='open'] & {
    transform: rotate(180deg);
  }
`;

const SelectContent = styled(RadixSelect.Content)`
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.surface.subtle};
  border: 1.5px solid ${({ theme }) => theme.color.surface.muted};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.md};
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  min-width: var(--radix-select-trigger-width);
  animation: slideDown 150ms ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const SelectViewport = styled(RadixSelect.Viewport)`
  padding: ${({ theme }) => theme.space[1]};
`;

const SelectItem = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.space[2]};
  padding: ${({ theme }) => `${theme.space[2]} ${theme.space[3]}`};
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.primary};
  cursor: pointer;
  outline: none;
  user-select: none;
  transition: background-color 100ms ease;

  &[data-highlighted] {
    background-color: ${({ theme }) => theme.color.text.primaryHover};
  }

  &[data-state='checked'] {
    color: ${({ theme }) => theme.color.frost.blue};
    font-weight: ${({ theme }) => theme.typography.weight.medium};
  }
`;

const ItemCheckIcon = styled(RadixSelect.ItemIndicator)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.color.frost.blue};
`;

// ── Count + Clear ─────────────────────────────────────────────────────────────

const CountText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.color.text.secondary};
  margin-left: auto;
`;

const ClearAllButton = styled.button`
  padding: ${({ theme }) => `${theme.space[1]} ${theme.space[3]}`};
  border: 1.5px solid ${({ theme }) => theme.color.aurora.red};
  border-radius: ${({ theme }) => theme.radius.full};
  background: none;
  color: ${({ theme }) => theme.color.aurora.red};
  font-size: ${({ theme }) => theme.typography.size.xs};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.aurora.red};
    color: #ffffff;
  }
`;

const DesktopFilters = styled.div`
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.space[3]};

  @media (min-width: ${({ theme }) => theme.breakpoint.sm}) {
    display: flex;
  }
`;

// ── Shared body ───────────────────────────────────────────────────────────────

interface FiltersBodyProps {
  filters: GalleryFilters;
  typeOptions: string[];
  setOptions: string[];
  conditionOptions: string[];
  filteredCount: number;
  totalCount: number;
  isFiltered: boolean;
  onTypeClick: (type: string) => void;
  onSetChange: (set: string) => void;
  onConditionChange: (condition: string) => void;
  onClearAll: () => void;
}

function CustomSelect({
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
    <RadixSelect.Root value={value || ''} onValueChange={(v) => onValueChange(v === '__all__' ? '' : v)}>
      <SelectTrigger>
        <RadixSelect.Value placeholder={placeholder} />
        <SelectChevron>
          <IconChevronDown size={14} stroke={2} />
        </SelectChevron>
      </SelectTrigger>
      <RadixSelect.Portal>
        <SelectContent position='popper' sideOffset={4}>
          <SelectViewport>
            <SelectItem value='__all__'>
              <RadixSelect.ItemText>{placeholder}</RadixSelect.ItemText>
            </SelectItem>
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                <RadixSelect.ItemText>{opt}</RadixSelect.ItemText>
                <ItemCheckIcon>
                  <IconCheck size={12} stroke={2.5} />
                </ItemCheckIcon>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}

function FiltersBody({
  filters,
  typeOptions,
  setOptions,
  conditionOptions,
  filteredCount,
  totalCount,
  isFiltered,
  onTypeClick,
  onSetChange,
  onConditionChange,
  onClearAll,
}: FiltersBodyProps) {
  return (
    <>
      <TypeRow>
        <TypePill $active={filters.type === ''} onClick={() => onTypeClick('')}>
          All
        </TypePill>
        {typeOptions.map((type) => (
          <TypePill
            key={type}
            $active={filters.type === type}
            onClick={() => onTypeClick(type)}
          >
            {type}
          </TypePill>
        ))}
      </TypeRow>
      <FilterRow>
        {setOptions.length > 0 && (
          <CustomSelect
            value={filters.set}
            onValueChange={onSetChange}
            placeholder='All Sets'
            options={setOptions}
          />
        )}
        {conditionOptions.length > 0 && (
          <CustomSelect
            value={filters.condition}
            onValueChange={onConditionChange}
            placeholder='All Conditions'
            options={conditionOptions}
          />
        )}
        {isFiltered && (
          <ClearAllButton onClick={onClearAll}>Clear all</ClearAllButton>
        )}
        <CountText>
          {isFiltered && filteredCount !== totalCount
            ? `${filteredCount} / ${totalCount} cards`
            : `${totalCount} cards`}
        </CountText>
      </FilterRow>
    </>
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
}: FilterBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isFiltered = hasActiveFilters(filters) || filters.search !== '';

  const updateFilter = <K extends keyof GalleryFilters>(
    key: K,
    value: GalleryFilters[K]
  ) => {
    onChange({ ...filters, [key]: value });
  };

  const handleTypeClick = (type: string) =>
    updateFilter('type', filters.type === type ? '' : type);

  const sharedBodyProps: FiltersBodyProps = {
    filters,
    typeOptions,
    setOptions,
    conditionOptions,
    filteredCount,
    totalCount,
    isFiltered,
    onTypeClick: handleTypeClick,
    onSetChange: (set) => updateFilter('set', set),
    onConditionChange: (condition) => updateFilter('condition', condition),
    onClearAll: () => onChange(defaultFilters),
  };

  return (
    <Bar>
      <TopRow>
        <SearchWrapper>
          <SearchIconWrapper>
            <IconSearch size={16} stroke={2} />
          </SearchIconWrapper>
          <SearchInput
            type='text'
            placeholder='Search Pokémon...'
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
          <AnimatePresence>
            {filters.search && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.1 }}
                style={{ position: 'absolute', right: '0.5rem' }}
              >
                <ClearInputButton onClick={() => updateFilter('search', '')}>
                  <IconX size={14} stroke={2} />
                </ClearInputButton>
              </motion.div>
            )}
          </AnimatePresence>
        </SearchWrapper>
        <FilterToggle
          $active={isFiltered}
          onClick={() => setMobileOpen((o) => !o)}
          aria-label='Toggle filters'
        >
          <IconAdjustmentsHorizontal size={16} stroke={2} />
          Filters{hasActiveFilters(filters) ? ' •' : ''}
        </FilterToggle>
      </TopRow>

      <DesktopFilters>
        <FiltersBody {...sharedBodyProps} />
      </DesktopFilters>

      <AnimatePresence>
        {mobileOpen && (
          <FiltersContainer
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiltersBody {...sharedBodyProps} />
          </FiltersContainer>
        )}
      </AnimatePresence>
    </Bar>
  );
}
