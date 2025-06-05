import React from "react";

/**
 * PUBLIC_INTERFACE
 * Avatar component.
 * Displays the user's character avatar. Accepts `src` for image, `name`, and optional decorations.
 */
function Avatar({ src, name = "Hero", size = 64 }) {
  return (
    <div
      className="avatar flex flex-col items-center gap-1"
      style={{ width: size, minWidth: size }}
    >
      <div
        className="avatar__img rounded-full bg-violetneon overflow-hidden border-2 border-rpg-gold shadow-neon-violet"
        style={{ width: size, height: size }}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        ) : (
          <span className="avatar__placeholder flex items-center justify-center w-full h-full text-3xl text-rpg-gold bg-black/40">
            ?
          </span>
        )}
      </div>
      <span className="avatar__name text-xs text-white/80">{name}</span>
    </div>
  );
}

export default Avatar;
