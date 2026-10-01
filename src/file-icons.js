// File icon themes in two styles that share one set of file/folder rules:
//   classic: rounded badges, document shapes, plain folders
//   bulb:    every file is an onion bulb with a label or mini glyph; folders carry a sliced-onion ring
// Folder colors follow the accent (or stay neutral); file colors are fixed mid-tones that read on
// both Night and Day backgrounds.

const C = {
  js: "#e8c547",
  ts: "#4f8fdc",
  py: "#4b8bbe",
  pyY: "#f2c94c",
  react: "#4cc3e0",
  json: "#d9a93a",
  html: "#e5704b",
  css: "#4f8fdc",
  scss: "#d16b9b",
  md: "#7f8fa6",
  yaml: "#c9605a",
  toml: "#a98b6a",
  go: "#3fb6c9",
  rs: "#d9825b",
  java: "#d6584f",
  c: "#6b8fd6",
  sh: "#6fbf73",
  sql: "#d0a24c",
  php: "#8892bf",
  rb: "#cc4b4b",
  vue: "#42b883",
  svelte: "#ef5a2c",
  img: "#58b48f",
  lock: "#c9a248",
  env: "#e0b84a",
  git: "#e5704b",
  docker: "#3c9ad6",
  npm: "#cb3837",
  info: "#4f8fdc",
  license: "#d9b44a",
  config: "#8a93a6",
  test: "#6fbf73",
  text: "#8a93a6",
  file: "#8a93a6",
  xml: "#e5904b",
  nb: "#e8873a",
};
const DARK_TEXT = "#1b1b24";
const WHITE = "#ffffff";

const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${inner}</svg>`;
const font = `font-family="Inter,'Segoe UI',system-ui,sans-serif" font-weight="800" text-anchor="middle"`;

// ── onion bulb: pointed tip, layer lines, root tuft ──────────────
const BULB = "M8 .8C8.3 2.2 8.9 3.1 9.9 3.8C12.6 4.6 14.2 6.8 14.2 9.4C14.2 12.6 11.5 14.6 8 14.6C4.5 14.6 1.8 12.6 1.8 9.4C1.8 6.8 3.4 4.6 6.1 3.8C7.1 3.1 7.7 2.2 8 .8Z";
const LAYERS = "M7.2 4.1C5 6 4.6 11 6.4 14.4M8.8 4.1C11 6 11.4 11 9.6 14.4";
const ROOTS = "M7.1 14.5l-.5 1.1M8 14.6v1.2M8.9 14.5l.5 1.1";
function onion(color, content = "", { outline = false } = {}) {
  const body = outline
    ? `<path d="${BULB}" fill="none" stroke="${color}" stroke-width="1.2" stroke-linejoin="round"/><path d="${LAYERS}" fill="none" stroke="${color}" stroke-opacity=".4" stroke-width=".9" stroke-linecap="round"/>`
    : `<path d="${BULB}" fill="${color}"/><path d="${LAYERS}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".9" stroke-linecap="round"/>`;
  return svg(`${body}<path d="${ROOTS}" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>${content}`);
}
// text centered in the bulb's wide lower half
const label = (text, ink, size = text.length > 2 ? 4.3 : 5.6) =>
  `<text x="8" y="11.9" font-size="${size}" fill="${ink}" ${font}>${text}</text>`;
// 16-grid glyph shrunk into the bulb body
const mini = (inner) => `<g transform="translate(4.6 6.2) scale(.425)">${inner}</g>`;

