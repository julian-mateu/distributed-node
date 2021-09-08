#!/bin/bash
set -e -o pipefail
pushd "$(git rev-parse --show-toplevel)"

CA_KEY="ca-private-key.key"
CA_CERT="shared/tls/ca-certificate.cert"

# Happens once for the CA

## generate CA private key (will be prompted for password)
openssl genrsa -des3 -out "${CA_KEY}" 2048

## generate CA root cert (this will be shared with clients)
openssl req -x509 -new -nodes -key "${CA_KEY}" \
    -sha256 -days 365 -out "${CA_CERT}"


# Happens for each new certificate
key_dir="recipe-api/tls"
cert_dir="shared/tls"
system_name="producer"

## generate private key for the service
openssl genrsa -out "${key_dir}/${system_name}-private-key.key" 2048

## generate CSR (certificate sign request) for the service (answer localhost for common name)
openssl req -new -key "${key_dir}/${system_name}-private-key.key" \
    -out "${key_dir}/${system_name}.csr"

## generate certificate for the service, signed by the CA
openssl x509 -req -in "${key_dir}/${system_name}.csr" \
    -CA "${CA_CERT}" \
    -CAkey "${CA_KEY}" -CAcreateserial \
    -out "${cert_dir}/${system_name}-certificate.cert" -days 365 -sha256

popd
