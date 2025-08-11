import React from 'react';
import { render, screen } from '@testing-library/react';
import GradientLegend from './GradientLegend';

describe('GradientLegend', () => {
  describe('Rendering', () => {
    it('renders with default props', () => {
      render(<GradientLegend />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });

    it('renders with loading state', () => {
      render(<GradientLegend loading={true} />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });

    it('renders with non-loading state', () => {
      render(<GradientLegend loading={false} />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });
  });

  describe('Styling and layout', () => {
    it('applies correct container classes', () => {
      render(<GradientLegend />);

      const container = screen.getByText('Brick-and-Mortar').closest('div')
        ?.parentElement?.parentElement;
      expect(container).toHaveClass(
        'mb-8 md:mb-4 md:mt-0 flex flex-col items-center',
      );
    });

    it('applies correct gradient container classes', () => {
      render(<GradientLegend />);

      const gradientContainer = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.parentElement;
      expect(gradientContainer).toHaveClass(
        'relative flex flex-col items-center',
      );
    });

    it('applies correct gradient bar classes', () => {
      render(<GradientLegend />);

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toHaveClass(
        'w-64 md:w-96 h-4 border border-white rounded',
      );
    });

    it('applies correct labels container classes', () => {
      render(<GradientLegend />);

      const labelsContainer = screen
        .getByText('Brick-and-Mortar')
        .closest('div');
      expect(labelsContainer).toHaveClass(
        'flex justify-between text-xs text-white mt-2 w-64 md:w-96',
      );
    });
  });

  describe('Gradient styling', () => {
    it('applies loading background color when loading is true', () => {
      render(<GradientLegend loading={true} />);

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toHaveStyle({ background: '#6B7280' });
    });

    it('applies gradient background when loading is false', () => {
      render(<GradientLegend loading={false} />);

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toHaveStyle({
        background:
          'linear-gradient(to right, rgb(200, 220, 255), rgb(5, 10, 65))',
      });
    });

    it('applies gradient background when loading is undefined', () => {
      render(<GradientLegend />);

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toHaveStyle({
        background:
          'linear-gradient(to right, rgb(200, 220, 255), rgb(5, 10, 65))',
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper text content for screen readers', () => {
      render(<GradientLegend />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });
  });

  describe('Responsive behavior', () => {
    it('applies responsive width classes', () => {
      render(<GradientLegend />);

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toHaveClass('w-64 md:w-96');
    });

    it('applies responsive margin classes', () => {
      render(<GradientLegend />);

      const container = screen.getByText('Brick-and-Mortar').closest('div')
        ?.parentElement?.parentElement;
      expect(container).toHaveClass('mb-8 md:mb-4 md:mt-0');
    });
  });

  describe('Edge cases', () => {
    it('handles loading prop as undefined gracefully', () => {
      render(<GradientLegend loading={undefined} />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });

    it('handles loading prop as null gracefully', () => {
      render(<GradientLegend loading={null as any} />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });

    it('handles loading prop as false explicitly', () => {
      render(<GradientLegend loading={false} />);

      expect(screen.getByText('Brick-and-Mortar')).toBeInTheDocument();
      expect(screen.getByText('E-commerce')).toBeInTheDocument();
    });
  });

  describe('Component structure', () => {
    it('renders complete component structure', () => {
      render(<GradientLegend />);

      const container = screen.getByText('Brick-and-Mortar').closest('div')
        ?.parentElement?.parentElement;
      expect(container).toBeInTheDocument();

      const gradientBar = screen
        .getByText('Brick-and-Mortar')
        .closest('div')?.previousElementSibling;
      expect(gradientBar).toBeInTheDocument();

      const labelsContainer = screen
        .getByText('Brick-and-Mortar')
        .closest('div');
      expect(labelsContainer).toBeInTheDocument();
    });
  });
});
