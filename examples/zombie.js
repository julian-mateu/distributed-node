const nt_recursive = () => process.nextTick(nt_recursive);
nt_recursive(); // setInterval will never run as the nextTick microtask queue will never empty!

const si_recursive = () => setImmediate(si_recursive);
si_recursive(); // setInterval will run as setImmediate callbacks are added in the 'next' phase

setInterval(() => console.log('hi'), 10);
