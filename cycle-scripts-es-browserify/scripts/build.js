var fs = require('fs-extra')
var {join} = require('path')
var mkdirp = require('mkdirp')
var browserify = require('browserify')
var babelify = require('babelify')
var envify = require('envify/custom')

require('dotenv').config({silent: true})

var buildPath = join(process.cwd(), 'build')
var publicPath = join(process.cwd(), 'public')
var srcPath = join(process.cwd(), 'src')

mkdirp.sync(buildPath)

fs.copySync(publicPath, buildPath)

browserify(join(srcPath, 'index.js'))
  .transform(
    babelify.configure({
      presets: ['es2015']
    })
  )
  .transform(
    envify(Object.assign({}, process.env, {
      _: 'purge',
      NODE_ENV: 'production'
    }))
  )
  .bundle()
  .pipe(fs.createWriteStream(join(buildPath, 'bundle.js')))
