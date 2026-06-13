# Kill Team Companion — 项目文档索引

> 🎯 AI 辅助开发时的主入口文档

## 项目概览

- **类型：** 单体 Web 应用（SPA）
- **主要语言：** JavaScript (ES Modules)
- **架构：** 模块化单体 + 回调注入解耦
- **构建工具：** Vite 6.3.5
- **框架：** 无（原生 JavaScript）

## 快速参考

| 项目 | 值 |
|------|-----|
| 入口文件 | `index.html` → `src/js/app.js` |
| 技术栈 | Vite + 原生 JS + CSS3 + Web Audio API |
| 架构模式 | 状态机 + 回调注入模式 |
| 代码规模 | ~5000行（14个文件） |
| 测试 | 无自动化测试（手动 + CLI demo 验证） |

## 生成文档

- [项目概览](./project-overview.md) — 项目简介、功能列表、代码规模
- [架构文档](./architecture.md) — 技术架构、数据模型、战斗系统、音效系统
- [源码树分析](./source-tree-analysis.md) — 目录结构、模块依赖图、入口点
- [组件清单](./component-inventory.md) — 模块清单、UI组件分类、函数一览
- [开发指南](./development-guide.md) — 环境配置、开发约定、常见任务

## Getting Started

```bash
npm install      # 安装依赖（仅 Vite）
npm run dev      # 启动开发服务器 → http://localhost:5173
npm run build    # 生产构建 → dist/
npm run demo     # CLI 战斗结算演示
```

## 扫描元数据

| 项目 | 值 |
|------|-----|
| 扫描模式 | 初始扫描 (initial_scan) |
| 扫描深度 | 深度扫描 (deep) |
| 扫描日期 | 2026-06-13 |
| 文档语言 | Chinese |
