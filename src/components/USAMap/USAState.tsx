import React from 'react';
import { StateNames, USAStateAbbreviation } from '@constants';

interface USAStateProps {
  dimensions: string;
  state: USAStateAbbreviation | string;
  fill: string;
  stroke: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const USAState: React.FC<USAStateProps> = ({
  dimensions,
  state,
  fill,
  stroke,
  selected = false,
  disabled = false,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const label = StateNames[state as USAStateAbbreviation] ?? `State ${state}`;
  const interactive = Boolean(onClick) && !disabled;

  const handleKeyDown = (e: React.KeyboardEvent<SVGPathElement>) => {
    if (!interactive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <path
      aria-disabled={disabled || undefined}
      aria-label={label}
      aria-pressed={interactive ? selected : undefined}
      className={`usa-state ${state.toLowerCase()} outline-none focus:outline-none`}
      d={dimensions}
      data-name={state}
      data-testid={`usa-state-${state.toLowerCase()}`}
      fill={fill}
      role={interactive ? 'button' : undefined}
      stroke={stroke}
      style={{ outline: 'none' }}
      tabIndex={interactive ? 0 : undefined}
      onClick={interactive ? onClick : undefined}
      onDoubleClick={interactive ? onDoubleClick : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      onMouseEnter={interactive ? onMouseEnter : undefined}
      onMouseLeave={interactive ? onMouseLeave : undefined}
    />
  );
};

export { USAState };
