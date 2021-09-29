#!/usr/bin/env node

// npm install fastify@3.2 node-fetch@2.6
// Warning: Not as efficient as using a Reverse Proxy
const server = require('fastify')();
const fetch = require('node-fetch');
const https = require('https');
const fs = require('fs');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';
const VAULT_TOKEN = process.env.VAULT_TOKEN;
const VAULT_ADDR = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';


(async () => {
    const res = await fetch(
        `${VAULT_ADDR}/v1/pki_int/ca/pem`,
        { headers: { 'X-Vault-Token': `${VAULT_TOKEN}` } }
    );

    const ca1 = await res.text();

    const res2 = await fetch(
        `${VAULT_ADDR}/v1/pki/ca/pem`,
        { headers: { 'X-Vault-Token': `${VAULT_TOKEN}` } }
    );

    const ca2 = await res2.text();


    const ca = [ ca1, ca2 ];

    const res3 = await fetch(
        `${VAULT_ADDR}/v1/pki/crl/pem`,
        { headers: { 'X-Vault-Token': `${VAULT_TOKEN}` } }
    );

    const crl1 = await res3.text();

    const res4 = await fetch(
        `${VAULT_ADDR}/v1/pki_int/crl/pem`,
        { headers: { 'X-Vault-Token': `${VAULT_TOKEN}` } }
    );

    const crl2 = await res4.text();

    const crl = [ crl1, crl2 ];


    const options = {
        agent: new https.Agent({
            ca, crl
        })
    };

    server.get('/', async () => {
        const req = await fetch(`https://${TARGET}/recipes/42`, options);

        const producer_data = await req.json();

        return {
            consumer_pid: process.pid,
            producer_data
        };
    });

    server.listen(PORT, HOST, () => {
        console.log(`Consumer running at http://${HOST}:${PORT}/`);
    });
})();


