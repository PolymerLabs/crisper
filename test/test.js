/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

var assert = require('chai').assert;
var fs = require('fs');
var dom5 = require('dom5');
var pred = dom5.predicates;

suite('Crisper', function() {
  var crisp = require('../index');

  suite('Split API', function() {
    suite('Default', function () {
      var obj;
      setup(function() {
        obj = crisp.split('<script>var foo = "bar";</script>', 'foo.js');
      });

      test('return object with js and html properties', function() {
        assert.property(obj, 'html');
        assert.property(obj, 'js');
      });

      test('output html is serialized', function() {
        assert.typeOf(obj.html, 'string');
      });

      test('output js is linked via <script> in the output html <body>', function() {
        var doc = dom5.parse(obj.html);
        var outscript = dom5.query(doc, pred.AND(
          pred.hasTagName('script'),
          pred.hasAttrValue('src', 'foo.js')
        ));
        assert.ok(outscript);
      });

    });

    suite('No JS', function() {
      var obj;
      setup(function() {
        obj = crisp.split('<body>Hello World</body>', 'foo.js');
      });

      test('js property is empty', function() {
        assert.notOk(obj.js);
      });

      test('output js is NOT linked via <script> in the output html <body>', function() {
        var doc = dom5.parse(obj.html);
        var outscript = dom5.query(doc, pred.AND(
          pred.hasTagName('script'),
          pred.hasAttrValue('src', 'foo.js')
        ));
        assert.notOk(outscript);
      });

    });
  });

  suite('Script Outlining', function() {
    suite('Default', function() {

      var obj;
      setup(function() {
        var docText = fs.readFileSync('test/html/index.html', 'utf-8');
        obj = crisp.split(docText, 'foo.js');
      });

      test('Scripts are in order', function() {
        var script = obj.js;
        var oneIndex = script.indexOf('one');
        var twoIndex = script.indexOf('two');
        var threeIndex = script.indexOf('three');
        assert.ok(oneIndex < twoIndex);
        assert.ok(twoIndex < threeIndex);
      });

      test('Unknown script types are not removed', function() {
        var script = obj.js;
        var unknownMatcher = pred.AND(
          pred.hasTagName('script'),
          pred.hasAttrValue('type', 'random-type')
        );
        var doc = dom5.parse(obj.html);
        var unknownScript = dom5.query(doc, unknownMatcher);
        assert(unknownScript);

        var unknownIndex = script.indexOf("DON'T READ THIS");
        assert.equal(unknownIndex, -1);
      });

      test('Newline Semicolon should be used for concating, when necessary', function() {
        var script = obj.js;
        var expected = '//inline comment\nvar next_statement=\'found\';';
        var actual = script.indexOf(expected);
        assert(actual > -1, 'semicolon in the wrong spot');
        expected = 'var three = "three"; //still supported, but don\'t use!';
        actual = script.indexOf(expected);
        assert(actual > -1, 'semicolon inserted incorrectly');
        expected = '//# sourceMappingURL=/dev/null';
        actual = script.indexOf(expected);
        assert(actual > -1, 'sourcemap had semicolon insertion incorrectly');
      });

      test('Only the last line is considered for semicolon insertion', function() {
        var script = obj.js;
        var expected = 'var statement;';
        var lines = script.split('\n');
        var actual = lines[lines.length - 1].trim();

        assert.equal(actual, expected);
      });
    });
  });
});
