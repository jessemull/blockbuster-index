import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { COLORS } from '@constants';
import { NationalMapView } from './NationalMapView';

jest.mock('@components/USAMap', () => ({
  USAMap: ({ customStates, defaultState }: any) => (
    <div data-testid="usa-map">
      <span data-testid="default-fill">{defaultState.fill}</span>
      <button
        data-testid="click-ca"
        type="button"
        onClick={() => customStates.CA?.onClick?.('CA')}
      >
        CA
      </button>
      <span data-testid="ca-fill">{customStates.CA?.fill}</span>
    </div>
  ),
}));

describe('NationalMapView', () => {
  const onSelectState = jest.fn();
  const getColorForScore = jest.fn(() => '#112233');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses gray fills when data is null and allows selection when not loading', () => {
    render(
      <NationalMapView
        data={null}
        getColorForScore={getColorForScore}
        loading={false}
        selectedState={null}
        onSelectState={onSelectState}
      />,
    );

    expect(screen.getByTestId('default-fill')).toHaveTextContent(
      COLORS.MAP_DEFAULT,
    );
    expect(screen.getByTestId('ca-fill')).toHaveTextContent(COLORS.MAP_GRAY);
    fireEvent.click(screen.getByTestId('click-ca'));
    expect(onSelectState).toHaveBeenCalledWith('CA');
  });

  it('colors selected state yellow from score data', () => {
    render(
      <NationalMapView
        data={
          {
            states: {
              CA: { score: 88, components: {} },
            },
          } as any
        }
        getColorForScore={getColorForScore}
        loading={false}
        selectedState="CA"
        onSelectState={onSelectState}
      />,
    );

    expect(screen.getByTestId('ca-fill')).toHaveTextContent(COLORS.YELLOW);
    expect(getColorForScore).not.toHaveBeenCalled();
  });

  it('shows loading hint when loading', () => {
    render(
      <NationalMapView
        data={null}
        getColorForScore={getColorForScore}
        loading
        selectedState={null}
        onSelectState={onSelectState}
      />,
    );
    expect(screen.getByText(/loading map data/i)).toBeInTheDocument();
  });
});
