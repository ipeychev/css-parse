
/**
 * Module dependencies.
 */

var parse = require('..');
var fs = require('fs');
var path = require('path');
var read = fs.readFileSync;
var readdir = fs.readdirSync;
var assert = require('assert');

describe('parse(str)', function(){
  readdir('test/cases').forEach(function(file){
    if (~file.indexOf('json')) return;
    file = path.basename(file, '.css');
    it('should parse ' + file, function(){
      var css = read(path.join('test', 'cases', file + '.css'), 'utf8');
      var json = read(path.join('test', 'cases', file + '.json'), 'utf8');
      var ret = parse(css, { filename: file + '.css' });
      ret = JSON.stringify(ret, null, 2);
      ret.should.equal(json);
    })
  });

  it('should save the filename and source', function(){
    var css = 'booty {\n  size: large;\n}\n';
    var ast = parse(css, {
      filename: 'booty.css'
    });

    var position = ast.stylesheet.rules[0].position
    position.start.should.be.ok;
    position.end.should.be.ok;
    position.filename.should.equal('booty.css');
    position.source.should.equal(css);
  });

  it('should throw when a selector is missing', function(){
    assert.throws(function(){
      parse('{size: large}');
    });

    assert.throws(function(){
      parse('b { color: red; }\n{ color: green; }\na {color: blue; }');
    });
  })
})
