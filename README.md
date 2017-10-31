roosevelt-less
===
[![Build Status](https://travis-ci.org/rooseveltframework/roosevelt-less.svg?branch=master)](https://travis-ci.org/rooseveltframework/roosevelt-less) [![npm](https://img.shields.io/npm/v/roosevelt-less.svg)](https://www.npmjs.com/package/roosevelt-less)

[LESS](http://lesscss.org) CSS preprocessor support for [Roosevelt MVC web framework](https://github.com/rooseveltframework/roosevelt).

Usage
===

Declare this module as a dependency in your app, for example:

```js
"dependencies": {
  "roosevelt": "*",
  "roosevelt-less": "*"
}
```

Declare your CSS compiler by passing it as a param to Roosevelt:

```js
"rooseveltConfig": {
  "cssCompiler": {nodeModule: "roosevelt-less", params: {advanced: true, aggressiveMerging: true}}
}
```

Roosevelt-less uses the [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) plugin under-the-hood for CSS minification and advanced compilation. Valid parameter arguments include options for clean-css. Default options set by roosevelt-less include:

```js
{
  advanced: true,
  aggressiveMerging: true
}
```

See the [clean-css docs](https://github.com/jakubpawlowicz/clean-css) for documentation on available params.

Backwards Compatibility
===

Since the upgrade to Less v2, Roosevelt-less uses the third party package [less-plugin-clean-css](https://www.npmjs.com/package/less-plugin-clean-css) for minification and compilation. Although the old Less `compress` option is no longer supported, Roosevelt-less will still allow it as a valid parameter and will simply interpret the parameter to enable clean-css's `advanced` and `aggressiveMerging` options.
