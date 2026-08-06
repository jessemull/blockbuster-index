import React from 'react';

interface USAStateProps {
  dimensions: string;
  state: string;
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
  return (
    <path
      className={`usa-state ${state.toLowerCase()}`}
      d={dimensions}
      data-name={state}
      data-testid={`usa-state-${state.toLowerCase()}`}
      fill={fill}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      stroke={stroke}
    />
  );
};

export { USAState };
