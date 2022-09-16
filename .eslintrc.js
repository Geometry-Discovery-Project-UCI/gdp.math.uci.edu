module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 1 }],
    "eol-last": ["error", "always"],
    "@typescript-eslint/no-non-null-assertion": "off",

    "@typescript-eslint/adjacent-overload-signatures": "error",
    "@typescript-eslint/array-type": "error",

    "brace-style": "off",
    "@typescript-eslint/brace-style": ["error", "1tbs", { allowSingleLine: true }],

    "@typescript-eslint/naming-convention": [
      "error",
      { selector: "typeLike", format: ["PascalCase"], filter: { regex: "^(__String|[A-Za-z]+_[A-Za-z]+)$", match: false } },
      { selector: "interface", format: ["PascalCase"], custom: { regex: "^I[A-Z]", match: false }, filter: { regex: "^I(Arguments|TextWriter|O([A-Z][a-z]+[A-Za-z]*)?)$", match: false } },
      { selector: "variable", format: ["camelCase", "PascalCase", "UPPER_CASE"], leadingUnderscore: "allow", filter: { regex: "^(_{1,2}filename|_{1,2}dirname|_+|[A-Za-z]+_[A-Za-z]+)$", match: false } },
      { selector: "function", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow", filter: { regex: "^[A-Za-z]+_[A-Za-z]+$", match: false } },
      { selector: "parameter", format: ["camelCase"], leadingUnderscore: "allow", filter: { regex: "^(_+|[A-Za-z]+_[A-Z][a-z]+)$", match: false } },
      { selector: "method", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow", filter: { regex: "^([0-9]+|[A-Za-z]+_[A-Za-z]+)$", match: false } },
      { selector: "memberLike", format: ["camelCase"], leadingUnderscore: "allow", filter: { regex: "^([0-9]+|[A-Za-z]+_[A-Za-z]+)$", match: false } },
      { selector: "enumMember", format: ["camelCase", "PascalCase"], leadingUnderscore: "allow", filter: { regex: "^[A-Za-z]+_[A-Za-z]+$", match: false } },
      { selector: "property", format: null }
    ],

    "@typescript-eslint/no-explicit-any": "off",

    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
    "@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "as" }],

    "max-statements-per-line": ["error", { max: 1 }],

    "no-duplicate-imports": "off",
    "@typescript-eslint/no-duplicate-imports": "error",

    "@typescript-eslint/no-inferrable-types": "error",
    "@typescript-eslint/no-misused-new": "error",
    "@typescript-eslint/no-this-alias": "error",

    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": ["error", { allowTernary: true }],

    "@typescript-eslint/prefer-for-of": "error",
    "@typescript-eslint/prefer-function-type": "error",
    "@typescript-eslint/prefer-namespace-keyword": "error",

    "quotes": "off",
    "@typescript-eslint/quotes": ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],

    "semi": "off",
    "@typescript-eslint/semi": "error",

    "space-before-function-paren": "off",
    "@typescript-eslint/space-before-function-paren": ["error", {
      asyncArrow: "always",
      anonymous: "always",
      named: "never"
    }],

    "@typescript-eslint/triple-slash-reference": "error",
    "@typescript-eslint/type-annotation-spacing": "error",
    "@typescript-eslint/unified-signatures": "error",

    // eslint
    "constructor-super": "error",
    "curly": ["error", "multi-line"],
    "dot-notation": "error",
    "eqeqeq": "error",
    "linebreak-style": ["error", "unix"],
    "new-parens": "error",
    "no-caller": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-eval": "error",
    "no-extra-bind": "error",
    "no-fallthrough": "error",
    "no-new-func": "error",
    "no-new-wrappers": "error",
    "no-return-await": "error",
    "no-restricted-globals": ["error",
      { name: "setTimeout" },
      { name: "clearTimeout" },
      { name: "setInterval" },
      { name: "clearInterval" },
      { name: "setImmediate" },
      { name: "clearImmediate" }
    ],
    "no-sparse-arrays": "error",
    "no-template-curly-in-string": "error",
    "no-throw-literal": "error",
    "no-trailing-spaces": "error",
    "no-undef-init": "error",
    "no-unsafe-finally": "error",
    "no-unused-labels": "error",
    "no-var": "error",
    "object-shorthand": "error",
    "prefer-const": "error",
    "prefer-object-spread": "error",
    "quote-props": ["error", "consistent-as-needed"],
    "space-in-parens": "error",
    "unicode-bom": ["error", "never"],
    "use-isnan": "error"
  },
};
