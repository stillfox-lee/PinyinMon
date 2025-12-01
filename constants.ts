import { PinyinData } from './types';

// A subset of common Pinyin for Grade 1-2 level
export const PINYIN_DATABASE: PinyinData[] = [
  { syllable: 'a', display: 'ā', tone: 1 }, { syllable: 'a', display: 'á', tone: 2 }, { syllable: 'a', display: 'ǎ', tone: 3 }, { syllable: 'a', display: 'à', tone: 4 },
  { syllable: 'o', display: 'ō', tone: 1 }, { syllable: 'o', display: 'ó', tone: 2 }, { syllable: 'o', display: 'ǒ', tone: 3 }, { syllable: 'o', display: 'ò', tone: 4 },
  { syllable: 'e', display: 'ē', tone: 1 }, { syllable: 'e', display: 'é', tone: 2 }, { syllable: 'e', display: 'ě', tone: 3 }, { syllable: 'e', display: 'è', tone: 4 },
  { syllable: 'yi', display: 'yī', tone: 1 }, { syllable: 'yi', display: 'yí', tone: 2 }, { syllable: 'yi', display: 'yǐ', tone: 3 }, { syllable: 'yi', display: 'yì', tone: 4 },
  { syllable: 'wu', display: 'wū', tone: 1 }, { syllable: 'wu', display: 'wú', tone: 2 }, { syllable: 'wu', display: 'wǔ', tone: 3 }, { syllable: 'wu', display: 'wù', tone: 4 },
  { syllable: 'yu', display: 'yū', tone: 1 }, { syllable: 'yu', display: 'yú', tone: 2 }, { syllable: 'yu', display: 'yǔ', tone: 3 }, { syllable: 'yu', display: 'yù', tone: 4 },
  { syllable: 'ba', display: 'bā', tone: 1 }, { syllable: 'ba', display: 'bá', tone: 2 }, { syllable: 'ba', display: 'bǎ', tone: 3 }, { syllable: 'ba', display: 'bà', tone: 4 },
  { syllable: 'pa', display: 'pā', tone: 1 }, { syllable: 'pa', display: 'pá', tone: 2 }, { syllable: 'pa', display: 'pǎ', tone: 3 }, { syllable: 'pa', display: 'pà', tone: 4 },
  { syllable: 'ma', display: 'mā', tone: 1 }, { syllable: 'ma', display: 'má', tone: 2 }, { syllable: 'ma', display: 'mǎ', tone: 3 }, { syllable: 'ma', display: 'mà', tone: 4 },
  { syllable: 'fa', display: 'fā', tone: 1 }, { syllable: 'fa', display: 'fá', tone: 2 }, { syllable: 'fa', display: 'fǎ', tone: 3 }, { syllable: 'fa', display: 'fà', tone: 4 },
  { syllable: 'da', display: 'dā', tone: 1 }, { syllable: 'da', display: 'dá', tone: 2 }, { syllable: 'da', display: 'dǎ', tone: 3 }, { syllable: 'da', display: 'dà', tone: 4 },
  { syllable: 'ta', display: 'tā', tone: 1 }, { syllable: 'ta', display: 'tá', tone: 2 }, { syllable: 'ta', display: 'tǎ', tone: 3 }, { syllable: 'ta', display: 'tà', tone: 4 },
  { syllable: 'na', display: 'nā', tone: 1 }, { syllable: 'na', display: 'ná', tone: 2 }, { syllable: 'na', display: 'nǎ', tone: 3 }, { syllable: 'na', display: 'nà', tone: 4 },
  { syllable: 'la', display: 'lā', tone: 1 }, { syllable: 'la', display: 'lá', tone: 2 }, { syllable: 'la', display: 'lǎ', tone: 3 }, { syllable: 'la', display: 'là', tone: 4 },
  { syllable: 'ga', display: 'gā', tone: 1 }, { syllable: 'ga', display: 'gá', tone: 2 }, { syllable: 'ga', display: 'gǎ', tone: 3 }, { syllable: 'ga', display: 'gà', tone: 4 },
  { syllable: 'ka', display: 'kā', tone: 1 }, { syllable: 'ka', display: 'ká', tone: 2 }, { syllable: 'ka', display: 'kǎ', tone: 3 }, { syllable: 'ka', display: 'kà', tone: 4 },
  { syllable: 'ha', display: 'hā', tone: 1 }, { syllable: 'ha', display: 'há', tone: 2 }, { syllable: 'ha', display: 'hǎ', tone: 3 }, { syllable: 'ha', display: 'hà', tone: 4 },
  { syllable: 'ji', display: 'jī', tone: 1 }, { syllable: 'ji', display: 'jí', tone: 2 }, { syllable: 'ji', display: 'jǐ', tone: 3 }, { syllable: 'ji', display: 'jì', tone: 4 },
  { syllable: 'qi', display: 'qī', tone: 1 }, { syllable: 'qi', display: 'qí', tone: 2 }, { syllable: 'qi', display: 'qǐ', tone: 3 }, { syllable: 'qi', display: 'qì', tone: 4 },
  { syllable: 'xi', display: 'xī', tone: 1 }, { syllable: 'xi', display: 'xí', tone: 2 }, { syllable: 'xi', display: 'xǐ', tone: 3 }, { syllable: 'xi', display: 'xì', tone: 4 },
  { syllable: 'zi', display: 'zī', tone: 1 }, { syllable: 'zi', display: 'zí', tone: 2 }, { syllable: 'zi', display: 'zǐ', tone: 3 }, { syllable: 'zi', display: 'zì', tone: 4 },
  { syllable: 'ci', display: 'cī', tone: 1 }, { syllable: 'ci', display: 'cí', tone: 2 }, { syllable: 'ci', display: 'cǐ', tone: 3 }, { syllable: 'ci', display: 'cì', tone: 4 },
  { syllable: 'si', display: 'sī', tone: 1 }, { syllable: 'si', display: 'sí', tone: 2 }, { syllable: 'si', display: 'sǐ', tone: 3 }, { syllable: 'si', display: 'sì', tone: 4 },
  { syllable: 'zhi', display: 'zhī', tone: 1 }, { syllable: 'zhi', display: 'zhí', tone: 2 }, { syllable: 'zhi', display: 'zhǐ', tone: 3 }, { syllable: 'zhi', display: 'zhì', tone: 4 },
  { syllable: 'chi', display: 'chī', tone: 1 }, { syllable: 'chi', display: 'chí', tone: 2 }, { syllable: 'chi', display: 'chǐ', tone: 3 }, { syllable: 'chi', display: 'chì', tone: 4 },
  { syllable: 'shi', display: 'shī', tone: 1 }, { syllable: 'shi', display: 'shí', tone: 2 }, { syllable: 'shi', display: 'shǐ', tone: 3 }, { syllable: 'shi', display: 'shì', tone: 4 },
  { syllable: 'ri', display: 'rì', tone: 4 },
  { syllable: 'ai', display: 'āi', tone: 1 }, { syllable: 'ei', display: 'ēi', tone: 1 }, { syllable: 'ui', display: 'uī', tone: 1 },
  { syllable: 'ao', display: 'āo', tone: 1 }, { syllable: 'ou', display: 'ōu', tone: 1 }, { syllable: 'iu', display: 'iū', tone: 1 },
  { syllable: 'ie', display: 'iē', tone: 1 }, { syllable: 'ue', display: 'uē', tone: 1 }, { syllable: 'er', display: 'ěr', tone: 3 },
  { syllable: 'an', display: 'ān', tone: 1 }, { syllable: 'en', display: 'ēn', tone: 1 }, { syllable: 'in', display: 'īn', tone: 1 },
  { syllable: 'un', display: 'ūn', tone: 1 }, { syllable: 'ang', display: 'āng', tone: 1 }, { syllable: 'eng', display: 'ēng', tone: 1 },
  { syllable: 'ing', display: 'īng', tone: 1 }, { syllable: 'ong', display: 'ōng', tone: 1 },
];

export const TOTAL_ROUNDS = 7;
export const CARDS_PER_ROUND = 3;