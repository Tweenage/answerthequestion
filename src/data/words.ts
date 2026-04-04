// TODO (Task 5): Migrate these 50 words to the new SpellingWord format (definitions array,
// wordFamily, theme, source, isFree, partOfSpeech, trickyIndices as array of tuples).
// For now they are stored in the old shape and cast via OldSpellingWord to avoid
// touching 50 individual entries before the bulk migration script is ready.

interface OldSpellingWord {
  id: string;
  word: string;
  definition: string;
  sentence: string;
  trickyIndices: [number, number];
  difficulty: 1 | 2 | 3;
  category?: string;
}

import type { SpellingWord } from '../types/spelling';
import { migrateWord } from './words/migrate';

const OLD_SPELLING_WORDS: OldSpellingWord[] = [
  // ── DIFFICULTY 1: Foundation ─────────────────────────────────────────────

  {
    id: 'word-001',
    word: 'necessary',
    definition: 'Something that must be done or must exist; you cannot do without it.',
    sentence: 'It is necessary to read the question carefully before choosing your answer.',
    trickyIndices: [2, 4],  // 'ces' — one c, two s (ne-C-es-SS-ary)
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-002',
    word: 'definitely',
    definition: 'Without any doubt; absolutely certain.',
    sentence: 'The scientist definitely proved her hypothesis with a series of careful experiments.',
    trickyIndices: [3, 5],  // 'ini' — often misspelled as 'itely' or 'ately'
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-003',
    word: 'separate',
    definition: 'To keep apart or divide; existing as distinct things.',
    sentence: 'The teacher asked the pupils to separate into two groups for the debate.',
    trickyIndices: [3, 3],  // 'a' — commonly misspelled as 'seperate'
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-004',
    word: 'because',
    definition: 'For the reason that; used to explain why something happens.',
    sentence: 'She studied hard every evening because she wanted to achieve top marks in the exam.',
    trickyIndices: [3, 5],  // 'aus' — the middle section that trips people up
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-005',
    word: 'believe',
    definition: 'To think that something is true or that someone is telling the truth.',
    sentence: 'Many historians believe that the ancient Egyptians developed one of the world\'s first writing systems.',
    trickyIndices: [3, 4],  // 'ie' — i before e rule
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-006',
    word: 'friend',
    definition: 'A person you like and enjoy spending time with; someone who helps you.',
    sentence: 'A true friend will support you even when your ideas are unusual or unpopular.',
    trickyIndices: [2, 3],  // 'ie' — i before e
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-007',
    word: 'receive',
    definition: 'To get or accept something that is given or sent to you.',
    sentence: 'The charity was delighted to receive a generous donation from the local business.',
    trickyIndices: [1, 2],  // 'ec' — e before i, exception to i-before-e rule
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-008',
    word: 'achieve',
    definition: 'To succeed in doing something difficult through effort and skill.',
    sentence: 'With dedication and practice, she was able to achieve her goal of playing in the county orchestra.',
    trickyIndices: [2, 3],  // 'hi' — the 'chi' combination often misspelled
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-009',
    word: 'height',
    definition: 'How tall or how high something or someone is.',
    sentence: 'The height of the cliff made the view across the valley truly breathtaking.',
    trickyIndices: [4, 5],  // 'gh' — the silent gh combination
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-010',
    word: 'weird',
    definition: 'Very strange or unusual in a way that is hard to explain.',
    sentence: 'The explorer described the weird bioluminescent creatures she discovered in the deep ocean.',
    trickyIndices: [1, 2],  // 'ei' — exception to i-before-e after c rule
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-011',
    word: 'February',
    definition: 'The second month of the year, which usually has 28 days.',
    sentence: 'The results of the election were announced on the first day of February.',
    trickyIndices: [1, 2],  // 'eb' then 'r' — the silent first 'r' (Feb-roo-ary)
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-012',
    word: 'Wednesday',
    definition: 'The third day of the working week, between Tuesday and Thursday.',
    sentence: 'The parliamentary debate was scheduled for Wednesday afternoon.',
    trickyIndices: [1, 2],  // 'ed' — the silent 'd' (Wednes-day)
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-013',
    word: 'conscience',
    definition: 'The inner sense that tells you whether what you are doing is right or wrong.',
    sentence: 'His conscience would not allow him to ignore the injustice he witnessed.',
    trickyIndices: [3, 6],  // 'scie' — the silent 'sc' and unusual vowel sequence
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-014',
    word: 'embarrass',
    definition: 'To make someone feel awkward, self-conscious, or ashamed in front of others.',
    sentence: 'She was careful not to embarrass her classmate by correcting him in front of everyone.',
    trickyIndices: [2, 4],  // 'bar' — double r and double s (em-B-ARR-ASS)
    difficulty: 1,
    category: 'common misspellings',
  },
  {
    id: 'word-015',
    word: 'particularly',
    definition: 'Especially; more than usual; in a specific or detailed way.',
    sentence: 'The judges were particularly impressed by the student\'s original approach to solving the problem.',
    trickyIndices: [7, 9],  // 'lar' — the '-larly' ending often shortened
    difficulty: 1,
    category: 'common misspellings',
  },

  // ── DIFFICULTY 2: Building ────────────────────────────────────────────────

  {
    id: 'word-016',
    word: 'phenomenon',
    definition: 'A remarkable or unusual event or fact that can be observed.',
    sentence: 'The northern lights are a breathtaking natural phenomenon that attracts tourists worldwide.',
    trickyIndices: [0, 4],  // 'pheno' — Greek ph spelling and unusual vowel run
    difficulty: 2,
    category: 'Greek roots',
  },
  {
    id: 'word-017',
    word: 'exhilarating',
    definition: 'Making you feel very excited, thrilled, and full of energy.',
    sentence: 'The pupils found the rocket-building competition exhilarating and decided to enter again next year.',
    trickyIndices: [2, 4],  // 'hil' — the silent 'h' after ex-
    difficulty: 2,
    category: 'commonly confused',
  },
  {
    id: 'word-018',
    word: 'enthusiasm',
    definition: 'A strong feeling of excitement and eagerness about something.',
    sentence: 'The young musician played with such enthusiasm that the audience gave a standing ovation.',
    trickyIndices: [2, 3],  // 'th' — Greek theta spelling
    difficulty: 2,
    category: 'Greek roots',
  },
  {
    id: 'word-019',
    word: 'melancholy',
    definition: 'A feeling of deep sadness or gloom that lasts for a long time.',
    sentence: 'A sense of melancholy settled over the village as the last train departed from the station.',
    trickyIndices: [5, 8],  // 'chol' — Greek khole spelling
    difficulty: 2,
    category: 'Greek roots',
  },
  {
    id: 'word-020',
    word: 'sufficient',
    definition: 'Enough to meet a need or requirement; as much as is needed.',
    sentence: 'The expedition team ensured they had sufficient supplies to last the entire three-week journey.',
    trickyIndices: [2, 4],  // 'ffi' — double f before 'ici'
    difficulty: 2,
    category: 'Latin roots',
  },
  {
    id: 'word-021',
    word: 'mischievous',
    definition: 'Playfully causing trouble or misbehaving in a way that is amusing rather than harmful.',
    sentence: 'The mischievous puppy had scattered newspapers across the entire kitchen floor.',
    trickyIndices: [5, 7],  // 'iev' — the 'ie' before 'vous' often garbled as 'ious'
    difficulty: 2,
    category: 'commonly confused',
  },
  {
    id: 'word-022',
    word: 'catastrophe',
    definition: 'A sudden, terrible event that causes a great deal of damage or suffering.',
    sentence: 'The burst dam was a catastrophe for the communities living in the valley below.',
    trickyIndices: [4, 7],  // 'stro' — the middle cluster people forget
    difficulty: 2,
    category: 'Greek roots',
  },
  {
    id: 'word-023',
    word: 'inconvenient',
    definition: 'Causing problems or difficulties; not easy or suitable at a particular time.',
    sentence: 'The road closure was extremely inconvenient for commuters travelling into the city centre.',
    trickyIndices: [2, 3],  // 'co' — then the double 'n' split by prefix
    difficulty: 2,
    category: 'prefixes',
  },
  {
    id: 'word-024',
    word: 'accommodate',
    definition: 'To provide space or room for something; to adapt to someone\'s needs.',
    sentence: 'The new sports hall was designed to accommodate up to five hundred spectators.',
    trickyIndices: [2, 4],  // 'com' — double c then double m (ac-CC-om-MM-odate)
    difficulty: 2,
    category: 'double letters',
  },
  {
    id: 'word-025',
    word: 'perseverance',
    definition: 'Continuing to try hard despite facing difficulties or setbacks.',
    sentence: 'Her perseverance in the face of repeated failure eventually led to a remarkable scientific breakthrough.',
    trickyIndices: [4, 6],  // 'eve' — the middle vowel section, often written 'erev'
    difficulty: 2,
    category: 'Latin roots',
  },
  {
    id: 'word-026',
    word: 'eloquent',
    definition: 'Able to express ideas clearly and beautifully in speech or writing.',
    sentence: 'The eloquent barrister swayed the jury with her carefully chosen words.',
    trickyIndices: [0, 2],  // 'elo' — opening vowels before 'qu'
    difficulty: 2,
    category: 'Latin roots',
  },
  {
    id: 'word-027',
    word: 'ambiguous',
    definition: 'Having more than one possible meaning; not clear or certain.',
    sentence: 'The politician\'s ambiguous statement left journalists unsure of her true intentions.',
    trickyIndices: [5, 7],  // 'ous' — the '-iguous' ending, not '-igious'
    difficulty: 2,
    category: 'Latin roots',
  },
  {
    id: 'word-028',
    word: 'transparent',
    definition: 'Something you can see through clearly; also means honest and open.',
    sentence: 'The government pledged to be fully transparent about how public funds were being spent.',
    trickyIndices: [5, 8],  // 'aren' — the middle vowel cluster
    difficulty: 2,
    category: 'Latin roots',
  },
  {
    id: 'word-029',
    word: 'diligent',
    definition: 'Working carefully and putting in a lot of effort consistently.',
    sentence: 'The diligent student reviewed her notes every evening and rarely missed a revision session.',
    trickyIndices: [3, 5],  // 'ige' — the soft g sound before 'ent'
    difficulty: 2,
    category: 'Latin roots',
  },

  // ── DIFFICULTY 3: Exam Ready ──────────────────────────────────────────────

  {
    id: 'word-030',
    word: 'tempestuous',
    definition: 'Very stormy and turbulent, or full of strong and uncontrolled emotions.',
    sentence: 'The tempestuous sea made the fishermen\'s voyage extremely dangerous.',
    trickyIndices: [4, 8],  // 'estu' — the middle cluster before '-ous'
    difficulty: 3,
    category: '-uous words',
  },
  {
    id: 'word-031',
    word: 'conscientious',
    definition: 'Taking great care to do everything correctly and thoroughly; very diligent.',
    sentence: 'The conscientious editor checked every fact in the article before it went to print.',
    trickyIndices: [3, 7],  // 'scie' — same silent cluster as conscience
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-032',
    word: 'meticulous',
    definition: 'Paying very close attention to detail and making sure everything is exactly right.',
    sentence: 'The archaeologist was meticulous in recording the precise location of each artefact she uncovered.',
    trickyIndices: [2, 4],  // 'tic' — the Latin '-ticu-' stem
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-033',
    word: 'flamboyant',
    definition: 'Very confident and showy; dressing or behaving in a very noticeable, colourful way.',
    sentence: 'The flamboyant designer arrived at the ceremony draped in a vivid crimson cape.',
    trickyIndices: [4, 6],  // 'boy' — the unexpected '-boy-' in the middle
    difficulty: 3,
    category: 'French roots',
  },
  {
    id: 'word-034',
    word: 'tenacious',
    definition: 'Refusing to give up; holding on firmly to something even when it is difficult.',
    sentence: 'The tenacious young athlete trained through injury and eventually won the regional championship.',
    trickyIndices: [4, 6],  // 'aci' — the '-acious' suffix
    difficulty: 3,
    category: '-acious words',
  },
  {
    id: 'word-035',
    word: 'magnanimous',
    definition: 'Very generous and forgiving, especially towards a rival or someone who has done wrong.',
    sentence: 'The magnanimous champion shook hands with every opponent and praised their performances.',
    trickyIndices: [3, 5],  // 'nan' — the double 'n' hidden in the middle
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-036',
    word: 'perspicacious',
    definition: 'Having a very sharp, clear understanding of things; quick to notice and understand.',
    sentence: 'The perspicacious detective spotted the clue that every other officer had overlooked.',
    trickyIndices: [4, 6],  // 'ica' — the '-picacious' run is easy to garble
    difficulty: 3,
    category: '-acious words',
  },
  {
    id: 'word-037',
    word: 'incredulous',
    definition: 'Unable or unwilling to believe something; showing disbelief.',
    sentence: 'The incredulous audience gasped when the magician apparently made the grand piano disappear.',
    trickyIndices: [2, 5],  // 'cred' — the '-credulous' Latin root
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-038',
    word: 'ostentatious',
    definition: 'Designed to impress or attract attention in a showy and often vulgar way.',
    sentence: 'The ostentatious mansion was decorated with gold-plated door handles and crystal chandeliers.',
    trickyIndices: [5, 9],  // 'atio' — the '-tatious' ending is easy to misspell
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-039',
    word: 'surreptitious',
    definition: 'Done secretly, trying not to be noticed or caught.',
    sentence: 'The spy made a surreptitious copy of the documents before replacing them in the safe.',
    trickyIndices: [2, 4],  // 'rre' — double r at the start
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-040',
    word: 'obsequious',
    definition: 'Trying too hard to please or obey someone important, in an embarrassing way.',
    sentence: 'The obsequious assistant agreed with every word the director said, never offering a different view.',
    trickyIndices: [2, 5],  // 'sequ' — the '-sequious' cluster
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-041',
    word: 'pejorative',
    definition: 'A word or phrase that expresses disapproval or makes something sound worse.',
    sentence: 'The journalist was criticised for using pejorative language when describing the protesters.',
    trickyIndices: [1, 3],  // 'ejo' — the unusual vowel sequence at the start
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-042',
    word: 'ephemeral',
    definition: 'Lasting for only a very short time; fleeting.',
    sentence: 'The beauty of cherry blossoms is ephemeral, lasting little more than a week each spring.',
    trickyIndices: [0, 2],  // 'eph' — Greek ph at the start
    difficulty: 3,
    category: 'Greek roots',
  },
  {
    id: 'word-043',
    word: 'inimitable',
    definition: 'So special or unique that it cannot be copied or imitated.',
    sentence: 'The comedian performed with an inimitable style that had been built up over thirty years.',
    trickyIndices: [2, 5],  // 'imit' — the doubled root hidden inside 'in-imitable'
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-044',
    word: 'loquacious',
    definition: 'Talking a great deal; very chatty and talkative.',
    sentence: 'The loquacious tour guide barely paused for breath as she led the group through the palace.',
    trickyIndices: [2, 5],  // 'qua' — the '-oquacious' Latin cluster with qu
    difficulty: 3,
    category: '-acious words',
  },
  {
    id: 'word-045',
    word: 'vociferous',
    definition: 'Making a lot of noise; expressing opinions loudly and forcefully.',
    sentence: 'The vociferous crowd chanted slogans outside the town hall throughout the entire meeting.',
    trickyIndices: [2, 4],  // 'cif' — the '-vocifer-' root, not 'vocifr' or 'vocifer'
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-046',
    word: 'punctilious',
    definition: 'Very careful about following rules and correct behaviour in every detail.',
    sentence: 'The punctilious headmaster insisted that every uniform button be fastened before assembly.',
    trickyIndices: [4, 7],  // 'tili' — the '-ctilious' cluster
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-047',
    word: 'sagacious',
    definition: 'Having or showing good judgement and wisdom; very wise.',
    sentence: 'The sagacious adviser counselled the young king to listen carefully before making any decision.',
    trickyIndices: [3, 5],  // 'aci' — the '-acious' suffix after 'sag-'
    difficulty: 3,
    category: '-acious words',
  },
  {
    id: 'word-048',
    word: 'querulous',
    definition: 'Complaining in a petty or whining way; easily irritated.',
    sentence: 'The querulous passenger complained about every aspect of the journey, from the seat to the temperature.',
    trickyIndices: [0, 3],  // 'quer' — the qu- opening and then '-ulous'
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-049',
    word: 'superfluous',
    definition: 'More than is needed or wanted; unnecessary and excessive.',
    sentence: 'The editor removed several superfluous paragraphs to make the report clearer and more concise.',
    trickyIndices: [5, 8],  // 'fluo' — the '-fluous' cluster inside the word
    difficulty: 3,
    category: 'Latin roots',
  },
  {
    id: 'word-050',
    word: 'exacerbate',
    definition: 'To make a problem, illness, or bad situation worse.',
    sentence: 'Pouring cold water on the wound would only exacerbate the injury and slow the healing process.',
    trickyIndices: [2, 5],  // 'acer' — the '-acerbate' Latin root
    difficulty: 3,
    category: 'Latin roots',
  },
];

export const SPELLING_WORDS: SpellingWord[] = OLD_SPELLING_WORDS.map(migrateWord);

export const WORDS_BY_ID: Record<string, SpellingWord> = Object.fromEntries(
  SPELLING_WORDS.map(w => [w.id, w])
);
