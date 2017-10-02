const fs = require('fs')
const LessPluginCleanCSS = require('less-plugin-clean-css')
const less = require('less')

module.exports = {
  versionCode: function (app) {
    return '@' + app.get('params').versionedCssFile.varName + ': \'' + app.get('appVersion') + '\';\n'
  },

  parse: function (app, fileName, callback) {
    let defaultCompress = true

    // LESS render options
    let options = {
      filename: app.get('cssPath') + fileName,
      paths: app.get('cssPath')
    }

    // Clean-css options
    let opts

    // LESS clean-css plugin
    let cleanCSSPlugin

    // disable minify if noMinify param is present in roosevelt
    if (app.get('params').noMinify) {
      defaultCompress = false
      app.get('params').cssCompiler.params.advanced = defaultCompress
      app.get('params').cssCompiler.params.aggressiveMerging = defaultCompress
    }

    // Enable minification and compilation with less-plugin-clean-css
    if (defaultCompress) {
      opts = app.get('params').cssCompiler.params || {
        advanced: defaultCompress,
        aggressiveMerging: defaultCompress
      }

      // Re-interpret 'compress' param into valid clean-css options
      if (opts.hasOwnProperty('compress')) {
        opts.advanced = true
        opts.aggressiveMerging = true
        delete opts.compress
      }

      cleanCSSPlugin = new LessPluginCleanCSS(opts)
      options.plugins = [cleanCSSPlugin]
    }

    less.render(fs.readFileSync(options.filename, 'utf8'), options, function (err, tree) {
      let newFile
      let newCss

      if (!err) {
        newFile = app.get('cssCompiledOutput') + fileName.replace('.less', '.css')
        newCss = tree.css
      }

      callback(err, newFile, newCss)
    })
  }
}
