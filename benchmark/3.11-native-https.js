#!/usr/bin/env node
const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || 4000;
require('http').createServer((req, res) => {
    res.end('ok');
}).listen(PORT, () => {
    console.log(`Producer running at http://${HOST}:${PORT}`);
});
