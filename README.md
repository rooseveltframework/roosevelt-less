roosevelt-less
===

[![Build Status](https://travis-ci.org/rooseveltframework/roosevelt-less.svg?branch=master)](https://travis-ci.org/rooseveltframework/roosevelt-less) [![Build status](https://ci.appveyor.com/api/projects/status/exl75v6q4xvlr207?svg=true)](https://ci.appveyor.com/project/kethinov/roosevelt-less/branch/master) [![codecov](https://codecov.io/gh/rooseveltframework/roosevelt-less/branch/master/graph/badge.svg)](https://codecov.io/gh/rooseveltframework/roosevelt-less) [![npm](https://img.shields.io/npm/v/roosevelt-less.svg)](https://www.npmjs.com/package/roosevelt-less)

[LESS](http://lesscss.org) CSS preprocessor middleware for [Roosevelt MVC web framework](https://github.com/rooseveltframework/roosevelt). See Roosevelt CSS compiler docs for usage.

Params
---

- `cleanCSS`: roosevelt-less uses the [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) plugin under-the-hood for CSS minification and advanced compilation. Use the `cleanCSS` param to configure options passed to the plugin. See the [less-plugin-clean-css docs](https://github.com/jakubpawlowicz/clean-css/tree/v3.0.1#how-to-use-clean-css-programmatically) for documentation on available params.
- `sourceMap`: This param is optional. It accepts multiple options which are documented in the [LESS API documentation](http://lesscss.org/usage/index.html#programmatic-usage).

## Backwards compatibility notes

- roosevelt-less 0.7.x is compatible with Roosevelt 0.12.x and later.
- roosevelt-less 0.6.x is compatible with Roosevelt 0.11.x and lower.
- Since the upgrade to LESS v2, roosevelt-less uses the third party package [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) for minification and compilation. Although the old LESS `compress` option from previous versions is no longer supported, roosevelt-less will still allow it as a valid parameter and will simply interpret the parameter to enable the clean-css plugin's `advanced` and `aggressiveMerging` options.
