# JobCraft · 求职面试助手

> 面试题生成 + 录音问答提取 + 回答优化，一站式搞定面试准备、复盘与提升

体验地址：https://job-craft-gray.vercel.app/

---

## 它能做什么

JobCraft 围绕面试的三个阶段，提供三个对应的 AI 工具：

| 阶段 | 功能 | 你需要做的 | AI 帮你做的 |
|------|------|-----------|------------|
| **面试前** | 根据简历出题 | 粘贴简历 | 生成一面（执行力）+ 二面（思维力）定制面试题 |
| **面试后** | 录音问答提取 | 粘贴 ASR 转录文本 | 提取结构化「问题 - 回答」，修正语音识别错误 |
| **持续打磨** | 回答优化 | 输入面试题 + 你的回答 | 诊断问题、优化表达、给出建议、预判追问 |

---

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 http://localhost:5173 ，首次使用需配置 API：

- **API Key** — 火山引擎 API 密钥
- **Endpoint ID** — 推理接入点 ID（如 `ep-xxxxxxxx-xxxxx`）

> 前往 [火山引擎 Ark 控制台](https://console.volcengine.com/ark/region:ark+cn-beijing/endpoint) 获取。配置仅保存在浏览器本地，不会上传到任何服务器。

---

## 三大功能详解

### 1. 根据简历生成面试题

粘贴简历内容，AI 自动生成两轮面试题：

- **一面 · 专业执行力** — 项目深挖、基本功、协作执行、数据实感，共 15-18 题
- **二面 · 思维力** — 问题发现力、思考深度、方法论、商业视野，共 15-18 题
- 每道题标注难度、考察点、面试官真实意图和答题建议

### 2. 面试录音提取问答

粘贴面试录音的 ASR 转录文本，AI 自动整理为结构化问答：

- 忠实还原候选人原始回答，不做润色改写
- 智能修正 ASR 识别错误（同音字、专业术语等）
- 自动识别追问并归属到主问题下
- 候选人反问环节单独归类

### 3. 面试回答优化

输入面试题和你的原始回答，AI 给出完整优化报告：

- **回答诊断** — 考察意图、原始亮点、主要问题
- **优化后的回答** — 保留真实经历，重组结构与表达
- **优化说明** — 逐项对比表格，说明改动原因
- **进阶建议** — 1-3 条可选采纳的强化方向
- **追问预判** — 面试官接下来可能问的问题

---

## 功能特性

- **三大模式** — 覆盖面试准备 → 复盘 → 提升的完整链路
- **流式输出** — 结果逐字生成，无需等待
- **本地持久化** — 所有输入内容和 API 配置缓存在浏览器 localStorage
- **历史记录** — 最多 20 条，侧边栏一键回顾，自动区分模式
- **导出 Markdown** — 一键导出结果为 `.md` 文件
- **随时中断** — 生成过程中可随时停止
- **响应式布局** — 桌面端左右分栏，移动端上下排列
- **纯前端** — 无需后端，数据不经过第三方

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
│   ├── Header.tsx             # 顶栏
│   ├── ApiKeyModal.tsx        # API 配置弹窗
│   ├── ResumeEditor.tsx       # 简历编辑器
│   ├── TranscriptEditor.tsx   # 录音文本编辑器
│   ├── AnswerEditor.tsx       # 回答优化输入（面试题 + 回答 + 补充信息）
│   ├── QuestionPanel.tsx      # 面试题展示（一面 + 二面）
│   ├── ExtractionPanel.tsx    # 录音问答提取结果展示
│   ├── OptimizePanel.tsx      # 回答优化报告展示
│   └── HistoryPanel.tsx       # 历史记录侧边栏
├── hooks/
│   ├── useLocalStorage.ts     # localStorage hook
│   └── useVolcanoApi.ts       # 火山引擎 SSE 流式调用
├── utils/
│   ├── prompts.ts             # 三套 Prompt 模板
│   └── export.ts              # Markdown 导出
├── types/
│   └── index.ts               # TypeScript 类型定义
├── App.tsx                    # 主布局 + Tab 切换 + 核心逻辑
├── main.tsx
└── index.css                  # Tailwind 入口
```

---

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 生产构建
npm run preview   # 预览生产构建
npm run lint      # ESLint 检查
```

---

## 路线图

- [x] 根据简历生成一面 + 二面面试题
- [x] 面试录音文本提取结构化问答
- [x] 面试回答优化（诊断 + 优化 + 建议 + 追问预判）
- [x] 流式输出 + 历史记录 + Markdown 导出
- [ ] 支持更多大模型供应商（OpenAI / Anthropic / DeepSeek 等）
- [ ] 模拟面试对话模式（AI 面试官角色扮演）
- [ ] 导出为 PDF
- [ ] 后端服务 + 用户账号体系

---

## 许可证

MIT
