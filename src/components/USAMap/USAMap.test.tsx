import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { USAMap } from './USAMap';

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

  it('calls onDoubleClick, preferring custom over default', () => {
    const customDouble = jest.fn();
    const defaultDouble = jest.fn();
    const customStates = { CA: { onDoubleClick: customDouble } } as any;
    const defaultState = { onDoubleClick: defaultDouble } as any;
    const { container } = render(
      <USAMap customStates={customStates} defaultState={defaultState} />,
    );
    const caPath = container.querySelector('.usa-state.ca');
    // @ts-expect-error jsdom supports dblclick in testing-library
    fireEvent.doubleClick(caPath!);
    expect(customDouble).toHaveBeenCalled();

    const nyPath = container.querySelector('.usa-state.ny');
    // default fallback when no custom provided
    // @ts-expect-error jsdom supports dblclick
    fireEvent.doubleClick(nyPath!);
    expect(defaultDouble).toHaveBeenCalled();
  });

  it('applies default fill/stroke when not overridden', () => {
    const { container } = render(<USAMap />);
    const nyPath = container.querySelector('.usa-state.ny')!;
    expect(nyPath.getAttribute('fill')).toBe('#d3d3d3');
    expect(nyPath.getAttribute('stroke')).toBe('#a5a5a5');
  });
});
