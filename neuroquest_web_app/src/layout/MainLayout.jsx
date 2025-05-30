import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import '../App.css';

/* RPG hero/fantasy banner image – put final asset at src/assets/hero_banner_wizard.png */
/* You may swap out the demo image for a final illustration as required. */

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
          {/* Fantasy hero banner, mobile-optimized */}
          <div
            className="hero-fantasy-bg mb-4 w-full mx-auto px-0 py-2 flex flex-row items-center justify-between relative shadow-lg"
            style={{
              backgroundImage: "linear-gradient(180deg,#2d2250 44%,#3b2398 90%), url('/src/assets/hero_banner_wizard.png')"
            }}
          >
            <div className="flex flex-col items-start justify-center gap-1 pl-5 md:pl-9 py-3">
              <span className="font-cinzel text-2xl md:text-3xl text-accent neon-accent font-extrabold select-none tracking-wide drop-shadow-xl">
                NeuroQuest <span className="text-brand-orange">RPG</span>
              </span>
              <span className="font-poppins text-sm text-fuchsia-200 drop-shadow-md">The Productivity RPG</span>
            </div>
            <div className="pr-5 md:pr-10 flex items-center">
              <Link
                to="/dashboard"
                className="btn btn-sm neon-accent hover:bg-accent/30 transition font-poppins text-lg px-4"
              >
                Home
              </Link>
            </div>
            {/* Art halo overlay */}
            <span
              aria-hidden
              className="absolute left-0 bottom-0 w-full h-5 pointer-events-none"
              style={{
                background: "radial-gradient(circle,#c084fc29 0%,transparent 80%)",
                filter: "blur(4px)",
                zIndex: 1,
              }}
            />
          </div>
          {/* RPG XP/HP Bars */}
          <div className="flex gap-2 items-center pb-2">
            <div className="w-1/2 relative rpg-rounded neon-accent border border-accent/40 bg-neutral-800">
              <div
                className="xp-bar absolute left-0 top-0 h-full neon-glow"
                style={{ width: `${dummyXP}%`, zIndex: 2 }}
              ></div>
              <div className="relative z-10 py-1 px-2 text-xs text-white mix-blend-difference font-bold font-poppins">
                XP {dummyXP}%
              </div>
            </div>
            <div className="w-1/2 relative rpg-rounded neon-accent border border-red-400/70 bg-neutral-800">
              <div
                className="hp-bar absolute left-0 top-0 h-full neon-glow"
                style={{ width: `${dummyHP}%`, zIndex: 2 }}
              ></div>
              <div className="relative z-10 py-1 px-2 text-xs text-white mix-blend-difference font-bold font-poppins">
                HP {dummyHP}%
              </div>
            </div>
          </div>
          {/* RPG navigation bar */}
          <nav className="flex flex-row flex-wrap gap-2 mt-2">
            {menu.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={classNames(
                  'rpg-tab font-poppins font-bold transition-shadow duration-150 text-sm px-4 py-1 neon-accent relative',
                  'hover:bg-accent/24 hover:text-accent',
                  location.pathname === to
                    ? 'active bg-accent text-background shadow-neon-accent rpg-glow-anim'
                    : 'bg-black/30 text-secondary'
                )}
                style={{
                  minWidth: 88,
                  textShadow: location.pathname === to
                    ? "0 0 12px #c084fc, 0 0 20px #7c3aed"
                    : "",
                  letterSpacing: "0.011em",
                }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-gradient-to-b from-primary via-[#251947] to-background pt-6 pb-14">
        <div className="container mx-auto px-1 md:px-4 relative min-h-[400px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default MainLayout;
