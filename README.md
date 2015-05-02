roosevelt-less [![NPM version](https://badge.fury.io/js/roosevelt-less.png)](http://badge.fury.io/js/roosevelt-less) [![Dependency Status](https://gemnasium.com/kethinov/roosevelt-less.png)](https://gemnasium.com/kethinov/roosevelt-less) [![Gittip](http://img.shields.io/gittip/kethinov.png)](https://www.gittip.com/kethinov/)
==============

[LESS](http://lesscss.org) CSS preprocessor support for [Roosevelt MVC web framework](https://github.com/kethinov/roosevelt).

Usage
=====

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
  "cssCompiler": {nodeModule: "roosevelt-less", params: {compress: true}}
}
```

See the [LESS docs](http://lesscss.org/#using-less-configuration) for documentation on available params.