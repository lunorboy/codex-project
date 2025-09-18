# Ethereum Balance Fetcher

使用 Node.js 通过 JSON-RPC 查询任意以太坊地址的余额。内置默认 RPC 节点为 Cloudflare，亦可通过环境变量自定义。

## 功能亮点

- 纯 Node.js 实现，无需额外依赖或打包。
- 支持通过环境变量切换到私有节点或第三方服务。
- 输出原始 `wei` 数值与格式化后的 ETH 金额，便于脚本继续处理。

## 环境准备

- Node.js 18+（脚本使用原生 `http/https` 模块）。
- 可选：设置 `ETH_RPC_URL` 指向自有的 RPC 服务（如 Infura、Alchemy、Bloxroute 等）。

## 快速开始

1. 克隆或下载仓库。
2. 在项目根目录运行：

   ```bash
   node getBalance.js <以太坊地址>
   ```

   例如：

   ```bash
   ETH_RPC_URL=https://cloudflare-eth.com node getBalance.js 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe
   ```

## 示例输出

```
Address: 0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe
Balance (wei): 742351242455273044123
Balance (ETH): 742.351242455273044123
```

## 常见问题

- **收到 `Failed to fetch balance`？**
  - 检查地址是否为 0x 开头的 40 位十六进制字符串。
  - 确认 RPC 节点可用，必要时换用带密钥的付费服务。
- **是否可以集成到自动化脚本？** 可以，`getBalance.js` 导出的 CLI 可直接被其他 Node.js 或 shell 脚本调用。

> **提示**：公共节点通常存在速率限制与区域性阻断。如需批量查询或生产环境使用，建议配置专用的 RPC 服务端点到 `ETH_RPC_URL`。
