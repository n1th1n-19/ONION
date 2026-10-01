// Product icons in a solid (filled) style, drawn on a 24px grid with a tiny geometry kit that emits *filled* outlines
// (icon fonts ignore SVG strokes). Every shape is a positive-wound contour; holes are reversed
// contours, so overlapping shapes union under the nonzero fill rule.

const W = 2.3; // stroke width: heavy enough to sit next to solid glyphs
const N = 40; // circle segments

const area = (pts) =>
  pts.reduce((a, [x, y], i) => {
    const [x2, y2] = pts[(i + 1) % pts.length];
    return a + x * y2 - x2 * y;
  }, 0) / 2;
const orient = (pts, hole = false) =>
  area(pts) > 0 !== hole ? pts : [...pts].reverse();
const circlePts = (cx, cy, r, n = N) =>
  Array.from({ length: n }, (_, i) => [
    cx + r * Math.cos((i / n) * 2 * Math.PI),
    cy + r * Math.sin((i / n) * 2 * Math.PI),
  ]);
const CAP = 12; // round caps/joins are ~1px wide: 12 points is plenty and keeps glyph paths small

const dot = (cx, cy, r) => [orient(circlePts(cx, cy, r))];
const fill = (pts) => [orient(pts)];
const ring = (cx, cy, r, w = W) => [
  orient(circlePts(cx, cy, r + w / 2)),
  orient(circlePts(cx, cy, r - w / 2), true),
];

const cap = (x, y, w) => orient(circlePts(x, y, w / 2, CAP));
function quad([x1, y1], [x2, y2], w) {
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = (-(y2 - y1) / len) * (w / 2),
    ny = ((x2 - x1) / len) * (w / 2);
  return [
    orient([
      [x1 + nx, y1 + ny],
      [x2 + nx, y2 + ny],
      [x2 - nx, y2 - ny],
      [x1 - nx, y1 - ny],
    ]),
  ];
}
const seg = (a, b, w = W) => [...quad(a, b, w), cap(...a, w), cap(...b, w)];
// polyline: one quad per segment, one round join per vertex
function line(pts, { closed = false, w = W } = {}) {
  const list = closed ? [...pts, pts[0]] : pts;
  const out = [];
  for (let i = 0; i < list.length - 1; i++) out.push(...quad(list[i], list[i + 1], w));
  for (const p of pts) out.push(cap(...p, w));
  return out;
}
const rad = (d) => (d * Math.PI) / 180;
const arcPts = (cx, cy, r, a0, a1, n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  });
const arc = (cx, cy, r, a0, a1, w = W) =>
  line(arcPts(cx, cy, r, a0, a1), { w });
const bez = (p0, p1, p2, n = 16) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n,
      u = 1 - t;
    return [
      u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0],
      u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1],
    ];
  });

function roundRectPts(x, y, w, h, r) {
  const pts = [];
  for (const [cx, cy, a] of [
    [x + w - r, y + r, -90],
    [x + w - r, y + h - r, 0],
    [x + r, y + h - r, 90],
    [x + r, y + r, 180],
  ])
    pts.push(...arcPts(cx, cy, r, a, a + 90, 6));
  return pts;
}
const box = (x, y, w, h, r = 2, sw = W) => [
  orient(roundRectPts(x - sw / 2, y - sw / 2, w + sw, h + sw, r + sw / 2)),
  orient(
    roundRectPts(
      x + sw / 2,
      y + sw / 2,
      w - sw,
      h - sw,
      Math.max(0.3, r - sw / 2),
    ),
    true,
  ),
];
const solidBox = (x, y, w, h, r = 1.5) => [orient(roundRectPts(x, y, w, h, r))];
// filled arrowhead with its tip at (x, y), pointing along angle `deg`
function head(x, y, deg, s = 6.2) {
  const b = rad(deg + 150),
    c = rad(deg - 150);
  return fill([
    [x, y],
    [x + s * Math.cos(b), y + s * Math.sin(b)],
    [x + s * Math.cos(c), y + s * Math.sin(c)],
  ]);
}
// arc ending in an arrowhead at a1 (direction of travel)
function arrowArc(cx, cy, r, a0, a1) {
  const dir = a1 > a0 ? 1 : -1;
  const tip = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
  const trim = (Math.asin(Math.min(1, 3.2 / (2 * r))) * 360) / Math.PI; // stop the shaft inside the head
  return [
    ...arc(cx, cy, r, a0, a1 - dir * trim),
    ...head(tip[0], tip[1], a1 + dir * 90 + dir * 10),
  ];
}
const tri = (pts) => [...fill(pts), ...line(pts, { closed: true, w: 1.2 })]; // filled polygon, softly rounded corners

