import type { SpellingWord } from '../../types/spelling';

export const ELEVEN_PLUS_A_D: SpellingWord[] = [
  // ─── Criticism ────────────────────────────────────────────────────────────

  {
    id: 'atom-accuse',
    word: 'accuse',
    definitions: [{
      definition: 'To say that someone has done something wrong or illegal.',
      exampleSentence: 'The teacher did not want to accuse anyone without proof.',
      synonyms: ['blame', 'charge', 'allege'],
      antonyms: ['defend', 'excuse', 'acquit'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['accused', 'accusing', 'accusation', 'accuser'],
    trickyIndices: [[0, 2]], // 'ac' — double c is a common error
    theme: 'Criticism',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-admirable',
    word: 'admirable',
    definitions: [{
      definition: 'Deserving great respect and approval because of impressive qualities.',
      exampleSentence: 'Her admirable patience helped the whole team stay calm during the crisis.',
      synonyms: ['commendable', 'praiseworthy', 'worthy'],
      antonyms: ['shameful', 'contemptible', 'disgraceful'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['admire', 'admiration', 'admirably', 'admirer'],
    trickyIndices: [[4, 6]], // 'ir' — often misspelled as 'er'
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Slow Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-amble',
    word: 'amble',
    definitions: [{
      definition: 'To walk at a slow, relaxed pace without any rush.',
      exampleSentence: 'On Sunday afternoons we would amble along the riverbank, watching the ducks.',
      synonyms: ['stroll', 'saunter', 'wander'],
      antonyms: ['sprint', 'dash', 'hurry'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['ambled', 'ambling', 'ambler'],
    trickyIndices: [[3, 5]], // 'le' ending — not 'el'
    theme: 'Slow Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-ambitious',
    word: 'ambitious',
    definitions: [{
      definition: 'Having a strong desire to succeed or achieve something great.',
      exampleSentence: 'The ambitious young scientist dreamed of discovering a new species.',
      synonyms: ['determined', 'driven', 'aspiring'],
      antonyms: ['lazy', 'unambitious', 'complacent'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['ambition', 'ambitiously', 'ambitions', 'unambitious'],
    trickyIndices: [[4, 7]], // 'itious' — unusual ending
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Speaking Verbs ───────────────────────────────────────────────────────

  {
    id: 'atom-announce',
    word: 'announce',
    definitions: [{
      definition: 'To make a public or formal declaration of something.',
      exampleSentence: 'The headteacher stood up to announce the winners of the science competition.',
      synonyms: ['declare', 'proclaim', 'broadcast'],
      antonyms: ['conceal', 'suppress', 'withhold'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['announced', 'announcing', 'announcement', 'announcer'],
    trickyIndices: [[2, 4]], // 'no' — 'ann' double-n often forgotten
    theme: 'Speaking Verbs',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-anxious',
    word: 'anxious',
    definitions: [{
      definition: 'Feeling worried, nervous, or uneasy about something that might happen.',
      exampleSentence: 'Priya felt anxious before her piano recital, but she took a deep breath and began.',
      synonyms: ['worried', 'nervous', 'apprehensive'],
      antonyms: ['calm', 'relaxed', 'confident'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['anxiety', 'anxiously', 'anxiousness'],
    trickyIndices: [[3, 6]], // 'ious' — anxiety drops the i
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-argue',
    word: 'argue',
    definitions: [{
      definition: 'To give reasons for or against something, or to disagree with someone.',
      exampleSentence: 'The two friends began to argue over who had the better plan, each refusing to back down.',
      synonyms: ['dispute', 'debate', 'contend'],
      antonyms: ['agree', 'concur', 'concede'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['argued', 'arguing', 'argument', 'argumentative'],
    trickyIndices: [[3, 5]], // 'ue' — dropped before 'ment' (argument)
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-arrogant',
    word: 'arrogant',
    definitions: [{
      definition: 'Behaving as if you are better or more important than other people.',
      exampleSentence: 'The arrogant knight refused to listen to the peasant\'s warning, and rode straight into the trap.',
      synonyms: ['conceited', 'haughty', 'smug'],
      antonyms: ['humble', 'modest', 'respectful'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['arrogance', 'arrogantly', 'arrogate'],
    trickyIndices: [[0, 2]], // 'ar' — double r
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-assert',
    word: 'assert',
    definitions: [{
      definition: 'To state something clearly and confidently as being true.',
      exampleSentence: 'The lawyer stood up to assert that her client was completely innocent.',
      synonyms: ['declare', 'maintain', 'insist'],
      antonyms: ['deny', 'retract', 'concede'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['asserted', 'asserting', 'assertion', 'assertive', 'assertively'],
    trickyIndices: [[0, 2]], // 'as' — double s
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-astute',
    word: 'astute',
    definitions: [{
      definition: 'Very clever and quick to notice things and understand situations.',
      exampleSentence: 'The astute detective spotted the clue that everyone else had overlooked.',
      synonyms: ['sharp', 'shrewd', 'perceptive'],
      antonyms: ['naive', 'foolish', 'oblivious'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['astutely', 'astuteness'],
    trickyIndices: [[4, 6]], // 'te' — not 'tute' (tuteness vs astuteness)
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-audacious',
    word: 'audacious',
    definitions: [{
      definition: 'Showing a willingness to take bold risks; daring or fearless.',
      exampleSentence: 'The audacious explorer crossed the desert alone with only three days of supplies.',
      synonyms: ['daring', 'bold', 'fearless'],
      antonyms: ['timid', 'cautious', 'cowardly'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['audacity', 'audaciously', 'audaciousness'],
    trickyIndices: [[3, 7]], // 'acious' — tricky ending
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Nature & Forests ─────────────────────────────────────────────────────

  {
    id: 'atom-barren',
    word: 'barren',
    definitions: [{
      definition: 'Land that is barren has no plants growing on it because conditions are too harsh.',
      exampleSentence: 'Beyond the forest, the landscape became barren — nothing but cracked earth and dust.',
      synonyms: ['desolate', 'empty', 'infertile'],
      antonyms: ['fertile', 'lush', 'abundant'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['barrenness', 'barrenly'],
    trickyIndices: [[2, 4]], // 'rr' — double r
    theme: 'Nature & Forests',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-bashful',
    word: 'bashful',
    definitions: [{
      definition: 'Shy and easily embarrassed when around other people.',
      exampleSentence: 'The bashful child hid behind her mother when the guests arrived.',
      synonyms: ['shy', 'timid', 'self-conscious'],
      antonyms: ['bold', 'confident', 'outgoing'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['bashfully', 'bashfulness'],
    trickyIndices: [[4, 7]], // 'ful' — one l (not 'full')
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Body Language ────────────────────────────────────────────────────────

  {
    id: 'atom-beckon',
    word: 'beckon',
    definitions: [{
      definition: 'To signal to someone with a gesture to come closer or follow.',
      exampleSentence: 'The mysterious figure at the gate beckoned us to come inside.',
      synonyms: ['gesture', 'signal', 'summon'],
      antonyms: ['dismiss', 'wave away'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['beckoned', 'beckoning'],
    trickyIndices: [[4, 6]], // 'on' — not 'an' (beckon not beckun)
    theme: 'Body Language',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Tone of Voice ────────────────────────────────────────────────────────

  {
    id: 'atom-bellow',
    word: 'bellow',
    definitions: [{
      definition: 'To shout in a loud, deep, powerful voice.',
      exampleSentence: 'The captain bellowed his orders across the ship\'s deck in the roaring storm.',
      synonyms: ['roar', 'thunder', 'shout'],
      antonyms: ['whisper', 'murmur', 'mutter'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['bellowed', 'bellowing', 'bellower'],
    trickyIndices: [[3, 6]], // 'low' — not 'loe' or 'lo'
    theme: 'Tone of Voice',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Criticism ────────────────────────────────────────────────────────────

  {
    id: 'atom-blame',
    word: 'blame',
    definitions: [{
      definition: 'To say or think that someone or something is responsible for something bad.',
      exampleSentence: 'It is never helpful to blame others when working as a team.',
      synonyms: ['accuse', 'fault', 'hold responsible'],
      antonyms: ['praise', 'credit', 'absolve'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['blamed', 'blaming', 'blameless', 'blameful'],
    trickyIndices: [[3, 5]], // 'me' — drop the e before suffix
    theme: 'Criticism',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Nature & Forests ─────────────────────────────────────────────────────

  {
    id: 'atom-blossom',
    word: 'blossom',
    definitions: [{
      definition: 'The flowers on a tree or bush, or to produce flowers; also means to develop and grow.',
      exampleSentence: 'The cherry blossom filled the garden with pale pink petals every spring.',
      synonyms: ['flower', 'bloom', 'flourish'],
      antonyms: ['wither', 'fade', 'decay'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['blossomed', 'blossoming', 'blossoms'],
    trickyIndices: [[5, 7]], // 'om' — not 'um'
    theme: 'Nature & Forests',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Weather ──────────────────────────────────────────────────────────────

  {
    id: 'atom-blizzard',
    word: 'blizzard',
    definitions: [{
      definition: 'A severe snowstorm with strong, icy winds and very low visibility.',
      exampleSentence: 'The blizzard swept in overnight, burying the village under two metres of snow.',
      synonyms: ['snowstorm', 'whiteout', 'squall'],
      antonyms: ['heatwave', 'drought'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['blizzards', 'blizzardy'],
    trickyIndices: [[2, 4]], // 'iz' — double z
    theme: 'Weather',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Speaking Verbs ───────────────────────────────────────────────────────

  {
    id: 'atom-boast',
    word: 'boast',
    definitions: [{
      definition: 'To talk with excessive pride about yourself or your achievements.',
      exampleSentence: 'Marcus loved to boast about his trophy collection, which made his teammates groan.',
      synonyms: ['brag', 'crow', 'show off'],
      antonyms: ['downplay', 'understate', 'humble'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['boasted', 'boasting', 'boastful', 'boastfully', 'boaster'],
    trickyIndices: [[1, 3]], // 'oa' — vowel pair
    theme: 'Speaking Verbs',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-boisterous',
    word: 'boisterous',
    definitions: [{
      definition: 'Noisy, energetic, and cheerfully rough or excited.',
      exampleSentence: 'The boisterous crowd cheered so loudly that the whole stadium shook.',
      synonyms: ['rowdy', 'lively', 'exuberant'],
      antonyms: ['quiet', 'calm', 'subdued'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['boisterously', 'boisterousness'],
    trickyIndices: [[4, 8]], // 'erous' — silent 'e' pattern
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Fast Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-bolt',
    word: 'bolt',
    definitions: [{
      definition: 'To move very suddenly and quickly, as if running away in fear or urgency.',
      exampleSentence: 'The startled rabbit bolted across the field and disappeared into the hedge.',
      synonyms: ['dash', 'dart', 'sprint'],
      antonyms: ['creep', 'dawdle', 'amble'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['bolted', 'bolting'],
    trickyIndices: [[2, 4]], // 'lt' — consonant cluster
    theme: 'Fast Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-brilliant',
    word: 'brilliant',
    definitions: [{
      definition: 'Exceptionally clever or talented; also meaning very bright in light or colour.',
      exampleSentence: 'The brilliant mathematician solved the puzzle that had defeated everyone else for years.',
      synonyms: ['gifted', 'exceptional', 'dazzling'],
      antonyms: ['mediocre', 'dull', 'ordinary'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['brilliance', 'brilliantly', 'brilliancy'],
    trickyIndices: [[5, 8]], // 'iant' — not 'ent'
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Weather ──────────────────────────────────────────────────────────────

  {
    id: 'atom-breeze',
    word: 'breeze',
    definitions: [{
      definition: 'A gentle, light wind.',
      exampleSentence: 'A warm summer breeze carried the scent of cut grass across the meadow.',
      synonyms: ['gust', 'draught', 'zephyr'],
      antonyms: ['gale', 'hurricane', 'stillness'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['breezy', 'breezes', 'breezily', 'breeziness'],
    trickyIndices: [[4, 6]], // 'ze' — not 'se'
    theme: 'Weather',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-capable',
    word: 'capable',
    definitions: [{
      definition: 'Having the ability, skill, or power needed to do something well.',
      exampleSentence: 'She proved she was more than capable of leading the expedition on her own.',
      synonyms: ['able', 'competent', 'skilled'],
      antonyms: ['incapable', 'unable', 'incompetent'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['capability', 'capably', 'incapable', 'capabilities'],
    trickyIndices: [[4, 6]], // 'ble' — not 'bel'
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Nature & Forests ─────────────────────────────────────────────────────

  {
    id: 'atom-canopy',
    word: 'canopy',
    definitions: [{
      definition: 'The upper layer of a forest formed by the tops and branches of tall trees.',
      exampleSentence: 'Sunlight filtered through the dense canopy, casting dappled shadows on the forest floor.',
      synonyms: ['cover', 'awning', 'overhang'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['canopies', 'canopied'],
    trickyIndices: [[4, 6]], // 'py' — not 'pee' or 'pie'
    theme: 'Nature & Forests',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Sea & Water ──────────────────────────────────────────────────────────

  {
    id: 'atom-cascade',
    word: 'cascade',
    definitions: [{
      definition: 'A small waterfall; or to fall in large quantities, like a waterfall.',
      exampleSentence: 'Water cascaded down the mossy rocks, filling the valley with a constant rushing sound.',
      synonyms: ['torrent', 'rush', 'stream'],
      antonyms: ['trickle', 'seep'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['cascaded', 'cascading', 'cascades'],
    trickyIndices: [[5, 7]], // 'de' — silent e ending
    theme: 'Sea & Water',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Fast Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-charge',
    word: 'charge',
    definitions: [{
      definition: 'To move forward very quickly and with great force, especially in an attack.',
      exampleSentence: 'The cavalry charged across the battlefield at full gallop.',
      synonyms: ['rush', 'storm', 'stampede'],
      antonyms: ['retreat', 'withdraw', 'slink'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['charged', 'charging', 'charger'],
    trickyIndices: [[3, 6]], // 'rge' — soft g
    theme: 'Fast Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-claim',
    word: 'claim',
    definitions: [{
      definition: 'To state that something is true, especially without proof; or to assert a right to something.',
      exampleSentence: 'The explorer claimed to have discovered the hidden temple, though nobody could verify his story.',
      synonyms: ['assert', 'declare', 'maintain'],
      antonyms: ['deny', 'refute', 'disclaim'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['claimed', 'claiming', 'claim', 'claimant', 'disclaimer'],
    trickyIndices: [[2, 4]], // 'ai' — vowel pair
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-clever',
    word: 'clever',
    definitions: [{
      definition: 'Quick to understand, learn, and devise things; showing intelligence.',
      exampleSentence: 'The clever fox found three different ways to escape the trap before morning.',
      synonyms: ['intelligent', 'bright', 'shrewd'],
      antonyms: ['foolish', 'dim', 'simple'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['cleverly', 'cleverness', 'cleverer', 'cleverest'],
    trickyIndices: [[4, 6]], // 'er' — not 'a' (clevur)
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Tone of Voice ────────────────────────────────────────────────────────

  {
    id: 'atom-command',
    word: 'command',
    definitions: [{
      definition: 'To give an order with authority and expect it to be obeyed.',
      exampleSentence: 'The general commanded his troops to hold the line no matter what.',
      synonyms: ['order', 'direct', 'instruct'],
      antonyms: ['obey', 'request', 'plead'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['commanded', 'commanding', 'commander', 'commandment', 'commandingly'],
    trickyIndices: [[2, 4]], // 'mm' — double m
    theme: 'Tone of Voice',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-compassionate',
    word: 'compassionate',
    definitions: [{
      definition: 'Feeling or showing concern and care for someone who is suffering.',
      exampleSentence: 'The compassionate nurse sat with the frightened child until the medicine took effect.',
      synonyms: ['caring', 'empathetic', 'kind-hearted'],
      antonyms: ['callous', 'cold-hearted', 'unfeeling'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['compassion', 'compassionately', 'compassionateness'],
    trickyIndices: [[6, 10]], // 'ionate' — long suffix
    mnemonic: 'Com-PASSION-ate — full of passion for others',
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Criticism ────────────────────────────────────────────────────────────

  {
    id: 'atom-condemn',
    word: 'condemn',
    definitions: [{
      definition: 'To express strong disapproval of something, or to declare someone guilty.',
      exampleSentence: 'The judge condemned the action as dangerous and irresponsible.',
      synonyms: ['censure', 'denounce', 'criticise'],
      antonyms: ['praise', 'commend', 'approve'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['condemned', 'condemning', 'condemnation', 'condemnatory'],
    trickyIndices: [[5, 7]], // 'mn' — silent n
    theme: 'Criticism',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-confident',
    word: 'confident',
    definitions: [{
      definition: 'Feeling certain about your own abilities and not doubting yourself.',
      exampleSentence: 'After weeks of practice, Aisha felt confident enough to perform her speech in front of the school.',
      synonyms: ['assured', 'self-assured', 'bold'],
      antonyms: ['nervous', 'uncertain', 'insecure'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['confidence', 'confidently', 'unconfident', 'self-confident'],
    trickyIndices: [[5, 8]], // 'dent' — not 'dant'
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Speaking Verbs ───────────────────────────────────────────────────────

  {
    id: 'atom-confess',
    word: 'confess',
    definitions: [{
      definition: 'To admit that you have done something wrong or to reveal something personal.',
      exampleSentence: 'After an hour of questioning, he finally confessed that he had taken the book.',
      synonyms: ['admit', 'acknowledge', 'reveal'],
      antonyms: ['deny', 'conceal', 'hide'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['confessed', 'confessing', 'confession', 'confessor'],
    trickyIndices: [[5, 7]], // 'ss' — double s
    theme: 'Speaking Verbs',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-courageous',
    word: 'courageous',
    definitions: [{
      definition: 'Not afraid to do things that are dangerous or difficult; showing bravery.',
      exampleSentence: 'The courageous firefighter rushed back into the burning building to save the trapped child.',
      synonyms: ['brave', 'fearless', 'valiant'],
      antonyms: ['cowardly', 'timid', 'fearful'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['courage', 'courageously', 'courageous'],
    trickyIndices: [[4, 7]], // 'age' inside 'ageous'
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Body Language ────────────────────────────────────────────────────────

  {
    id: 'atom-cower',
    word: 'cower',
    definitions: [{
      definition: 'To crouch down or move back in fear.',
      exampleSentence: 'The small puppy cowered behind the sofa when it heard the thunder.',
      synonyms: ['cringe', 'shrink', 'flinch'],
      antonyms: ['stand tall', 'confront', 'face'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['cowered', 'cowering'],
    trickyIndices: [[2, 4]], // 'we' — not 'wa' or 'wi'
    theme: 'Body Language',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Slow Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-creep',
    word: 'creep',
    definitions: [{
      definition: 'To move slowly and quietly, trying not to be noticed.',
      exampleSentence: 'The spy crept along the corridor, pressing herself against the cold stone wall.',
      synonyms: ['slink', 'tiptoe', 'sneak'],
      antonyms: ['stride', 'march', 'charge'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['crept', 'creeping', 'creeper'],
    trickyIndices: [[1, 3]], // 'ee' — double e
    theme: 'Slow Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Body Language ────────────────────────────────────────────────────────

  {
    id: 'atom-cringe',
    word: 'cringe',
    definitions: [{
      definition: 'To shrink back slightly in embarrassment or fear.',
      exampleSentence: 'She cringed as her dad attempted to sing along to the pop song in front of her friends.',
      synonyms: ['wince', 'flinch', 'recoil'],
      antonyms: ['stand firm', 'face boldly'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['cringed', 'cringing', 'cringey', 'cringe-worthy'],
    trickyIndices: [[4, 6]], // 'ge' — soft g
    theme: 'Body Language',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Weather ──────────────────────────────────────────────────────────────

  {
    id: 'atom-crisp',
    word: 'crisp',
    definitions: [{
      definition: 'Air that is crisp is fresh, dry, and slightly cold in a pleasant way.',
      exampleSentence: 'The crisp autumn air smelled of wood smoke and fallen leaves.',
      synonyms: ['fresh', 'brisk', 'sharp'],
      antonyms: ['humid', 'muggy', 'stale'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['crisply', 'crispness', 'crisper', 'crispest'],
    trickyIndices: [[3, 5]], // 'sp' — consonant cluster
    theme: 'Weather',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Criticism ────────────────────────────────────────────────────────────

  {
    id: 'atom-criticise',
    word: 'criticise',
    definitions: [{
      definition: 'To say what you think is wrong or bad about something or someone.',
      exampleSentence: 'The reviewer did not criticise the book unfairly — she balanced praise with genuine concerns.',
      synonyms: ['condemn', 'censure', 'find fault with'],
      antonyms: ['praise', 'commend', 'applaud'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['criticised', 'criticising', 'criticism', 'critic', 'critical', 'critically'],
    trickyIndices: [[5, 9]], // 'icise' — British spelling with 's' not 'z'
    theme: 'Criticism',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-cunning',
    word: 'cunning',
    definitions: [{
      definition: 'Clever at getting what you want, especially by using tricks or deceit.',
      exampleSentence: 'The cunning fox waited patiently until the farmer fell asleep, then raided the henhouse.',
      synonyms: ['crafty', 'sly', 'devious'],
      antonyms: ['naive', 'honest', 'straightforward'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['cunningly', 'cunningness'],
    trickyIndices: [[3, 6]], // 'nin' — double n
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Sea & Water ──────────────────────────────────────────────────────────

  {
    id: 'atom-current',
    word: 'current',
    definitions: [{
      definition: 'A steady flow of water or air moving in one direction.',
      exampleSentence: 'The swimmer was strong, but the current pulled her further downstream with every stroke.',
      synonyms: ['flow', 'stream', 'tide'],
      antonyms: ['stillness', 'calm'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['currents', 'currently', 'currency'],
    trickyIndices: [[0, 2]], // 'cu' — double r follows
    theme: 'Sea & Water',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-curious',
    word: 'curious',
    definitions: [{
      definition: 'Eager to know or learn about something; showing great interest.',
      exampleSentence: 'The curious scientist peered through the microscope at the strange blue cells.',
      synonyms: ['inquisitive', 'enquiring', 'interested'],
      antonyms: ['uninterested', 'indifferent', 'bored'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['curiosity', 'curiously', 'incurious'],
    trickyIndices: [[4, 7]], // 'ious' — not 'us' alone
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Fast Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-dart',
    word: 'dart',
    definitions: [{
      definition: 'To move suddenly and rapidly in a particular direction.',
      exampleSentence: 'The kingfisher darted from its perch and caught the fish in a single clean dive.',
      synonyms: ['dash', 'bolt', 'zip'],
      antonyms: ['crawl', 'dawdle', 'drift'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['darted', 'darting'],
    trickyIndices: [[2, 4]], // 'rt' — consonant cluster
    theme: 'Fast Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Fast Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-dash',
    word: 'dash',
    definitions: [{
      definition: 'To run or move very quickly, especially over a short distance.',
      exampleSentence: 'He dashed across the playground to reach the gate before the bell rang.',
      synonyms: ['sprint', 'bolt', 'hurtle'],
      antonyms: ['amble', 'saunter', 'creep'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['dashed', 'dashing', 'dasher'],
    trickyIndices: [[2, 4]], // 'sh' — digraph
    theme: 'Fast Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-dauntless',
    word: 'dauntless',
    definitions: [{
      definition: 'Showing no fear; never giving up even when things are very difficult.',
      exampleSentence: 'The dauntless mountaineer kept climbing even as the storm clouds closed in around her.',
      synonyms: ['fearless', 'undaunted', 'indomitable'],
      antonyms: ['fearful', 'cowardly', 'timid'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['dauntlessly', 'dauntlessness', 'daunt', 'undaunted'],
    trickyIndices: [[5, 9]], // 'less' — the 'nt' before it is easy to drop
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Slow Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-dawdle',
    word: 'dawdle',
    definitions: [{
      definition: 'To walk or move very slowly, wasting time.',
      exampleSentence: 'Stop dawdling — we will miss the train if you keep stopping to look in shop windows.',
      synonyms: ['linger', 'loiter', 'amble'],
      antonyms: ['hurry', 'rush', 'sprint'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['dawdled', 'dawdling', 'dawdler'],
    trickyIndices: [[3, 5]], // 'dl' — unusual consonant combination
    theme: 'Slow Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Light & Glow ─────────────────────────────────────────────────────────

  {
    id: 'atom-dazzle',
    word: 'dazzle',
    definitions: [{
      definition: 'To impress greatly or temporarily blind with intense light.',
      exampleSentence: 'The performer dazzled the audience with her acrobatic leaps across the stage.',
      synonyms: ['stun', 'impress', 'bewilder'],
      antonyms: ['bore', 'dim', 'dull'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['dazzled', 'dazzling', 'dazzlingly', 'dazzlement'],
    trickyIndices: [[2, 4]], // 'zz' — double z
    theme: 'Light & Glow',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Nature & Forests ─────────────────────────────────────────────────────

  {
    id: 'atom-decay',
    word: 'decay',
    definitions: [{
      definition: 'To rot or break down slowly, or to become worse over time.',
      exampleSentence: 'The fallen oak had begun to decay, becoming home to beetles, moss, and fungi.',
      synonyms: ['rot', 'decompose', 'deteriorate'],
      antonyms: ['flourish', 'thrive', 'grow'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['decayed', 'decaying', 'decays', 'decay'],
    trickyIndices: [[3, 5]], // 'ay' — vowel pair
    theme: 'Nature & Forests',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Tone of Voice ────────────────────────────────────────────────────────

  {
    id: 'atom-declare',
    word: 'declare',
    definitions: [{
      definition: 'To state something firmly and clearly, especially in public.',
      exampleSentence: 'The queen declared war on the neighbouring kingdom in a speech from the palace steps.',
      synonyms: ['announce', 'proclaim', 'state'],
      antonyms: ['conceal', 'retract', 'mumble'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['declared', 'declaring', 'declaration', 'declarative'],
    trickyIndices: [[5, 7]], // 're' — silent e
    theme: 'Tone of Voice',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Slow Movement ────────────────────────────────────────────────────────

  {
    id: 'atom-deliberate',
    word: 'deliberate',
    definitions: [{
      definition: 'Done intentionally and carefully, not by accident.',
      exampleSentence: 'Each deliberate step across the frozen lake was taken with great care.',
      synonyms: ['intentional', 'purposeful', 'calculated'],
      antonyms: ['accidental', 'hasty', 'impulsive'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['deliberately', 'deliberateness', 'deliberation', 'deliberate'],
    trickyIndices: [[3, 5]], // 'ib' — not 'ab'
    theme: 'Slow Movement',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Sea & Water ──────────────────────────────────────────────────────────

  {
    id: 'atom-deluge',
    word: 'deluge',
    definitions: [{
      definition: 'A very heavy fall of rain, or a large amount of things arriving at once.',
      exampleSentence: 'A sudden deluge flooded the streets and trapped cars beneath brown churning water.',
      synonyms: ['downpour', 'torrent', 'flood'],
      antonyms: ['drought', 'trickle', 'scarcity'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['deluged', 'deluging', 'deluges'],
    trickyIndices: [[4, 6]], // 'ge' — soft g ending
    theme: 'Sea & Water',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Speaking Verbs ───────────────────────────────────────────────────────

  {
    id: 'atom-demand',
    word: 'demand',
    definitions: [{
      definition: 'To ask for something in a forceful, authoritative way that expects obedience.',
      exampleSentence: 'The passengers demanded an explanation from the company after being stranded overnight.',
      synonyms: ['insist', 'command', 'require'],
      antonyms: ['request', 'plead', 'beg'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['demanded', 'demanding', 'demand', 'demanding'],
    trickyIndices: [[2, 4]], // 'ma' — not 'me'
    theme: 'Speaking Verbs',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-demonstrate',
    word: 'demonstrate',
    definitions: [{
      definition: 'To show clearly, prove something, or carry out a practical example.',
      exampleSentence: 'The scientist demonstrated the experiment step by step so the class could follow along.',
      synonyms: ['show', 'prove', 'illustrate'],
      antonyms: ['disprove', 'conceal', 'obscure'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['demonstrated', 'demonstrating', 'demonstration', 'demonstrative', 'demonstrator'],
    trickyIndices: [[8, 11]], // 'ate' — often written as 'eate'
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Nature & Forests ─────────────────────────────────────────────────────

  {
    id: 'atom-dense',
    word: 'dense',
    definitions: [{
      definition: 'Closely packed together; thick and difficult to move through or see through.',
      exampleSentence: 'The explorers hacked their way through dense undergrowth for hours without finding a path.',
      synonyms: ['thick', 'impenetrable', 'compact'],
      antonyms: ['sparse', 'open', 'thin'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['densely', 'density', 'denser', 'densest'],
    trickyIndices: [[3, 5]], // 'se' — not 'ce'
    theme: 'Nature & Forests',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Criticism ────────────────────────────────────────────────────────────

  {
    id: 'atom-denounce',
    word: 'denounce',
    definitions: [{
      definition: 'To publicly declare that something or someone is wrong, evil, or unacceptable.',
      exampleSentence: 'The mayor denounced the vandalism in a strongly worded public statement.',
      synonyms: ['condemn', 'criticise', 'censure'],
      antonyms: ['praise', 'defend', 'endorse'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['denounced', 'denouncing', 'denunciation', 'denouncer'],
    trickyIndices: [[5, 8]], // 'oun' — not 'un' alone
    theme: 'Criticism',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-defiant',
    word: 'defiant',
    definitions: [{
      definition: 'Refusing to obey or accept something, even when put under pressure.',
      exampleSentence: 'The defiant prisoner crossed his arms and refused to sign the confession.',
      synonyms: ['rebellious', 'resistant', 'obstinate'],
      antonyms: ['obedient', 'submissive', 'compliant'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['defy', 'defiance', 'defiantly'],
    trickyIndices: [[3, 5]], // 'ia' — not just 'i'
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Diplomacy ────────────────────────────────────────────────────────────

  {
    id: 'atom-debate',
    word: 'debate',
    definitions: [{
      definition: 'A formal discussion where people express opposite points of view.',
      exampleSentence: 'The school held a debate on whether homework should be abolished, with strong arguments on both sides.',
      synonyms: ['discussion', 'argument', 'deliberation'],
      antonyms: ['agreement', 'consensus', 'silence'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['debated', 'debating', 'debater', 'debatable'],
    trickyIndices: [[4, 6]], // 'te' — silent e
    theme: 'Diplomacy',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Cause & Effect ───────────────────────────────────────────────────────

  {
    id: 'atom-consequence',
    word: 'consequence',
    definitions: [{
      definition: 'A result or effect of an action or decision.',
      exampleSentence: 'As a consequence of skipping revision, he was not prepared for the first question on the exam.',
      synonyms: ['result', 'outcome', 'effect'],
      antonyms: ['cause', 'origin', 'source'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['consequences', 'consequent', 'consequential', 'consequently'],
    trickyIndices: [[7, 11]], // 'ence' — not 'ance'
    theme: 'Cause & Effect',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Strength & Effort ────────────────────────────────────────────────────

  {
    id: 'atom-conquer',
    word: 'conquer',
    definitions: [{
      definition: 'To overcome and take control of something by force, or to succeed over a difficulty.',
      exampleSentence: 'She was determined to conquer her fear of heights before the climbing competition.',
      synonyms: ['overcome', 'defeat', 'triumph over'],
      antonyms: ['surrender', 'yield', 'fail'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['conquered', 'conquering', 'conqueror', 'conquest'],
    trickyIndices: [[5, 7]], // 'er' — not 'or'
    theme: 'Strength & Effort',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-contradict',
    word: 'contradict',
    definitions: [{
      definition: 'To say the opposite of what someone else has said, or to disagree with a statement.',
      exampleSentence: 'The witness\'s evidence seemed to contradict what the first witness had told the jury.',
      synonyms: ['counter', 'challenge', 'dispute'],
      antonyms: ['confirm', 'support', 'agree'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['contradicted', 'contradicting', 'contradiction', 'contradictory'],
    trickyIndices: [[5, 8]], // 'dict' — comes from Latin
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Cause & Effect ───────────────────────────────────────────────────────

  {
    id: 'atom-contribute',
    word: 'contribute',
    definitions: [{
      definition: 'To give something (time, money, ideas) that helps to produce a result.',
      exampleSentence: 'Every member of the team was asked to contribute at least one idea to the project.',
      synonyms: ['give', 'donate', 'add'],
      antonyms: ['withhold', 'take', 'subtract'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['contributed', 'contributing', 'contribution', 'contributor', 'contributory'],
    trickyIndices: [[7, 10]], // 'ute' — often dropped when adding suffix
    theme: 'Cause & Effect',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Diplomacy ────────────────────────────────────────────────────────────

  {
    id: 'atom-compromise',
    word: 'compromise',
    definitions: [{
      definition: 'An agreement where both sides give up something to reach a solution.',
      exampleSentence: 'After a long discussion, the two groups reached a compromise that satisfied everyone.',
      synonyms: ['agreement', 'settlement', 'concession'],
      antonyms: ['standoff', 'deadlock', 'disagreement'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['compromised', 'compromising', 'compromiser'],
    trickyIndices: [[6, 10]], // 'mise' — not 'mize' (British English)
    theme: 'Diplomacy',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Argument & Evidence ──────────────────────────────────────────────────

  {
    id: 'atom-counter',
    word: 'counter',
    definitions: [{
      definition: 'To respond to an argument by making an opposite or opposing point.',
      exampleSentence: 'The defence lawyer countered every claim with carefully chosen evidence.',
      synonyms: ['rebut', 'challenge', 'respond'],
      antonyms: ['agree', 'accept', 'support'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['countered', 'countering', 'counter-argument'],
    trickyIndices: [[4, 7]], // 'ter' — not 'tar'
    theme: 'Argument & Evidence',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Intelligence & Learning ──────────────────────────────────────────────

  {
    id: 'atom-distinguished',
    word: 'distinguished',
    definitions: [{
      definition: 'Extremely successful and highly respected in a particular field.',
      exampleSentence: 'The distinguished professor had spent forty years studying ancient languages.',
      synonyms: ['eminent', 'renowned', 'celebrated'],
      antonyms: ['unknown', 'ordinary', 'unremarkable'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['distinguish', 'distinguishing', 'distinguishable', 'indistinguishable'],
    trickyIndices: [[8, 12]], // 'guish' — tricky letter sequence
    theme: 'Intelligence & Learning',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-devoted',
    word: 'devoted',
    definitions: [{
      definition: 'Completely loyal and giving a lot of time and energy to someone or something.',
      exampleSentence: 'The devoted nurse worked sixteen-hour shifts to care for her patients during the flood crisis.',
      synonyms: ['dedicated', 'loyal', 'committed'],
      antonyms: ['indifferent', 'disloyal', 'neglectful'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['devote', 'devotion', 'devotedly', 'devotee'],
    trickyIndices: [[4, 7]], // 'ted' — double vowel drop from 'devote'
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Emotions & Character ─────────────────────────────────────────────────

  {
    id: 'atom-diligent',
    word: 'diligent',
    definitions: [{
      definition: 'Working hard and carefully with sustained effort over time.',
      exampleSentence: 'The diligent student revised every subject each evening for three months before her exams.',
      synonyms: ['hardworking', 'industrious', 'conscientious'],
      antonyms: ['lazy', 'careless', 'negligent'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['diligence', 'diligently'],
    trickyIndices: [[4, 7]], // 'gen' — not 'jan'
    mnemonic: 'DILIgent people always put in the effort',
    theme: 'Emotions & Character',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Light & Glow ─────────────────────────────────────────────────────────

  {
    id: 'atom-dim',
    word: 'dim',
    definitions: [{
      definition: 'Not bright or producing little light; also means not very clever.',
      exampleSentence: 'The dim glow of the lantern barely lit the narrow passageway.',
      synonyms: ['faint', 'pale', 'shadowy'],
      antonyms: ['bright', 'vivid', 'brilliant'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['dimly', 'dimness', 'dimmer', 'dimmest', 'dimmed'],
    trickyIndices: [[1, 2]], // 'i' — doubles the m before suffixes (dimming)
    theme: 'Light & Glow',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Diplomacy ────────────────────────────────────────────────────────────

  {
    id: 'atom-discuss',
    word: 'discuss',
    definitions: [{
      definition: 'To talk about something with other people, sharing different views.',
      exampleSentence: 'The class was asked to discuss the poem in pairs before sharing ideas with the group.',
      synonyms: ['consider', 'examine', 'debate'],
      antonyms: ['ignore', 'avoid', 'dismiss'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['discussed', 'discussing', 'discussion'],
    trickyIndices: [[5, 7]], // 'ss' — double s
    theme: 'Diplomacy',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Cause & Effect ───────────────────────────────────────────────────────

  {
    id: 'atom-disrupt',
    word: 'disrupt',
    definitions: [{
      definition: 'To interrupt something and prevent it from continuing normally.',
      exampleSentence: 'The fire drill disrupted the lesson at the most important moment.',
      synonyms: ['disturb', 'interrupt', 'unsettle'],
      antonyms: ['restore', 'stabilise', 'continue'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['disrupted', 'disrupting', 'disruption', 'disruptive', 'disruptively'],
    trickyIndices: [[3, 7]], // 'rupt' — from Latin root
    theme: 'Cause & Effect',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Strength & Effort ────────────────────────────────────────────────────

  {
    id: 'atom-determined',
    word: 'determined',
    definitions: [{
      definition: 'Having made a firm decision and refusing to let anything stop you.',
      exampleSentence: 'Despite the setbacks, she remained determined to finish the marathon and crossed the line with a smile.',
      synonyms: ['resolute', 'persistent', 'tenacious'],
      antonyms: ['uncertain', 'hesitant', 'wavering'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['determine', 'determination', 'determinedly', 'undetermined'],
    trickyIndices: [[8, 10]], // 'ed' — not 'id'
    theme: 'Strength & Effort',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Strength & Effort ────────────────────────────────────────────────────

  {
    id: 'atom-durable',
    word: 'durable',
    definitions: [{
      definition: 'Able to last a long time without deteriorating or wearing out.',
      exampleSentence: 'The explorer chose durable boots that could survive months of rough mountain terrain.',
      synonyms: ['tough', 'lasting', 'resilient'],
      antonyms: ['fragile', 'flimsy', 'delicate'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['durability', 'durably', 'endure', 'enduring'],
    trickyIndices: [[4, 7]], // 'ble' — not 'bel'
    theme: 'Strength & Effort',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Sea & Water ──────────────────────────────────────────────────────────

  {
    id: 'atom-drift',
    word: 'drift',
    definitions: [{
      definition: 'To move slowly and without direction, carried by water or air.',
      exampleSentence: 'The small boat drifted slowly downstream, its oars abandoned on the bank.',
      synonyms: ['float', 'wander', 'meander'],
      antonyms: ['charge', 'drive', 'surge'],
    }],
    partOfSpeech: 'verb',
    wordFamily: ['drifted', 'drifting', 'drifter', 'adrift'],
    trickyIndices: [[3, 5]], // 'ft' — consonant cluster
    theme: 'Sea & Water',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Weather ──────────────────────────────────────────────────────────────

  {
    id: 'atom-drizzle',
    word: 'drizzle',
    definitions: [{
      definition: 'Light, fine rain falling in very small drops.',
      exampleSentence: 'A light drizzle dampened the spectators, but nobody left the cricket match.',
      synonyms: ['mist', 'sprinkle', 'shower'],
      antonyms: ['downpour', 'deluge', 'sunshine'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['drizzled', 'drizzling', 'drizzly'],
    trickyIndices: [[3, 6]], // 'zzle' — double z
    theme: 'Weather',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Light & Glow ─────────────────────────────────────────────────────────

  {
    id: 'atom-dusk',
    word: 'dusk',
    definitions: [{
      definition: 'The time just after sunset when the light is beginning to fade.',
      exampleSentence: 'Bats began to circle the oak tree at dusk, hunting for insects in the fading light.',
      synonyms: ['twilight', 'sunset', 'nightfall'],
      antonyms: ['dawn', 'daybreak', 'noon'],
    }],
    partOfSpeech: 'noun',
    wordFamily: ['dusky', 'duskily', 'duskiness'],
    trickyIndices: [[2, 4]], // 'sk' — consonant cluster
    theme: 'Light & Glow',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-bold',
    word: 'bold',
    definitions: [{
      definition: 'Confident and willing to take risks or face dangerous situations.',
      exampleSentence: 'The bold knight stepped forward when everyone else held back in fear.',
      synonyms: ['courageous', 'daring', 'audacious'],
      antonyms: ['timid', 'cowardly', 'meek'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['boldly', 'boldness', 'embolden', 'bolder', 'boldest'],
    trickyIndices: [[2, 4]], // 'ld' — consonant cluster
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },

  // ─── Heroes & Courage ─────────────────────────────────────────────────────

  {
    id: 'atom-brave',
    word: 'brave',
    definitions: [{
      definition: 'Ready to face and endure danger or pain without showing fear.',
      exampleSentence: 'It was brave of her to speak up about the injustice even when she knew nobody else would.',
      synonyms: ['courageous', 'fearless', 'valiant'],
      antonyms: ['cowardly', 'afraid', 'timid'],
    }],
    partOfSpeech: 'adjective',
    wordFamily: ['bravely', 'bravery', 'braver', 'bravest'],
    trickyIndices: [[3, 5]], // 've' — silent e
    theme: 'Heroes & Courage',
    difficulty: 3,
    source: 'eleven-plus',
    isFree: false,
  },
];
