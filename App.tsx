import React, { useState, useEffect, useCallback } from 'react';
import { GamePhase, UserProgress, GameCard, PinyinData, CollectionItem } from './types';
import { PINYIN_DATABASE, TOTAL_ROUNDS, CARDS_PER_ROUND } from './constants';
import GameButton from './components/GameButton';
import PokemonCard from './components/PokemonCard';
import { BookOpen, Play, Trophy, RotateCcw, Home, Star, Sparkles } from 'lucide-react';

// --- Helper Functions ---

const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getStorage = (): UserProgress => {
  const saved = localStorage.getItem('poke_pinyin_progress');
  return saved ? JSON.parse(saved) : { collected: [] };
};

const saveStorage = (progress: UserProgress) => {
  localStorage.setItem('poke_pinyin_progress', JSON.stringify(progress));
};

// --- Main Component ---

const App: React.FC = () => {
  // Global State
  const [collection, setCollection] = useState<UserProgress>(getStorage());
  const [phase, setPhase] = useState<GamePhase>(GamePhase.WELCOME);

  // Session State
  const [currentRound, setCurrentRound] = useState(0);
  const [roundCards, setRoundCards] = useState<GameCard[]>([]);
  const [mistakes, setMistakes] = useState<GameCard[]>([]);
  const [newlyCollected, setNewlyCollected] = useState<GameCard[]>([]);
  
  // Review Mode Specifics
  const [reviewQueue, setReviewQueue] = useState<GameCard[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Effects
  useEffect(() => {
    saveStorage(collection);
  }, [collection]);

  // --- Logic ---

  const generateCardsForRound = useCallback(() => {
    const collectedPinyins = new Set(collection.collected.map(c => c.pinyinDisplay));
    
    // Separate uncollected and collected
    const uncollectedPool = PINYIN_DATABASE.filter(p => !collectedPinyins.has(p.display));
    const collectedPool = PINYIN_DATABASE.filter(p => collectedPinyins.has(p.display));

    const selectedPinyins: PinyinData[] = [];

    // Bias towards uncollected
    for (let i = 0; i < CARDS_PER_ROUND; i++) {
      // 80% chance to pick uncollected if available
      const useUncollected = uncollectedPool.length > 0 && (Math.random() < 0.8 || collectedPool.length === 0);
      
      let pool = useUncollected ? uncollectedPool : collectedPool;
      if (pool.length === 0) pool = PINYIN_DATABASE; // Fallback

      const randomIndex = getRandomInt(0, pool.length - 1);
      selectedPinyins.push(pool[randomIndex]);
    }

    // Generate GameCards
    const newCards: GameCard[] = selectedPinyins.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      pinyin: p,
      // Random Gen 1 Pokemon (1-151)
      pokemonId: getRandomInt(1, 151),
      status: 'hidden',
    }));

    setRoundCards(newCards);
  }, [collection]);

  const startGame = () => {
    setMistakes([]);
    setNewlyCollected([]);
    setCurrentRound(1);
    generateCardsForRound();
    setPhase(GamePhase.PLAYING);
  };

  const handleCardFlip = (cardId: string) => {
    // Only allow one revealed card at a time if none are answered? 
    // Or just reveal it. Let's just reveal it.
    setRoundCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, status: 'revealed' } : c
    ));
  };

  const handleCardAnswer = (cardId: string, correct: boolean) => {
    // Update card status
    setRoundCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, status: correct ? 'answered_correct' : 'answered_wrong' } : c
    ));

    const card = roundCards.find(c => c.id === cardId);
    if (!card) return;

    if (!correct) {
      setMistakes(prev => [...prev, card]);
    } else {
      // If correct and NOT in review mode, we track it for potential collection
      // We process collection at the very end
    }

    // Check if round is complete after a short delay
    setTimeout(() => {
      checkRoundCompletion(cardId);
    }, 1000);
  };

  const checkRoundCompletion = (lastActionCardId: string) => {
    // We need to look at the state *after* the update. 
    // Since state update is async, we can check roundCards logic but we need to be careful.
    // simpler: check if all cards in the current visible set are answered.
    // NOTE: 'roundCards' inside this closure is stale. 
    // We need to rely on the effect or functional update, but functional update doesn't trigger side effects easily.
    // Let's use a ref or check via a useEffect, BUT simply passing the updated status in handleCardAnswer's logic is cleaner for a small app.
    // Re-calculating using the setter to be safe.
    
    setRoundCards(currentCards => {
      const allAnswered = currentCards.every(c => c.status === 'answered_correct' || c.status === 'answered_wrong');
      
      if (allAnswered) {
        // Round Finished
        if (currentRound < TOTAL_ROUNDS) {
          // Next Round
          setTimeout(() => {
            setCurrentRound(r => r + 1);
            generateCardsForRound();
          }, 500);
        } else {
          // Game Finished -> Review or Summary
          setTimeout(() => {
             transitionToEndGame();
          }, 500);
        }
      }
      return currentCards;
    });
  };

  const transitionToEndGame = () => {
    // Check mistakes using functional update to ensure fresh state
    setMistakes(currentMistakes => {
      if (currentMistakes.length > 0) {
        setReviewQueue([...currentMistakes]);
        setCurrentReviewIndex(0);
        setPhase(GamePhase.REVIEW);
      } else {
        processResults([]); // No extra collected from review
        setPhase(GamePhase.SUMMARY);
      }
      return currentMistakes;
    });
  };

  const handleReviewAnswer = (correct: boolean) => {
    const currentCard = reviewQueue[currentReviewIndex];
    if (correct) {
      // Mark as corrected locally for animation (not needed as we switch card immediately usually)
      // Remove from queue logic:
      const nextIndex = currentReviewIndex + 1;
      if (nextIndex < reviewQueue.length) {
        setCurrentReviewIndex(nextIndex);
      } else {
        // Review done!
        // In review mode, if they get it right, we count it as "learned" this session?
        // Let's be generous: yes, but maybe mark it differently. 
        // For simplicity, we just finish.
        processResults(reviewQueue); // Pass review queue if we want to add them. 
        // Actually, logic said: "Only in review mode if clicked 'correct' it gets added".
        // Play regular session: Correct -> Added. Wrong -> Mistake.
        // Review session: Correct -> Added.
        // So we need to calculate all "Correct" cards from the session + review.
        setPhase(GamePhase.SUMMARY);
      }
    } else {
      // If wrong again in review? Just shake or loop? 
      // Let's just keep it there or simple: move to next but don't collect.
      // Strict Mode: Must get it right.
      alert("再试一次！跟读一下： " + currentCard.pinyin.display);
    }
  };

  const processResults = (reviewedCards: GameCard[]) => {
    // 1. Identify all cards from rounds that were correct on first try.
    // We don't have a persistent "allSessionCards" state, so we might have lost them if we reset roundCards.
    // FIX: We need to track 'collectedCandidates' throughout the game.
    // RE-ARCHITECT: Let's calculate purely based on what is NOT in mistakes (first try) + what was fixed in Review.
    
    // Actually, simpler:
    // We only need to show "New Pokemon Found".
    // Let's filter mistakes out.
    // Wait, roundCards gets overwritten. 
    // We need to store successful cards as we go.
  };

  // Improved Collection Logic Hook
  const [sessionSuccesses, setSessionSuccesses] = useState<GameCard[]>([]);
  
  // Patch handleCardAnswer to store success
  const handleCardAnswerWithCollection = (cardId: string, correct: boolean) => {
    setRoundCards(prev => {
      const card = prev.find(c => c.id === cardId);
      if (card && correct) {
        setSessionSuccesses(s => [...s, card]);
      }
      return prev.map(c => c.id === cardId ? { ...c, status: correct ? 'answered_correct' : 'answered_wrong' } : c);
    });

    const card = roundCards.find(c => c.id === cardId);
    if (card && !correct) {
       setMistakes(prev => [...prev, card]);
    }

    setTimeout(() => {
      checkRoundCompletion(cardId);
    }, 800);
  };

  // Finalize Collection
  useEffect(() => {
    if (phase === GamePhase.SUMMARY) {
      const newItems: CollectionItem[] = [];
      const currentCollectionPinyins = new Set(collection.collected.map(c => c.pinyinDisplay));

      // 1. Cards correct on first try
      sessionSuccesses.forEach(card => {
        if (!currentCollectionPinyins.has(card.pinyin.display)) {
          newItems.push({
            pinyinDisplay: card.pinyin.display,
            pokemonId: card.pokemonId,
            dateCollected: Date.now()
          });
          currentCollectionPinyins.add(card.pinyin.display); // Avoid dupes in same session
        }
      });

      // 2. Cards corrected in Review (Assume all in ReviewQueue were eventually Corrected to get here)
      // Note: In strict review, we forced them to be correct.
      reviewQueue.forEach(card => {
         if (!currentCollectionPinyins.has(card.pinyin.display)) {
          newItems.push({
            pinyinDisplay: card.pinyin.display,
            pokemonId: card.pokemonId,
            dateCollected: Date.now()
          });
          currentCollectionPinyins.add(card.pinyin.display);
        }
      });

      if (newItems.length > 0) {
        setCollection(prev => ({
          collected: [...prev.collected, ...newItems]
        }));
        
        // Convert to GameCards for display
        const displayCards: GameCard[] = newItems.map(item => ({
          id: 'summary-' + item.pinyinDisplay,
          pinyin: PINYIN_DATABASE.find(p => p.display === item.pinyinDisplay)!,
          pokemonId: item.pokemonId,
          status: 'revealed'
        }));
        setNewlyCollected(displayCards);
      }
    }
  }, [phase]); // Runs once when entering Summary

  // --- Views ---

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center h-full p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-cartoon text-yellow-500 drop-shadow-lg tracking-wider">
          拼音大冒险
        </h1>
        <p className="text-xl text-slate-500 font-bold">Poké Pinyin Adventure</p>
      </div>
      
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
        <GameButton size="xl" onClick={startGame} className="relative">
           <Play className="w-8 h-8 mr-2" /> 开始冒险
        </GameButton>
      </div>

      <GameButton variant="secondary" size="lg" onClick={() => setPhase(GamePhase.POKEDEX)}>
        <BookOpen className="w-6 h-6 mr-2" /> 我的图鉴
      </GameButton>
    </div>
  );

  const renderPlaying = () => (
    <div className="flex flex-col h-full p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border-2 border-slate-100">
           <span className="font-bold text-slate-400">ROUND</span>
           <span className="ml-2 text-2xl font-cartoon text-blue-500">{currentRound} / {TOTAL_ROUNDS}</span>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border-2 border-slate-100 flex items-center gap-2">
           <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
           <span className="font-bold text-slate-600">{sessionSuccesses.length}</span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-items-center pb-20">
        {roundCards.map(card => (
          <div key={card.id} className="w-48 md:w-56">
            <PokemonCard 
              card={card} 
              onFlip={() => handleCardFlip(card.id)}
              onAnswer={(correct) => handleCardAnswerWithCollection(card.id, correct)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderReview = () => {
    const card = reviewQueue[currentReviewIndex];
    // Create a temp object with revealed status for the UI
    const reviewCard = { ...card, status: 'revealed' as const }; 

    return (
      <div className="flex flex-col items-center justify-center h-full p-6 bg-red-50">
        <h2 className="text-3xl font-cartoon text-red-500 mb-8 animate-bounce">
          复习时间! (Review Time)
        </h2>
        <div className="w-64 mb-8">
           <PokemonCard 
             card={reviewCard} 
             onFlip={() => {}} // Already flipped
             onAnswer={handleReviewAnswer}
           />
        </div>
        <p className="text-slate-500 font-bold">
           还有 {reviewQueue.length - currentReviewIndex} 个错题
        </p>
      </div>
    );
  };

  const renderSummary = () => (
    <div className="flex flex-col items-center h-full p-6 overflow-y-auto no-scrollbar">
      <h2 className="text-4xl font-cartoon text-green-500 mb-2 mt-8">今日成果</h2>
      <p className="text-slate-500 mb-8 font-bold">Session Complete!</p>
      
      {newlyCollected.length > 0 ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
            <Sparkles className="text-yellow-400" />
            新抓到的宝可梦 ({newlyCollected.length})
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {newlyCollected.map((card) => (
              <div key={card.id} className="flex flex-col items-center bg-yellow-50 rounded-xl p-2">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${card.pokemonId}.png`}
                  className="w-16 h-16 object-contain"
                  alt=""
                />
                <span className="font-bold text-slate-700">{card.pinyin.display}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-12 text-2xl text-slate-400 font-cartoon">
          这次没有抓到新的宝可梦... 加油!
        </div>
      )}

      <div className="flex gap-4 w-full max-w-md">
        <GameButton variant="secondary" onClick={() => {
            setSessionSuccesses([]); // Reset
            setPhase(GamePhase.WELCOME);
        }} className="flex-1">
          <Home className="mr-2" /> 主页
        </GameButton>
        <GameButton onClick={() => {
            setSessionSuccesses([]); // Reset
            startGame();
        }} className="flex-1">
          <RotateCcw className="mr-2" /> 再玩一次
        </GameButton>
      </div>
    </div>
  );

  const renderPokedex = () => {
    // Sort collected by date
    const sorted = [...collection.collected].sort((a, b) => b.dateCollected - a.dateCollected);

    return (
      <div className="flex flex-col h-full bg-slate-100">
        <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => setPhase(GamePhase.WELCOME)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
            <Home className="text-slate-600" />
          </button>
          <h2 className="text-2xl font-cartoon text-slate-700">我的图鉴 ({collection.collected.length})</h2>
          <div className="w-10"></div> {/* Spacer */}
        </div>
        
        <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 overflow-y-auto pb-20">
          {sorted.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm p-2 flex flex-col items-center border-b-4 border-slate-200">
               <span className="text-xl font-bold text-slate-800 mb-1">{item.pinyinDisplay}</span>
               <img 
                 src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.pokemonId}.png`}
                 className="w-20 h-20 object-contain"
                 loading="lazy"
                 alt=""
               />
            </div>
          ))}
          
          {/* Fillers for empty state or just placeholders logic is complex, sticking to collected list */}
          {sorted.length === 0 && (
             <div className="col-span-full py-20 text-center text-slate-400">
                <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>还没有收集到宝可梦哦！<br/>快去冒险吧！</p>
             </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full w-full max-w-4xl mx-auto bg-yellow-50 shadow-2xl overflow-hidden relative">
      {phase === GamePhase.WELCOME && renderWelcome()}
      {phase === GamePhase.PLAYING && renderPlaying()}
      {phase === GamePhase.REVIEW && renderReview()}
      {phase === GamePhase.SUMMARY && renderSummary()}
      {phase === GamePhase.POKEDEX && renderPokedex()}
    </div>
  );
};

export default App;