// ── cut-outs (reversed contours). Each cut-out must be ONE polygon: crossing holes cancel out.
const hole = (pts) => orient(pts, true);
const holeDot = (cx, cy, r) => hole(circlePts(cx, cy, r));
const holeBox = (x, y, w, h, r = 1) => hole(roundRectPts(x, y, w, h, r));
// plus as a single 12-point polygon (arm length L from center, half-width a), optionally rotated
function plusPts(cx, cy, L, a, deg = 0) {
  const raw = [[a, -L], [a, -a], [L, -a], [L, a], [a, a], [a, L], [-a, L], [-a, a], [-L, a], [-L, -a], [-a, -a], [-a, -L]];
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return raw.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}
// open polyline as one mitered polygon (for cut-outs like the terminal prompt)
function strokePoly(pts, w) {
  const h = w / 2, nrm = (a, b) => { const l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [-(b[1] - a[1]) / l, (b[0] - a[0]) / l]; };
  const L = [], R = [];
  pts.forEach((p, i) => {
    const n1 = i > 0 ? nrm(pts[i - 1], p) : nrm(p, pts[i + 1]);
    const n2 = i < pts.length - 1 ? nrm(p, pts[i + 1]) : n1;
    let nx = n1[0] + n2[0], ny = n1[1] + n2[1];
    const l = Math.hypot(nx, ny); nx /= l; ny /= l;
    const m = h / (nx * n1[0] + ny * n1[1]);
    L.push([p[0] + nx * m, p[1] + ny * m]); R.push([p[0] - nx * m, p[1] - ny * m]);
  });
  return [...L, ...R.reverse()];
}

const doc = (x0, x1, y0, y1, fold = 5.5) => [
  ...fill([[x0, y0], [x1 - fold - 1, y0], [x1 - fold - 1, y0 + fold + 1], [x1, y0 + fold + 1], [x1, y1], [x0, y1]]),
  ...fill([[x1 - fold, y0], [x1, y0 + fold], [x1 - fold, y0 + fold]]),
];