// mini glyphs, drawn on a 16 grid
const g = {
  lines: (k) => `<path d="M3 4.5h10M3 8h10M3 11.5h6.5" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`,
  atom: (k) => `<g fill="none" stroke="${k}" stroke-width="1.6"><ellipse cx="8" cy="8" rx="7" ry="2.7"/><ellipse cx="8" cy="8" rx="7" ry="2.7" transform="rotate(60 8 8)"/><ellipse cx="8" cy="8" rx="7" ry="2.7" transform="rotate(120 8 8)"/></g><circle cx="8" cy="8" r="1.6" fill="${k}"/>`,
  gear: (k) => `<path fill="${k}" fill-rule="evenodd" d="M7 1h2l.35 1.8 1.2.5 1.5-1.05 1.4 1.4-1.05 1.5.5 1.2L15 7v2l-1.8.35-.5 1.2 1.05 1.5-1.4 1.4-1.5-1.05-1.2.5L9 15H7l-.35-1.8-1.2-.5-1.5 1.05-1.4-1.4 1.05-1.5-.5-1.2L1 9V7l1.8-.35.5-1.2-1.05-1.5 1.4-1.4 1.5 1.05 1.2-.5zM8 5.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z"/>`,
  check: (k) => `<path d="M2.5 8.5l3.6 3.6L13.5 4" fill="none" stroke="${k}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`,
  term: (k) => `<path d="M2.5 4l4 4-4 4M8.5 12.5h5" fill="none" stroke="${k}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`,
  image: (k) => `<circle cx="5" cy="4.5" r="2" fill="${k}"/><path fill="${k}" d="M1 14 6 7.5l3 3.5 2-2.3 4 5.3z"/>`,
  lock: (k) => `<rect x="2.5" y="7" width="11" height="8" rx="1.8" fill="${k}"/><path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="${k}" stroke-width="2.2"/>`,
  key: (k) => `<circle cx="5" cy="8" r="3.4" fill="none" stroke="${k}" stroke-width="2.2"/><path d="M8.4 8h6.5M13 8v3" stroke="${k}" stroke-width="2.2" stroke-linecap="round"/>`,
  branch: (k) => `<g fill="none" stroke="${k}" stroke-width="2"><circle cx="4" cy="3" r="2"/><circle cx="4" cy="13" r="2"/><circle cx="12" cy="4" r="2"/><path d="M4 5v6M12 6c0 4-8 3-8 5"/></g>`,
  boxes: (k) => `<g fill="${k}"><rect x="1" y="5" width="4" height="3.5" rx=".6"/><rect x="6" y="5" width="4" height="3.5" rx=".6"/><rect x="11" y="5" width="4" height="3.5" rx=".6"/><rect x="6" y="0.5" width="4" height="3.5" rx=".6"/><rect x="1" y="9.5" width="14" height="5" rx="1.5"/></g>`,
  info: (k) => `<rect x="6.7" y="6.5" width="2.6" height="8.5" rx="1.3" fill="${k}"/><circle cx="8" cy="2.8" r="1.8" fill="${k}"/>`,
  db: (k) => `<g fill="none" stroke="${k}" stroke-width="2"><ellipse cx="8" cy="3.5" rx="6" ry="2.3"/><path d="M2 3.5v9c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3v-9M2 8c0 1.3 2.7 2.3 6 2.3s6-1 6-2.3"/></g>`,
};

