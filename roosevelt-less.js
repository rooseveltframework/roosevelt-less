'use strict';

var fs = require('fs'),
    less = require('less');

module.exports = {
  versionCode: function(app) {
    return '@' + app.get('params').versionedCssFile.varName + ': \'' + app.get('appVersion') + '\';';
  },

  parse: function(app, fileName, callback) {
    var defaultCompress = true;
    
    // disable minify if noMinify param is present in roosevelt
    if (app.get('params').noMinify) {
      defaultCompress = false;
      app.get('params').cssCompiler.params.compress = defaultCompress;
      app.get('params').cssCompiler.params.yuicompress = defaultCompress;
    }

    var parser = new less.Parser({
          paths: app.get('cssPath')
        }),
        opts = app.get('params').cssCompiler.params || {
          compress: defaultCompress,
          yuicompress: defaultCompress
        };

    parser.parse(fs.readFileSync(app.get('cssPath') + fileName, 'utf8'), function(err, tree) {
      var newFile,
          newCss;

      if (!err) {
        newFile = app.get('cssCompiledOutput') + fileName.replace('.less', '.css');
        newCss = tree.toCSS(opts);
      }

      callback(err, newFile, newCss);
    });
  }
};