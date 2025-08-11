import React from 'react';
import { render, screen } from '@testing-library/react';
import VHSCharacterPage from './page';

// Mock the VHSCharacterDemo component since it uses Three.js
jest.mock('@components/VHSCharacter', () => ({
  VHSCharacterDemo: () => (
    <div data-testid="vhs-character-demo">VHS Character Demo</div>
  ),
}));

describe('VHSCharacterPage', () => {
  it('renders the VHS character demo', () => {
    render(<VHSCharacterPage />);
    expect(screen.getByTestId('vhs-character-demo')).toBeInTheDocument();
  });
});
