import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { CENSUS_DIVISIONS } from '@constants';
import { USAStateAbbreviation } from '@constants';
import { RegionalMapView } from './RegionalMapView';

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
        selectedRegion={null}
        selectedState={null}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
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
        selectedRegion={null}
        selectedState={null}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
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
        selectedRegion={mockRegion}
        selectedState={mockState as USAStateAbbreviation}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
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
        selectedRegion={null}
        selectedState={null}
        onSelectRegion={onSelectRegion}
        onSelectState={onSelectState}
      />,
    );

    const btn = screen.getByTestId(`state-${mockState}`);
    fireEvent.click(btn);

    expect(onSelectState).toHaveBeenCalledWith(mockState);
    expect(onSelectRegion).toHaveBeenCalledWith(mockRegion);
    expect(getColorForScore).not.toHaveBeenCalled();
  });
});
