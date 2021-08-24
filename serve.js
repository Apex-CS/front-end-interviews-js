var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic(path.join(__dirname, 'dist')));
app.listen(1337);
console.info('Running localhost:1337');
