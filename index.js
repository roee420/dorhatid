'use strict';
const request = require('request');
const path = require('path');
const fs = require('fs');


const dir = path.join(__dirname, '/public');

const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};


// Imports dependencies and sets up http server
const
    express = require('express'),
    bodyParser = require('body-parser'),
// creates express http server
    app = express().use(bodyParser.json());

// Sets server port and logs message on success
app.listen(process.env.PORT || 8765, () => console.log('webhook is listening'));





app.get('*', function (req, res) {
    let file = path.join(dir, req.path.replace(/\/$/, '/index.html'));
    if (file.indexOf(dir + path.sep) !== 0) {
        return res.status(403).end('Forbidden');
    }
    let type = mime[path.extname(file).slice(1)] || 'text/plain';
    let s = fs.createReadStream(file);
    s.on('open', function () {
        res.set('Content-Type', type);
        s.pipe(res);
    });
    s.on('error', function () {
        res.set('Content-Type', 'text/plain');
        res.status(404).end('Not found');
    });
});