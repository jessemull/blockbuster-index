import React from 'react';

type Props = {
  className?: string;
};

/**
 * Shared site footer with a dynamic copyright year.
 */
export const Footer: React.FC<Props> = ({
  className = 'text-center py-4 mt-auto',
}) => {
  const year = new Date().getFullYear();

  return (
    <footer className={className}>
      <p className="text-gray-500 text-xs">DATA UPDATED DAILY • © {year}</p>
    </footer>
  );
};

export default Footer;
