startTime = Date.now();

function log(message) {
    console.log(`${Date.now() - startTime} ${message}`)
}

setImmediate(() => log(1));
log(2);
Promise.resolve().then(() => setTimeout(() => {
    setImmediate(() => log(3));
    log(4);
    Promise.resolve().then(() => setImmediate(() => {
        setImmediate(() => log(5));
        log(6);
        Promise.resolve().then(() => {
            setImmediate(() => log(7));
            log(8);
        });
    }));
}, 0));
