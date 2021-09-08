#!/bin/bash
set -e -o pipefail
pushd "$(git rev-parse --show-toplevel)"

mkdir -p ./{recipe-api,shared}/tls

# Answer localhost for common name
openssl req -nodes -new -x509 \
    -keyout recipe-api/tls/basic-private-key.key \
    -out shared/tls/basic-certificate.cert

popd
