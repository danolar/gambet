import OpenAI from 'openai';
import { OPENAI_CONFIG, AI_PROMPTS } from './config';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for development
});

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIChatResponse {
  content: string;
  suggestions?: string[];
  shouldCreateNew?: boolean;
  existingBets?: Array<{
    id: string;
    title: string;
    description: string;
    odds: number;
  }>;
}

export interface AIGeneratedBettingEvent {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  endDate: string;
  initialOdds: number;
  imagePrompt: string;
}

export class OpenAIService {
  // Chat with AI agent
  static async chatWithAgent(
    userMessage: string,
    conversationHistory: AIChatMessage[] = []
  ): Promise<AIChatResponse> {
    try {
      const messages: AIChatMessage[] = [
        { role: 'system', content: AI_PROMPTS.system },
        ...conversationHistory,
        { role: 'user', content: userMessage }
      ];

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.models.chat,
        messages,
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature,
      });

      const content = response.choices[0]?.message?.content || '';
      
      // Analyze response to determine if should create new bet
      const shouldCreateNew = content.toLowerCase().includes('create new') || 
                             content.toLowerCase().includes('doesn\'t exist') ||
                             content.toLowerCase().includes('new bet');

      return {
        content,
        shouldCreateNew,
        suggestions: this.extractSuggestions(content),
      };
    } catch (error) {
      console.error('Error in chat with agent:', error);
      throw new Error('Error communicating with AI agent');
    }
  }

  // Generate new bet based on prediction
  static async generateBettingEvent(
    userPrediction: string
  ): Promise<AIGeneratedBettingEvent> {
    try {
      const prompt = `${AI_PROMPTS.createBettingEvent}

User prediction: "${userPrediction}"

Respond in JSON format:
{
  "title": "Bet title",
  "description": "Detailed description",
  "category": "category",
  "subcategory": "subcategory",
  "endDate": "YYYY-MM-DD",
  "initialOdds": 2.5,
  "imagePrompt": "Prompt to generate representative image"
}`;

      const response = await openai.chat.completions.create({
        model: OPENAI_CONFIG.models.chat,
        messages: [
          { role: 'system', content: 'Respond only in valid JSON format.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: OPENAI_CONFIG.maxTokens,
        temperature: OPENAI_CONFIG.temperature,
      });

      const content = response.choices[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(content);
        return {
          title: parsed.title,
          description: parsed.description,
          category: parsed.category,
          subcategory: parsed.subcategory,
          endDate: parsed.endDate,
          initialOdds: parsed.initialOdds,
          imagePrompt: parsed.imagePrompt,
        };
      } catch {
        throw new Error('Error parsing AI agent response');
      }
    } catch (error) {
      console.error('Error generating bet:', error);
      throw new Error('Error generating bet');
    }
  }

  // Generate representative image
  static async generateImage(prompt: string): Promise<string> {
    try {
      const response = await openai.images.generate({
        model: OPENAI_CONFIG.models.image,
        prompt: `${AI_PROMPTS.imageGeneration} ${prompt}`,
        size: OPENAI_CONFIG.imageSize,
        quality: 'standard',
        n: 1,
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('Could not generate image');
      }

      const imageUrl = response.data[0]?.url;
      if (!imageUrl) {
        throw new Error('Could not generate image');
      }

      return imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Error generating image');
    }
  }

  // Extract suggestions from agent text
  private static extractSuggestions(content: string): string[] {
    const suggestions: string[] = [];
    
    // Search for suggestion patterns
    const suggestionPatterns = [
      /you can bet on:?\s*(.+?)(?=\n|\.|$)/gi,
      /i recommend:?\s*(.+?)(?=\n|\.|$)/gi,
      /there's a bet:?\s*(.+?)(?=\n|\.|$)/gi,
    ];

    suggestionPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        suggestions.push(...matches.map(match => match.replace(/^[^:]*:\s*/, '').trim()));
      }
    });

    return suggestions.filter(s => s.length > 0);
  }
}
