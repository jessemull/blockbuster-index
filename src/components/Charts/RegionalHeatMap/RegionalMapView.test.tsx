import React from 'react';
import { CENSUS_DIVISIONS } from '@constants';
import { RegionalMapView } from './RegionalMapView';
import { USAStateAbbreviation } from '@constants';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@components/USAMap', () => ({
  USAMap: jest.fn(({ customStates }) => {
    return (
      <div>
        {Object.entries(customStates).map(([code, cfg]) => (
          <button
            key={code}
            data-testid={`state-${code}`}
            onClick={(cfg as any).onClick}
          >
            {code}
          </button>
        ))}
      </div>
    );
  }),
}));

jest.mock('../../../providers/BlockbusterDataProvider', () => ({
  useBlockbusterData: jest.fn(),
}));

const {
  useBlockbusterData,
} = require('../../../providers/BlockbusterDataProvider');

describe('RegionalMapView', () => {
  const getColorForScore = jest.fn((score) => `color-${score}`);
  const onSelectRegion = jest.fn();
  const onSelectState = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default colors when data is null', () => {
    useBlockbusterData.mockReturnValue({ regionAverageByName: {} });

    render(
      <RegionalMapView
        data={null}
        getColorForScore={getColorForScore}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
        selectedRegion={null}
        selectedState={null}
      />,
    );

    const allStates = Object.values(CENSUS_DIVISIONS).flat();
    allStates.forEach((state) => {
      const btn = screen.getByTestId(`state-${state}`);
      fireEvent.click(btn);
      expect(onSelectState).toHaveBeenCalledWith(state as USAStateAbbreviation);
    });

    expect(onSelectState).toHaveBeenCalledTimes(allStates.length);
    expect(getColorForScore).not.toHaveBeenCalled();
  });

  it('renders nothing for states when regionAverageByName is falsy', () => {
    useBlockbusterData.mockReturnValue({ regionAverageByName: null });

    render(
      <RegionalMapView
        data={{} as any}
        getColorForScore={getColorForScore}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
        selectedRegion={null}
        selectedState={null}
      />,
    );

    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders with region data and triggers both state and region selection', () => {
    const mockRegion = Object.keys(CENSUS_DIVISIONS)[0];
    const mockState = CENSUS_DIVISIONS[mockRegion][0];
    useBlockbusterData.mockReturnValue({
      regionAverageByName: {
        [mockRegion]: 0.5,
      },
    });

    render(
      <RegionalMapView
        data={{} as any}
        getColorForScore={getColorForScore}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
        selectedRegion={mockRegion}
        selectedState={mockState as USAStateAbbreviation}
      />,
    );

    const btn = screen.getByTestId(`state-${mockState}`);
    fireEvent.click(btn);

    expect(onSelectState).toHaveBeenCalledWith(mockState);
    expect(onSelectRegion).toHaveBeenCalledWith(mockRegion);
    expect(getColorForScore).toHaveBeenCalledWith(0.5);
  });

  it('renders with unselected region/state and uses fallback color when no average', () => {
    const mockRegion = Object.keys(CENSUS_DIVISIONS)[0];
    const mockState = CENSUS_DIVISIONS[mockRegion][0];
    useBlockbusterData.mockReturnValue({
      regionAverageByName: {
        [mockRegion]: undefined,
      },
    });

    render(
      <RegionalMapView
        data={{} as any}
        getColorForScore={getColorForScore}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
        selectedRegion={null}
        selectedState={null}
      />,
    );

    const btn = screen.getByTestId(`state-${mockState}`);
    fireEvent.click(btn);

    expect(onSelectState).toHaveBeenCalledWith(mockState);
    expect(onSelectRegion).toHaveBeenCalledWith(mockRegion);
    expect(getColorForScore).not.toHaveBeenCalled();
  });
});
