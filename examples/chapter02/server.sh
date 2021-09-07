#!/bin/bash
while true
do
   echo -e "HTTP/1.1 200 OK\n\n {\"date\": \"$(date)\"}" | nc -l 3002 
done
