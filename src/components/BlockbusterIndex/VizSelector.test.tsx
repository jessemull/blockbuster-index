import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import VizSelector from './VizSelector';

describe('VizSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props and correct selected value', () => {
    render(<VizSelector value="map" onChange={mockOnChange} />);

    const select = screen.getByLabelText(
      'Select visualization',
    ) as HTMLSelectElement;
    expect(select.value).toBe('map');

    const optionEls = screen.getAllByRole('option');
    expect(optionEls).toHaveLength(4);
    expect(optionEls.map((o: any) => o.value)).toEqual([
      'map',
      'lolli',
      'regional',
      'hist',
    ]);

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('calls onChange with the correct value when selection changes', () => {
    render(<VizSelector value="map" onChange={mockOnChange} />);
    const select = screen.getByLabelText('Select visualization');

    fireEvent.change(select, { target: { value: 'lolli' } });
    expect(mockOnChange).toHaveBeenCalledWith('lolli');
  });

  it('applies disabled styles and prevents change', () => {
    render(<VizSelector value="hist" disabled onChange={mockOnChange} />);
    const select = screen.getByLabelText(
      'Select visualization',
    ) as HTMLSelectElement;

    expect(select.disabled).toBe(true);
    expect(select.className).toMatch(/cursor-not-allowed/);
  });

  it('applies enabled styles when not disabled', () => {
    render(<VizSelector value="regional" onChange={mockOnChange} />);
    const select = screen.getByLabelText('Select visualization');
    expect(select.className).toMatch(/cursor-pointer/);
  });
});
