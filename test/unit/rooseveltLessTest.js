/* eslint-env mocha */

const assert = require('assert')
const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const cleanupTestApp = require('../../node_modules/roosevelt/test/util/cleanupTestApp')
const generateTestApp = require('../../node_modules/roosevelt/test/util/generateTestApp')
const fork = require('child_process').fork
const less = require('less')
const LessPluginCleanCSS = require('less-plugin-clean-css')

describe('Roosevelt LESS Section Test', function () {
  // location of the test app
  const appDir = path.join(__dirname, '../app/lessJSTest')

  // sample less source string to test the compiler with
  const lessStaticFile = `
  @fontSize1: 25px;
  @fontSize2: 15px;
  body {
    height: 100%;
    font-size: @fontSize2;
  }
  h1 {
    font-size: 10px;
    font-size: @fontSize1;
  }
  p1 {
    width: calc((50px * 5px ) - 100px);
    font-size: @fontSize2;
  }
  p2 {

  }
  `
  // path to where the file with the CSS source string written on it will be
  const pathOfStaticLess = path.join(appDir, 'statics', 'css', 'a.less')

  // path to where the compiled CSS file will be written to
  const pathOfcompiledCSS = path.join(appDir, 'statics', '.build', 'css', 'a.css')

  // options that would be passed to generateTestApp
  const lOptions = { rooseveltPath: 'roosevelt', method: 'initServer' }

  beforeEach(function () {
    // start by generating a statics folder in the roosevelt test app directory
    fse.ensureDirSync(path.join(appDir, 'statics', 'css'))
    // generate sample css files in statics with css source string from cssStaticFile
    fs.writeFileSync(pathOfStaticLess, lessStaticFile)
  })

  afterEach(function (done) {
    // delete the generated test folder once we are done so that we do not have conflicting data
    cleanupTestApp(appDir, (err) => {
      if (err) {
        throw err
      } else {
        done()
      }
    })
  })

  it('should make a compiled CSS file that is the same as the compiled CSS string I have generated from using less', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = { advanced: true, aggressiveMerging: true }
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null

      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, true)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it('should make a compiled CSS file with a changed param that is the same as the compiled CSS string I have generated from using less with changed param (cleanCSS)', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: false,
              aggressiveMerging: false,
              keepBreaks: true
            },
            sourceMap: null
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = { advanced: false, aggressiveMerging: false, keepBreaks: true }
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null
      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, true)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it('should make a inline comment that is a source map for the pre-compiled css files while it is in development mode', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: false,
              aggressiveMerging: false,
              keepBreaks: true
            },
            sourceMap: {
              sourceMapFileInline: true,
              outputSourceFiles: true
            }
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), ['--dev'], { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified one like
    testApp.on('message', () => {
      // read the string data
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test1 = contentsOfCompiledCSS.includes('/*# sourceMappingURL=data:application/json;base64')
      assert.strictEqual(test1, true)
      testApp.kill('SIGINT')
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should not make a inline comment that is a source map for the pre-compiled css files while it is in production mode', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: false,
              aggressiveMerging: false,
              keepBreaks: true
            },
            sourceMap: {
              sourceMapFileInline: true,
              outputSourceFiles: true
            }
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), ['--prod'], { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified one like
    testApp.on('message', () => {
      // read the string data
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test1 = contentsOfCompiledCSS.includes('/*# sourceMappingURL=data:application/json;base64')
      assert.strictEqual(test1, false)
      testApp.kill('SIGINT')
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it('should not use the cleanCSS plugin if minify is true', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      minify: false,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: false,
              aggressiveMerging: false
            },
            sourceMap: null
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = { advanced: false, aggressiveMerging: false }
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null
      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, false)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it('should give a "error" string if there is a massive problem with the code that the program is trying to parse (typo)', function (done) {
    // CSS source script that has a error in it (typo)
    const errorTest = `body { widthy: 300 pax`
    // path of where the file with this script will be located
    const pathOfErrorStaticCSS = path.join(appDir, 'statics', 'css', 'b.css')
    // make this file before the test
    fs.writeFileSync(pathOfErrorStaticCSS, errorTest)
    // variable to show whether or not an error has occured
    let error = false
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    testApp.stderr.on('data', (data) => {
      if (data.includes('failed to parse')) {
        error = true
      }
    })

    // It should not compiled, meaning that if it did, something is off with the error system
    testApp.on('message', () => {
      if (!error) {
        assert.fail('the app was able to initialize, meaning that roosevelt-less was not able to detect the error')
      }
      testApp.kill('SIGINT')
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it('make a CSS file that declares a CSS variable that contains the app version number from package.js', function (done) {
    // contents of sample package.json file to use for testing css versionFile
    let packageJSON = {
      version: '0.3.1',
      rooseveltConfig: {}
    }

    // generate the package json file with basic data
    fse.ensureDirSync(path.join(appDir))
    fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify(packageJSON))

    // create the app.js file
    generateTestApp({
      appDir: appDir,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: true,
              aggressiveMerging: true
            },
            sourceMap: null
          }
        },
        versionFile: {
          fileName: '_version.less',
          varName: 'appVersion'
        }
      },
      generateFolderStructure: true
    }, lOptions)

    // fork the app.js file and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // wait for the app to be finished initialized
    testApp.on('message', () => {
      // see if the file exist inside the css folder
      let versionFilePath = path.join(appDir, 'statics', 'css', '_version.less')
      let test1 = fs.existsSync(versionFilePath)
      assert.strictEqual(test1, true)
      // see that the value in the css version file is correct
      let versionFileString = fs.readFileSync(path.join(appDir, 'statics', 'css', '_version.less'), 'utf8')
      let versionFileNum = versionFileString.split(`'`)
      let test2 = packageJSON.version === versionFileNum[1]
      assert.strictEqual(test2, true)
      testApp.kill('SIGINT')
    })

    testApp.on('exit', () => {
      done()
    })
  })

  it(`should be able to compile a less file that uses its advanced and aggressiveMerging options if the compress param is true`, function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            cleanCSS: {
              advanced: false,
              aggressiveMerging: false
            },
            sourceMap: null
          },
          compress: true
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = { advanced: true, aggressiveMerging: true }
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null
      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, true)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it(`should be able to compile a less file that uses none of cleanCSS features if cleanCSS is not set`, function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less',
          params: {
            sourceMap: null
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = {}
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null
      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, true)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })

  it(`should be able to compile a less file even when the params of the css Compiler param is empty`, function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      css: {
        compiler: {
          nodeModule: '../../roosevelt-less'
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), { 'stdio': ['pipe', 'pipe', 'pipe', 'ipc'] })

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = {}
      const cleanCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleanCSSPlugin]
      options.sourceMap = null
      less.render(lessStaticFile, options, function (error, output) {
        if (error) {
          assert.fail(error)
          testApp.kill('SIGINT')
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.strictEqual(test, true)
          testApp.kill('SIGINT')
        }
      })
    })
    testApp.on('exit', () => {
      done()
    })
  })
})
