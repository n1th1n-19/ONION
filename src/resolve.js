const { palettes, DEFAULT_ROLES } = require("./palettes");

const MIN_FG = 7; // body text, WCAG AAA
const MIN_TEXT = 4.5; // syntax roles + comments, WCAG AA

const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (c) =>
  "#" +
  c
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const mix = (a, b, t) => {
  const x = rgb(a),
    y = rgb(b);
  return toHex(x.map((v, i) => v + (y[i] - v) * t));
};
const alpha = (hex, a) =>
  hex.slice(0, 7) +
  Math.round(a * 255)
    .toString(16)
    .padStart(2, "0");

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
// Nudge `fg` toward white (night) or black (day) until it reaches `min` contrast on `bg`.
function ensureContrast(fg, bg, min, toward) {
  for (let t = 0; t <= 1; t += 0.02) {
    const c = mix(fg, toward, t);
    if (contrast(c, bg) >= min) return c;
  }
  return toward;
}

const isHex = (s) => /^#[0-9a-f]{6}$/i.test(s);

// opts: { accent: 'default' | hue name | '#rrggbb', bordered, contrastSidebar, italic, folderColor }
function resolve(paletteName, mode, opts = {}) {
  const p = palettes[paletteName];
  const v = p[mode];
  const toward = mode === "night" ? "#ffffff" : "#000000";
  const fix = (c, min) => ensureContrast(c, v.bg2, min, toward);

  const accentKey =
    !opts.accent || opts.accent === "default"
      ? v.accent || p.accent
      : opts.accent;
  const accent = isHex(accentKey)
    ? accentKey
    : v.hues[accentKey] || v.hues[p.accent];

  const roleNames = { ...DEFAULT_ROLES, ...p.roles };
  const roles = {};
  for (const [role, hue] of Object.entries(roleNames))
    roles[role] = fix(v.hues[hue], MIN_TEXT);

  return {
    name: `Onion ${paletteName} ${mode === "night" ? "Night" : "Day"}`,
    palette: paletteName,
    mode,
    dark: mode === "night",
    ...v,
    fg: fix(v.fg, MIN_FG),
    comment: fix(v.comment, MIN_TEXT),
    hues: v.hues,
    // hues safe to use as text on sidebars/panels
    ink: Object.fromEntries(
      Object.entries(v.hues).map(([k, c]) => [
        k,
        ensureContrast(c, v.bg1, MIN_TEXT, toward),
      ]),
    ),
    accent,
    // readable text color to put on top of an accent-filled background
    onAccent:
      contrast(accent, "#000000") > contrast(accent, "#ffffff")
        ? mode === "night"
          ? v.bg0
          : "#000000"
        : "#ffffff",
    accentText: fix(accent, MIN_TEXT),
    roles,
    opts: { bordered: false, contrastSidebar: false, italic: true, ...opts },
  };
}

const variants = () =>
  Object.keys(palettes).flatMap((name) =>
    ["night", "day"].map((mode) => [name, mode]),
  );

module.exports = {
  resolve,
  variants,
  contrast,
  mix,
  alpha,
  isHex,
  MIN_FG,
  MIN_TEXT,
};
