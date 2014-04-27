'use strict';

var fs = require('fs'),
    less = require('less');

module.exports = {
  versionCode: function(app) {
    return '@' + app.get('params').versionedCssFile.varName + ': \'' + app.get('appVersion') + '\';';
  },

  parse: function(app, fileName, callback) {
    var parser = new less.Parser({
          paths: app.get('cssPath')
        }),
        opts = app.get('params').cssCompiler.params || {
          compress: true,
          yuicompress: true
        };

    parser.parse(fs.readFileSync(app.get('cssPath') + fileName, 'utf8'), function(err, tree) {
      if (!err) {
        var newFile = app.get('cssCompiledOutput') + fileName.replace('.less', '.css'),
            newCss = tree.toCSS(opts);
      }

      callback(err, newFile, newCss);
    });
  }
};