const bulbIcons = {
  _file: onion(C.file, "", { outline: true }),
  text: onion(C.text, mini(g.lines(C.text)), { outline: true }),
  js: onion(C.js, label("JS", DARK_TEXT)),
  ts: onion(C.ts, label("TS", WHITE)),
  dts: onion(C.ts, label("D", C.ts), { outline: true }),
  jsx: onion(C.react, mini(g.atom(DARK_TEXT))),
  tsx: onion(C.ts, mini(g.atom(WHITE))),
  py: onion(C.py, label("PY", C.pyY)),
  pyi: onion(C.py, label("PYI", C.py), { outline: true }),
  pyinit: onion(C.config, label("PY", C.config), { outline: true }),
  ipynb: onion(C.nb, label("NB", DARK_TEXT)),
  requirements: onion(C.py, mini(g.lines(C.pyY)), { outline: true }),
  pyproject: onion(C.py, mini(g.gear(C.pyY))),
  pytest: onion(C.py, mini(g.check(C.pyY))),
  jstest: onion(C.js, mini(g.check(DARK_TEXT))),
  tstest: onion(C.ts, mini(g.check(WHITE))),
  json: onion(C.json, label("{}", DARK_TEXT)),
  html: onion(C.html, label("&lt;/&gt;", DARK_TEXT, 4.4)),
  css: onion(C.css, label("#", WHITE, 6.4)),
  scss: onion(C.scss, label("#", WHITE, 6.4)),
  md: onion(C.md, label("M↓", C.md, 4.8), { outline: true }),
  yaml: onion(C.yaml, label("YML", WHITE)),
  toml: onion(C.toml, label("TML", WHITE)),
  xml: onion(C.xml, label("&lt;&gt;", DARK_TEXT, 4.8)),
  go: onion(C.go, label("GO", DARK_TEXT)),
  rs: onion(C.rs, label("RS", DARK_TEXT)),
  java: onion(C.java, label("J", WHITE)),
  c: onion(C.c, label("C", WHITE)),
  cpp: onion(C.c, label("C++", WHITE)),
  h: onion(C.c, label("H", C.c), { outline: true }),
  sh: onion(C.sh, mini(g.term(DARK_TEXT))),
  sql: onion(C.sql, mini(g.db(DARK_TEXT))),
  php: onion(C.php, label("php", WHITE)),
  rb: onion(C.rb, label("RB", WHITE)),
  vue: onion(C.vue, label("V", DARK_TEXT)),
  svelte: onion(C.svelte, label("S", WHITE)),
  image: onion(C.img, mini(g.image(DARK_TEXT))),
  svg: onion(C.img, label("SVG", C.img), { outline: true }),
  lock: onion(C.lock, mini(g.lock(DARK_TEXT))),
  env: onion(C.env, mini(g.key(DARK_TEXT))),
  git: onion(C.git, mini(g.branch(WHITE))),
  docker: onion(C.docker, mini(g.boxes(WHITE))),
  npm: onion(C.npm, label("npm", WHITE)),
  readme: onion(C.info, mini(g.info(WHITE))),
  license: onion(C.license, label("©", DARK_TEXT, 6.4)),
  config: onion(C.config, mini(g.gear(DARK_TEXT))),
  tsconfig: onion(C.ts, mini(g.gear(WHITE))),
};

// ── classic style: rounded badges, document shapes, plain folders ──
const badge = (fill, text, ink = DARK_TEXT, size = text.length > 2 ? 5.6 : 7) =>
  svg(`<rect x="1.5" y="1.5" width="13" height="13" rx="3" fill="${fill}"/><text x="8" y="${size > 6 ? 11 : 10.3}" font-size="${size}" fill="${ink}" ${font}>${text}</text>`);
const outlineBadge = (stroke, text) =>
  svg(`<rect x="2" y="2" width="12" height="12" rx="2.6" fill="none" stroke="${stroke}" stroke-width="1.3"/><text x="8" y="10.6" font-size="${text.length > 2 ? 5.2 : 6.4}" fill="${stroke}" ${font}>${text}</text>`);
const doc = (stroke, inner = "") =>
  svg(`<path d="M4 1.75h5.2L12.5 5v8.25a1 1 0 0 1-1 1h-7.5a1 1 0 0 1-1-1V2.75a1 1 0 0 1 1-1z" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"/><path d="M9 1.9V5.2h3.3" fill="none" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"/>${inner}`);
const glyph = (text, fill, size = 9) => svg(`<text x="8" y="${8 + size * 0.36}" font-size="${size}" fill="${fill}" ${font}>${text}</text>`);
// a 16-grid mini glyph at full size
const full = (inner) => svg(inner);
const flask = (k) =>
  svg(`<path fill="none" stroke="${k}" stroke-width="1.3" stroke-linejoin="round" d="M6 1.75h4M6.6 1.9v4.3L2.9 12.6a1.1 1.1 0 0 0 .95 1.65h8.3a1.1 1.1 0 0 0 .95-1.65L9.4 6.2V1.9"/><path fill="${k}" d="M4.7 10h6.6l1.4 2.5a.6.6 0 0 1-.52.9H3.82a.6.6 0 0 1-.52-.9z"/>`);

