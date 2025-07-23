import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { USAMap } from './usa-map';

describe('USAMap', () => {
  it('calls customStates onClick if present, otherwise calls defaultState onClick', () => {
    const customClick = jest.fn();
    const defaultClick = jest.fn();
    const customStates = { CA: { onClick: customClick } };
    const defaultState = { onClick: defaultClick };
    const { container } = render(
      <USAMap customStates={customStates} defaultState={defaultState} />,
    );

    const caPath = container.querySelector('.usa-state.ca');
    fireEvent.click(caPath!);
    expect(customClick).toHaveBeenCalled();

    const nyPath = container.querySelector('.usa-state.ny');
    fireEvent.click(nyPath!);
    expect(defaultClick).toHaveBeenCalled();
  });

  it('handles DC circle click and mouse events', () => {
    const onClick = jest.fn();
    const onMouseEnter = jest.fn();
    const onMouseLeave = jest.fn();
    const customStates = { DC: { onClick, onMouseEnter, onMouseLeave } };
    const { container } = render(<USAMap customStates={customStates} />);
    const dcCircle = container.querySelector('circle.dc2');
    fireEvent.click(dcCircle!);
    expect(onClick).toHaveBeenCalled();
    fireEvent.mouseEnter(dcCircle!);
    expect(onMouseEnter).toHaveBeenCalled();
    fireEvent.mouseLeave(dcCircle!);
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
