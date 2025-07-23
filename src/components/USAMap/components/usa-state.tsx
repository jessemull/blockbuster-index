import React from 'react';

interface USAStateProps {
  dimensions: string;
  state: string;
  fill: string;
  stroke: string;
  onClick: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

const USAState: React.FC<USAStateProps> = ({
  dimensions,
  state,
  fill,
  stroke,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <path
      d={dimensions}
      fill={fill}
      stroke={stroke}
      data-name={state}
      className={`usa-state ${state.toLowerCase()}`}
      data-testid={`usa-state-${state.toLowerCase()}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    />
  );
};

export { USAState };
