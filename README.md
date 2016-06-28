## Introduction

A tiny plugin used for compiling all of your html partials into a JS object.

## Usage


```javascript
// gulpfile.js

var gulp = require("gulp");
var feta = require("gulp-feta");

gulp.task("html", function() {
  return gulp.src("app/partials/**/*.html")
    .gulp(feta("partials.js"))
    .gulp(gulp.dest("dist"));
});
```

The above example will take all of your html files within `app/partials` and
create a file called `dist/partials.js` where it initializes an object called
`feta` and adds all of the partials there.

## Example input & output

Input:

```html
<!-- app/src/f1/test.html -->
Hello, world!
newline
<!-- EOF -->

<!-- app/src/f2/test.html -->
Another partial!!


This one has "quotes," whatever those are
<!-- EOF -->
```

Output:
```javascript
var feta = {};
feta['f1/test'] = 'Hello, world!\nnewline\n';
feta['f2/test'] = 'Another partial!!\n\n\nThis one has \"quotes,\" whatever those are\n';
```

