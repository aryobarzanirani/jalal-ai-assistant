// multi-router.js
const MODELS = {
  fast: {
    name: "gemini-2.0-flash-exp",
    temperature: 0.7,
    maxTokens: 8192
  },
  quality: {
    name: "gemini-2.5-pro-exp-03-25", // یا هر مدلی که داری
    temperature: 0.6,
    maxTokens: 16000
  },
  reasoning: {
    name: "gemini-2.5-pro-exp-03-25",
    temperature: 0.3,
    maxTokens: 16000
  }
};

export async function smartRoute(env, message, memoryContext) {
  const priority = message.priority || 5;
  const hasMedia = !!message.photo || !!message.voice || !!message.video;
  const isComplex = message.text.length > 300 || 
                   /محاسبه|برنامه|سرمایه|سفر|تحلیل|خلاصه/.test(message.text);

  let modelType = "fast";

  if (hasMedia || isComplex || priority >= 8) {
    modelType = "quality";
  }
  if (/برنامه ریزی|تحلیل عمیق|سرمایه گذاری|دوبله/.test(message.text)) {
    modelType = "reasoning";
  }

  const model = MODELS[modelType];
  
  // اینجا بعداً می‌توانیم Claude یا Grok را هم اضافه کنیم
  return {
    model: model.name,
    config: model,
    reason: modelType
  };
}
