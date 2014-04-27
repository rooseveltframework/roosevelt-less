roosevelt-less
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

License
=======

All original code in this module is licensed under the [Creative Commons Attribution 4.0 International License](http://creativecommons.org/licenses/by/4.0/). Commercial and noncommercial use is permitted with attribution.