const classicIcons = {
  _file: doc(C.file),
  text: doc(C.text, `<path d="M5.5 8h5M5.5 10.5h5M5.5 13h3" stroke="${C.text}" stroke-width="1.2" stroke-linecap="round"/>`),
  js: badge(C.js, "JS"),
  ts: badge(C.ts, "TS", WHITE),
  dts: outlineBadge(C.ts, "D"),
  jsx: full(g.atom(C.react)),
  tsx: full(g.atom(C.ts)),
  py: svg(`<path fill="${C.py}" d="M7.9 1.2c-3.3 0-3.1 1.4-3.1 1.4v1.5h3.2v.5H3.6S1.5 4.4 1.5 7.7s1.8 3.2 1.8 3.2h1.1V9.3s-.1-1.8 1.8-1.8h3.1s1.7 0 1.7-1.7V2.9s.3-1.7-3.1-1.7zM6.2 2.2a.55.55 0 1 1 0 1.1.55.55 0 0 1 0-1.1z"/><path fill="${C.pyY}" d="M8.1 14.8c3.3 0 3.1-1.4 3.1-1.4v-1.5H8v-.5h4.4s2.1.2 2.1-3.1-1.8-3.2-1.8-3.2h-1.1v1.6s.1 1.8-1.8 1.8H6.7s-1.7 0-1.7 1.7v2.9s-.3 1.7 3.1 1.7zm1.7-1a.55.55 0 1 1 0-1.1.55.55 0 0 1 0 1.1z"/>`),
  pyi: outlineBadge(C.py, "PYI"),
  pyinit: outlineBadge(C.config, "PY"),
  ipynb: svg(`<rect x="2.5" y="1.5" width="11" height="13" rx="2" fill="none" stroke="${C.nb}" stroke-width="1.3"/><path d="M5 5h6M5 8h6M5 11h4" stroke="${C.nb}" stroke-width="1.3" stroke-linecap="round"/>`),
  requirements: doc(C.py, `<path d="M5.5 8h5M5.5 10.5h5M5.5 13h3" stroke="${C.pyY}" stroke-width="1.2" stroke-linecap="round"/>`),
  pyproject: full(g.gear(C.py)),
  pytest: flask(C.py),
  jstest: flask(C.js),
  tstest: flask(C.ts),
  json: glyph("{ }", C.json, 8.5),
  html: glyph("&lt;/&gt;", C.html, 7.5),
  css: glyph("#", C.css, 12),
  scss: glyph("#", C.scss, 12),
  md: outlineBadge(C.md, "M↓"),
  yaml: badge(C.yaml, "YML", WHITE),
  toml: badge(C.toml, "TML", WHITE),
  xml: glyph("&lt;&gt;", C.xml, 8.5),
  go: badge(C.go, "GO"),
  rs: badge(C.rs, "RS"),
  java: badge(C.java, "J", WHITE),
  c: badge(C.c, "C", WHITE),
  cpp: badge(C.c, "C++", WHITE),
  h: outlineBadge(C.c, "H"),
  sh: svg(`<rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="${C.sh}" stroke-width="1.3"/><path d="M4.5 6l2 2-2 2M8 10.5h3.5" fill="none" stroke="${C.sh}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>`),
  sql: full(g.db(C.sql)),
  php: badge(C.php, "php", WHITE),
  rb: svg(`<path fill="${C.rb}" d="M4.2 2h7.6L15 6l-7 8.5L1 6z"/><path fill="#ffffff" opacity=".35" d="M4.2 2 8 6H1zM11.8 2 8 6h7z"/>`),
  vue: svg(`<path fill="${C.vue}" d="M1 2.5h3l4 6.8 4-6.8h3L8 14z"/><path fill="#35495e" d="M4.2 2.5h2.2L8 5.3l1.6-2.8h2.2L8 9z"/>`),
  svelte: badge(C.svelte, "S", WHITE),
  image: svg(`<rect x="1.5" y="2.5" width="13" height="11" rx="2" fill="none" stroke="${C.img}" stroke-width="1.3"/><circle cx="5.5" cy="6" r="1.3" fill="${C.img}"/><path fill="${C.img}" d="M2.5 12.5 6.5 8l2.5 2.6L11 8.5l3 4z"/>`),
  svg: svg(`<path fill="none" stroke="${C.img}" stroke-width="1.3" d="M8 1.8 13.4 5v6L8 14.2 2.6 11V5z"/><circle cx="8" cy="8" r="2" fill="${C.img}"/>`),
  lock: full(g.lock(C.lock)),
  env: full(g.key(C.env)),
  git: svg(`<path fill="${C.git}" d="M15.1 7.3 8.7.9a1 1 0 0 0-1.4 0L5.9 2.3l1.8 1.8a1.2 1.2 0 0 1 1.5 1.5l1.7 1.7a1.2 1.2 0 1 1-.7.7L8.6 6.4v4.2a1.2 1.2 0 1 1-1-.03V6.3a1.2 1.2 0 0 1-.6-1.6L5.2 2.9.9 7.3a1 1 0 0 0 0 1.4l6.4 6.4a1 1 0 0 0 1.4 0l6.4-6.4a1 1 0 0 0 0-1.4z"/>`),
  docker: full(g.boxes(C.docker)),
  npm: svg(`<path fill="${C.npm}" d="M8 1 14.5 4.6v6.8L8 15 1.5 11.4V4.6z"/><path fill="#ffffff" fill-opacity=".35" d="M8 8.2v5.4L3 10.8V5.4zM8 8.2 13 5.4 8 2.6 3 5.4z"/>`),
  readme: svg(`<circle cx="8" cy="8" r="6.5" fill="${C.info}"/><rect x="7.2" y="7" width="1.6" height="4.6" rx=".8" fill="#ffffff"/><circle cx="8" cy="4.9" r="1" fill="#ffffff"/>`),
  license: svg(`<circle cx="8" cy="6.5" r="4.6" fill="${C.license}"/><path fill="${C.license}" d="M5.3 10.3 4.5 15 8 13.4 11.5 15l-.8-4.7z"/><circle cx="8" cy="6.5" r="2.2" fill="none" stroke="${DARK_TEXT}" stroke-width="1"/>`),
  config: full(g.gear(C.config)),
  tsconfig: full(g.gear(C.ts)),
};

