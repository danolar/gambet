import React, { useState, useRef, useEffect } from 'react';
import { OpenAIService } from './openaiService';
import type { AIChatMessage, AIGeneratedBettingEvent } from './openaiService';

interface AIAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  onBettingEventCreated: (event: AIGeneratedBettingEvent & { imageUrl: string }) => void;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({
  isOpen,
  onClose,
  onBettingEventCreated,
}) => {
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'chat' | 'creating' | 'image-generation'>('chat');
  const [generatedEvent, setGeneratedEvent] = useState<AIGeneratedBettingEvent | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to end of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      role: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await OpenAIService.chatWithAgent(inputMessage, messages);
      
      const assistantMessage: AIChatMessage = {
        role: 'assistant',
        content: response.content,
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If agent suggests creating new bet, switch to creation mode
      if (response.shouldCreateNew) {
        setCurrentStep('creating');
        await handleCreateBettingEvent(inputMessage);
      }
    } catch {
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: 'Sorry, I had a problem processing your message. Can you try again?',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBettingEvent = async (userPrediction: string) => {
    try {
      setIsLoading(true);
      const event = await OpenAIService.generateBettingEvent(userPrediction);
      setGeneratedEvent(event);
      setCurrentStep('image-generation');
    } catch (error) {
      console.error('Error creating bet:', error);
      const errorMessage: AIChatMessage = {
        role: 'assistant',
        content: 'Error creating the bet. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
      setCurrentStep('chat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!generatedEvent) return;

    try {
      setIsGeneratingImage(true);
      const imageUrl = await OpenAIService.generateImage(generatedEvent.imagePrompt);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePublishAndBet = () => {
    if (generatedEvent && generatedImage) {
      onBettingEventCreated({
        ...generatedEvent,
        imageUrl: generatedImage,
      });
      onClose();
      resetChat();
    }
  };

  const handlePublishOnly = () => {
    if (generatedEvent && generatedImage) {
      onBettingEventCreated({
        ...generatedEvent,
        imageUrl: generatedImage,
      });
      onClose();
      resetChat();
    }
  };

  const resetChat = () => {
    setMessages([]);
    setCurrentStep('chat');
    setGeneratedEvent(null);
    setGeneratedImage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-lg font-semibold">🤖 AI Agent - Gambet Vision</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentStep === 'chat' && (
            <>
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-center text-gray-400">
                  <div className="text-4xl mb-2">🤖</div>
                  <p>Hello! I'm your AI assistant for betting.</p>
                  <p className="text-sm mt-2">
                    Tell me what you want to bet on in natural language, for example:
                  </p>
                  <p className="text-sm text-blue-400 mt-1">
                    "I think team X will win with more than 2 goals"
                  </p>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-200 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bet creation step */}
          {currentStep === 'creating' && generatedEvent && (
            <div className="space-y-4">
              <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">📝 Generated Bet</h4>
                <div className="space-y-2">
                  <p><strong>Title:</strong> {generatedEvent.title}</p>
                  <p><strong>Description:</strong> {generatedEvent.description}</p>
                  <p><strong>Category:</strong> {generatedEvent.category}</p>
                  <p><strong>Initial odds:</strong> {generatedEvent.initialOdds}x</p>
                  <p><strong>End date:</strong> {generatedEvent.endDate}</p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateImage}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                🎨 Generate Representative Image
              </button>
            </div>
          )}

          {/* Image generation step */}
          {currentStep === 'image-generation' && generatedEvent && (
            <div className="space-y-4">
              <div className="bg-blue-900 bg-opacity-20 border border-blue-500 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">📝 Generated Bet</h4>
                <div className="space-y-2">
                  <p><strong>Title:</strong> {generatedEvent.title}</p>
                  <p><strong>Description:</strong> {generatedEvent.description}</p>
                  <p><strong>Category:</strong> {generatedEvent.category}</p>
                  <p><strong>Initial odds:</strong> {generatedEvent.initialOdds}x</p>
                  <p><strong>End date:</strong> {generatedEvent.endDate}</p>
                </div>
              </div>

              {!generatedImage && (
                <button
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white py-2 px-4 rounded-lg"
                >
                  {isGeneratingImage ? '🎨 Generating image...' : '🎨 Generate Representative Image'}
                </button>
              )}

              {generatedImage && (
                <div className="space-y-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <h4 className="text-lg font-semibold mb-2">🖼️ Generated Image</h4>
                    <img
                      src={generatedImage}
                      alt="Generated prediction"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={handlePublishAndBet}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg"
                    >
                      🎯 Bet and Publish
                    </button>
                    <button
                      onClick={handlePublishOnly}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                    >
                      📢 Publish Only
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {currentStep === 'chat' && (
          <div className="p-4 border-t border-gray-700">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Write your prediction in natural language..."
                className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-6 py-2 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
