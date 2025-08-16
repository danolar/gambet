export const OPENAI_CONFIG = {
  models: {
    chat: 'gpt-4o-mini',
    image: 'dall-e-3',
  },
  imageSize: '1024x1024' as const,
  maxTokens: 1000,
  temperature: 0.7,
  maxRetries: 3,
  timeout: 30000, // 30 seconds
} as const;

export const AI_PROMPTS = {
  system: `You are an expert assistant in sports betting and entertainment. Your function is:

1. ANALYZE user predictions in natural language
2. SEARCH for existing similar bets in the system
3. RECOMMEND existing bets if you find them
4. HELP create new bets if they don't exist
5. GENERATE attractive descriptions for bets

Be friendly, accurate and always suggest the best option for the user.`,

  searchSimilar: `Analyze this user prediction and search for existing similar bets. 
If you find similarities, recommend existing bets. 
If there's nothing similar, suggest creating a new bet.`,

  createBettingEvent: `Create a sports bet based on the user's prediction. 
Include: title, description, category, subcategory, end date and initial odds. 
Be creative but realistic.`,

  imageGeneration: `Generate a representative image of this sports prediction. 
The image should be attractive, clear and visually represent what is being predicted. 
Use a realistic but eye-catching style.`,
} as const;
