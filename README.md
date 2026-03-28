# Vita Board - 企业级协作白板系统

基于 React + NestJS + PostgreSQL + Yjs + tldraw 的完整前后端可运行项目。

## 项目架构

- **前端 (`/frontend`)**: React, TypeScript, Vite, Zustand, Ant Design, tldraw v1, y-websocket
- **后端 (`/backend`)**: NestJS, TypeORM, PostgreSQL, Passport JWT, Swagger, Yjs WebSocket Server
- **基础设施**: Docker Compose (PostgreSQL, Redis, Backend, Frontend)

## 功能特性

1. **RBAC 权限控制**: 部门、角色、权限点管理，精确到按钮级。
2. **多租户/数据范围**: 按照部门隔离数据，管理员可看全部。
3. **多人实时协作**: 基于 Yjs 和 y-websocket，支持 tldraw 实时协同绘图。
4. **数据持久化**: 画布二进制数据存储至 PostgreSQL (BYTEA)，后端提供文档校验与 JWT 鉴权。

## 快速运行指南 (Docker 部署)

推荐使用 Docker Compose 一键启动所有服务：

```bash
docker-compose up -d --build
```

启动后：
- 前端地址：[http://localhost:5173](http://localhost:5173)
- 后端 API 地址：[http://localhost:3000/api](http://localhost:3000/api)
- Swagger 接口文档：[http://localhost:3000/api/docs](http://localhost:3000/api/docs)
- Yjs WebSocket 端口：1234

### 默认测试账号

系统在数据库初始化 (`init.sql`) 时已默认创建了超级管理员账号：

- **用户名**: `admin`
- **密码**: `123456`

## 本地开发指南

如果你希望在本地进行开发而不是使用 Docker：

### 1. 启动数据库

```bash
docker-compose up -d postgres redis
```

### 2. 启动后端

```bash
cd backend
npm install
npm run start:dev

# 在另一个终端启动 Yjs 服务
node yjs-server.js
```

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

## 目录结构说明

```text
.
├── docker-compose.yml       # 一键编排文件
├── init.sql                 # PostgreSQL 数据库初始化及 Seed 数据
├── backend/                 # NestJS 后端源码
│   ├── src/                 # 包含 Auth, Users, Roles, Depts, Whiteboards 模块
│   ├── yjs-server.js        # Yjs WebSocket 协同服务器
│   └── Dockerfile           # 后端容器构建配置
└── frontend/                # React 前端源码
    ├── src/
    │   ├── pages/           # 路由页面 (登录、白板、管理后台等)
    │   ├── store/           # Zustand 全局状态
    │   ├── utils/           # Axios 封装
    │   └── router/          # 路由配置与 AuthGuard
    └── Dockerfile           # 前端容器构建配置
```
