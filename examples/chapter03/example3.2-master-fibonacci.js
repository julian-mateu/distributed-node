#!/usr/bin/env node

const cluster = require('cluster');
console.log(`master pid=${process.pid}`)
cluster.setupMaster({
    exec: __dirname + '/example3.2-cluster-fibonacci.js'
});
cluster.fork();
cluster.fork();

cluster
    .on('disconnect', (worker) => {
        console.log('disconnect', worker.id);
    })
    .on('exit', (worker, code, signal) => {
        console.log('exit', worker.id, code, signal);
        // cluster.fork(); // Uncomment to make the worker restart.
    })
    .on('listening', (worker, {address, port}) => {
        console.log('listening', worker.id, `${address}:${port}`);
    });