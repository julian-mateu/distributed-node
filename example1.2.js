startTime = Date.now();

function A() { console.log(`${Date.now()-startTime} A`); }
function C() { console.log(`${Date.now()-startTime} C`); }
function D() { console.log(`${Date.now()-startTime} D`); }

setTimeout(A, 0);
console.log(`${Date.now()-startTime} B`);
setTimeout(C, 100);
setTimeout(D, 0);

let i = 0;
while (i < 1_000_000_000) { // Assume this takes ~500ms
  let ignore = Math.sqrt(i);
  i++;
}

console.log(`${Date.now()-startTime} E`);
