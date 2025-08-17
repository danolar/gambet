import React, { useState, useRef, useEffect } from 'react';
import { OpenAIService } from './openaiService';
import type { AIChatMessage, AIGeneratedBettingEvent } from './openaiService';

interface AIAgentChatProps {
  isOpen: boolean;
  onClose: () => void;
  onBettingEventCreated: (event: AIGeneratedBettingEvent & { imageUrl: string }) => void;
  walletAddress: string | null;
}

export const AIAgentChat: React.FC<AIAgentChatProps> = ({
  isOpen,
  onClose,
  onBettingEventCreated,
  walletAddress,
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
      const imageUrl = await OpenAIService.generateImage(generatedEvent.title);
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Error generating image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handlePublishBet = () => {
    if (!generatedEvent || !generatedImage) return;

    const eventWithImage = {
      ...generatedEvent,
      imageUrl: generatedImage,
    };

    onBettingEventCreated(eventWithImage);
  };

  const handleReset = () => {
    setMessages([]);
    setInputMessage('');
    setCurrentStep('chat');
    setGeneratedEvent(null);
    setGeneratedImage('');
    setGeneratedImage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a2e] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-[#8fef70]/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#8fef70]/20">
          <h2 className="text-2xl font-bold text-white">AI Betting Assistant</h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {currentStep === 'chat' && (
            <>
              {/* Welcome message */}
              {messages.length === 0 && (
                <div className="text-center text-white">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#8fef70] to-[#131549] rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold mb-2">Welcome to Gambet Vision!</p>
                  <p className="text-[#8fef70] mb-4">I'm your AI assistant for creating predictions.</p>
                  {walletAddress && (
                    <div className="mb-4 p-3 bg-[#8fef70]/10 border border-[#8fef70]/30 rounded-lg">
                      <p className="text-sm text-[#8fef70] mb-1">Connected Wallet:</p>
                      <p className="text-xs text-white font-mono">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-300 mb-2">
                    Tell me what you want to bet on in natural language, for example:
                  </p>
                  <p className="text-sm text-[#8fef70] font-medium">
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
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-[#8fef70] text-[#131549] font-medium'
                        : 'bg-white/10 text-white border border-[#8fef70]/30'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white px-4 py-3 rounded-2xl border border-[#8fef70]/30">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-[#8fef70] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#8fef70] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#8fef70] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Bet creation step */}
          {currentStep === 'creating' && generatedEvent && (
            <div className="space-y-4">
              <div className="bg-[#8fef70]/10 border-2 border-[#8fef70]/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#8fef70] mb-4">Generated Bet</h4>
                <div className="space-y-3 text-white">
                  <p><strong>Title:</strong> {generatedEvent.title}</p>
                  <p><strong>Description:</strong> {generatedEvent.description}</p>
                  <p><strong>Category:</strong> {generatedEvent.category}</p>
                  <p><strong>Initial odds:</strong> {generatedEvent.initialOdds}x</p>
                  <p><strong>End date:</strong> {generatedEvent.endDate}</p>
                </div>
              </div>
              
              <button
                onClick={handleGenerateImage}
                className="w-full bg-gradient-to-r from-[#8fef70] to-[#131549] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Generate Representative Image
              </button>
            </div>
          )}

          {/* Image generation step */}
          {currentStep === 'image-generation' && generatedEvent && (
            <div className="space-y-4">
              <div className="bg-[#8fef70]/10 border-2 border-[#8fef70]/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-[#8fef70] mb-4">Generated Bet</h4>
                <div className="space-y-3 text-white">
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
                  className="w-full bg-gradient-to-r from-[#8fef70] to-[#131549] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGeneratingImage ? 'Generating image...' : 'Generate Representative Image'}
                </button>
              )}

              {generatedImage && (
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-xl p-6 border border-[#8fef70]/30">
                    <h4 className="text-lg font-bold text-[#8fef70] mb-4">Generated Image</h4>
                    <img
                      src={generatedImage}
                      alt="Generated prediction"
                      className="w-full h-64 object-cover rounded-xl"
                    />
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handlePublishBet}
                      className="flex-1 bg-gradient-to-r from-[#8fef70] to-[#131549] text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Publish and Bet
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 bg-white/10 text-white py-3 px-6 rounded-xl font-semibold border border-[#8fef70]/30 hover:bg-[#8fef70]/20 transition-all duration-300"
                    >
                      Reset
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
          <div className="p-6 border-t border-[#8fef70]/30">
            <div className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Write your prediction in natural language..."
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-xl border border-[#8fef70]/30 focus:outline-none focus:ring-2 focus:ring-[#8fef70] focus:border-transparent placeholder-gray-400"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-[#8fef70] to-[#131549] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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
