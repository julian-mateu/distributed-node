const { assert } = require("console");

startTime = Date.now();

function log(message) {
    console.log(`${Date.now() - startTime} ${message}`)
}

function myAsyncOperation(count, callback) {
    setImmediate(() => {
        callback(count);
    });
}

// Antipattern
function foo_bad(count, callback) {
    log(`foo_bad = ${bar}`)
    log(`count = ${count}`)
    if (count <= 0) {
        log('calling callback');
        return callback(new TypeError('count > 0')); // called synchronouslyy
    }
    log('calling myAsyncOperation');
    myAsyncOperation(count, callback);
}

// actual solution
function foo_good(count, callback) {
    log(`foo_good = ${bar}`)
    log(`count = ${count}`)
    if (count <= 0) {
        return process.nextTick(() => {
            log('calling callback');
            callback(new TypeError('count > 0'));
        }); // called asynchronously
    }
    log('calling myAsyncOperation');
    myAsyncOperation(count, callback);
}

log('setting bar to false')
let bar = false;
foo_good(-1, () => {
    log(`asserting bar = ${bar}`)
    assert(bar);
});
log('setting bar to true')
bar = true;

setTimeout(() => {
    log('setting bar to false')
    bar = false;
    foo_bad(-1, () => {
        log(`asserting bar = ${bar}`)
        assert(bar);
    });
    log('setting bar to true')
    bar = true;
}, 100);