const icons = {
  files: [...doc(6.5, 20, 2, 18.5), ...line([[3, 6], [3, 21.5], [15.5, 21.5]], { w: 2 })],
  search: [...ring(10, 10, 5.6, 3), ...seg([14.6, 14.6], [20.5, 20.5], 3.2)],
  "source-control": [...dot(6, 5, 2.9), ...dot(6, 19, 2.9), ...dot(18, 12, 2.9), ...seg([6, 7], [6, 17]), ...line(bez([15.5, 12], [7, 12], [6, 7.6]))],
  "debug-alt": [...tri([[3.5, 3], [15.5, 10], [3.5, 17]]), ...dot(17.5, 17.5, 3.6), ...seg([17.5, 11.6], [17.5, 12.6], 1.6), ...seg([11.4, 17.5], [12.4, 17.5], 1.6), ...seg([22.6, 17.5], [23.2, 17.5], 1.6)],
  extensions: [...solidBox(2.5, 13, 8, 8, 1.6), ...solidBox(11.5, 13, 8, 8, 1.6), ...solidBox(2.5, 4, 8, 8, 1.6), ...solidBox(13.5, 2, 8, 8, 1.6)],
  account: [...dot(12, 7.8, 4.6), ...fill(arcPts(12, 22, 8.5, 180, 360))],
  "settings-gear": [
    ...ring(12, 12, 4.6, 4.8),
    ...Array.from({ length: 8 }, (_, i) => { const a = rad(i * 45); return seg([12 + 6.4 * Math.cos(a), 12 + 6.4 * Math.sin(a)], [12 + 8.4 * Math.cos(a), 12 + 8.4 * Math.sin(a)], 3); }).flat(),
  ],
  "chevron-right": line([[9, 5], [16, 12], [9, 19]]),
  "chevron-left": line([[15, 5], [8, 12], [15, 19]]),
  "chevron-down": line([[5, 9], [12, 16], [19, 9]]),
  "chevron-up": line([[5, 15], [12, 8], [19, 15]]),
  close: [...seg([6, 6], [18, 18], 2.6), ...seg([18, 6], [6, 18], 2.6)],
  ellipsis: [...dot(4.5, 12, 2.3), ...dot(12, 12, 2.3), ...dot(19.5, 12, 2.3)],
  "git-branch": [...dot(7, 5, 2.9), ...dot(7, 19, 2.9), ...dot(17, 6, 2.9), ...seg([7, 7], [7, 17]), ...line(bez([17, 8.3], [17, 14.5], [7.2, 15]))],
  "git-commit": [...dot(12, 12, 4.8), ...seg([2.5, 12], [7, 12], 2.4), ...seg([17, 12], [21.5, 12], 2.4)],
  sync: [...arrowArc(12, 12, 7.5, 200, 330), ...arrowArc(12, 12, 7.5, 20, 150)],
  refresh: arrowArc(12, 12, 7.5, -50, 230),
  "debug-restart": [...arrowArc(12, 12, 7.5, -50, 230), ...dot(12, 12, 2.6)],
  error: [...dot(12, 12, 9.5), hole(plusPts(12, 12, 5, 1.25, 45))],
  warning: [...tri([[12, 2.5], [22, 20.5], [2, 20.5]]), holeBox(10.9, 8.4, 2.2, 6.8, 1.1), holeDot(12, 17.3, 1.35)],
  info: [...dot(12, 12, 9.5), holeDot(12, 7.4, 1.5), holeBox(10.8, 10.5, 2.4, 7.6, 1.2)],
  bell: [...tri([[3.5, 18], [5.5, 15.5], ...arcPts(12, 10.5, 6.5, 180, 360), [18.5, 15.5], [20.5, 18]]), ...fill(arcPts(12, 19.3, 2.7, 0, 180)), ...dot(12, 3.4, 1.6)],
  check: line([[4.5, 12.5], [9.5, 17.5], [19.5, 7]], { w: 2.6 }),
  add: [...seg([12, 4.5], [12, 19.5], 2.6), ...seg([4.5, 12], [19.5, 12], 2.6)],
  "collapse-all": [...solidBox(7, 7, 14.5, 14.5, 2), holeBox(10, 13.15, 8.5, 2.2, 1.1), ...line([[3, 17], [3, 3], [17, 3]], { w: 2 })],
  "new-file": [...doc(4.5, 19.5, 2, 22), hole(plusPts(12, 15.2, 4, 1.1))],
  "new-folder": [...tri([[2, 4.5], [9, 4.5], [11, 7], [22, 7], [22, 20], [2, 20]]), hole(plusPts(12, 13.6, 3.8, 1.1))],
  "split-horizontal": [...solidBox(2.5, 4, 8.5, 16, 2), ...solidBox(13, 4, 8.5, 16, 2)],
  terminal: [...solidBox(2, 3.5, 20, 17, 2.5), hole(strokePoly([[6.5, 8.5], [10, 12], [6.5, 15.5]], 2.2)), holeBox(12, 14.4, 6, 2.2, 1.1)],
  "debug-start": tri([[6.5, 4], [20, 12], [6.5, 20]]),
  "debug-stop": solidBox(5.5, 5.5, 13, 13, 2.5),
  "debug-pause": [...solidBox(6, 4.5, 4.5, 15, 1.3), ...solidBox(13.5, 4.5, 4.5, 15, 1.3)],
  "debug-continue": [...solidBox(4, 4.5, 3.5, 15, 1.2), ...tri([[10.5, 4.5], [20.5, 12], [10.5, 19.5]])],
  "debug-step-over": [...arrowArc(12, 12.5, 7, 190, 345), ...dot(12, 18.8, 2.6)],
  "debug-step-into": [...seg([12, 2.5], [12, 9.5]), ...head(12, 14, 90), ...dot(12, 19.6, 2.5)],
  "debug-step-out": [...seg([12, 15], [12, 8.5]), ...head(12, 3, -90), ...dot(12, 19.6, 2.5)],
  remote: [...line([[3.5, 6.5], [9, 12], [3.5, 17.5]], { w: 2.6 }), ...line([[20.5, 6.5], [15, 12], [20.5, 17.5]], { w: 2.6 })],
  "symbol-method": [
    ...fill([[12, 2.5], [20.5, 7.2], [12, 11.9], [3.5, 7.2]]),
    ...fill([[3.5, 8.6], [11.3, 13], [11.3, 21.6], [3.5, 17.1]]),
    ...fill([[20.5, 8.6], [12.7, 13], [12.7, 21.6], [20.5, 17.1]]),
  ],
  "symbol-class": [...solidBox(2.5, 3.5, 8, 8, 1.6), ...solidBox(13.5, 12.5, 8, 8, 1.6), ...line([[10.5, 7.5], [17.5, 7.5], [17.5, 12.5]])],
  "symbol-variable": [...line([[6.5, 5], [3.5, 5], [3.5, 19], [6.5, 19]], { w: 2.2 }), ...line([[17.5, 5], [20.5, 5], [20.5, 19], [17.5, 19]], { w: 2.2 }), ...solidBox(8, 8.5, 8, 7, 1.5)],
  "symbol-field": tri([[12, 2.5], [21.5, 12], [12, 21.5], [2.5, 12]]),
};

const f = (n) => Math.round(n * 100) / 100;
const toSvg = (contours) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${contours.map((c) => "M" + c.map(([x, y]) => `${f(x)} ${f(y)}`).join("L") + "Z").join("")}"/></svg>`;

// Stable order: append new icons at the end so existing codepoints never move.
const ORDER = Object.keys(icons);
const CODEPOINT_START = 0xe001;
const codepoints = Object.fromEntries(
  ORDER.map((id, i) => [id, CODEPOINT_START + i]),
);
const svgs = Object.fromEntries(
  ORDER.map((id) => [`${id}.svg`, toSvg(icons[id])]),
);

module.exports = { svgs, codepoints };
