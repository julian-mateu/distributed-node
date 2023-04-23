#!/usr/bin/env node

// Don't do much on the master. Because of long living session
// of HTTP/2, the requests from a single consumer will be 
// sent to the same worker untill the consumer restarts.
const cluster = require('cluster');
console.log(`master pid=${process.pid}`)
cluster.setupMaster({
    exec: __dirname + '/2.14-producer-grpc.js'
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