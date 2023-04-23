#!/usr/bin/env sh

npm install autocannon@6

# run either the master or the cluster and compare
# in linux try also running master and setting the affinity of
# every pid to 0 with: taskset -c 0 <pid>
node example3.2-master-fibonacci.js
autocannon -c 2 http://127.0.0.1:4000/100000