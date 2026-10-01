// Build: color themes + file icons (src/generate.js), product icon font, package.json contributes, self-checks.
const fs = require('fs');
const path = require('path');
const { generate, themeFile, iconThemeFile } = require('./src/generate');
const { ICON_STYLES } = require('./src/file-icons');
const { contrast, MIN_FG, MIN_TEXT } = require('./src/resolve');
const { palettes, HUES } = require('./src/palettes');
const product = require('./src/product-icons');

const ROOT = __dirname;
const THEMES = path.join(ROOT, 'themes');
const PRODUCT_SVG = path.join(ROOT, 'icons', 'product');
const errors = [];

async function buildProductIcons() {
  fs.rmSync(PRODUCT_SVG, { recursive: true, force: true });
  fs.mkdirSync(PRODUCT_SVG, { recursive: true });
  for (const [name, content] of Object.entries(product.svgs)) fs.writeFileSync(path.join(PRODUCT_SVG, name), content);

  const { generateFonts, FontAssetType, OtherAssetType } = require('fantasticon');
  await generateFonts({
    name: 'onion-product',
    inputDir: PRODUCT_SVG,
    outputDir: THEMES,
    fontTypes: [FontAssetType.WOFF],
    assetTypes: [OtherAssetType.JSON],
    codepoints: product.codepoints,
    normalize: true,
    fontHeight: 1000,
  });
  const map = JSON.parse(fs.readFileSync(path.join(THEMES, 'onion-product.json'), 'utf8'));
  fs.rmSync(path.join(THEMES, 'onion-product.json'));

  const iconDefinitions = {};
  for (const [id, cp] of Object.entries(product.codepoints)) {
    if (map[id] !== cp) errors.push(`product icon ${id}: codepoint ${cp} missing from font`);
    iconDefinitions[id] = { fontCharacter: '\\' + cp.toString(16) };
  }
  const theme = {
    fonts: [{ id: 'onion-product', src: [{ path: './onion-product.woff', format: 'woff' }], weight: 'normal', style: 'normal' }],
    iconDefinitions,
  };
  fs.writeFileSync(path.join(THEMES, 'onion-product-icons.json'), JSON.stringify(theme, null, 2) + '\n');
}

