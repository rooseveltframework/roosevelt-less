'use strict';

var fs = require('fs'),
    less = require('less'),
    compress = true,
    yuicompress = true;

process.argv.forEach(function (val, index, array) {
  switch (val) {
    case '-no-minify':
      compress = false;
      yuicompress = false;
      break;
  }
});

module.exports = {
  versionCode: function(app) {
    return '@' + app.get('params').versionedCssFile.varName + ': \'' + app.get('appVersion') + '\';';
  },

  parse: function(app, fileName, callback) {

    // override params from argv
    if (app.get('params').cssCompiler.params) {
      app.get('params').cssCompiler.params.compress = compress;
    }
    
    var parser = new less.Parser({
          paths: app.get('cssPath')
        }),
        opts = app.get('params').cssCompiler.params || {
          compress: compress,
          yuicompress: yuicompress
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