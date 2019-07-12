const fs = require('fs')
const path = require('path')
const LessPluginCleanCSS = require('less-plugin-clean-css')
const less = require('less')

module.exports = {
  versionCode: function (app) {
    return `@${app.get('params').css.versionFile.varName}: '${app.get('appVersion')}';\n`
  },

  parse: function (app, fileName) {
    return new Promise((resolve, reject) => {
      const cssCompiler = app.get('params').css.compiler
      const params = cssCompiler.params || {}

      // LESS render options
      const options = {
        paths: app.get('cssPath'),
        filename: path.basename(fileName)
      }

      const lessInput = fs.readFileSync(path.join(app.get('cssPath'), fileName), 'utf8')

      // Clean-css options
      let opts

      // LESS clean-css plugin
      let cleanCSSPlugin

      if (typeof params.sourceMap === 'object' && app.settings.env === 'development') {
        options.sourceMap = params.sourceMap
      } else {
        options.sourceMap = undefined
      }

      // use clean-css plugin to minify CSS if minify param is true
      if (app.get('params').minify) {
        opts = params.cleanCSS || {}

        // support use of the compress param
        if (cssCompiler.compress) {
          opts.advanced = true
          opts.aggressiveMerging = true
        }

        cleanCSSPlugin = new LessPluginCleanCSS(opts)
        options.plugins = [cleanCSSPlugin]
      }

      less.render(lessInput, options, (err, output) => {
        if (err) {
          reject(err)
        }
        const newFile = fileName.replace('.less', '.css')
        const newCSS = output.css

        resolve([newFile, newCSS])
      })
    })
  }
}
