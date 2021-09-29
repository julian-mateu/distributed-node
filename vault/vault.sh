#!/bin/bash
set -e -o pipefail

# https://learn.hashicorp.com/tutorials/vault/pki-engine

docker run --cap-add=IPC_LOCK -d --name=dev-vault -p 8200:8200 vault server -dev

sleep 15

VAULT_ADDR="http://127.0.0.1:8200"
VAULT_TOKEN="$(docker logs dev-vault 2>&1 | grep Token | awk -F': ' '{print $2}')"

## Step 1: Generate Root CA

http -v "${VAULT_ADDR}/v1/sys/mounts/pki" X-Vault-Token:"${VAULT_TOKEN}" \
    type=pki

http -v "${VAULT_ADDR}/v1/sys/mounts/pki/tune" X-Vault-Token:"${VAULT_TOKEN}" \
    max_lease_ttl=87600h

http "${VAULT_ADDR}/v1/pki/root/generate/internal" X-Vault-Token:"${VAULT_TOKEN}" \
    common_name=example.com ttl=87600h |
    jq -r '.data.certificate' >ca-certificate.cert

http -v "${VAULT_ADDR}/v1/pki/config/urls" X-Vault-Token:"${VAULT_TOKEN}" \
    issuing_certificates="${VAULT_ADDR}/v1/pki/ca" \
    clr_distribution_points="${VAULT_ADDR}/v1/pki/crl"

## Step 2: Generate Intermediate CA

http -v "${VAULT_ADDR}/v1/sys/mounts/pki_int" X-Vault-Token:"${VAULT_TOKEN}" \
    type=pki

http -v "${VAULT_ADDR}/v1/sys/mounts/pki_int/tune" X-Vault-Token:"${VAULT_TOKEN}" \
    max_lease_ttl=43800h

http "${VAULT_ADDR}/v1/pki_int/intermediate/generate/internal" X-Vault-Token:"${VAULT_TOKEN}" \
    common_name="example.com Intermediate Authority" |
    jq -r '.data.csr' >intermediate.csr

http "${VAULT_ADDR}/v1/pki/root/sign-intermediate" X-Vault-Token:"${VAULT_TOKEN}" \
    csr="$(cat intermediate.csr)" \
    format=pem_bundle \
    ttl=43800h |
    jq -r '.data.certificate' >intermediate.cert

http -v "${VAULT_ADDR}/v1/pki_int/intermediate/set-signed" X-Vault-Token:"${VAULT_TOKEN}" \
    certificate="$(cat intermediate.cert)"

## Step 3: Create a Role

role_name="producer"
domain="localhost"

http -v "${VAULT_ADDR}/v1/pki_int/roles/${role_name}" X-Vault-Token:"${VAULT_TOKEN}" \
    allowed_domains="${domain}" \
    allow_subdomains=true \
    max_ttl=720h

## Step 4: Request certificates

http "${VAULT_ADDR}/v1/pki_int/issue/${role_name}" X-Vault-Token:"${VAULT_TOKEN}" \
    common_name="${domain}" \
    ttl=24h |
    jq >response.json

jq -r '.data.certificate' response.json >"${role_name}-certificate.cert"
jq -r '.data.private_key' response.json >"${role_name}-private-key.key"

rm -rf response.json

## Revoke cert

# http "${VAULT_ADDR}/v1/pki_int/revoke" X-Vault-Token:"${VAULT_TOKEN}" \
#     serial_number="${serial_number}"

## Tidy CA

# http "${VAULT_ADDR}/v1/pki_int/tidy" X-Vault-Token:"${VAULT_TOKEN}" \
#     tidy_cert_store=true \
#     tidy_revoked_certs=true
