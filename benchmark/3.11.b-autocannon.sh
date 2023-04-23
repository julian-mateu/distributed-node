#!/usr/bin/env bash

npm install autocannon@6

./node_modules/.bin/autocannon -d 60 -c 10 -l http://localhost:4000/
# ./node_modules/.bin/autocannon -H "Accept-Encoding: gzip" -d 60 -c 10 -l http://localhost:4000/
# ./node_modules/.bin/autocannon -d 60 -c 10 -l https://localhost:4000/