const FILE_EXTENSIONS = {
  js: ["js", "mjs", "cjs"],
  ts: ["ts", "mts", "cts"],
  dts: ["d.ts", "d.mts", "d.cts"],
  jsx: ["jsx"],
  tsx: ["tsx"],
  jstest: ["test.js", "spec.js", "test.mjs", "test.jsx", "spec.jsx"],
  tstest: ["test.ts", "spec.ts", "test.tsx", "spec.tsx"],
  py: ["py", "pyw"],
  pyi: ["pyi"],
  ipynb: ["ipynb"],
  json: ["json", "jsonc", "json5"],
  html: ["html", "htm"],
  css: ["css"],
  scss: ["scss", "sass", "less"],
  md: ["md", "mdx", "markdown"],
  yaml: ["yml", "yaml"],
  toml: ["toml"],
  xml: ["xml", "plist"],
  go: ["go"],
  rs: ["rs"],
  java: ["java", "kt"],
  c: ["c"],
  cpp: ["cpp", "cc", "cxx", "hpp"],
  h: ["h"],
  sh: ["sh", "bash", "zsh", "fish"],
  sql: ["sql", "db", "sqlite"],
  php: ["php"],
  rb: ["rb"],
  vue: ["vue"],
  svelte: ["svelte"],
  image: ["png", "jpg", "jpeg", "gif", "webp", "avif", "ico", "bmp"],
  svg: ["svg"],
  lock: ["lock"],
  env: ["env"],
  text: ["txt", "log"],
};
const FILE_NAMES = {
  npm: ["package.json"],
  lock: [
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",
    "poetry.lock",
    "uv.lock",
    "bun.lockb",
  ],
  tsconfig: [
    "tsconfig.json",
    "jsconfig.json",
    "tsconfig.base.json",
    "tsconfig.build.json",
  ],
  requirements: [
    "requirements.txt",
    "requirements-dev.txt",
    "dev-requirements.txt",
  ],
  pyproject: [
    "pyproject.toml",
    "setup.py",
    "setup.cfg",
    "tox.ini",
    ".python-version",
  ],
  pytest: ["conftest.py", "pytest.ini"],
  pyinit: ["__init__.py"],
  git: [".gitignore", ".gitattributes", ".gitmodules", ".gitkeep"],
  docker: [
    "dockerfile",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "compose.yaml",
    ".dockerignore",
  ],
  env: [
    ".env",
    ".env.local",
    ".env.example",
    ".env.development",
    ".env.production",
  ],
  readme: ["readme.md", "README.md", "README", "readme.txt"],
  license: ["LICENSE", "license", "LICENSE.md", "LICENSE.txt"],
  config: [
    ".editorconfig",
    ".prettierrc",
    ".prettierrc.json",
    ".eslintrc",
    ".eslintrc.json",
    ".eslintrc.js",
    "eslint.config.js",
    "eslint.config.mjs",
    "vite.config.ts",
    "vite.config.js",
    "vitest.config.ts",
    "webpack.config.js",
    "next.config.js",
    "next.config.mjs",
    "next.config.ts",
    ".npmrc",
    ".nvmrc",
    "ruff.toml",
    ".flake8",
    "mypy.ini",
  ],
};
const LANGUAGE_IDS = {
  javascript: "js",
  typescript: "ts",
  javascriptreact: "jsx",
  typescriptreact: "tsx",
  python: "py",
  json: "json",
  jsonc: "json",
  html: "html",
  css: "css",
  scss: "scss",
  less: "scss",
  markdown: "md",
  yaml: "yaml",
  toml: "toml",
  xml: "xml",
  go: "go",
  rust: "rs",
  java: "java",
  c: "c",
  cpp: "cpp",
  shellscript: "sh",
  sql: "sql",
  php: "php",
  ruby: "rb",
  vue: "vue",
  svelte: "svelte",
  dockerfile: "docker",
  ignore: "git",
  plaintext: "text",
  jupyter: "ipynb",
};

