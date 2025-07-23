import React from 'react';

import { StatePaths } from '../data/state-paths';
import { USAStateAbbreviation } from '../types/index';

import { USAState } from './usa-state';

import '../styles.css';

type OnStateClick = (state: USAStateAbbreviation) => void;

interface State {
  fill?: string;
  stroke?: string;
  onClick?: OnStateClick;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface MapSettings {
  width?: string | number;
  height?: string | number;
  title?: string;
}

interface Props {
  defaultState?: State;
  customStates?: {
    [key in USAStateAbbreviation]?: State;
  };
  mapSettings?: MapSettings;
  className?: string;
}

const USAMap: React.FC<Props> = ({
  defaultState = {
    fill: '#d3d3d3',
    stroke: '#a5a5a5',
  },
  customStates = {},
  mapSettings = {
    width: '100%',
    height: 'fit-content',
  },
  className = '',
}) => {
  const { width, height } = mapSettings;

  const onClick = (stateAbbreviation: USAStateAbbreviation) => {
    if (customStates[stateAbbreviation]?.onClick) {
      customStates[stateAbbreviation]?.onClick!(stateAbbreviation);
    } else {
      defaultState.onClick?.(stateAbbreviation);
    }
  };

  return (
    <svg
      className={`usa-map w-full h-auto ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      viewBox="9 6.4 918.4 582.5"
    >
      <g className="outlines">
        {Object.entries(StatePaths).map(([abbreviation, path]) => (
          <USAState
            key={abbreviation}
            dimensions={path}
            state={abbreviation}
            fill={customStates[abbreviation]?.fill ?? defaultState.fill!}
            stroke={customStates[abbreviation]?.stroke ?? defaultState.stroke!}
            onClick={() => onClick(abbreviation)}
            onMouseEnter={customStates[abbreviation]?.onMouseEnter}
            onMouseLeave={customStates[abbreviation]?.onMouseLeave}
          />
        ))}

        <g className="DC state">
          <circle
            className="dc2"
            onClick={() => onClick('DC')}
            onMouseEnter={customStates['DC']?.onMouseEnter}
            onMouseLeave={customStates['DC']?.onMouseLeave}
            data-name={'DC'}
            fill={customStates['DC']?.fill ?? defaultState.fill!}
            stroke={customStates['DC']?.stroke ?? defaultState.stroke!}
            strokeWidth="1.5"
            cx="801.3"
            cy="251.8"
            r="5"
            opacity="1"
          />
        </g>
      </g>
    </svg>
  );
};

export { USAMap };
