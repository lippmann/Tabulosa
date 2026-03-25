# Tabulosa

A browser extension that helps you learn vocabulary every time you open a new tab. Transform your browsing habits into a powerful language learning experience.

[中文文档](./README_CN.md)

## Features

- **11 Languages Supported** - Spanish, French, German, Italian, Portuguese, Japanese, Korean, Mandarin, Arabic, Russian, and Hindi
- **Smart Level System** - CEFR levels (A1-C2) for all languages, JLPT levels (N5-N1) for Japanese
- **Native Audio Pronunciation** - Listen to authentic pronunciation with text-to-speech
- **Example Sentences** - Learn words in context with native example sentences
- **Two Learning Modes**:
  - **Random Mode**: Words can appear multiple times, perfect for reinforcement
  - **Ichigo Ichie Mode**: Each word appears only once until you've learned them all
- **Progress Tracking** - Track learned words and save favorites for review
- **Clean, Minimal Design** - Distraction-free learning with a warm cream background and elegant typography
- **Offline Ready** - All vocabulary stored locally, works without internet

## Supported Languages

| Language | Native Name | Levels |
|----------|-------------|--------|
| Spanish | Español | A1-C2 |
| French | Français | A1-C2 |
| German | Deutsch | A1-C2 |
| Italian | Italiano | A1-C2 |
| Portuguese | Português | A1-C2 |
| Japanese | 日本語 | JLPT N5-N1 |
| Korean | 한국어 | A1-C2 |
| Mandarin | 中文 | A1-C2 |
| Arabic | العربية | A1-C2 |
| Russian | Русский | A1-C2 |
| Hindi | हिन्दी | A1-C2 |

## Installation

### From Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tabulosa.git
   cd tabulosa
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Build for Chrome**
   ```bash
   pnpm build
   ```

4. **Load the extension**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `.output/chrome-mv3` folder

### Firefox

```bash
pnpm build:firefox
```

Then load the `.output/firefox-mv2` folder in `about:debugging`.

## Development

```bash
# Start development server with hot reload
pnpm dev

# Preview in browser (for UI development)
pnpm dev:preview
```

## Tech Stack

- **Framework**: [WXT](https://wxt.dev/) - Modern Web Extension framework
- **UI**: React 19 + TypeScript
- **Styling**: Tailwind CSS 4
- **State Management**: Jotai
- **Animation**: Motion
- **Build Tool**: Vite

## Project Structure

```
.
├── entrypoints/
│   └── newtab/              # New tab page
│       ├── App.tsx          # Main application
│       ├── components/      # UI components
│       ├── hooks/           # Custom React hooks
│       └── lib/             # Utility functions
├── public/
│   ├── data/                # Vocabulary JSON files
│   │   ├── spanish.json
│   │   ├── french.json
│   │   └── ...
│   └── flags/               # SVG flag icons
├── assets/                  # Extension icons
└── wxt.config.ts           # WXT configuration
```

## Level Reference

### CEFR Levels (Common European Framework of Reference)

| Level | Name | Description | Vocabulary |
|-------|------|-------------|------------|
| A1 | Beginner | Basic everyday communication | 900-1,000 words |
| A2 | Elementary | Simple daily situations | 2,000-3,000 words |
| B1 | Intermediate | Independent communication | 5,000-6,000 words |
| B2 | Upper-Intermediate | Professional communication | 7,000-8,000 words |
| C1 | Advanced | Near-native fluency | 10,000+ words |
| C2 | Proficiency | Full mastery, native-like | 15,000+ words |

### JLPT Levels (Japanese Language Proficiency Test)

| Level | Description | Vocabulary |
|-------|-------------|------------|
| N5 | Basic daily conversation | ~800 words |
| N4 | Everyday situations | ~1,500 words |
| N3 | Abstract concepts | ~3,750 words |
| N2 | Business conversations | ~6,000 words |
| N1 | Academic discussions | ~10,000 words |

## Customizing Vocabulary

Edit the JSON files in `public/data/` to add or modify vocabulary:

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

### For Japanese Words

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

## Acknowledgments

Inspired by [the-tab-of-words](https://github.com/kahosan/the-tab-of-words).

## License

MIT License