function writeContributes(resolved) {
  const pkgPath = path.join(ROOT, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const accents = ['default', ...HUES];
  pkg.contributes = {
    themes: resolved.map((t) => ({ label: t.name, uiTheme: t.dark ? 'vs-dark' : 'vs', path: `./themes/${themeFile(t.name)}` })),
    iconThemes: [
      { id: 'onion-files', label: 'Onion Classic Icons', path: `./themes/${iconThemeFile('classic')}` },
      { id: 'onion-files-bulb', label: 'Onion Bulb Icons', path: `./themes/${iconThemeFile('bulb')}` },
    ],
    productIconThemes: [{ id: 'onion-product', label: 'Onion Product Icons', path: './themes/onion-product-icons.json' }],
    configuration: {
      title: 'Onion Theme',
      properties: {
        'onion.accent': {
          type: 'string', default: 'default', pattern: `^(${accents.join('|')}|#[0-9a-fA-F]{6})$`,
          markdownDescription: `Accent color for cursor, selection, active tab, buttons and folders. One of ${accents.map((a) => '`' + a + '`').join(', ')}, or a \`#rrggbb\` hex.`,
        },
        'onion.bordered': { type: 'boolean', default: false, description: 'Draw 1px borders between sidebar, editor, panel and tabs.' },
        'onion.contrastSidebar': { type: 'boolean', default: false, description: 'Use the darkest background for the sidebar and panel.' },
        'onion.italic': { type: 'boolean', default: true, description: 'Italicize comments, docstrings, parameters, self/this, decorators and type parameters.' },
        'onion.folderColor': { type: 'string', enum: ['accent', 'neutral'], default: 'accent', description: 'Color folder icons with the accent or a neutral gray.' },
        'onion.dayNight': {
          type: 'string', enum: ['off', 'os', 'schedule'], default: 'off',
          enumDescriptions: ['Never switch automatically.', 'Follow the OS light/dark setting (uses window.autoDetectColorScheme).', 'Switch at onion.dayStart and onion.nightStart.'],
          description: 'Switch between the Day and Night variant of the current Onion palette automatically.',
        },
        'onion.dayStart': { type: 'string', default: '07:00', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', description: 'Day variant starts at (HH:MM, local time).' },
        'onion.nightStart': { type: 'string', default: '19:00', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$', description: 'Night variant starts at (HH:MM, local time).' },
      },
    },
    commands: [
      { command: 'onion.selectAccent', title: 'Select Accent', category: 'Onion' },
      { command: 'onion.toggleDayNight', title: 'Toggle Day/Night', category: 'Onion' },
      { command: 'onion.reset', title: 'Reset Customizations', category: 'Onion' },
    ],
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function check(resolved) {
  const hex = /^#[0-9a-f]{6}([0-9a-f]{2})?$/i;
  const walk = (v, where) => {
    if (typeof v === 'string') { if (v.startsWith('#') && !hex.test(v)) errors.push(`${where}: bad color ${v}`); }
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${where}.${k}`);
  };
  for (const t of resolved) {
    const file = path.join(THEMES, themeFile(t.name));
    walk(JSON.parse(fs.readFileSync(file, 'utf8')), t.name);
    const need = (label, fg, min) => { const c = contrast(fg, t.bg2); if (c < min) errors.push(`${t.name}: ${label} ${fg} contrast ${c.toFixed(2)} < ${min}`); };
    need('fg', t.fg, MIN_FG);
    need('comment', t.comment, MIN_TEXT);
    for (const [role, c] of Object.entries(t.roles)) need(role, c, MIN_TEXT);
    // report hues the contrast guard had to adjust, so palette authors can fix them at the source
    const raw = palettes[t.palette][t.mode];
    const moved = Object.entries(t.roles).filter(([, c]) => !Object.values(raw.hues).includes(c)).map(([r]) => r);
    if (raw.fg !== t.fg) moved.unshift('fg');
    if (raw.comment !== t.comment) moved.unshift('comment');
    if (moved.length) console.log(`  · ${t.name}: contrast-adjusted ${moved.join(', ')}`);
  }
  for (const style of ICON_STYLES) {
    const icons = JSON.parse(fs.readFileSync(path.join(THEMES, iconThemeFile(style)), 'utf8'));
    for (const [id, { iconPath }] of Object.entries(icons.iconDefinitions)) {
      if (!fs.existsSync(path.join(THEMES, iconPath))) errors.push(`${style} icon ${id}: missing ${iconPath}`);
    }
    const used = [icons, icons.light].flatMap((s) => [s.file, s.folder, s.folderExpanded, s.rootFolder, s.rootFolderExpanded,
      ...['fileExtensions', 'fileNames', 'languageIds', 'folderNames', 'folderNamesExpanded'].flatMap((k) => Object.values(s[k] || {}))]).filter(Boolean);
    for (const id of used) if (!icons.iconDefinitions[id]) errors.push(`${style} icon reference ${id} has no definition`);
  }
  if (!fs.existsSync(path.join(THEMES, 'onion-product.woff'))) errors.push('onion-product.woff missing');
}

(async () => {
  fs.rmSync(THEMES, { recursive: true, force: true });
  const { resolved } = generate(THEMES);
  console.log(`✓ ${resolved.length} color themes + ${ICON_STYLES.length} file icon themes`);
  await buildProductIcons();
  console.log(`✓ product icon font (${Object.keys(product.codepoints).length} glyphs)`);
  writeContributes(resolved);
  console.log('✓ package.json contributes');
  check(resolved);
  if (errors.length) { console.error('\n✗ ' + errors.join('\n✗ ')); process.exit(1); }
  console.log('✓ all checks passed');
})().catch((e) => { console.error(e); process.exit(1); });
