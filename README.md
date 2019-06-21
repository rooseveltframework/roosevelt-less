roosevelt-less
===

[![Build Status](https://travis-ci.org/rooseveltframework/roosevelt-less.svg?branch=master)](https://travis-ci.org/rooseveltframework/roosevelt-less) [![codecov](https://codecov.io/gh/rooseveltframework/roosevelt-less/branch/master/graph/badge.svg)](https://codecov.io/gh/rooseveltframework/roosevelt-less) [![npm](https://img.shields.io/npm/v/roosevelt-less.svg)](https://www.npmjs.com/package/roosevelt-less)

[LESS](http://lesscss.org) CSS preprocessor middleware for [Roosevelt MVC web framework](https://github.com/rooseveltframework/roosevelt). See Roosevelt CSS compiler docs for usage.

Params
---

- `sourceMap`: This param is optional. It accepts multiple options which are documented in the [LESS API documentation](http://lesscss.org/usage/index.html#programmatic-usage).

## Backwards compatibility notes

- roosevelt-less 0.7.x is compatible with Roosevelt 0.12.x and later.
- roosevelt-less 0.6.x is compatible with Roosevelt 0.11.x and lower.
- Since the upgrade to LESS v2, roosevelt-less uses the third party package [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) for minification and compilation. Although the old LESS `compress` option from previous versions is no longer supported, roosevelt-less will still allow it as a valid parameter and will simply interpret the parameter to enable the clean-css plugin's `advanced` and `aggressiveMerging` options.
