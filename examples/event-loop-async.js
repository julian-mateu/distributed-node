

startTime = Date.now();

function log(message) {
    console.log(`${Date.now() - startTime} ${message}`)
}

const sleep_st = (t) => new Promise((r) => setTimeout(r, t));
const sleep_im = () => new Promise((r) => setImmediate(r));

(async () => {
    setImmediate(() => log(1));
    log(2);
    await sleep_st(0);
    setImmediate(() => log(3));
    log(4);
    await sleep_im();
    setImmediate(() => log(5));
    log(6);
    await 1;
    setImmediate(() => log(7));
    log(8);
})();


