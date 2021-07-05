module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:jest/recommended",
    "plugin:jest/style",
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {},
  plugins: ["@babel", "jest"],
};
