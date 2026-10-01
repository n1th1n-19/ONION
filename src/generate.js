// Shared by build.js (ships defaults) and extension.js (applies onion.* settings).
const fs = require("fs");
const path = require("path");
const { resolve, variants } = require("./resolve");
const uiColors = require("./colors");
const syntax = require("./syntax");
const { buildFileIcons, ICON_STYLES } = require("./file-icons");

const slug = (name) => name.toLowerCase().replace(/\s+/g, "-");
const themeFile = (name) => `${slug(name)}-color-theme.json`;
const iconThemeFile = (style) => `onion-file-icons-${style}.json`;

function colorTheme(t) {
  return {
    $schema: "vscode://schemas/color-theme",
    name: t.name,
    type: t.dark ? "dark" : "light",
    semanticHighlighting: true,
    colors: uiColors(t),
    ...syntax(t),
  };
}

// Writes only files whose content changed. Returns the list of changed paths.
function writeIfChanged(file, content, changed) {
  if (fs.existsSync(file) && fs.readFileSync(file, "utf8") === content) return;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
  changed.push(file);
}

// opts: resolve() opts + { iconPalette: palette whose accent colors the folders }
function generate(themesDir, opts = {}) {
  const changed = [];
  const resolved = variants().map(([name, mode]) => resolve(name, mode, opts));
  for (const t of resolved)
    writeIfChanged(
      path.join(themesDir, themeFile(t.name)),
      JSON.stringify(colorTheme(t), null, 2) + "\n",
      changed,
    );

  const iconPalette = opts.iconPalette || "Mocha";
  const night = resolve(iconPalette, "night", opts);
  const day = resolve(iconPalette, "day", opts);
  for (const style of ICON_STYLES) {
    const { json, files } = buildFileIcons(night, day, opts.folderColor, style);
    for (const [name, content] of Object.entries(files))
      writeIfChanged(path.join(themesDir, "icons", name), content, changed);
    writeIfChanged(path.join(themesDir, iconThemeFile(style)), JSON.stringify(json, null, 2) + "\n", changed);
  }

  return { changed, resolved };
}

module.exports = { generate, themeFile, iconThemeFile, colorTheme };
