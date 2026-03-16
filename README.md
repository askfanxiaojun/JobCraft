# JobCraft · 求职面试助手

> 粘贴简历生成定制面试题 + 粘贴录音文本提取结构化问答，一站式搞定面试准备与复盘

体验地址：https://job-craft-gray.vercel.app/

<!-- 首页截图 -->
![JobCraft 主界面](./docs/screenshots/main.png)

---

## 它能做什么

面试准备最大的痛点是——**不知道面试官会问什么**；面试复盘最大的痛点是——**录音听完就忘，回答内容对不上号**。

JobCraft 用两个核心功能帮你解决这两个问题：

### 功能一：根据简历生成面试题

把简历粘贴进来，AI 自动生成两轮面试题：

| 面试阶段 | 考察重点 | 题目风格 |
|--------|--------|--------|
| **一面 · 专业执行力** | 项目经历、落地能力、协作沟通、量化成果 | 8-10 道 STAR 行为追问题 |
| **二面 · 思维力** | 发现问题、拆解分析、学习复盘、第一性原理 | 6-8 道开放性深度思考题 |

### 功能二：面试录音提取问答

把面试录音的 ASR 转录文本粘贴进来，AI 自动提取结构化的「问题 — 回答」：

- 忠实还原候选人的原始回答，不做润色改写
- 智能修正 ASR 语音识别错误（同音字、专业术语等）
- 自动识别追问（follow-up）并归属到主问题下
- 候选人反问环节单独归类

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

---

## 使用流程

应用顶部有两个标签页，对应两种使用场景：

**场景 A — 根据简历出题（面试前）**

```
切换到「根据简历出题」→ 粘贴简历 → 点击「生成面试题」→ 流式输出一面 + 二面题目
```

**场景 B — 面试录音提取（面试后）**

```
切换到「面试录音提取」→ 粘贴 ASR 转录文本 → 点击「提取问答」→ 流式输出结构化问答
```

两种场景的生成结果都会自动保存到历史记录，随时回顾。

---

## 功能特性

- **双模式** — 面试题生成 + 录音问答提取，覆盖面试准备到复盘的完整链路
- **流式输出** — 结果逐字生成，体验流畅
- **两阶段面试题** — 一面考察执行力，二面考察思维力
- **ASR 智能纠错** — 录音提取模式自动修正语音识别错误
- **本地持久化** — 简历、录音文本、API 配置、历史记录全部缓存在浏览器 localStorage
- **历史记录** — 最多保存 20 条记录，侧边栏一键回顾，自动区分两种模式
- **导出 Markdown** — 一键导出生成结果为 `.md` 文件
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
│   ├── Header.tsx             # 顶栏（设置 + 历史入口）
│   ├── ApiKeyModal.tsx        # API Key / Endpoint ID 配置弹窗
│   ├── ResumeEditor.tsx       # 简历编辑器
│   ├── TranscriptEditor.tsx   # 面试录音文本编辑器
│   ├── QuestionPanel.tsx      # 面试题展示（一面 + 二面，可折叠）
│   ├── ExtractionPanel.tsx    # 录音问答提取结果展示
│   └── HistoryPanel.tsx       # 历史记录侧边栏（区分两种模式）
├── hooks/
│   ├── useLocalStorage.ts     # 带跨 Tab 同步的 localStorage hook
│   └── useVolcanoApi.ts       # 火山引擎 SSE 流式调用（含中断）
├── utils/
│   ├── prompts.ts             # Prompt 模板（面试题生成 + 录音提取）
│   └── export.ts              # Markdown 导出工具
├── types/
│   └── index.ts               # TypeScript 类型定义
├── App.tsx                    # 主布局 + Tab 切换 + 生成/提取逻辑
├── main.tsx
└── index.css                  # Tailwind 入口 + 自定义样式
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
- [x] 导出面试题为 Markdown 文件
- [x] 面试录音文本 → 结构化问答提取
- [ ] 支持更多大模型供应商（OpenAI / Anthropic / DeepSeek 等）
- [ ] 后端服务 + 用户账号体系
- [ ] 模拟面试对话模式（AI 面试官角色扮演）
- [ ] 导出为 PDF

---

## 许可证

MIT
