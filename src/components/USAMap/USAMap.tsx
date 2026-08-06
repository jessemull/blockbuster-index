import React from 'react';
import {
  COLORS,
  StateNames,
  StatePaths,
  USAStateAbbreviation,
} from '@constants';
import { Props } from '@types';
import { USAState } from './USAState';

const USAMap: React.FC<Props> = ({
  defaultState = {
    fill: COLORS.MAP_PLACEHOLDER_FILL,
    stroke: COLORS.MAP_PLACEHOLDER_STROKE,
  },
  customStates = {},
  mapSettings = {
    width: '100%',
  },
  className = '',
}) => {
  const { width } = mapSettings;

  const resolveClick = (stateAbbreviation: USAStateAbbreviation) => {
    return customStates[stateAbbreviation]?.onClick ?? defaultState.onClick;
  };

  const resolveDoubleClick = (stateAbbreviation: USAStateAbbreviation) => {
    return (
      customStates[stateAbbreviation]?.onDoubleClick ??
      defaultState.onDoubleClick
    );
  };

  const isInteractive = (stateAbbreviation: USAStateAbbreviation) => {
    const disabled = Boolean(
      customStates[stateAbbreviation]?.disabled || defaultState.disabled,
    );
    return (
      !disabled &&
      Boolean(
        resolveClick(stateAbbreviation) ||
        resolveDoubleClick(stateAbbreviation),
      )
    );
  };

  const onClick = (stateAbbreviation: USAStateAbbreviation) => {
    resolveClick(stateAbbreviation)?.(stateAbbreviation);
  };

  const onDoubleClick = (stateAbbreviation: USAStateAbbreviation) => {
    resolveDoubleClick(stateAbbreviation)?.(stateAbbreviation);
  };

  return (
    <svg
      aria-label="United States map"
      className={`usa-map w-full h-auto ${className}`}
      role="img"
      viewBox="9 6.4 918.4 582.5"
      width={width}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>United States map</title>
      <g className="outlines">
        {Object.entries(StatePaths).map(([abbreviation, path]) => {
          const code = abbreviation as USAStateAbbreviation;
          const custom = customStates[code];
          const disabled = Boolean(custom?.disabled || defaultState.disabled);
          const selected = Boolean(custom?.selected);
          const interactive = isInteractive(code);

          return (
            <USAState
              key={abbreviation}
              dimensions={path}
              disabled={disabled}
              fill={custom?.fill ?? defaultState.fill!}
              selected={selected}
              state={code}
              stroke={custom?.stroke ?? defaultState.stroke!}
              onClick={interactive ? () => onClick(code) : undefined}
              onDoubleClick={
                interactive ? () => onDoubleClick(code) : undefined
              }
              onMouseEnter={custom?.onMouseEnter}
              onMouseLeave={custom?.onMouseLeave}
            />
          );
        })}

        <g className="DC state">
          {(() => {
            const disabled = Boolean(
              customStates.DC?.disabled || defaultState.disabled,
            );
            const selected = Boolean(customStates.DC?.selected);
            const interactive = isInteractive('DC');

            return (
              <circle
                aria-disabled={disabled || undefined}
                aria-label={StateNames.DC}
                aria-pressed={interactive ? selected : undefined}
                className="dc2"
                cx="801.3"
                cy="251.8"
                data-name={'DC'}
                fill={customStates.DC?.fill ?? defaultState.fill!}
                opacity="1"
                r="5"
                role={interactive ? 'button' : undefined}
                stroke={customStates.DC?.stroke ?? defaultState.stroke!}
                strokeWidth="1.5"
                tabIndex={interactive ? 0 : undefined}
                onClick={interactive ? () => onClick('DC') : undefined}
                onKeyDown={
                  interactive
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onClick('DC');
                        }
                      }
                    : undefined
                }
                onMouseEnter={customStates.DC?.onMouseEnter}
                onMouseLeave={customStates.DC?.onMouseLeave}
              />
            );
          })()}
        </g>
      </g>
    </svg>
  );
};

export { USAMap };
