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

  // sample CSS source string to test the compiler with
  const cssStaticFile = `body {
    height: 100%;
  }
  h1 {
    font-size: 10px;
  }
  p1 {
    width: calc((50px * 5px ) - 100px);
  }
  p2 {

  }
  `
  // path to where the file with the CSS source string written on it will be
  const pathOfStaticCSS = path.join(appDir, 'statics', 'css', 'a.css')

  // path to where the compiled CSS file will be written to
  const pathOfcompiledCSS = path.join(appDir, 'statics', '.build', 'css', 'a.css')

  // options that would be passed to generateTestApp
  const lOptions = {rooseveltPath: 'roosevelt', method: 'initServer'}

  beforeEach(function () {
    // start by generating a statics folder in the roosevelt test app directory
    fse.ensureDirSync(path.join(appDir, 'statics', 'css'))
    // generate sample css files in statics with css source string from cssStaticFile
    fs.writeFileSync(pathOfStaticCSS, cssStaticFile)
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
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
    // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = {advanced: true, aggressiveMerging: true}
      const cleansCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleansCSSPlugin]
      options.sourceMap = null

      less.render(cssStaticFile, options, function (error, output) {
        if (error) {
          console.log(error)
          throw error
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.equal(test, true)
          testApp.kill()
          done()
        }
      })
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
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
    // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = {advanced: false, aggressiveMerging: false, keepBreaks: true}
      const cleansCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleansCSSPlugin]
      options.sourceMap = null
      less.render(cssStaticFile, options, function (error, output) {
        if (error) {
          console.log(error)
          throw error
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.equal(test, true)
          testApp.kill()
          done()
        }
      })
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
              sourceMapFileInline: true
            }
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), ['--dev'], {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified one like
    testApp.on('message', () => {
      // read the string data
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test1 = contentsOfCompiledCSS.includes('/*# sourceMappingURL')
      assert.equal(test1, true)
      testApp.kill()
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
              sourceMapFileInline: true
            }
          }
        }
      }
    }, lOptions)

    // fork the app and run it as a child process
    const testApp = fork(path.join(appDir, 'app.js'), ['--prod'], {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    // grab the string data from the compiled css file and compare that to the string of what a normal uglified one like
    testApp.on('message', () => {
      // read the string data
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      let test1 = contentsOfCompiledCSS.includes('/*# sourceMappingURL')
      assert.equal(test1, false)
      testApp.kill()
      done()
    })
  })

  it('should not use the cleanCSS plugin if noMinify is true', function (done) {
    // generate the app
    generateTestApp({
      appDir: appDir,
      generateFolderStructure: true,
      noMinify: true,
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
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

      // grab the string data from the compiled css file and compare that to the string of what a normal one looks like
    testApp.on('message', () => {
      let contentsOfCompiledCSS = fs.readFileSync(pathOfcompiledCSS, 'utf8')
      // generate a CSS string that represents the CSS file that was compiled with no params set and compare that on the callback

      // set up the options that would be the same as the default of the app
      const opts = {advanced: false, aggressiveMerging: false}
      const cleansCSSPlugin = new LessPluginCleanCSS(opts)
      const options = {}
      options.plugins = [cleansCSSPlugin]
      options.sourceMap = null
      less.render(cssStaticFile, options, function (error, output) {
        if (error) {
          console.log(error)
          throw error
        } else {
          let test = contentsOfCompiledCSS === output.css
          assert.equal(test, false)
          testApp.kill()
          done()
        }
      })
    })
  })

  it('should give a "error" string if there is a massive problem with the code that the program is trying to parse (typo)', function (done) {
    // CSS source script that has a error in it (typo)
    const errorTest = `body { widthy: 300 pax`
    // path of where the file with this script will be located
    const pathOfErrorStaticCSS = path.join(appDir, 'statics', 'css', 'b.css')
    // make this file before the test
    fs.writeFileSync(pathOfErrorStaticCSS, errorTest)

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
    const testApp = fork(path.join(appDir, 'app.js'), {'stdio': ['pipe', 'pipe', 'pipe', 'ipc']})

    testApp.stderr.on('data', (data) => {
      if (data.includes('failed to parse')) {
        testApp.kill()
        done()
      }
    })

    // It should not compiled, meaning that if it did, something is off with the error system
    testApp.on('message', () => {
      assert.fail('the app was able to initialize, meaning that roosevelt-sass was not able to detect the error')
      testApp.kill()
      done()
    })
  })
})
