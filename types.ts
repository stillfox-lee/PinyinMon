export enum GamePhase {
  WELCOME = 'WELCOME',
  PLAYING = 'PLAYING', // The 7 rounds
  REVIEW = 'REVIEW',   // Reviewing mistakes
  SUMMARY = 'SUMMARY', // End of session results
  POKEDEX = 'POKEDEX'  // View collection
}

export interface PinyinData {
  syllable: string; // e.g., "ba"
  display: string;  // e.g., "bà"
  tone: number;     // 1, 2, 3, 4
}

export interface PokemonData {
  id: number;
  name: string; // We might just use ID for images, but name is nice
}

// A specific instance of a card in a game session
export interface GameCard {
  id: string; // unique instance id
  pinyin: PinyinData;
  pokemonId: number;
  status: 'hidden' | 'revealed' | 'answered_correct' | 'answered_wrong';
  isReview?: boolean;
}

export interface CollectionItem {
  pinyinDisplay: string;
  pokemonId: number;
  dateCollected: number;
}

// Local Storage Schema
export interface UserProgress {
  collected: CollectionItem[];
}