startTime = Date.now();

function a() { console.log(`${Date.now()-startTime} a`); b(); }
function b() { console.log(`${Date.now()-startTime} b`); c(); }
function c() { console.log(`${Date.now()-startTime} c`); }

function x() { console.log(`${Date.now()-startTime} x`); y(); }
function y() { console.log(`${Date.now()-startTime} y`); z(); }
function z() { console.log(`${Date.now()-startTime} z`); }

setTimeout(x, 0);
a();
