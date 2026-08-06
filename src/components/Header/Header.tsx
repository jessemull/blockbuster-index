'use client';

import { BarChart3, Home, Info, Menu, Trophy, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useId, useRef, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/about', label: 'About', icon: Info },
  { href: '/signals', label: 'Signals', icon: BarChart3 },
  { href: '/rankings', label: 'Rankings', icon: Trophy },
] as const;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const drawerRef = useRef<HTMLDivElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!isMenuOpen) {
      if (wasOpenRef.current) {
        toggleButtonRef.current?.focus();
      }
      wasOpenRef.current = false;
      return;
    }

    wasOpenRef.current = true;
    closeButtonRef.current?.focus();

    const drawer = drawerRef.current;
    if (!drawer) return;

    const getFocusable = () =>
      Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMenuOpen(false);
        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const currentPageProps = (href: string) =>
    pathname === href ? ({ 'aria-current': 'page' } as const) : {};

  return (
    <header className="sticky top-0 z-20 bg-brand-darker-blue backdrop-blur-sm border-b border-brand-yellow relative">
      <div className="max-w-6xl py-3 md:py-4 pl-3 md:pl-6">
        <div className="flex items-center relative">
          <button
            aria-controls={menuId}
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
            className="lg:hidden absolute md:-left-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded"
            ref={toggleButtonRef}
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <Menu className="w-6 h-6 md:w-8 md:h-8 text-white" />
          </button>
          <div className="flex items-center space-x-3 w-full lg:w-auto justify-center lg:justify-start">
            <Link
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow"
              href="/"
            >
              <Image
                alt=""
                className="w-6 h-6 md:w-8 md:h-8"
                height={32}
                src="/favicon.png"
                width={32}
              />
              <span className="text-white font-light text-base md:text-lg tracking-wide">
                Blockbuster Index
              </span>
            </Link>
          </div>
          <nav
            aria-label="Desktop navigation"
            className="hidden lg:flex items-center space-x-6 ml-8"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                className="text-gray-200 hover:text-blue-300 transition-colors font-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow"
                href={href}
                {...currentPageProps(href)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        {isMenuOpen && (
          <div
            aria-label="Mobile navigation menu"
            aria-modal="true"
            className="lg:hidden min-h-screen absolute top-0 left-0 bg-brand-darker-blue border-r border-white/30 shadow-lg z-50 min-w-72"
            id={menuId}
            ref={drawerRef}
            role="dialog"
          >
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center space-x-3">
                <Image
                  alt=""
                  className="w-5 h-5 md:w-6 md:h-6"
                  height={32}
                  src="/favicon.png"
                  width={32}
                />
                <span className="text-white font-light text-sm md:text-base tracking-wide">
                  Blockbuster Index
                </span>
              </div>
              <button
                aria-label="Close menu"
                className="text-white hover:text-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow rounded"
                ref={closeButtonRef}
                type="button"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <nav
              aria-label="Mobile navigation"
              className="flex flex-col space-y-0"
            >
              {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  className="text-white hover:text-blue-300 transition-colors font-light text-sm md:text-base flex items-center space-x-3 py-2.5 md:py-3 px-4 border-b border-white/30 first:border-t focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-yellow"
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                  {...currentPageProps(href)}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
