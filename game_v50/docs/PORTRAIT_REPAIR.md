# Portrait restoration — playtest follow-up

The v54 playtest patch replaced 17 portrait references with each character's full-body anime art to obtain alpha. That solved the alpha audit but broke card framing in deck thumbnails, deck previews and the collection.

The original supplied headshots remained present in the repository. `dist/game-1.js` now references those exact original files again. No source artwork was regenerated, recropped, resaved or altered.

Affected characters: warrior, lancer, bastion, shinobi, kinoichi, samurai, omnamusha, ronin, fighter, martial_artist, shaolin, cowboy, gunner, miner, pirate_captain, pirate and cannoneer.

## Display transparency

Those 17 legacy headshot files have an opaque black matte. `dist/portrait-renderer.js` composites that matte at display time only:

- Recognizes the original headshot asset paths, leaving full anime art and sprites untouched.
- Clears near-black pixels connected to an outside image edge; enclosed dark pixels remain.
- Uses a sequential, cached display canvas capped at 512 px, avoiding repeated work for repeated cards.
- Applies the result to dynamically rendered image elements across decks, cards, collection and other portrait consumers.
- Retains the original headshot as a fallback if a browser cannot composite the matte.

Load the renderer after `game-1.js` and before rendering/UI initialization. The source portrait and full art references must remain different.

## Verification

`node tests/portrait-alpha.cjs` verifies all 17 exact original references and headshot aspect ratios, confirms the matte algorithm preserves enclosed black pixels, and audits alpha on the other 102 existing portraits. The nine Ironbound headshot sets and existing Blackfang/Dawncrest boss portraits already contain alpha and are unaffected.
