import React, { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Shared page shell with the gradient background and subtle dot pattern
 * used across Index, Rankings, Signals, and About pages.
 */
export const PageBackground: React.FC<Props> = ({
  children,
  className = 'min-h-screen flex flex-col bg-gradient-to-br from-blue-950 via-black to-blue-950',
}) => {
  return (
    <div className={className}>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />
      {children}
    </div>
  );
};

export default PageBackground;
