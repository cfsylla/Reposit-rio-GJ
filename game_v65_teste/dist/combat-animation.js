// Presentation follows the combat clock, so pause and battle speed apply to every clip.
const CombatAnimation = (() => {
  const roster = {
    warrior: {
      walk: { width: 308, height: 378, frames: 8, seconds: 0.12, anchor: [162, 368], scale: 78 / 358 },
      attack: { width: 404, height: 385, frames: 7, seconds: 0.12, anchor: [203, 378], scale: 78 / 376, facesRight: true },
      skill: { width: 426, height: 394, frames: 7, seconds: 0.14, anchor: [215, 387], scale: 78 / 382, facesRight: true }
    },
    lancer: {
      walk: { width: 307, height: 376, frames: 8, seconds: 0.12, anchor: [165, 367], scale: 78 / 365 },
      attack: { width: 418, height: 390, frames: 7, seconds: 0.14, anchor: [244, 387], scale: 78 / 363 },
      skill: { width: 439, height: 329, frames: 7, seconds: 0.16, anchor: [224, 328], scale: 78 / 325, facesRight: true }
    },
    bastion: {
      walk: { width: 373, height: 418, frames: 8, seconds: 0.12, anchor: [184, 396], scale: 78 / 395 },
      attack: { width: 407, height: 383, frames: 7, seconds: 0.14, anchor: [217, 376], scale: 78 / 373 },
      skill: { width: 413, height: 401, frames: 7, seconds: 0.16, anchor: [214, 370], scale: 78 / 370 }
    },
    omnamusha: {
      walk: { width: 426, height: 428, frames: 8, seconds: 0.12, anchor: [220, 426], scale: 78 / 424 },
      attack: { width: 443, height: 413, frames: 7, seconds: 0.12, anchor: [236, 410], scale: 78 / 381 },
      skill: { width: 439, height: 404, frames: 7, seconds: 0.14, anchor: [226, 397], scale: 78 / 335 }
    },
    shinobi: {
      walk: { width: 285, height: 410, frames: 8, seconds: 0.12, anchor: [146, 397], scale: 78 / 395 },
      attack: { width: 433, height: 424, frames: 7, seconds: 0.12, anchor: [234, 422], scale: 78 / 420 },
      skill: { width: 409, height: 392, frames: 7, seconds: 0.15, anchor: [244, 371], scale: 78 / 369 }
    },
    kinoichi: {
      walk: { width: 353, height: 411, frames: 8, seconds: 0.12, anchor: [179, 403], scale: 78 / 401 },
      attack: { width: 380, height: 397, frames: 7, seconds: 0.14, anchor: [197, 394], scale: 78 / 392 },
      skill: { width: 428, height: 358, frames: 7, seconds: 0.17, anchor: [221, 342], scale: 78 / 338 }
    },
    shaolin: {
      walk: { width: 264, height: 423, frames: 8, seconds: 0.13, anchor: [128, 409], scale: 78 / 407 },
      attack: { width: 378, height: 414, frames: 7, seconds: 0.12, anchor: [219, 414], scale: 78 / 414 },
      skill: { width: 288, height: 367, frames: 7, seconds: 0.15, anchor: [140, 364], scale: 78 / 332 }
    },
    cowboy: {
      walk: { width: 288, height: 412, frames: 8, seconds: 0.12, anchor: [137, 412], scale: 78 / 408 },
      attack: { width: 410, height: 394, frames: 7, seconds: 0.12, anchor: [224, 388], scale: 78 / 388 },
      skill: { width: 443, height: 396, frames: 7, seconds: 0.14, anchor: [246, 396], scale: 78 / 396 }
    },
    gunner: {
      walk: { width: 298, height: 417, frames: 8, seconds: 0.13, anchor: [148, 417], scale: 78 / 415 },
      attack: { width: 409, height: 409, frames: 7, seconds: 0.12, anchor: [233, 403], scale: 78 / 403 },
      skill: { width: 393, height: 394, frames: 7, seconds: 0.14, anchor: [182, 388], scale: 78 / 388, facesRight: true }
    },
    ronin: {
      walk: { width: 340, height: 383, frames: 8, seconds: 0.14, anchor: [215, 383], scale: 78 / 380 },
      attack: { width: 443, height: 400, frames: 7, seconds: 0.13, anchor: [251, 370], scale: 78 / 365 },
      skill: { width: 443, height: 372, frames: 7, seconds: 0.12, anchor: [244, 360], scale: 78 / 356 }
    },
    fighter: {
      walk: { width: 234, height: 396, frames: 8, seconds: 0.12, anchor: [123, 392], scale: 78 / 390 },
      attack: { width: 359, height: 396, frames: 7, seconds: 0.11, anchor: [231, 395], scale: 78 / 395 },
      skill: { width: 322, height: 404, frames: 7, seconds: 0.14, anchor: [176, 397], scale: 78 / 377 }
    },
    martial_artist: {
      walk: { width: 310, height: 399, frames: 8, seconds: 0.13, anchor: [172, 396], scale: 78 / 396 },
      attack: { width: 435, height: 405, frames: 7, seconds: 0.12, anchor: [244, 404], scale: 78 / 403 },
      skill: { width: 413, height: 392, frames: 7, seconds: 0.14, anchor: [209, 382], scale: 78 / 382 }
    },
    samurai: {
      walk: { width: 376, height: 426, frames: 8, seconds: 0.13, anchor: [185, 423], scale: 78 / 419 },
      attack: { width: 439, height: 427, frames: 7, seconds: 0.13, anchor: [225, 425], scale: 78 / 417 },
      skill: { width: 435, height: 383, frames: 7, seconds: 0.14, anchor: [250, 381], scale: 78 / 369 }
    }
  };
  for (const [unit, clips] of Object.entries(roster)) {
    for (const [action, clip] of Object.entries(clips)) {
      clip.image = new Image();
      const revision = ['shaolin', 'cowboy', 'gunner'].includes(unit) || unit === 'warrior' && action !== 'walk' || unit === 'lancer' && action !== 'walk' ? 2 : 1;
      clip.image.src = 'assets/' + unit + '-' + action + '-v' + revision + '.webp';
    }
  }

  function actionFrame(clips, unit, time, name) {
    const event = unit[name === 'skill' ? 'skillAnimation' : 'attackAnimation'];
    if (!event || time < event.time) return null;
    // Frame zero is the neutral pose. Play the action once from its first moving frame.
    const frame = 1 + Math.floor((time - event.time) / clips[name].seconds);
    return frame < clips[name].frames ? { name, frame, right: event.right } : null;
  }

  function draw(ctx, unit, target, time) {
    if (!Object.hasOwn(roster, unit.type) || unit.hp <= 0 || REDUCED_MOTION) return false;
    const clips = roster[unit.type];
    const walk = unit.walkAnimation;
    const moving = walk && time - walk.last <= 0.05 && !unit.stun && !unit.root;
    const pose = actionFrame(clips, unit, time, 'skill') || actionFrame(clips, unit, time, 'attack') || {
      name: 'walk',
      frame: moving ? Math.floor((time - walk.start) / clips.walk.seconds) % clips.walk.frames : 0,
      right: moving ? walk.right : target && Math.abs(target.x - unit.x) > 3 ? target.x > unit.x : walk?.right ?? (unit.side !== 0)
    };
    const { image, width, height, anchor, scale, facesRight } = clips[pose.name];
    if (!image.complete || !image.naturalWidth) return false;

    ctx.save();
    ctx.translate(unit.x, unit.y + 8);
    if (pose.right !== Boolean(facesRight)) ctx.scale(-1, 1);
    ctx.imageSmoothingEnabled = false;
    const filters = [];
    if (unit.fused) filters.push('drop-shadow(1px 0 #f6cf70) drop-shadow(-1px 0 #f6cf70) drop-shadow(0 1px #f6cf70) drop-shadow(0 -1px #f6cf70)');
    if (unit.flash > 0) filters.push('brightness(1.25) saturate(1.4)');
    if (filters.length) ctx.filter = filters.join(' ');
    ctx.drawImage(image, pose.frame * width, 0, width, height,
      -anchor[0] * scale, -anchor[1] * scale, width * scale, height * scale);
    ctx.restore();
    return true;
  }
  return { draw };
})();
