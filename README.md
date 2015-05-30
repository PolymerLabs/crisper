# Crisper
> Split inline scripts from an HTML file for CSP compliance

## Usage

Command line usage:

    cat index.html | crisper -h build.html -j build.js
    crisper --source index.html --html build.html --js build.js

Library usage:

    var output = crisper(htmlString, jsOutputFileName);
    fs.writeFile(htmlOutputFileName, output.html, 'utf-8', ...);
    fs.writeFile(jsOutputFileName, output.js, 'utf-8', ...);

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
        var out = crisper.split(html, jsFilename)
        cb(null, out.html, out.js);
      }
    });

## Build Tools

- [gulp-crisper](https://npmjs.com/package/gulp-crisper)
- *No grunt plugin yet, will you write it?*
- *No broccoli plugin yet, will you write it?*
