/**
 * ESLint config for the user-facing React app.
 *
 * The repo shipped with a lint SCRIPT but no config file, so linting had never
 * actually run. All the plugins below were already in devDependencies — this
 * just wires them up. jsx-a11y (accessibility) and the security plugin are the
 * two that earn their place here beyond ordinary style.
 */
module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: 'detect' } },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: ['react', 'react-hooks', 'jsx-a11y', 'security'],
  rules: {
    // Real correctness signals — keep as errors.
    'react-hooks/rules-of-hooks': 'error',
    'no-unsafe-optional-chaining': 'error',
    'security/detect-eval-with-expression': 'error',
    // A console call in a production path is either a debugging leftover (the
    // editor used to log every keystroke) or a place where request data can
    // reach the console — a failed sign-in once printed the plaintext
    // password that way. The few deliberate ones (a non-401 session failure,
    // a service-worker registration failure) carry a per-line disable that
    // says why, so each is a visible decision rather than ambient noise.
    'no-console': 'error',
    // Pre-existing debt in a volunteer codebase — surface as warnings, not
    // build-blockers, so the lint can pass while the debt is visible.
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-vars': 'warn',
    'react/prop-types': 'off',
    // Accessibility debt surfaced by this config: clickable non-button elements
    // need keyboard handlers + roles. Real UX work, tracked as warnings until each
    // is fixed and tested in a browser — not silenced.
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
  },
  overrides: [
    {
      // Node-side test and check code: the console IS the report channel there
      // (axe violation dumps, probe progress), and none of it ships to the browser.
      files: ['e2e/**', 'scripts/**'],
      rules: { 'no-console': 'off' },
    },
  ],
  ignorePatterns: ['build/', 'dist/', 'node_modules/', 'vite.config.js'],
};
