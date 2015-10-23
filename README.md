# Crisper
> Split inline scripts from an HTML file for CSP compliance

## Usage

Command line usage:

    cat index.html | crisper -h build.html -j build.js
    crisper --source index.html --html build.html --js build.js

Optional Flags:

  - `--script-in-head`: in the output HTML file, place the script in `<head>`
      with the `defer` attribute to provide better loading performance.
      Note: this will not work correctly if your script contains
      `document.write` calls.
  - `--only-split`: Do not write include a `<script>` tag in the output HTML
      file
  - `--always-write-script`: Always create a .js file, even without any `<script>`
      elements.

Library usage:

    var output = crisper({
      source: 'source HTML string',
      jsFileName: 'output js file name.js',
      scriptInHead: Boolean, //default false
      onlySplit: Boolean // default false
    });
    fs.writeFile(htmlOutputFileName, output.html, 'utf-8', ...);
    fs.writeFile(jsOutputFileName, output.js, 'utf-8', ...);

Deprecated API:

    var output = crisper.split('source HTML string', 'output js filename.js');

## Usage with Vulcanize

When using [vulcanize](https://github.com/Polymer/vulcanize), crisper can handle
the html string output directly and write the CSP seperated files on the command
line

    vulcanize index.html --inline-script | crisper --html build.html --js
    build.js

Or programmatically

    vulcanize.process('index.html', function(err, html) {
      if (err) {
        return cb(err);
      } else {
        var out = crisper({
          source: html,
          jsFileName: 'name of js file.js',
          scriptInHead: Boolean, // default false
          onlySplit: Boolean // default false
        })
        cb(null, out.html, out.js);
      }
    });

## Build Tools

- [gulp-crisper](https://npmjs.com/package/gulp-crisper)
- [grunt-crisper](https://www.npmjs.com/package/grunt-crisper)
- *No broccoli plugin yet, will you write it?*
