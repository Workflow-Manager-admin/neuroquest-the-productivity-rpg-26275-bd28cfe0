import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react"; // Ensure 'lottie-react' is installed in your project
import lostPortal from "../assets/lostPortal.json";

// NeonButton: import first tries shared button, fallback to local.
import PropTypes from "prop-types";
let NeonButton;
try {
  // Try to import global NeonButton component if available
  // eslint-disable-next-line
  // @ts-ignore
  NeonButton = require("../components/NeonButton").default;
} catch {
  // Fallback: define a local neon button if the shared isn't available
  NeonButton = function NeonButton({ children, onClick, className = "", ...props }) {
    return (
      <button
        className={`px-7 py-3 bg-gradient-to-tr from-violet-700 to-fuchsia-600 border-2 border-fuchsia-300 rounded-lg neon-glow text-fuchsia-100 shadow-xl transition-all focus:outline-none hover:brightness-125 focus:ring-2 focus:ring-fuchsia-400 font-bold text-lg ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
        <style>{`
        .neon-glow {
          box-shadow: 0 0 12px #910ad9, 0 0 32px #910ad97c, 0 0 2px #fff inset;
          text-shadow: 0 0 6px #fc86ff, 0 0 12px #9663db;
        }
        `}</style>
      </button>
    );
  };
  NeonButton.displayName = "NeonButton";
  NeonButton.propTypes = {
    children: PropTypes.node,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };
}

const NotFound = () => {
  const navigate = useNavigate();

  // Custom RPG neon styled copy + layout
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0137] to-[#150022] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md sm:max-w-xl mx-auto flex flex-col items-center gap-5">
        {/* Fantasy portal Unsplash/PD image - devs: swap this src to change NotFound hero art!
            https://unsplash.com/photos/time-lapse-photography-of-castle-during-nighttime-innOwR8D5Dg */}
        <img
          src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=550&q=80"
          alt="Lost mystical portal ruins"
          className="w-full max-w-sm mx-auto mt-2 mb-4 rounded-xl border-2 border-accent shadow-lg object-cover"
          onError={e=>{e.target.style.display='none'}}
          style={{background: "#261239"}}
        />
        <span className="block text-5xl text-accent my-2" aria-label="Portal" style={{display:'none'}}>🌀</span>
        {/* Dramatic animated portal */}
        <div
          className="w-[70vw] max-w-[410px] xs:max-w-[300px] mx-auto drop-shadow-lg"
          style={{
            filter: "drop-shadow(0 0 18px #ad54f6) drop-shadow(0 0 50px #8b13ab77)",
          }}
        >
          <Lottie animationData={lostPortal} loop={true} />
        </div>
        {/* RPG/Fantasy Neon Styled Text */}
        <h1
          className="text-neon font-rpg text-center text-3xl xs:text-4xl sm:text-5xl mt-3 mb-2"
          style={{
            letterSpacing: "0.035em",
            color: "#ffccfa",
            textShadow:
              "0 0 14px #be47e7, 0 0 6px #e867eb, 0 0 40px #e0daff",
            fontFamily: "'UnifrakturCook', 'Cinzel Decorative', serif",
          }}
        >
          This path leads to <span className="text-fuchsia-400">nowhere…</span>
        </h1>
        <p className="text-fuchsia-200 text-center text-lg max-w-xs md:max-w-lg mx-auto mb-3 font-semibold" style={{
          textShadow: "0 0 8px #a83df5cc"
        }}>
          The mists thicken, the portal grows faint.<br />
          Perhaps your destiny awaits elsewhere?<br />
        </p>
        {/* Neon Glowing Return Button */}
        <div className="mt-2">
          <NeonButton
            onClick={() => navigate("/dashboard")}
            className="w-full text-xl py-3 mt-1"
            aria-label="Return to Kingdom"
          >
            ⟵ Return to Kingdom
          </NeonButton>
        </div>
      </div>
      {/* Glow/particle accent for immersive RPG */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 15%, #3b10794b 0%, transparent 70%), radial-gradient(ellipse at 10% 70%, #bf3fc44a 0%, transparent 75%)",
          zIndex: 0,
        }}
      />
      {/* Inline style for RPG font if not imported elsewhere */}
      <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@900&family=UnifrakturCook:wght@700&display=swap');
      .font-rpg {
        font-family: 'UnifrakturCook', 'Cinzel Decorative', serif;
      }
      .text-neon {
        color: #f0a8ff;
        text-shadow: 0 0 16px #d06bf5, 0 0 32px #94033faa;
      }
      @media (max-width: 640px) {
        h1 { font-size: 2.2rem !important; }
      }
      `}</style>
    </div>
  );
};
NotFound.displayName = "NotFound";

export default NotFound;
