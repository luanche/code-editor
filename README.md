# code-editor

### Demo
Try demo here https://luanche.github.io/code-editor/

### Usage
```html
<head>
    <link rel="stylesheet" type="text/css" href="./dist/css/icons.css">
    <link rel="stylesheet" type="text/css" href="./dist/css/editor.css">
    <link rel="stylesheet" type="text/css" href="./dist/css/theme/dark.css">
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js"></script>
</head>

<div id="editor-outter-c"></div>

<script src="./dist/editor.js"></script>
<script src="./dist/language/c.js"></script>

<script>
    var editor_c = new Editor("editor-outter-c", {
        language: 'c'
    });
</script>
```

### Theme

##### dark theme
``` html
<link rel="stylesheet" type="text/css" href="./dist/css/theme/dark.css">
```

##### light theme
``` html
<link rel="stylesheet" type="text/css" href="./dist/css/theme/light.css">
```

### Languages support

##### c
```html
<script src="./dist/language/c.js"></script>
<script>
var editor = new Editor("editor-outter", {
    language: 'c'
});
</script>
```

##### cpp
```html
<script src="./dist/language/cpp.js"></script>
<script>
var editor = new Editor("editor-outter", {
    language: 'cpp'
});
</script>
```

##### python
```html
<script src="./dist/language/python.js"></script>
<script>
var editor = new Editor("editor-outter", {
    language: 'python'
});
</script>
```
