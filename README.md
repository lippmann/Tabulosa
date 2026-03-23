# Spanish Tab of Words

一个帮助你在每次打开新标签页时学习西班牙语单词的 Chrome/Firefox 浏览器扩展。

## 功能特点

- 🎯 **新标签页学习** - 每次打开新标签页都会显示一个西班牙语单词
- 📚 **分级学习** - 支持初级、中级、高级等不同难度级别
- 🔊 **发音支持** - 点击即可听到单词的标准西班牙语发音
- 📖 **例句展示** - 每个单词都配有例句和中文翻译
- 🎨 **美观界面** - 简洁优雅的界面设计，学习体验舒适
- ⚙️ **灵活设置** - 可自定义学习模式、难度级别等

## 学习模式

### 随机模式
随机显示单词，可以重复学习，适合反复巩固。

### 一期一会模式
每个单词只会出现一次，学习完所有单词后会重新开始，适合系统学习。

## 安装方法

### 从源码构建

1. 克隆仓库
```bash
git clone <repository-url>
cd spanish-tab-of-words
```

2. 安装依赖
```bash
pnpm install
```

3. 构建扩展
```bash
pnpm build
```

4. 加载扩展
   - 打开 Chrome 浏览器，访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择项目中的 `.output/chrome-mv3` 目录

### Firefox 用户
```bash
pnpm build:firefox
```
然后在 Firefox 的 `about:debugging` 页面加载 `.output/firefox-mv2` 目录。

## 开发

### 预览模式
```bash
pnpm dev:preview
```
访问 http://localhost:5000 查看预览效果。

### 开发模式
```bash
pnpm dev
```
需要在系统中安装 Chrome 或 Chromium 浏览器。

## 项目结构

```
.
├── entrypoints/
│   └── newtab/          # 新标签页组件
│       ├── App.tsx      # 主应用组件
│       ├── components/  # UI 组件
│       ├── hooks/       # 自定义 Hooks
│       └── lib/         # 工具函数
├── public/
│   └── data/
│       └── words.json   # 单词数据库
└── wxt.config.ts        # WXT 配置文件
```

## 技术栈

- **框架**: WXT (Web Extension Tools)
- **UI**: React 19 + TypeScript
- **样式**: Tailwind CSS 4
- **动画**: Motion
- **状态管理**: Jotai

## 自定义单词

你可以编辑 `public/data/words.json` 文件来添加或修改单词：

```json
{
  "word": "hola",
  "meaning": "你好",
  "pronunciation": "/ˈola/",
  "example": "¡Hola! ¿Cómo estás?",
  "exampleTranslation": "你好！你好吗？",
  "level": 1,
  "category": "greetings"
}
```

字段说明：
- `word`: 西班牙语单词
- `meaning`: 中文含义
- `pronunciation`: 国际音标
- `example: 西班牙语例句
- `exampleTranslation`: 例句中文翻译
- `level`: 难度级别 (1-5)
- `category`: 单词分类

## 许可证

MIT License

## 致谢

本项目灵感来源于 [the-tab-of-words](https://github.com/kahosan/the-tab-of-words)，原项目用于学习日语单词。
