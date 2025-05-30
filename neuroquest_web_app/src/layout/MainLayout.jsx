import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import '../App.css';

// Dummy data (to be replaced by context/providers later)
const dummyXP = 45; // percent, just for demo
const dummyHP = 73; // percent

// PUBLIC_INTERFACE
function MainLayout() {
  /** Main app layout with neon-glow top bars and navigation. */
  const location = useLocation();

  // Simple tab highlight for top nav, RPG style
  const menu = [
    { label: 'Dashboard', to: '/dashboard' },
    { label: 'Quest Log', to: '/questlog' },
    { label: 'Boss Battle', to: '/bossbattle' },
    { label: 'Focus', to: '/focus' },
    { label: 'Inventory', to: '/inventory' },
    { label: 'Calendar', to: '/calendarsync' },
    { label: 'Settings', to: '/settings' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-primary">
      <header className="w-full px-0 py-3 bg-black/60 backdrop-blur-md shadow-neon-accent z-30">
        <div className="container mx-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="font-poppins text-xl text-accent neon-accent font-bold select-none tracking-wide drop-shadow-lg">
              NeuroQuest <span className="text-brand-orange">RPG</span>
            </div>
            <div className="flex gap-2">
              <Link
                to="/dashboard"
                className="btn btn-sm neon-accent hover:bg-accent/30 transition"
              >
                Home
              </Link>
            </div>
          </div>
          {/* RPG XP/HP Bars */}
          <div className="flex gap-2 items-center">
            <div className="w-1/2 relative rpg-rounded border border-accent/40 bg-neutral-800">
              <div
                className="xp-bar absolute left-0 top-0 h-full neon-accent"
                style={{ width: `${dummyXP}%`, zIndex: 2 }}
              ></div>
              <div className="relative z-10 py-1 px-2 text-xs text-white mix-blend-difference font-bold">
                XP {dummyXP}%
              </div>
            </div>
            <div className="w-1/2 relative rpg-rounded border border-red-400/50 bg-neutral-800">
              <div
                className="hp-bar absolute left-0 top-0 h-full"
                style={{ width: `${dummyHP}%`, zIndex: 2 }}
              ></div>
              <div className="relative z-10 py-1 px-2 text-xs text-white mix-blend-difference font-bold">
                HP {dummyHP}%
              </div>
            </div>
          </div>
          {/* RPG navigation bar */}
          <nav className="flex gap-2 mt-2">
            {menu.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={classNames(
                  'px-4 py-1 rpg-rounded font-semibold transition-shadow duration-100 text-sm',
                  'hover:bg-accent/20 hover:text-accent neon-accent',
                  location.pathname === to
                    ? 'bg-accent text-black shadow-neon-accent'
                    : 'bg-black/30 text-secondary'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-primary via-[#251947] to-background pt-8 pb-14">
        <div className="container mx-auto p-4 relative min-h-[400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
