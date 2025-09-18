#!/usr/bin/env node
const http = require('http');
const https = require('https');

function formatEth(wei) {
  const weiStr = wei.toString();
  if (weiStr.length <= 18) {
    return `0.${weiStr.padStart(18, '0')}`.replace(/0+$/, '').replace(/\.$/, '') || '0';
  }
  const integerPart = weiStr.slice(0, -18);
  const fractionalPart = weiStr.slice(-18).replace(/0+$/, '');
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}

function jsonRpcRequest(url, data) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const requestUrl = new URL(url);
    const isHttps = requestUrl.protocol === 'https:';
    const client = isHttps ? https : http;
    const path = `${requestUrl.pathname || '/'}${requestUrl.search || ''}`;

    const options = {
      method: 'POST',
      hostname: requestUrl.hostname,
      path,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    if (requestUrl.port) {
      options.port = requestUrl.port;
    }

    if (requestUrl.username || requestUrl.password) {
      options.auth = `${decodeURIComponent(requestUrl.username)}:${decodeURIComponent(requestUrl.password)}`;
    }

    const req = client.request(options, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          if (result.error) {
            reject(new Error(result.error.message || 'RPC error'));
            return;
          }
          resolve(result.result);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function main() {
  const [, , address] = process.argv;
  if (!address) {
    console.error('Usage: node getBalance.js <ethereum-address>');
    process.exit(1);
  }

  const rpcUrl = process.env.ETH_RPC_URL || 'https://cloudflare-eth.com';

  try {
    const balanceHex = await jsonRpcRequest(rpcUrl, {
      jsonrpc: '2.0',
      method: 'eth_getBalance',
      params: [address, 'latest'],
      id: Date.now(),
    });

    if (!balanceHex) {
      throw new Error('Empty balance result from RPC');
    }

    const balanceWei = BigInt(balanceHex);
    console.log(`Address: ${address}`);
    console.log(`Balance (wei): ${balanceWei}`);
    console.log(`Balance (ETH): ${formatEth(balanceWei)}`);
  } catch (error) {
    console.error('Failed to fetch balance:', error.message);
    process.exit(1);
  }
}

main();
