import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu as MenuIcon } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';
import BrushButton from '@/components/ui/BrushButton';
import LiveDot from './LiveDot';
import MegaMenu from './MegaMenu';
import MobileMenu from './MobileMenu';
import { menus } from './menu-data';

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpenMenu(null);
    setMobileOpen(false);
  }, [location.pathname]);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
  };
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const order = ['product', 'solutions', 'developers', 'resources'];

  return (
    <>
      <AnimatePresence>
        {openMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpenMenu(null)}
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-200 ${
          scrolled ? 'glass border-b border-line-subtle' : ''
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-6">
          <Link to="/" className="shrink-0" aria-label="Tudu home">
            <Wordmark size="sm" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {order.map((key) => {
              const menu = menus[key];
              const isOpen = openMenu === key;
              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => {
                    cancelClose();
                    setOpenMenu(key);
                  }}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    type="button"
                    className={`flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                      isOpen
                        ? 'text-ink bg-raised'
                        : 'text-ink-muted hover:text-ink hover:bg-raised'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {menu.label}
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <MegaMenu
                    menu={menu}
                    isOpen={isOpen}
                    onClose={() => setOpenMenu(null)}
                  />
                </div>
              );
            })}
            <Link
              to="/pricing"
              className="rounded-md px-3 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:bg-raised hover:text-ink"
            >
              Pricing
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:block">
              <LiveDot />
            </div>
            <Link
              to="/login"
              className="rounded-md px-2 py-1.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink sm:px-3"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <BrushButton size="sm">Start free</BrushButton>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-2 text-ink-muted transition-colors hover:bg-subtle hover:text-ink lg:hidden"
              aria-label="Open menu"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
