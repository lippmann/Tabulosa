export default defineBackground(() => {
  console.log('Spanish Tab of Words - Background script loaded', { id: browser.runtime.id });

  // 监听来自 newtab 的 TTS 请求
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'TTS') {
      handleTTS(message.text)
        .then(audioUrl => {
          sendResponse({ success: true, audioUrl });
        })
        .catch(error => {
          sendResponse({ success: false, error: error.message });
        });
      return true; // 保持消息通道开放以进行异步响应
    }
  });

  // 使用 Google Translate TTS 或其他高质量 TTS 服务
  async function handleTTS(text: string): Promise<string> {
    // 使用 Google Translate TTS API
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=es&client=tw-ob&q=${encodeURIComponent(text)}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('TTS request failed');
      }
      
      const blob = await response.blob();
      // 创建 blob URL
      const blobUrl = URL.createObjectURL(blob);
      return blobUrl;
    } catch (error) {
      console.error('TTS error:', error);
      throw error;
    }
  }
});
