# Tldraw + Yjs Multiplayer Whiteboard

这是一个基于 `@tldraw/tldraw` v1 和 Yjs 实现的多人实时协作白板示例项目。

## 技术栈

- **前端**: React, TypeScript, Vite
- **画板**: `@tldraw/tldraw` (v1)
- **协同**: `yjs`, `y-websocket`
- **后端**: Node.js, `ws`

## 功能特性

1. **完整白板功能**：支持画笔、图形、文本、框选、撤销/重做等（由 tldraw 提供）。
2. **实时同步**：基于 Yjs CRDT 算法和 WebSocket 广播，实现毫秒级多人同步。
3. **极简后端**：使用 Node.js + `ws` 构建轻量级 WebSocket 服务，负责房间数据与鼠标状态的广播。
4. **即开即用**：前端与后端已通过 `concurrently` 集成到单个启动脚本中。

## 运行说明

### 1. 安装依赖

确保你已经安装了 Node.js（推荐 v18+）。

```bash
npm install
```

### 2. 启动服务

使用以下命令同时启动前端 Vite 服务和后端 Node.js WebSocket 服务：

```bash
npm run dev
```

启动后：
- 前端页面将运行在: `http://localhost:3000`
- 后端 WebSocket 服务将运行在: `ws://localhost:1234`

### 3. 本地多开测试

1. 在浏览器中打开 `http://localhost:3000`。
2. 复制该页面地址，在新标签页或隐私窗口中再次打开。
3. 在任意一个页面上进行绘画，你将立即在另一个页面中看到同步的效果。

## 项目结构

- `/server.js`: Node.js WebSocket 极简后端服务。
- `/src/App.tsx`: 前端白板入口组件。
- `/src/useMultiplayerState.ts`: Yjs 与 tldraw v1 数据双向绑定的核心自定义 Hook。
- `/package.json`: 项目依赖及启动脚本配置。