const SPECIAL_FOLDERS = {
  src: { names: ["src", "lib", "app"], color: null }, // null -> accent
  node: { names: ["node_modules"], color: "#6fbf73" },
  git: { names: [".git", ".github"], color: "#e5704b" },
  vscode: { names: [".vscode"], color: "#4f8fdc" },
  test: { names: ["test", "tests", "__tests__", "spec"], color: "#d9b44a" },
  dist: { names: ["dist", "build", "out", ".next"], color: "#8a93a6" },
  venv: { names: ["venv", ".venv", "env"], color: "#4b8bbe" },
  cache: {
    names: ["__pycache__", ".pytest_cache", ".mypy_cache", ".ruff_cache"],
    color: "#6c7086",
  },
};

const FOLDER = "M1.5 3.5a1 1 0 0 1 1-1h3.6l1.6 1.6h5.8a1 1 0 0 1 1 1v7.4a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z";
const FOLDER_BACK = "M1.5 3.5a1 1 0 0 1 1-1h3.6l1.6 1.6h5.3a1 1 0 0 1 1 1V7H4.2a1 1 0 0 0-.95.68L1.5 12.5z";
const FOLDER_FRONT = "M3.3 7.7A1 1 0 0 1 4.25 7h10.3a.6.6 0 0 1 .57.79l-1.6 5a1 1 0 0 1-.95.71H1.9z";
const folderClosed = (c, extra = "") => svg(`<path fill="${c}" d="${FOLDER}"/>${extra}`);
const folderOpen = (c, extra = "") => svg(`<path fill="${c}" opacity=".55" d="${FOLDER_BACK}"/><path fill="${c}" d="${FOLDER_FRONT}"/>${extra}`);
// bulb style: folders carry a sliced-onion ring on the front face
const SLICE = `<path d="M4.6 13.5a3.4 3.4 0 0 1 6.8 0M6.4 13.5a1.6 1.6 0 0 1 3.2 0" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="1.1"/>`;

