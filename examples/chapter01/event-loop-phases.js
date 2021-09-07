const fs = require('fs');

startTime = Date.now();

function log(message) {
    console.log(`${Date.now() - startTime} ${message}`)
}

setImmediate(() => log(1));
Promise.resolve().then(() => log(2));
process.nextTick(() => log(3));
fs.readFile(__filename, () => {
    log(4);
    setTimeout(() => log(5));
    setImmediate(() => log(6));
    process.nextTick(() => log(7));
});
log(8);
