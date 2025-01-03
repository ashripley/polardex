import {
  ChangeEventHandler,
  EventHandler,
  forwardRef,
  KeyboardEventHandler,
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
} from 'react';
import styled from 'styled-components';

export type FieldChangeHandler<T> = (value: T) => void;

interface Props extends InputOptions, SearchFieldOptions {
  active: boolean;
  onClear: () => void;
  onSubmit: () => void;
}

interface SearchFieldOptions extends Field<string> {
  placeholder?: string;
  maxLength?: number;
}

interface Field<T> {
  value?: T;
  onChange?: FieldChangeHandler<T>;
  disabled?: boolean;
}

interface InputOptions {
  active: boolean;
  hasClearButton?: boolean;
}

const StyledInput = styled.input<InputOptions>`
  border: ${({ theme }) => `2px solid ${theme.bgColor.bg3}`};
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
  margin-top: 0.5rem;
`;

export const SearchField = forwardRef<
  HTMLInputElement,
  PropsWithChildren<Props>
>((props, ref) => {
  const {
    value,
    placeholder,
    active,
    disabled,
    onClear,
    onSubmit,
    onChange,
    ...rest
  } = props;

  const onChangeInput = useOnChange(onChange);
  const onEscape = useOnEscape(onClear);
  const onEnter = useOnEnter(onSubmit);
  const onKeyDown = useCombineEventHandlers(onEscape, onEnter);

  return (
    <StyledInput
      {...rest}
      ref={ref}
      type='search'
      value={value}
      placeholder={placeholder}
      active={active}
      disabled={disabled}
      onChange={onChangeInput}
      onKeyDown={onKeyDown}
    />
  );
});

function useOnChange(onChange: Props['onChange']) {
  return useCallback<ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      if (onChange) {
        onChange(e.target.value);
      }
    },
    [onChange]
  );
}

function useOnEscape(onEscape: () => void) {
  return useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onEscape();
      }
    },
    [onEscape]
  );
}

function useOnEnter(onEnter: () => void) {
  return useCallback<KeyboardEventHandler<HTMLInputElement>>(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onEnter();
      }
    },
    [onEnter]
  );
}

function useCombineEventHandlers<E extends SyntheticEvent>(
  ...handlers: (EventHandler<E> | undefined)[]
) {
  return useCallback<EventHandler<E>>(
    (e) => {
      for (let i = 0; i < handlers.length; i++) {
        const handler = handlers[i];

        if (handler) {
          handler(e);
        }
      }
    },
    [handlers]
  );
}
