import React from "react";
import PropTypes from "prop-types";
/**
 * ZoneCard – RPG fantasy zone: glow frame, zone art bg, responsive, immersive.
 * @param {string} name - Name of the zone
 * @param {string} description
 * @param {string} image - Fantasy image - provide a URL or import from /src/assets.
 * @param {function} onClick
 */
// PUBLIC_INTERFACE
export default function ZoneCard({ name, description, image, onClick }) {
  // Provide fallback to public domain fantasy land if no image supplied or load fails
  const zoneFallback =
    "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=320&q=80"; // fantasy forest demo

  // TODO: For production, drop your zone PNG/SVG in /src/assets and supply it as <ZoneCard image={require(...)} />

  return (
    <div
      className="relative cursor-pointer rpg-rounded rpg-zone-img border-2 border-accent/60 shadow-xl p-4 flex items-center gap-4 transition hover:scale-[1.025] hover:shadow-2xl hover:border-accent/90 group"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed="false"
      style={{
        minHeight: 86,
        background: "linear-gradient(135deg,#2c254c 70%,#7c3aed33 120%)",
      }}
    >
      <img
        src={image || zoneFallback}
        alt={name}
        className="w-14 h-14 rpg-rounded object-cover border-2 border-accent/50 group-hover:shadow-neon-accent bg-black/30 transition"
        style={{ boxShadow: "0 0 12px #9068d744" }}
        onError={e => {
          // Fallback for missing/failed image
          e.target.onerror = null;
          e.target.src = zoneFallback;
          // On double-fail, fallback to text
          setTimeout(() => {
            if (e.target.offsetParent && e.target.style.display !== "none") {
              e.target.style.display = "none";
              e.target.offsetParent.innerHTML +=
                `<span style="position:absolute;top:48%;left:21px;font-size:1.8em;color:#a2d8fc;text-shadow:0 0 9px #2ce7f7">🌲</span>`;
            }
          }, 400);
        }}
        // TODO: Customize your zone art here!
      />
      <div className="ml-2 flex flex-col flex-1">
        <h2 className="text-accent font-poppins font-extrabold text-xl drop-shadow-xl">{name}</h2>
        <div className="text-textFaded text-sm font-inter">{description}</div>
      </div>
      {/* Magic aura accent */}
      <span
        aria-hidden
        className="absolute pointer-events-none z-0 left-[14px] top-[14px] animate-pulse"
        style={{
          width: 34, height: 34, borderRadius: "100%",
          background: "radial-gradient(circle,#e89ffe38 0%,transparent 80%)",
          filter: "blur(3px)", zIndex: 1
        }}
      />
    </div>
  );
}

ZoneCard.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
  onClick: PropTypes.func
};
