# JobCraft · 求职面试助手

> 粘贴简历，AI 帮你生成一面 + 二面的定制面试题

<!-- 首页截图 -->
![JobCraft 主界面](./docs/screenshots/main.png)

---

## 它能做什么

面试准备最大的痛点是——**不知道面试官会问什么**。

JobCraft 让你把简历粘贴进来，基于大模型自动生成两轮面试题：

| 面试阶段 | 考察重点 | 题目风格 |
|--------|--------|--------|
| **一面 · 专业执行力** | 项目经历、落地能力、协作沟通、量化成果 | 8-10 道 STAR 行为追问题 |
| **二面 · 思维力** | 发现问题、拆解分析、学习复盘、第一性原理 | 6-8 道开放性深度思考题 |

<!-- 面试题生成效果截图 -->
![面试题生成效果](./docs/screenshots/questions.png)

---

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器打开 http://localhost:5173 即可使用。

### 3. 配置 API

首次打开会弹出配置弹窗，需要填写：

- **API Key** — 火山引擎的 API 密钥
- **Endpoint ID** — 推理接入点 ID（如 `ep-xxxxxxxx-xxxxx`）

> 前往 [火山引擎 Ark 控制台](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint) 获取以上信息。配置保存在浏览器本地，不会上传到任何服务器。

<!-- API 配置弹窗截图 -->
![API 配置](./docs/screenshots/api-settings.png)

---

## 使用流程

```
粘贴/编写简历 → 点击「生成面试题」→ 流式输出一面 + 二面题目 → 自动保存到历史记录
```

1. 在左侧编辑器粘贴你的简历内容（Markdown 或纯文本均可，不限格式）
2. 点击「生成面试题」按钮
3. 右侧实时流式渲染面试题，先生成一面再生成二面
4. 生成完毕后自动存入历史记录，随时回顾

<!-- 使用流程动图（可选） -->
<!-- ![使用流程](./docs/screenshots/flow.gif) -->

---

## 功能特性

- **流式输出** — 面试题逐字生成，体验流畅
- **两阶段面试题** — 一面考察执行力，二面考察思维力，覆盖完整面试链路
- **本地持久化** — 简历、API 配置、历史记录全部缓存在浏览器 localStorage
- **历史记录** — 最多保存 20 条生成记录，侧边栏一键回顾
- **随时中断** — 生成过程中可随时停止
- **响应式布局** — 桌面端左右分栏，移动端上下排列
- **纯前端运行** — 无需后端，用户自行提供 API Key，数据不经过第三方

---

## 技术栈

| 类目 | 选型 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite 7 |
| 样式 | Tailwind CSS 4 |
| Markdown 渲染 | react-markdown + remark-gfm |
| 图标 | Lucide React |
| 大模型 API | 火山引擎豆包（兼容 OpenAI 接口格式） |

---

## 项目结构

```
src/
├── components/
│   ├── Header.tsx           # 顶栏（设置 + 历史入口）
│   ├── ApiKeyModal.tsx      # API Key / Endpoint ID 配置弹窗
│   ├── ResumeEditor.tsx     # 简历 Markdown 编辑器
│   ├── QuestionPanel.tsx    # 面试题展示（一面 + 二面，可折叠）
│   └── HistoryPanel.tsx     # 历史记录侧边栏
├── hooks/
│   ├── useLocalStorage.ts   # 带跨 Tab 同步的 localStorage hook
│   └── useVolcanoApi.ts     # 火山引擎 SSE 流式调用（含中断）
├── utils/
│   └── prompts.ts           # 两阶段面试题 Prompt 模板
├── types/
│   └── index.ts             # TypeScript 类型定义
├── App.tsx                  # 主布局 + 生成逻辑
├── main.tsx
└── index.css                # Tailwind 入口 + 自定义样式
```

---

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建（输出到 dist/）
npm run preview   # 预览生产构建
npm run lint      # ESLint 检查
```

---

## 路线图

- [x] 简历输入 + 两阶段面试题生成
- [x] 流式输出 + 生成进度展示
- [x] 本地历史记录
- [ ] 导出面试题为 PDF / Markdown 文件
- [ ] 支持更多大模型供应商（OpenAI / Anthropic / DeepSeek 等）
- [ ] 后端服务 + 用户账号体系
- [ ] 模拟面试对话模式（AI 面试官角色扮演）

---

## 许可证

MIT
