#!/usr/bin/env node

startTime = Date.now();

const fs = require('fs');

fs.readFile('/etc/passwd', 
  (err, data) => {
    console.log(`${Date.now()-startTime} file read finished`);
    if (err) throw err;
    console.log(data);
});

setImmediate( 
  () => { 
    console.log(`${Date.now()-startTime} This runs while file is being read`);
});

console.log(`${Date.now()-startTime} finished stack`);
