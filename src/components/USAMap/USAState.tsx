import React from 'react';
import { StateNames, USAStateAbbreviation } from '@constants';

interface USAStateProps {
  dimensions: string;
  state: USAStateAbbreviation | string;
  fill: string;
  stroke: string;
  onClick: () => void;
  onDoubleClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const USAState: React.FC<USAStateProps> = ({
  dimensions,
  state,
  fill,
  stroke,
  onClick,
  onDoubleClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const label = StateNames[state as USAStateAbbreviation] ?? `State ${state}`;

  const handleKeyDown = (e: React.KeyboardEvent<SVGPathElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <path
      aria-label={label}
      className={`usa-state ${state.toLowerCase()}`}
      d={dimensions}
      data-name={state}
      data-testid={`usa-state-${state.toLowerCase()}`}
      fill={fill}
      role="button"
      stroke={stroke}
      tabIndex={0}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export { USAState };
