import React from 'react';
import { GameCard } from '../types';
import { Check, X, Sparkles } from 'lucide-react';
import GameButton from './GameButton';

interface PokemonCardProps {
  card: GameCard;
  onFlip: () => void;
  onAnswer: (correct: boolean) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ card, onFlip, onAnswer }) => {
  const isRevealed = card.status !== 'hidden';
  const isAnswered = card.status === 'answered_correct' || card.status === 'answered_wrong';

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.pokemonId}.png`;

  return (
    <div className="relative w-full aspect-[3/4] perspective-1000">
      <div 
        className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${isRevealed ? 'rotate-y-180' : ''}`}
      >
        {/* Front (Card Back) */}
        <div 
          onClick={!isRevealed ? onFlip : undefined}
          className="absolute w-full h-full backface-hidden rounded-2xl shadow-xl overflow-hidden cursor-pointer bg-red-500 border-4 border-slate-900 flex flex-col items-center justify-center hover:scale-[1.02] transition-transform"
          style={{
            background: 'linear-gradient(135deg, #ef4444 50%, #ffffff 50%)'
          }}
        >
          {/* Pokeball inner circle design */}
          <div className="w-16 h-16 bg-slate-900 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-10 h-10 bg-white rounded-full border-4 border-slate-400 animate-pulse"></div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full border-[12px] border-slate-900/10 pointer-events-none rounded-2xl"></div>
        </div>

        {/* Back (Card Face) */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-white rounded-2xl shadow-xl border-4 border-yellow-400 overflow-hidden flex flex-col">
          {/* Header with Tone Hint */}
          <div className="h-1/5 bg-yellow-100 flex items-center justify-center">
            <span className="text-4xl text-yellow-600 font-bold font-cartoon opacity-50">
               {card.pinyin.tone === 1 && '¯'}
               {card.pinyin.tone === 2 && '´'}
               {card.pinyin.tone === 3 && 'ˇ'}
               {card.pinyin.tone === 4 && '`'}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center relative p-2">
            {/* Pinyin Text */}
            <h2 className="text-6xl font-bold text-slate-800 mb-2 font-sans tracking-wide">
              {card.pinyin.display}
            </h2>

            {/* Pokemon Image */}
            <div className={`relative transition-all duration-500 ${isAnswered && card.status === 'answered_wrong' ? 'opacity-30 grayscale blur-sm' : ''}`}>
               <img 
                 src={imageUrl} 
                 alt="Pokemon" 
                 className="w-32 h-32 object-contain drop-shadow-md"
                 loading="lazy"
               />
               {card.status === 'answered_correct' && (
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Sparkles className="w-16 h-16 text-yellow-400 animate-bounce" />
                 </div>
               )}
            </div>
          </div>

          {/* Action Footer */}
          {!isAnswered ? (
             <div className="h-1/4 bg-slate-50 flex gap-2 p-2 items-center justify-center">
              <GameButton 
                variant="success" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); onAnswer(true); }}
                className="flex-1 text-xl font-bold"
              >
                <Check className="w-6 h-6" /> 对
              </GameButton>
              <GameButton 
                variant="danger" 
                size="sm" 
                onClick={(e) => { e.stopPropagation(); onAnswer(false); }}
                className="flex-1 text-xl font-bold"
              >
                <X className="w-6 h-6" /> 错
              </GameButton>
            </div>
          ) : (
            <div className={`h-12 flex items-center justify-center font-cartoon text-xl text-white ${card.status === 'answered_correct' ? 'bg-green-500' : 'bg-slate-400'}`}>
               {card.status === 'answered_correct' ? '太棒了!' : '下次加油!'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;