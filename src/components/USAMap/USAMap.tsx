import React from 'react';

import { StatePaths, USAStateAbbreviation } from '@constants';
import { Props } from '@types';

import { USAState } from './USAState';

const USAMap: React.FC<Props> = ({
  defaultState = {
    fill: '#d3d3d3',
    stroke: '#a5a5a5',
  },
  customStates = {},
  mapSettings = {
    width: '100%',
  },
  className = '',
}) => {
  const { width } = mapSettings;

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
            state={abbreviation as USAStateAbbreviation}
            fill={
              customStates[abbreviation as USAStateAbbreviation]?.fill ??
              defaultState.fill!
            }
            stroke={
              customStates[abbreviation as USAStateAbbreviation]?.stroke ??
              defaultState.stroke!
            }
            onClick={() => onClick(abbreviation as USAStateAbbreviation)}
            onMouseEnter={
              customStates[abbreviation as USAStateAbbreviation]?.onMouseEnter
            }
            onMouseLeave={
              customStates[abbreviation as USAStateAbbreviation]?.onMouseLeave
            }
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