// Each style: file icons + folder/root builders. Theme JSON wiring is shared.
const STYLES = {
  classic: {
    icons: classicIcons,
    folder: (c) => folderClosed(c),
    folderOpen: (c) => folderOpen(c),
    root: (c) => svg(`<path fill="none" stroke="${c}" stroke-width="1.3" d="M2.15 3.5a.85.85 0 0 1 .85-.85h3l1.6 1.6h5.4a.85.85 0 0 1 .85.85v7.4a.85.85 0 0 1-.85.85H3a.85.85 0 0 1-.85-.85z"/><circle cx="8" cy="8.7" r="1.6" fill="${c}"/>`),
    rootOpen: (c) => svg(`<path fill="none" stroke="${c}" stroke-width="1.3" stroke-linejoin="round" d="M2.15 12V3.5a.85.85 0 0 1 .85-.85h3l1.6 1.6h5V7M2.15 12.4 4 7.65h10.6l-1.7 5.2H2.3z"/>`),
  },
  bulb: {
    icons: bulbIcons,
    folder: (c) => folderClosed(c, SLICE),
    folderOpen: (c) => folderOpen(c, `<g transform="translate(.6 0)">${SLICE}</g>`),
    // workspace root = a whole onion
    root: (c) => onion(c, "", { outline: true }),
    rootOpen: (c) => onion(c, `<path d="${BULB}" fill="${c}" fill-opacity=".3"/>`, { outline: true }),
  },
};

// night/day: resolved variants (for accent + muted); style: key of STYLES.
// returns { json, files: { '<style>/<name>.svg': content } }
function buildFileIcons(night, day, folderColor = "accent", style = "bulb") {
  const S = STYLES[style];
  const files = {};
  const defs = {};
  const add = (id, content) => {
    files[`${style}/${id}.svg`] = content;
    defs[id] = { iconPath: `./icons/${style}/${id}.svg` };
  };

  for (const [id, content] of Object.entries(S.icons)) add(id, content);

  const json = {
    iconDefinitions: defs,
    file: "_file",
    fileExtensions: {},
    fileNames: {},
    languageIds: {},
    folderNames: {},
    folderNamesExpanded: {},
    hidesExplorerArrows: false,
    light: { folderNames: {}, folderNamesExpanded: {} },
  };
  for (const [id, exts] of Object.entries(FILE_EXTENSIONS))
    for (const e of exts) json.fileExtensions[e] = id;
  for (const [id, names] of Object.entries(FILE_NAMES))
    for (const n of names) json.fileNames[n] = id;
  for (const [lang, id] of Object.entries(LANGUAGE_IDS))
    json.languageIds[lang] = id;

  for (const [suffix, t, target] of [
    ["", night, json],
    ["_light", day, json.light],
  ]) {
    const base = folderColor === "neutral" ? t.muted : t.accent;
    add(`_folder${suffix}`, S.folder(base));
    add(`_folder_open${suffix}`, S.folderOpen(base));
    add(`_root${suffix}`, S.root(base));
    add(`_root_open${suffix}`, S.rootOpen(base));
    Object.assign(target, {
      folder: `_folder${suffix}`,
      folderExpanded: `_folder_open${suffix}`,
      rootFolder: `_root${suffix}`,
      rootFolderExpanded: `_root_open${suffix}`,
    });
    for (const [key, { names, color }] of Object.entries(SPECIAL_FOLDERS)) {
      const c = color || base;
      add(`_folder_${key}${suffix}`, S.folder(c));
      add(`_folder_${key}_open${suffix}`, S.folderOpen(c));
      for (const n of names) {
        target.folderNames[n] = `_folder_${key}${suffix}`;
        target.folderNamesExpanded[n] = `_folder_${key}_open${suffix}`;
      }
    }
  }
  return { json, files };
}

module.exports = { buildFileIcons, ICON_STYLES: Object.keys(STYLES) };
