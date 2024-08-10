/**
 * This file is the configuration file for PostCSS, a tool for transforming and
 * autoprefixing CSS with JavaScript.
 *
 * The `plugins` object contains a list of plugins that PostCSS will use to
 * transform and autoprefix the CSS.
 *
 * The `tailwindcss` plugin is used to apply utility classes to the CSS.
 *
 * The `autoprefixer` plugin is used to add vendor prefixes to the CSS.
 *
 * Each plugin is configured with an empty object `{}`, which means that the
 * default options for the plugin will be used.
 */
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
