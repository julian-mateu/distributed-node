#!/bin/bash
set -e -o pipefail

pushd "$(git rev-parse --show-toplevel)"

openssl req -nodes -new -x509 \
    -keyout haproxy/private.key \
    -out haproxy/certificate.cert

cat haproxy/certificate.cert \
    haproxy/private.key \
    > haproxy/combined.pem

popd
