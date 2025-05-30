# Fantasy RPG UI Image Assets – Drop-In Guide

1. Any PNG/SVG in this folder can be replaced with your own fantasy art for better polish!
2. Each UI component (e.g., hero image, avatars, items, boss art) has robust fallback logic, so missing images won't break the app.

## To Swap In Your Own Artwork:
- Replace the PNG/SVG/JSON with the same name (e.g. wizard_hero_01.png, zone_forest.png, boss_dragon.png).
- For SVGs, name them similar to their PNG equivalent.
- Lottie JSONs for animations (e.g. lostPortal.json) are supported for extra polish.
- Each component code has comments: look for "// TODO: Drop in your custom artwork here for production"

## Current placeholders (see ASSET_SOURCE_LICENSES.txt for sources/license):
- sword.png, shield.png, orb.png, wizard_hero_01.png, knight_hero_01.png, witch_hero_01.png
- hero_banner.png, zone_forest.png, zone_dungeon.png, zone_hills.png
- boss_dragon.png, quest_scroll.png, lost_portal.png
