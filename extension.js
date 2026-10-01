// Runtime: applies onion.* settings by regenerating theme files in place, and switches Day/Night.
const vscode = require('vscode');
const path = require('path');
const { generate } = require('./src/generate');
const { palettes, HUES } = require('./src/palettes');

const G = vscode.ConfigurationTarget.Global;
const cfg = (section) => vscode.workspace.getConfiguration(section);
const STYLE_KEYS = ['accent', 'bordered', 'contrastSidebar', 'italic', 'folderColor'];

const parseTheme = (label) => {
  const m = /^Onion (\w+) (Night|Day)$/.exec(label || '');
  return m && palettes[m[1]] ? { palette: m[1], mode: m[2] } : null;
};
const themeName = (palette, mode) => `Onion ${palette} ${mode}`;

// Active Onion theme, or null. With OS auto-detect on, workbench.colorTheme is ignored by VS Code.
function current() {
  const wb = cfg('workbench');
  if (cfg('window').get('autoDetectColorScheme')) {
    const k = vscode.window.activeColorTheme.kind;
    const light = k === vscode.ColorThemeKind.Light || k === vscode.ColorThemeKind.HighContrastLight;
    return parseTheme(wb.get(light ? 'preferredLightColorTheme' : 'preferredDarkColorTheme'));
  }
  return parseTheme(wb.get('colorTheme'));
}

function readOpts() {
  const c = cfg('onion');
  const opts = Object.fromEntries(STYLE_KEYS.map((k) => [k, c.get(k)]));
  return { ...opts, iconPalette: current()?.palette || 'Mocha' };
}

async function apply(ctx, prompt) {
  let changed;
  try {
    ({ changed } = generate(path.join(ctx.extensionPath, 'themes'), readOpts()));
  } catch (e) {
    vscode.window.showErrorMessage(`Onion: could not update theme files (${e.message}).`);
    return;
  }
  if (!changed.length || !prompt) return;
  const pick = await vscode.window.showInformationMessage('Onion theme updated. Reload to apply.', 'Reload Window');
  if (pick) vscode.commands.executeCommand('workbench.action.reloadWindow');
}

// ── day / night ──────────────────────────────────────────────
const minutes = (hhmm) => { const [h, m] = String(hhmm).split(':').map(Number); return h * 60 + (m || 0); };
function isDayNow() {
  const c = cfg('onion');
  const d = new Date();
  const now = d.getHours() * 60 + d.getMinutes();
  const day = minutes(c.get('dayStart')), night = minutes(c.get('nightStart'));
  return day < night ? now >= day && now < night : !(now >= night && now < day);
}

async function tick() {
  if (cfg('onion').get('dayNight') !== 'schedule') return;
  const cur = current();
  if (!cur) return; // only manage Onion themes
  const want = isDayNow() ? 'Day' : 'Night';
  if (cur.mode !== want) await cfg('workbench').update('colorTheme', themeName(cur.palette, want), G);
}

// Writes only when the value differs: each write fires onDidChangeConfiguration, which calls back here.
async function syncOsPair(palette) {
  for (const [key, mode] of [['preferredDarkColorTheme', 'Night'], ['preferredLightColorTheme', 'Day']]) {
    if (cfg('workbench').get(key) !== themeName(palette, mode)) await cfg('workbench').update(key, themeName(palette, mode), G);
  }
}

async function onDayNightChanged() {
  const mode = cfg('onion').get('dayNight');
  const cur = current() || { palette: 'Mocha', mode: 'Night' };
  const autoDetect = cfg('window').get('autoDetectColorScheme');
  if (mode === 'os') {
    await syncOsPair(cur.palette);
    await cfg('window').update('autoDetectColorScheme', true, G);
  } else if (autoDetect && parseTheme(cfg('workbench').get('preferredDarkColorTheme'))) {
    // leaving OS mode: pin the variant that is showing right now
    await cfg('window').update('autoDetectColorScheme', false, G);
    await cfg('workbench').update('colorTheme', themeName(cur.palette, cur.mode), G);
  }
  await tick();
}

// ── commands ─────────────────────────────────────────────────
async function selectAccent() {
  const cur = current() || { palette: 'Mocha', mode: 'Night' };
  const v = palettes[cur.palette][cur.mode === 'Day' ? 'day' : 'night'];
  const active = cfg('onion').get('accent');
  const items = [
    { label: 'default', description: `${cur.palette} default (${v.accent || palettes[cur.palette].accent})` },
    ...HUES.map((h) => ({ label: h, description: v.hues[h] })),
    { label: 'Custom hex…' },
  ].map((i) => ({ ...i, picked: i.label === active }));
  const pick = await vscode.window.showQuickPick(items, { placeHolder: `Onion accent (current: ${active})` });
  if (!pick) return;
  let value = pick.label;
  if (value === 'Custom hex…') {
    value = await vscode.window.showInputBox({ prompt: 'Accent color as #rrggbb', validateInput: (s) => (/^#[0-9a-f]{6}$/i.test(s) ? null : 'Use #rrggbb') });
    if (!value) return;
  }
  await cfg('onion').update('accent', value, G);
}

async function toggleDayNight() {
  const cur = current() || { palette: 'Mocha', mode: 'Day' };
  const want = cur.mode === 'Day' ? 'Night' : 'Day';
  if (cfg('onion').get('dayNight') !== 'off') {
    await cfg('onion').update('dayNight', 'off', G); // a manual toggle would be undone by auto-switching
    vscode.window.showInformationMessage('Onion: automatic day/night switching turned off.');
  }
  if (cfg('window').get('autoDetectColorScheme')) await cfg('window').update('autoDetectColorScheme', false, G);
  await cfg('workbench').update('colorTheme', themeName(cur.palette, want), G);
}

async function reset() {
  const c = cfg('onion');
  for (const key of [...STYLE_KEYS, 'dayNight', 'dayStart', 'nightStart']) await c.update(key, undefined, G);
}

function activate(ctx) {
  apply(ctx, true); // first run after install / settings sync
  tick();
  const timer = setInterval(tick, 60 * 1000);

  ctx.subscriptions.push(
    { dispose: () => clearInterval(timer) },
    vscode.commands.registerCommand('onion.selectAccent', selectAccent),
    vscode.commands.registerCommand('onion.toggleDayNight', toggleDayNight),
    vscode.commands.registerCommand('onion.reset', reset),
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (STYLE_KEYS.some((k) => e.affectsConfiguration(`onion.${k}`))) return apply(ctx, true);
      if (e.affectsConfiguration('onion.dayNight')) return onDayNightChanged();
      if (e.affectsConfiguration('onion.dayStart') || e.affectsConfiguration('onion.nightStart')) return tick();
      // OS mode: keep the dark/light pair on the same palette when the user picks a new one
      if (cfg('onion').get('dayNight') === 'os') {
        for (const key of ['preferredDarkColorTheme', 'preferredLightColorTheme']) {
          const t = e.affectsConfiguration(`workbench.${key}`) && parseTheme(cfg('workbench').get(key));
          if (t) await syncOsPair(t.palette);
        }
      }
      // palette switch recolors folder icons; applies on next reload, no prompt
      if (e.affectsConfiguration('workbench.colorTheme') || e.affectsConfiguration('workbench.preferredDarkColorTheme')) apply(ctx, false);
    }),
  );
}

module.exports = { activate, deactivate() {} };
