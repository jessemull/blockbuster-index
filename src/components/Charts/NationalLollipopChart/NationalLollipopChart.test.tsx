import NationalLollipopChart from './NationalLollipopChart';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

jest.mock('@components/Charts', () => ({
  Badge: jest.fn(({ data, variant, onViewStats }) => (
    <button data-testid={`badge-${variant}`} onClick={onViewStats}>
      {data
        ? `${data.stateCode || data.name}-${data.rank}-${data.score}-${data.type}`
        : 'no-data'}
    </button>
  )),
}));

jest.mock('./Lollipop', () => ({
  __esModule: true,
  default: jest.fn(({ scoresByState, className, onSelectState }) => (
    <div>
      <div data-testid="lollipop" className={className}>
        {Object.keys(scoresByState).join(',') || 'no-scores'}
      </div>
      <button data-testid="lollipop-select" onClick={() => onSelectState('CA')}>
        select state
      </button>
    </div>
  )),
}));

describe('NationalLollipopChart', () => {
  const mockGetStateRank = jest.fn((code) => (code === 'CA' ? 1 : 0));
  const mockOnSelectState = jest.fn();
  const mockOnViewStats = jest.fn();

  const sampleData = {
    states: {
      CA: { score: 0.9 },
      OR: { score: 0.7 },
    },
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without data and shows nothing else', () => {
    render(
      <NationalLollipopChart
        data={null}
        getStateRank={mockGetStateRank}
        onSelectState={mockOnSelectState}
        onViewStats={mockOnViewStats}
        selectedState={null}
      />,
    );

    expect(screen.queryByTestId('lollipop')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-default')).not.toBeInTheDocument();
  });

  it('renders Lollipop with data but without badges when no selectedState', () => {
    render(
      <NationalLollipopChart
        data={sampleData}
        getStateRank={mockGetStateRank}
        onSelectState={mockOnSelectState}
        onViewStats={mockOnViewStats}
        selectedState={null}
      />,
    );

    expect(screen.getByTestId('lollipop')).toHaveTextContent('CA,OR');
    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-default')).not.toBeInTheDocument();
  });

  it('renders badges when selectedState and data are provided', () => {
    render(
      <NationalLollipopChart
        data={sampleData}
        getStateRank={mockGetStateRank}
        onSelectState={mockOnSelectState}
        onViewStats={mockOnViewStats}
        selectedState={'CA'}
      />,
    );

    expect(screen.getByTestId('lollipop')).toHaveTextContent('CA,OR');

    expect(screen.getByTestId('badge-mobile')).toHaveTextContent(
      'CA-1-0.9-state',
    );
    expect(screen.getByTestId('badge-default')).toHaveTextContent(
      'CA-1-0.9-state',
    );

    fireEvent.click(screen.getByTestId('badge-mobile'));
    fireEvent.click(screen.getByTestId('badge-default'));
    expect(mockOnViewStats).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByTestId('lollipop-select'));
    expect(mockOnSelectState).toHaveBeenCalledWith('CA');
  });

  it('handles case when selectedState is provided but data is null (no badges)', () => {
    render(
      <NationalLollipopChart
        data={null}
        getStateRank={mockGetStateRank}
        onSelectState={mockOnSelectState}
        onViewStats={mockOnViewStats}
        selectedState={'CA'}
      />,
    );

    expect(screen.queryByTestId('badge-mobile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('badge-default')).not.toBeInTheDocument();
  });
});
