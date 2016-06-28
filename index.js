"use strict";

var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var Concat = require('concat-with-sourcemaps');
var path = require('path');

var PLUGIN_NAME = "gulp-feta";

var start = "var feta = {};";

function formatMarkup(filename, markup) {
  var content = escape(markup);
  
  if (content.slice(-2) === "\\n") {
    content = content.slice(0, content.length - 2);
  }

  return "feta['" + filename + "'] = \'" + content + "\';";
}

function escape(str) {
  return str.replace(/\n/g, "\\n").replace(/\"/g, "\\\"").replace(/\'/g, "\\\'");
}

function feta(file) {
  if (!file || typeof file !== "string") {
    throw new PluginError('gulp-feta', 'Missing output file name');
  }

  var latestFile;
  var latestMod;
  var concat;

  function bufferContents(file, enc, cb) {
    if (file.isNull()) {
      cb();
      return;
    }

    if (file.isStream()) {
      this.emit('error', new PluginError('gulp-concat',  'Streaming not supported'));
      cb();
      return;
    }

    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    if (!concat) {
      concat = new Concat(false, file, gutil.linefeed);
      concat.add("begin.js", start);
    }

    var filename = file.relative.replace(/\..*$/, "");

    concat.add(filename, formatMarkup(filename, file.contents.toString()), file.sourceMap);
    cb();
  }

  function endStream(cb) {
    if (!latestFile || !concat) {
      cb();
      return;
    }

    var joinedFile;

    joinedFile = latestFile.clone({contents: false});
    joinedFile.path = path.join(latestFile.base, file);
    joinedFile.contents = concat.content;

    if (concat.sourceMapping) {
      joinedFile.sourceMap = JSON.parse(concat.sourceMap);
    }

    this.push(joinedFile);
    cb();
  }

  return through.obj(bufferContents, endStream);

}

module.exports = feta;
