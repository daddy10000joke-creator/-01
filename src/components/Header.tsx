import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Menu, X } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const Header = () => {
  const { settings } = useSettings();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navItems = [
    { name: '홈', path: '/' },
    { name: '포트폴리오', path: '/portfolio' },
    { name: '오늘의 디자인', path: '/today-design' },
    { name: '철학 & 소개', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tighter text-primary">
          테일러 디자인
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path ? "text-primary" : "text-slate-500"
              )}
            >
              {item.name}
            </Link>
          ))}
          <a
            href={`tel:${settings?.phone}`}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            <Phone size={14} />
            {settings?.phone}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-600"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 md:hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "text-lg font-medium",
                    location.pathname === item.path ? "text-primary" : "text-slate-500"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href={`tel:${settings?.phone}`}
                className="flex items-center justify-center gap-2 bg-primary text-white py-3 rounded-xl text-lg font-semibold"
              >
                <Phone size={18} />
                {settings?.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
