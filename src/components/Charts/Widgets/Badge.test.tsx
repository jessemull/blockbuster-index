import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Badge from './Badge';
import { StateNames, USAStateAbbreviation } from '@constants';

describe('Badge', () => {
  const mockStateData = {
    type: 'state' as const,
    stateCode: 'CA' as USAStateAbbreviation,
    score: 85.5,
    rank: 1,
  };

  const mockRegionData = {
    type: 'region' as const,
    name: 'West Coast',
    score: 78.2,
    rank: 3,
  };

  const mockOnViewStats = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders state data correctly', () => {
      render(<Badge data={mockStateData} />);

      expect(screen.getByText(StateNames.CA)).toBeInTheDocument();
      expect(screen.getByText('85.5')).toBeInTheDocument();
      expect(screen.getByText('Rank: 1')).toBeInTheDocument();
    });

    it('renders region data correctly', () => {
      render(<Badge data={mockRegionData} />);

      expect(screen.getByText('West Coast')).toBeInTheDocument();
      expect(screen.getByText('78.2')).toBeInTheDocument();
      expect(screen.getByText('Rank: 3')).toBeInTheDocument();
    });

    it('returns null when no data is provided', () => {
      const { container } = render(<Badge data={null as any} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Variants', () => {
    it('applies mobile variant styles correctly', () => {
      render(<Badge data={mockStateData} variant="mobile" />);

      const badgeContainer = screen
        .getByText(StateNames.CA)
        .closest('div')?.parentElement;
      expect(badgeContainer).toHaveClass('w-52 sm:w-56 text-center mx-auto');
    });

    it('applies compact variant styles correctly', () => {
      render(<Badge data={mockStateData} variant="compact" />);

      const badgeContainer = screen
        .getByText(StateNames.CA)
        .closest('div')?.parentElement;
      expect(badgeContainer).toHaveClass('w-36 sm:w-40 text-center mx-auto');
    });

    it('applies default variant styles correctly', () => {
      render(<Badge data={mockStateData} variant="default" />);

      const badgeContainer = screen
        .getByText(StateNames.CA)
        .closest('div')?.parentElement;
      expect(badgeContainer).toHaveClass('w-48 text-center mx-auto');
    });
  });

  describe('Title sizes', () => {
    it('applies mobile variant title size', () => {
      render(<Badge data={mockStateData} variant="mobile" />);

      const title = screen.getByText(StateNames.CA);
      expect(title).toHaveClass('text-lg');
    });

    it('applies compact variant title size', () => {
      render(<Badge data={mockStateData} variant="compact" />);

      const title = screen.getByText(StateNames.CA);
      expect(title).toHaveClass('text-sm');
    });

    it('applies default variant title size', () => {
      render(<Badge data={mockStateData} variant="default" />);

      const title = screen.getByText(StateNames.CA);
      expect(title).toHaveClass('text-sm');
    });
  });

  describe('Button behavior', () => {
    it('shows button when showButton is true and onViewStats is provided', () => {
      render(<Badge data={mockStateData} onViewStats={mockOnViewStats} />);

      const button = screen.getByRole('button', { name: 'View Stats' });
      expect(button).toBeInTheDocument();
    });

    it('hides button when showButton is false', () => {
      render(
        <Badge
          data={mockStateData}
          showButton={false}
          onViewStats={mockOnViewStats}
        />,
      );

      const button = screen.queryByRole('button', { name: 'View Stats' });
      expect(button).not.toBeInTheDocument();
    });

    it('hides button when onViewStats is not provided', () => {
      render(<Badge data={mockStateData} />);

      const button = screen.queryByRole('button', { name: 'View Stats' });
      expect(button).not.toBeInTheDocument();
    });

    it('calls onViewStats when button is clicked', () => {
      render(<Badge data={mockStateData} onViewStats={mockOnViewStats} />);

      const button = screen.getByRole('button', { name: 'View Stats' });
      fireEvent.click(button);

      expect(mockOnViewStats).toHaveBeenCalledTimes(1);
    });
  });

  describe('Custom className', () => {
    it('applies custom className to outer container', () => {
      const customClass = 'custom-badge-class';
      render(<Badge data={mockStateData} className={customClass} />);

      const outerContainer = screen.getByText(StateNames.CA).closest('div')
        ?.parentElement?.parentElement;
      expect(outerContainer).toHaveClass(customClass);
    });

    it('applies default className when none provided', () => {
      render(<Badge data={mockStateData} />);

      const outerContainer = screen.getByText(StateNames.CA).closest('div')
        ?.parentElement?.parentElement;
      expect(outerContainer).toBeInTheDocument();
      expect(outerContainer?.className).toBe('');
    });
  });

  describe('Edge cases', () => {
    it('handles state data with missing components gracefully', () => {
      const incompleteStateData = {
        type: 'state' as const,
        stateCode: 'CA' as USAStateAbbreviation,
        score: 0,
        rank: 0,
      };

      render(<Badge data={incompleteStateData} />);

      expect(screen.getByText('0')).toBeInTheDocument();
      expect(screen.getByText('Rank: 0')).toBeInTheDocument();
    });

    it('handles region data with empty name', () => {
      const emptyRegionData = {
        type: 'region' as const,
        name: '',
        score: 50,
        rank: 25,
      };

      render(<Badge data={emptyRegionData} />);

      const titleElement = screen
        .getByText('50')
        .closest('div')?.previousElementSibling;
      expect(titleElement).toBeInTheDocument();
      expect(titleElement?.textContent).toBe('');
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('Rank: 25')).toBeInTheDocument();
    });
  });
});
