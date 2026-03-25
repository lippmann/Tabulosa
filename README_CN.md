# Tabulosa

一款帮助你在每次打开新标签页时学习词汇的浏览器扩展。将你的浏览习惯转化为高效的语言学习体验。

[English Documentation](./README.md)

## 功能特点

- **支持 11 种语言** - 西班牙语、法语、德语、意大利语、葡萄牙语、日语、韩语、中文、阿拉伯语、俄语和印地语
- **智能分级系统** - 所有语言支持 CEFR 等级（A1-C2），日语额外支持 JLPT 等级（N5-N1）
- **原生发音** - 使用语音合成技术听取地道的单词发音
- **例句学习** - 在真实语境中学习单词，附带母语例句
- **两种学习模式**：
  - **随机模式**：单词可重复出现，适合反复巩固
  - **一期一会模式**：每个单词只出现一次，直到学完所有单词
- **进度追踪** - 记录已学单词，收藏生词便于复习
- **简洁优雅的设计** - 奶油色背景搭配衬线字体，无干扰学习体验
- **离线可用** - 所有词汇本地存储，无需网络

## 支持的语言

| 语言 | 原生名称 | 等级系统 |
|------|----------|----------|
| 西班牙语 | Español | A1-C2 |
| 法语 | Français | A1-C2 |
| 德语 | Deutsch | A1-C2 |
| 意大利语 | Italiano | A1-C2 |
| 葡萄牙语 | Português | A1-C2 |
| 日语 | 日本語 | JLPT N5-N1 |
| 韩语 | 한국어 | A1-C2 |
| 中文 | 中文 | A1-C2 |
| 阿拉伯语 | العربية | A1-C2 |
| 俄语 | Русский | A1-C2 |
| 印地语 | हिन्दी | A1-C2 |

## 安装方法

### 从源码构建

1. **克隆仓库**
   ```bash
   git clone https://github.com/your-username/tabulosa.git
   cd tabulosa
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **构建 Chrome 版本**
   ```bash
   pnpm build
   ```

4. **加载扩展**
   - 打开 Chrome 浏览器，访问 `chrome://extensions/`
   - 开启右上角的「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择项目中的 `.output/chrome-mv3` 目录

### Firefox 用户

```bash
pnpm build:firefox
```

然后在 Firefox 的 `about:debugging` 页面加载 `.output/firefox-mv2` 目录。

## 开发

```bash
# 启动开发服务器（支持热更新）
pnpm dev

# 在浏览器中预览（用于 UI 开发）
pnpm dev:preview
```

## 技术栈

- **框架**: [WXT](https://wxt.dev/) - 现代化浏览器扩展开发框架
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **状态管理**: Jotai
- **动画**: Motion
- **构建工具**: Vite

## 项目结构

```
.
├── entrypoints/
│   └── newtab/              # 新标签页
│       ├── App.tsx          # 主应用组件
│       ├── components/      # UI 组件
│       ├── hooks/           # 自定义 Hooks
│       └── lib/             # 工具函数
├── public/
│   ├── data/                # 词汇 JSON 文件
│   │   ├── spanish.json
│   │   ├── french.json
│   │   └── ...
│   └── flags/               # SVG 国旗图标
├── assets/                  # 扩展图标
└── wxt.config.ts           # WXT 配置文件
```

## 等级说明

### CEFR 等级（欧洲语言共同参考框架）

| 等级 | 名称 | 描述 | 词汇量 |
|------|------|------|--------|
| A1 | 入门 | 基础日常交流 | 900-1,000 词 |
| A2 | 初级 | 简单日常情境 | 2,000-3,000 词 |
| B1 | 中级 | 独立交流 | 5,000-6,000 词 |
| B2 | 中高级 | 职场交流 | 7,000-8,000 词 |
| C1 | 高级 | 接近母语水平 | 10,000+ 词 |
| C2 | 精通 | 完全精通，母语般流利 | 15,000+ 词 |

### JLPT 等级（日本语能力测试）

| 等级 | 描述 | 词汇量 |
|------|------|--------|
| N5 | 基础日常对话 | 约 800 词 |
| N4 | 日常情境表达 | 约 1,500 词 |
| N3 | 抽象概念表达 | 约 3,750 词 |
| N2 | 商务会话、阅读报刊 | 约 6,000 词 |
| N1 | 学术讨论、阅读小说 | 约 10,000 词 |

## 自定义词汇

编辑 `public/data/` 目录下的 JSON 文件来添加或修改词汇：

```json
{
  "word": "hola",
  "cefr_level": "A1",
  "english_translation": "hello",
  "example_sentence_native": "¡Hola! ¿Cómo estás?",
  "example_sentence_english": "Hello! How are you?",
  "pos": "interjection",
  "word_frequency": 100
}
```

### 日语词汇格式

```json
{
  "word": "こんにちは",
  "jlpt_level": "N5",
  "english_translation": "hello",
  "example_sentence_native": "こんにちは、お元気ですか？",
  "example_sentence_english": "Hello, how are you?",
  "word_reading": "こんにちは",
  "romanization": "konnichiwa"
}
```

## 致谢

灵感来源于 [the-tab-of-words](https://github.com/kahosan/the-tab-of-words)。

## 许可证

MIT License
