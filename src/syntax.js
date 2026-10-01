// Resolved variant -> { tokenColors, semanticTokenColors }.
// Tuned for JavaScript, TypeScript (+JSX/TSX) and Python; other languages use the generic rules.
module.exports = function syntax(t) {
  const r = t.roles;
  const it = t.opts.italic ? "italic" : "";
  const rule = (name, scope, foreground, fontStyle) => ({
    name,
    scope,
    settings: {
      ...(foreground && { foreground }),
      ...(fontStyle !== undefined && { fontStyle }),
    },
  });

  const tokenColors = [
    // ── generic ──────────────────────────────────────────────
    rule(
      "Comment",
      ["comment", "punctuation.definition.comment"],
      t.comment,
      it,
    ),
    rule(
      "Variable",
      ["variable", "variable.other.readwrite", "meta.definition.variable"],
      t.fg,
    ),
    rule(
      "Punctuation",
      [
        "punctuation.separator",
        "punctuation.terminator",
        "meta.brace",
        "punctuation.definition.parameters",
        "punctuation.section",
      ],
      t.subtle,
    ),
    rule(
      "Keyword / storage",
      [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "keyword.other",
      ],
      r.keyword,
      "",
    ),
    rule(
      "Control flow",
      [
        "keyword.control",
        "keyword.control.flow",
        "keyword.control.conditional",
        "keyword.control.loop",
        "keyword.control.trycatch",
        "keyword.control.switch",
        "keyword.control.flow.python",
      ],
      r.control,
    ),
    rule(
      "Import / export",
      [
        "keyword.control.import",
        "keyword.control.export",
        "keyword.control.from",
        "keyword.control.as",
        "keyword.control.default",
        "keyword.control.import.python",
      ],
      r.keyword,
    ),
    rule(
      "Operator",
      [
        "keyword.operator",
        "punctuation.accessor",
        "punctuation.accessor.optional",
        "storage.type.function.arrow",
        "keyword.operator.type.annotation",
        "keyword.operator.optional",
        "keyword.operator.definiteassignment",
      ],
      r.operator,
    ),
    rule(
      "Word operators",
      [
        "keyword.operator.expression",
        "keyword.operator.new",
        "keyword.operator.logical.python",
        "keyword.operator.word",
        "keyword.operator.in",
        "keyword.operator.instanceof",
        "keyword.operator.typeof",
      ],
      r.keyword,
    ),
    rule(
      "String",
      ["string", "string.quoted", "string.template", "string.interpolated"],
      r.string,
    ),
    rule(
      "Escape / interpolation",
      [
        "constant.character.escape",
        "punctuation.definition.template-expression",
        "punctuation.section.embedded",
        "constant.character.format.placeholder",
        "meta.format.brace",
        "storage.type.format",
      ],
      r.escape,
    ),
    rule(
      "Interpolated code",
      ["meta.template.expression", "meta.embedded", "meta.fstring.python"],
      t.fg,
    ),
    rule("Regex", ["string.regexp"], r.regex),
    rule("Number", ["constant.numeric", "keyword.other.unit"], r.number),
    rule(
      "Constant",
      [
        "constant.language",
        "constant.other",
        "variable.other.constant",
        "variable.other.enummember",
        "support.constant",
      ],
      r.constant,
    ),
    rule(
      "Function",
      [
        "entity.name.function",
        "support.function",
        "variable.function",
        "meta.function-call entity.name.function",
      ],
      r.func,
      "",
    ),
    rule(
      "Method",
      [
        "entity.name.function.member",
        "meta.function-call.method",
        "meta.method-call entity.name.function",
        "support.function.dom",
      ],
      r.method,
    ),
    rule(
      "Type",
      [
        "entity.name.type",
        "support.type",
        "support.type.primitive",
        "entity.other.inherited-class",
        "entity.name.type.alias",
        "entity.name.type.interface",
        "entity.name.type.enum",
        "entity.name.namespace",
        "entity.name.type.module",
      ],
      r.type,
      "",
    ),
    rule(
      "Class",
      [
        "entity.name.class",
        "entity.name.type.class",
        "support.class",
        "meta.class entity.name.type",
      ],
      r.class,
      "",
    ),
    rule(
      "Parameter",
      [
        "variable.parameter",
        "meta.function.parameters variable.other",
        "variable.parameter.function",
      ],
      r.param,
      it,
    ),
    rule(
      "Property",
      [
        "variable.other.property",
        "variable.other.object.property",
        "variable.other.member",
        "meta.object-literal.key",
        "support.type.property-name",
        "entity.name.tag.yaml",
        "support.variable.property",
      ],
      r.prop,
    ),
    rule(
      "Builtin",
      [
        "support.function.builtin",
        "support.class.builtin",
        "support.class.console",
        "support.variable",
        "support.variable.dom",
        "support.constant.math",
        "support.class.promise",
        "support.variable.magic.python",
        "support.type.exception.python",
      ],
      r.builtin,
    ),
    rule("Invalid", ["invalid", "invalid.illegal"], r.error),
    rule("Deprecated", ["invalid.deprecated"], r.error, "strikethrough"),

    // ── JavaScript / TypeScript ──────────────────────────────
    rule(
      "JS async/await/yield",
      [
        "storage.modifier.async",
        "keyword.control.flow.js",
        "keyword.control.flow.ts",
        "keyword.control.flow.tsx",
        "keyword.generator.asterisk",
      ],
      r.control,
    ),
    rule(
      "JS this/super",
      [
        "variable.language.this",
        "variable.language.super",
        "variable.language.arguments",
      ],
      r.self,
      it,
    ),
    rule(
      "JS decorators",
      [
        "meta.decorator",
        "punctuation.decorator",
        "meta.decorator entity.name.function",
        "meta.decorator variable.other.readwrite",
      ],
      r.decorator,
      it,
    ),
    rule(
      "TS modifiers",
      [
        "storage.modifier.ts",
        "storage.modifier.tsx",
        "storage.type.type.ts",
        "storage.type.interface.ts",
        "storage.type.enum.ts",
        "storage.type.namespace.ts",
        "keyword.operator.expression.keyof",
        "keyword.operator.expression.infer",
        "keyword.operator.expression.satisfies",
        "keyword.operator.expression.is",
      ],
      r.keyword,
    ),
    rule(
      "TS type parameter",
      ["entity.name.type.parameter", "meta.type.parameters entity.name.type"],
      r.param,
      it,
    ),
    rule(
      "TS primitive",
      [
        "support.type.primitive.ts",
        "support.type.primitive.tsx",
        "support.type.builtin.ts",
      ],
      r.type,
      it,
    ),
    rule("TS enum member", ["variable.other.enummember"], r.constant),
    rule(
      "JSDoc",
      ["storage.type.class.jsdoc", "punctuation.definition.block.tag.jsdoc"],
      r.keyword,
      it,
    ),
    rule("JSDoc type", ["entity.name.type.instance.jsdoc"], r.type, it),
    rule("JSDoc param", ["variable.other.jsdoc"], r.param, it),

    // ── JSX / TSX / HTML ─────────────────────────────────────
    rule("Tag", ["entity.name.tag", "meta.tag.sgml"], r.tag),
    rule(
      "JSX component",
      [
        "support.class.component",
        "entity.name.tag.custom",
        "meta.tag.jsx support.class.component",
        "meta.tag.tsx support.class.component",
      ],
      r.class,
    ),
    rule("Tag punctuation", ["punctuation.definition.tag"], t.muted),
    rule("Attribute", ["entity.other.attribute-name"], r.attr, it),
    rule(
      "JSX braces",
      [
        "meta.embedded.expression punctuation.section.embedded",
        "meta.jsx.children punctuation.section.embedded",
      ],
      r.escape,
    ),
    rule("JSX text", ["meta.jsx.children", "JSXNested"], t.fg),

    // ── Python ───────────────────────────────────────────────
    rule(
      "Py self/cls",
      [
        "variable.language.special.self.python",
        "variable.parameter.function.language.special.self.python",
        "variable.language.special.cls.python",
        "variable.parameter.function.language.special.cls.python",
      ],
      r.self,
      it,
    ),
    rule(
      "Py decorator",
      [
        "meta.function.decorator.python",
        "entity.name.function.decorator.python",
        "punctuation.definition.decorator.python",
        "meta.function.decorator.python support.type",
        "meta.function.decorator.python variable",
      ],
      r.decorator,
      it,
    ),
    rule(
      "Py docstring",
      [
        "string.quoted.docstring",
        "string.quoted.docstring.multi.python",
        "string.quoted.docstring.raw.multi.python",
        "comment.block.documentation.python",
      ],
      r.docstring,
      it,
    ),
    rule("Py f-string prefix", ["storage.type.string.python"], r.keyword),
    rule(
      "Py f-string braces",
      [
        "constant.character.format.placeholder.other.python",
        "meta.fstring.python punctuation.definition",
        "storage.type.format.python",
      ],
      r.escape,
    ),
    rule(
      "Py dunder",
      ["support.function.magic.python", "entity.name.function.magic.python"],
      r.func,
      it,
    ),
    rule("Py builtins", ["support.function.builtin.python"], r.builtin),
    rule("Py builtin types", ["support.type.python"], r.type),
    rule(
      "Py async",
      ["storage.type.function.async.python", "keyword.control.flow.python"],
      r.control,
    ),
    rule(
      "Py def/class/lambda",
      [
        "storage.type.function.python",
        "storage.type.class.python",
        "storage.type.function.lambda.python",
      ],
      r.keyword,
    ),
    rule(
      "Py return annotation",
      [
        "punctuation.separator.annotation.result.python",
        "punctuation.separator.annotation.python",
      ],
      r.operator,
    ),
    rule(
      "Py unpacking",
      [
        "keyword.operator.unpacking.parameter.python",
        "keyword.operator.unpacking.arguments.python",
      ],
      r.operator,
    ),
    rule("Py None/True/False", ["constant.language.python"], r.constant),
    rule(
      "Py type hint",
      ["meta.function.parameters.python support.type", "meta.typehint"],
      r.type,
    ),

    // ── data / docs ──────────────────────────────────────────
    rule(
      "JSON key",
      ["support.type.property-name.json", "support.type.property-name.jsonc"],
      r.prop,
    ),
    rule(
      "CSS class/id",
      [
        "entity.other.attribute-name.class.css",
        "entity.other.attribute-name.id.css",
      ],
      r.type,
    ),
    rule("CSS property", ["support.type.property-name.css"], r.prop),
    rule(
      "Markdown heading",
      [
        "markup.heading",
        "entity.name.section.markdown",
        "punctuation.definition.heading.markdown",
      ],
      t.accentText,
      "bold",
    ),
    rule("Markdown bold", ["markup.bold"], r.number, "bold"),
    rule("Markdown italic", ["markup.italic"], r.decorator, "italic"),
    rule(
      "Markdown code",
      ["markup.inline.raw", "markup.fenced_code.block"],
      r.string,
    ),
    rule(
      "Markdown link",
      ["markup.underline.link", "string.other.link"],
      r.func,
    ),
    rule("Markdown quote", ["markup.quote"], t.muted, "italic"),
    rule(
      "Markdown list",
      ["punctuation.definition.list.begin.markdown"],
      r.keyword,
    ),
    rule("Diff inserted", ["markup.inserted"], t.ink.green),
    rule("Diff deleted", ["markup.deleted"], t.ink.red),
    rule("Diff changed", ["markup.changed"], t.ink.yellow),
  ];

  const s = (foreground, italic) =>
    italic && it ? { foreground, italic: true } : foreground;
  const semanticTokenColors = {
    parameter: s(r.param, true),
    typeParameter: s(r.param, true),
    property: r.prop,
    enumMember: r.constant,
    function: r.func,
    method: r.method,
    class: r.class,
    interface: r.type,
    type: r.type,
    enum: r.type,
    namespace: r.type,
    decorator: s(r.decorator, true),
    selfParameter: s(r.self, true), // Pylance
    clsParameter: s(r.self, true), // Pylance
    magicFunction: s(r.func, true), // Pylance dunder
    builtinConstant: r.constant, // Pylance
    module: r.type,
    "function.defaultLibrary": r.builtin,
    "class.defaultLibrary": r.builtin,
    "variable.defaultLibrary": r.builtin,
    // Python ALL_CAPS constants are readonly; in TS every `const` is, so scope this to Python.
    "variable.readonly:python": r.constant,
  };

  return { tokenColors, semanticTokenColors };
};
