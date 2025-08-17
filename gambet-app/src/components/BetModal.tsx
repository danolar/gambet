import { useState } from 'react';
import type { Vision } from '../services/api';

interface BetModalProps {
  isOpen: boolean;
  onClose: () => void;
  vision: Vision;
}

export function BetModal({ isOpen, onClose, vision }: BetModalProps) {
  const [selectedToken, setSelectedToken] = useState('CHZ');
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calcular ganancia aproximada
  const potentialWinnings = amount ? parseFloat(amount) * (vision.odds || 1) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsSubmitting(true);
    
    try {
      // TODO: Implementar lógica de transacción blockchain
      console.log('Submitting bet:', {
        visionId: vision.id,
        token: selectedToken,
        amount: parseFloat(amount),
        potentialWinnings
      });
      
      // Simular delay de transacción
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cerrar modal después de éxito
      onClose();
    } catch (error) {
      console.error('Error submitting bet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-[#131549] border border-[#8fef70]/30 rounded-2xl p-6 w-full max-w-md mx-auto shadow-[0_0_30px_rgba(143,239,112,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="text-[#8fef70] hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Vision Info */}
        <div className="mb-6 p-4 bg-[#131549]/50 rounded-xl border border-[#8fef70]/20">
          <div className="flex items-center space-x-3 mb-3">
            <img 
              src={vision.image_data || vision.image_url || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center"} 
              alt={vision.title}
              className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold line-clamp-2 text-sm">{vision.title}</h3>
              <p className="text-[#8fef70] text-xs">{vision.category}</p>
            </div>
            <div className="bg-[#8fef70] text-[#131549] px-3 py-1 rounded-full text-sm font-bold flex-shrink-0">
              {vision.odds}x
            </div>
          </div>
        </div>

        {/* Bet Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Token Selector */}
          <div>
            <label className="block text-[#8fef70] text-sm font-medium mb-2">
              Select Token
            </label>
            <select
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              className="w-full bg-[#131549] border border-[#8fef70]/30 rounded-lg px-4 py-3 text-white focus:border-[#8fef70] focus:outline-none transition-colors"
            >
              <option value="CHZ">CHZ (Chiliz)</option>
              <option value="USDT">USDT</option>
              <option value="USDC">USDC</option>
            </select>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-[#8fef70] text-sm font-medium mb-2">
              Bet Amount ({selectedToken})
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full bg-[#131549] border border-[#8fef70]/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:border-[#8fef70] focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Potential Winnings */}
          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 bg-[#8fef70]/10 border border-[#8fef70]/30 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-[#8fef70] font-medium">Potential Winnings:</span>
                <span className="text-white font-bold text-lg">
                  {potentialWinnings.toFixed(2)} {selectedToken}
                </span>
              </div>
              <div className="text-[#8fef70]/70 text-sm mt-1">
                If you win, you'll receive {potentialWinnings.toFixed(2)} {selectedToken}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
            className="w-full bg-gradient-to-r from-[#8fef70] to-[#131549] text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(143,239,112,0.5)] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Confirm Bet'
            )}
          </button>
        </form>

        {/* Disclaimer */}
        <p className="text-xs text-white/50 text-center mt-4">
          By placing this bet, you agree to our terms and conditions. 
          Betting involves risk and you may lose your stake.
        </p>
      </div>
    </div>
  );
}
