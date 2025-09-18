# Ethereum Balance Fetcher

使用 Node.js 通过 JSON-RPC 获取任意以太坊地址的余额。默认使用 Cloudflare 提供的公共 RPC 节点，可通过环境变量覆盖。

## 准备

- Node.js 18 或更高版本（内置 `fetch` 支持可选，当前实现使用原生 `http/https`）。
- 如果有自己的节点或第三方 RPC 服务，将其 URL 放在环境变量 `ETH_RPC_URL` 中。

## 使用方法

```bash
node getBalance.js <以太坊地址>
```

示例：

```bash
ETH_RPC_URL=https://cloudflare-eth.com node getBalance.js 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe
```

输出包含地址、以 wei 为单位的余额，以及格式化后的 ETH 金额。

> **提示**：公共节点可能速率受限；在正式环境建议使用带密钥的服务（如 Infura、Alchemy 等），将其 JSON-RPC 端点配置到 `ETH_RPC_URL`。
