import type { Question } from '../../types/question';

export const verbalReasoningQuestions: Question[] = [
  // ─── DIFFICULTY 1 (Simpler passages, one tricky detail) ──────────

  // vr-1-01: comprehension-who
  {
    id: 'vr-1-01',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Tom had two books but only gave one to Sarah. Sarah then passed it to Jake. Who gave the book to Sarah?',
    questionTokens: [
      'Tom', 'had', 'two', 'books', 'but', 'only', 'gave', 'one', 'to', 'Sarah.', 'Sarah', 'then', 'passed', 'it', 'to', 'Jake.',
      'Who', 'gave', 'the', 'book', 'to', 'Sarah?',
    ],
    // "Tom gave one to Sarah" at indices 0,6,7,8,9
    keyWordIndices: [0, 6, 7, 8, 9],
    options: [
      { text: 'Tom', isEliminatable: false },
      { text: 'Jake', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Jake because he is the last name mentioned in the passage.' },
      { text: 'Sarah', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Sarah because her name appears in the question itself.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says someone gave the book to Sarah, so this cannot be right.' },
      { text: 'The teacher', isEliminatable: true, eliminationReason: 'A teacher is not mentioned in the passage at all.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Tom gave his book to Sarah." Tom is the one who gave the book. Sarah then passed it on to Jake, but Jake did not give it to Sarah.',
    category: 'comprehension-who',
  },

  // vr-1-02: comprehension-when
  {
    id: 'vr-1-02',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'The school trip to the museum was on Wednesday, not Thursday. On Thursday, the children only wrote about their trip. When did the children visit the museum?',
    questionTokens: [
      'The', 'school', 'trip', 'to', 'the', 'museum', 'was', 'on', 'Wednesday,', 'not', 'Thursday.', 'On', 'Thursday,',
      'the', 'children', 'only', 'wrote', 'about', 'their', 'trip.', 'When', 'did', 'the', 'children',
      'visit', 'the', 'museum?',
    ],
    // "was on Wednesday, not Thursday" at indices 6,7,8,9,10
    keyWordIndices: [2, 5, 6, 7, 8],
    options: [
      { text: 'Wednesday', isEliminatable: false },
      { text: 'Thursday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Thursday because the children did something about the trip on Thursday, but that was writing, not visiting.' },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'Friday is not mentioned anywhere in the passage.' },
      { text: 'Tuesday', isEliminatable: true, eliminationReason: 'Tuesday is not mentioned in the passage at all.' },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'Monday is not mentioned in the passage. The museum visit was on Wednesday.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The first sentence says the school trip to the museum was on Wednesday. On Thursday they wrote about the trip, but the actual visit was on Wednesday.',
    category: 'comprehension-when',
  },

  // vr-1-03: comprehension-where
  {
    id: 'vr-1-03',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'After PE, Lily took off her coat and left it in the school gym. She did not notice until she got home. Where did Lily leave her coat?',
    questionTokens: [
      'After', 'PE,', 'Lily', 'took', 'off', 'her', 'coat', 'and', 'left', 'it', 'in',
      'the', 'school', 'gym.', 'She', 'did', 'not', 'notice', 'until', 'she', 'got',
      'home.', 'Where', 'did', 'Lily', 'leave', 'her', 'coat?',
    ],
    keyWordIndices: [0, 1, 4, 5, 6, 8, 11, 12, 13, 16, 19, 20, 21, 25],
    options: [
      { text: 'The school gym', isEliminatable: false },
      { text: 'At home', isEliminatable: true, eliminationReason: 'Lily got home but that is where she noticed the coat was missing — she did not leave it there. A rusher picks the last place mentioned.' },
      { text: 'The school playground', isEliminatable: true, eliminationReason: 'The playground is not mentioned. Lily left her coat in the gym after PE.' },
      { text: 'The school canteen', isEliminatable: true, eliminationReason: 'The canteen is not mentioned in the passage. The coat was left in the gym.' },
      { text: 'In the car', isEliminatable: true, eliminationReason: 'No car is mentioned. Lily left her coat in the school gym after PE.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Lily left her coat "in the school gym" after PE. Home is where she noticed it was missing — not where she left it. A rusher picks home because it is the last place mentioned.',
    category: 'comprehension-where',
    trickType: 'position-trap',
  },

  // vr-1-04: comprehension-how-many
  {
    id: 'vr-1-04',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Oliver had 5 sweets. He gave 2 to his sister but ate only 1 himself. How many sweets did Oliver give to his sister?',
    questionTokens: [
      'Oliver', 'had', '5', 'sweets.', 'He', 'gave', '2', 'to', 'his', 'sister', 'but',
      'ate', 'only', '1', 'himself.', 'How', 'many', 'sweets', 'did', 'Oliver', 'give', 'to',
      'his', 'sister?',
    ],
    // "gave 2 to his sister" at indices 5,6,7,8,9
    keyWordIndices: [5, 6, 7, 8, 9],
    options: [
      { text: '2', isEliminatable: false },
      { text: '5', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 5 because that is the total number of sweets Oliver had, not how many he gave away.' },
      { text: '1', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 1 because that number also appears in the passage, but 1 is how many he ate himself.' },
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 3 because 5 minus 2 equals 3, but the question asks how many he gave, not how many are left.' },
      { text: '4', isEliminatable: true, eliminationReason: '4 is not mentioned in the passage. Oliver had 5, gave 2, and ate 1.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Oliver "gave 2 to his sister." The number 5 is the total he started with, and 1 is how many he ate. The question specifically asks how many he gave to his sister, which is 2.',
    category: 'comprehension-how-many',
  },

  // vr-1-05: comprehension-what
  {
    id: 'vr-1-05',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Emma had a cat called Whiskers and a dog called Biscuit, but it was not the dog that knocked a vase off the shelf. What is the name of Emma\'s cat?',
    questionTokens: [
      'Emma', 'had', 'a', 'cat', 'called', 'Whiskers', 'and', 'a', 'dog', 'called',
      'Biscuit,', 'but', 'it', 'was', 'not', 'the', 'dog', 'that', 'knocked', 'a', 'vase', 'off', 'the', 'shelf.',
      'What', 'is', 'the', 'name', 'of', "Emma's", 'cat?',
    ],
    // "cat called Whiskers" at indices 3,4,5
    keyWordIndices: [3, 4, 5],
    options: [
      { text: 'Whiskers', isEliminatable: false },
      { text: 'Biscuit', isEliminatable: true, eliminationReason: 'If you rushed, you might mix up the pet names. Biscuit is the dog, not the cat.' },
      { text: 'Emma', isEliminatable: true, eliminationReason: 'Emma is the owner, not the cat. The question asks for the cat\'s name.' },
      { text: 'Vase', isEliminatable: true, eliminationReason: 'A vase is an object in the story, not a pet name.' },
      { text: 'Shelf', isEliminatable: true, eliminationReason: 'The shelf is an object in the passage, not a pet name.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Emma had "a cat called Whiskers and a dog called Biscuit." Whiskers is the cat. Biscuit is the dog.',
    category: 'comprehension-what',
  },

  // vr-1-06: comprehension-why (requires separating cause from effect)
  {
    id: 'vr-1-06',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Ben set his alarm for 7 o\'clock but it did not go off. He woke at 8 o\'clock and the bus had already left. His dad had to drive him to school. What caused Ben to miss the bus?',
    questionTokens: [
      'Ben', 'set', 'his', 'alarm', 'for', '7', "o'clock", 'but', 'it', 'did', 'not', 'go', 'off.',
      'He', 'woke', 'at', '8', "o'clock", 'and', 'the', 'bus', 'had', 'already', 'left.',
      'His', 'dad', 'had', 'to', 'drive', 'him', 'to', 'school.',
      'What', 'caused', 'Ben', 'to', 'miss', 'the', 'bus?',
    ],
    keyWordIndices: [7, 8, 9, 10, 11, 12, 32, 33],
    options: [
      { text: 'His alarm did not go off', isEliminatable: false },
      { text: 'His dad drove him', isEliminatable: true, eliminationReason: 'His dad driving was the result of missing the bus, not the cause. A rusher confuses what happened because of the problem with the cause of the problem.' },
      { text: 'The bus broke down', isEliminatable: true, eliminationReason: 'The bus left on time — it did not break down. Ben was the one who was late.' },
      { text: 'He forgot to set his alarm', isEliminatable: true, eliminationReason: 'He did set his alarm — the problem was that it did not go off. A rusher skips the detail about what went wrong.' },
      { text: 'He woke up late', isEliminatable: true, eliminationReason: 'Waking up late was the result of the alarm not going off, not the root cause.' },
    ],
    correctOptionIndex: 0,
    explanation: 'Ben did set his alarm — but "it did not go off." This caused him to oversleep until 8 o\'clock, by which time the bus had already left. His dad driving was the solution, not the cause.',
    category: 'comprehension-why',
  },

  // vr-1-07: comprehension-who
  {
    id: 'vr-1-07',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Sophie baked a cake but did not decorate it. Instead, her brother Jack decorated it with icing. Who decorated the cake?',
    questionTokens: [
      'Sophie', 'baked', 'a', 'cake', 'but', 'did', 'not', 'decorate', 'it.', 'Instead,', 'her', 'brother',
      'Jack', 'decorated', 'it', 'with', 'icing.', 'Who', 'decorated', 'the', 'cake?',
    ],
    // "brother Jack decorated it with icing" at indices 11,12,13,14,15,16
    keyWordIndices: [11, 12, 13, 14, 15, 16],
    options: [
      { text: 'Jack', isEliminatable: false },
      { text: 'Sophie', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Sophie because she is the first name in the passage, but Sophie baked the cake. Jack decorated it.' },
      { text: 'Their mum', isEliminatable: true, eliminationReason: 'Their mum is not mentioned in the passage at all.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says someone decorated the cake with icing.' },
      { text: 'Both of them', isEliminatable: true, eliminationReason: 'Sophie baked the cake but did not decorate it. Only Jack decorated it.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Her brother Jack decorated it with icing." Sophie baked the cake, but Jack is the one who decorated it.',
    category: 'comprehension-who',
  },

  // vr-1-08: comprehension-where
  {
    id: 'vr-1-08',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Grandma keeps her biscuits in the kitchen but not her sewing box. Her sewing box is always in the living room. Where does Grandma keep her biscuits?',
    questionTokens: [
      'Grandma', 'keeps', 'her', 'biscuits', 'in', 'the', 'kitchen', 'but', 'not', 'her', 'sewing',
      'box.', 'Her', 'sewing', 'box', 'is', 'always', 'in', 'the', 'living', 'room.',
      'Where', 'does', 'Grandma', 'keep', 'her', 'biscuits?',
    ],
    // "biscuits in the kitchen" at indices 3,4,5,6; "but not her sewing box" at indices 7,8,9,10,11
    keyWordIndices: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 21, 23, 24, 26],
    options: [
      { text: 'The kitchen', isEliminatable: false },
      { text: 'The living room', isEliminatable: true, eliminationReason: 'The living room is where Grandma keeps her sewing box, not her biscuits. A rusher reads the last location mentioned and picks it.' },
      { text: 'The bedroom', isEliminatable: true, eliminationReason: 'The bedroom is not mentioned in the passage.' },
      { text: 'The cupboard', isEliminatable: true, eliminationReason: 'A cupboard is not mentioned in the passage. The biscuits are kept in the kitchen.' },
      { text: 'The dining room', isEliminatable: true, eliminationReason: 'The dining room is not mentioned in the passage. The biscuits are in the kitchen.' },
    ],
    correctOptionIndex: 0,
    explanation: 'Sentence 1 says Grandma keeps her biscuits in the kitchen. Sentence 2 about the living room is about the sewing box — a rusher who reads quickly grabs "living room" as the last location mentioned and picks that instead.',
    category: 'comprehension-where',
    trickType: 'position-trap',
  },

  // vr-1-09: comprehension-when (requires following a chain of information)
  {
    id: 'vr-1-09',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Mia has three activities each week. Swimming is the day after Monday. Piano is two days after swimming. Dance is on Fridays. Which day does Mia have piano?',
    questionTokens: [
      'Mia', 'has', 'three', 'activities', 'each', 'week.', 'Swimming', 'is', 'the', 'day',
      'after', 'Monday.', 'Piano', 'is', 'two', 'days', 'after', 'swimming.', 'Dance', 'is',
      'on', 'Fridays.', 'Which', 'day', 'does', 'Mia', 'have', 'piano?',
    ],
    keyWordIndices: [6, 8, 9, 10, 11, 12, 14, 15, 16, 17],
    options: [
      { text: 'Thursday', isEliminatable: false },
      { text: 'Tuesday', isEliminatable: true, eliminationReason: 'Tuesday is the day after Monday — that is when Mia has swimming, not piano. A rusher stops too early in the chain.' },
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'Wednesday is only one day after swimming (Tuesday). Piano is TWO days after swimming. A rusher miscounts the days.' },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'Friday is when Mia has dance, not piano. A rusher picks the wrong activity\'s day.' },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'Monday is not the answer. Swimming is the day AFTER Monday (Tuesday), and piano is two days after that (Thursday).' },
    ],
    correctOptionIndex: 0,
    explanation: 'Swimming is "the day after Monday" — that is Tuesday. Piano is "two days after swimming" — Tuesday plus two is Thursday. So piano is on Thursday. You have to follow the chain of clues!',
    category: 'comprehension-inference',
  },

  // vr-1-10: comprehension-inference (requires deduction, not direct lookup)
  {
    id: 'vr-1-10',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Harry, Alfie and Tom each wore a different coloured jumper: red, green and blue. Harry\'s jumper was not green. Tom\'s jumper was not green and not red. What colour was Alfie\'s jumper?',
    questionTokens: [
      'Harry,', 'Alfie', 'and', 'Tom', 'each', 'wore', 'a', 'different', 'coloured', 'jumper:', 'red,', 'green', 'and', 'blue.',
      "Harry's", 'jumper', 'was', 'not', 'green.', "Tom's", 'jumper', 'was', 'not', 'green', 'and', 'not', 'red.',
      'What', 'colour', 'was', "Alfie's", 'jumper?',
    ],
    keyWordIndices: [14, 17, 18, 19, 22, 23, 25, 26, 27, 28, 30],
    options: [
      { text: 'Green', isEliminatable: false },
      { text: 'Red', isEliminatable: true, eliminationReason: 'Harry or Tom could wear red, but the question asks about Alfie. Since Harry and Tom are both "not green", only Alfie can wear green.' },
      { text: 'Blue', isEliminatable: true, eliminationReason: 'Tom must wear blue (not green, not red). Harry wears red (not green). That leaves green for Alfie.' },
      { text: 'Yellow', isEliminatable: true, eliminationReason: 'Yellow is not one of the three colours listed. Only red, green and blue are available.' },
      { text: 'Red and blue striped', isEliminatable: true, eliminationReason: 'Each child wore a single colour. Alfie\'s jumper was green because neither Harry nor Tom could wear green.' },
    ],
    correctOptionIndex: 0,
    explanation: 'Tom\'s jumper is not green and not red — so Tom must wear blue. Harry\'s is not green — so Harry wears red. That leaves green for Alfie. You have to work through the clues step by step!',
    category: 'comprehension-inference',
  },

  // ─── DIFFICULTY 2 (Medium passages, more details to confuse) ─────

  // vr-2-01: comprehension-who
  {
    id: 'vr-2-01',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Aisha scored the first goal, not Ruby, although Ruby scored the second. Charlotte was the goalkeeper who saved three shots. Who scored the first goal?',
    questionTokens: [
      'Aisha', 'scored', 'the', 'first', 'goal,', 'not', 'Ruby,', 'although', 'Ruby', 'scored', 'the', 'second.',
      'Charlotte', 'was', 'the', 'goalkeeper', 'who', 'saved', 'three', 'shots.',
      'Who', 'scored', 'the', 'first', 'goal?',
    ],
    // "Aisha scored the first goal" at indices 0,1,2,3,4
    keyWordIndices: [0, 1, 2, 3, 4],
    options: [
      { text: 'Aisha', isEliminatable: false },
      { text: 'Ruby', isEliminatable: true, eliminationReason: 'If you rushed, you might mix up the two scorers. Ruby scored the second goal, not the first.' },
      { text: 'Charlotte', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Charlotte because she is mentioned in the passage, but she was the goalkeeper, not a scorer.' },
      { text: 'The goalkeeper', isEliminatable: true, eliminationReason: 'The goalkeeper saved shots but did not score any goals.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says someone scored the first goal — Aisha did.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Aisha scored the first goal and Ruby scored the second." Aisha scored first. Ruby scored second. Charlotte was the goalkeeper.',
    category: 'comprehension-who',
  },

  // vr-2-02: comprehension-when
  {
    id: 'vr-2-02',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The Year 5 sports day is on Monday, not Tuesday. The Year 6 sports day is on Tuesday instead. The prize-giving for both years is on Friday. When is the Year 6 sports day?',
    questionTokens: [
      'The', 'Year', '5', 'sports', 'day', 'is', 'on', 'Monday,', 'not', 'Tuesday.', 'The', 'Year', '6',
      'sports', 'day', 'is', 'on', 'Tuesday', 'instead.', 'The', 'prize-giving', 'for', 'both',
      'years', 'is', 'on', 'Friday.', 'When', 'is', 'the', 'Year', '6', 'sports', 'day?',
    ],
    // "Year 6 sports day is on Tuesday instead" at indices 11,12,13,14,15,16,17,18
    keyWordIndices: [11, 12, 13, 14, 15, 16, 17, 18],
    options: [
      { text: 'Tuesday', isEliminatable: false },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Monday because it is the first day mentioned, but Monday is for Year 5, not Year 6.' },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Friday because it is related to sports day, but Friday is the prize-giving, not the sports day itself.' },
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'Wednesday is not mentioned in the passage at all.' },
      { text: 'Thursday', isEliminatable: true, eliminationReason: 'Thursday is not mentioned in the passage. The Year 6 sports day is on Tuesday.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "The Year 6 sports day is on Tuesday." Monday is for Year 5 and Friday is the prize-giving.',
    category: 'comprehension-when',
  },

  // vr-2-03: comprehension-where
  {
    id: 'vr-2-03',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Dad left his keys at the office. He looked for them at home first, then drove back to the office to get them. He stopped at the petrol station on the way. Where were the keys?',
    questionTokens: [
      'Dad', 'left', 'his', 'keys', 'at', 'the', 'office.', 'He', 'looked', 'for', 'them',
      'at', 'home', 'first,', 'then', 'drove', 'back', 'to', 'the', 'office', 'to', 'get',
      'them.', 'He', 'stopped', 'at', 'the', 'petrol', 'station', 'on', 'the', 'way.',
      'Where', 'were', 'the', 'keys?',
    ],
    // "left his keys at the office" at indices 1,2,3,4,5,6
    keyWordIndices: [1, 2, 3, 4, 5, 6],
    options: [
      { text: 'At the office', isEliminatable: false },
      { text: 'At home', isEliminatable: true, eliminationReason: 'If you rushed, you might pick home because Dad looked there first, but the keys were not at home. He left them at the office.' },
      { text: 'At the petrol station', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the petrol station because it is mentioned, but Dad only stopped there on the way. The keys were at the office.' },
      { text: 'In the car', isEliminatable: true, eliminationReason: 'The car is implied because Dad drove, but the keys were left at the office, not in the car.' },
      { text: 'At the shop', isEliminatable: true, eliminationReason: 'A shop is not mentioned in the passage. The keys were at the office.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The very first sentence says "Dad left his keys at the office." He looked at home first (they were not there) and stopped at a petrol station (not where the keys were). The keys were at the office all along.',
    category: 'comprehension-where',
  },

  // vr-2-04: comprehension-how-many
  {
    id: 'vr-2-04',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'There are 8 children in the choir. On Tuesday, 3 were absent so only 5 sang. On Wednesday, 2 were absent. How many children were absent on Wednesday?',
    questionTokens: [
      'There', 'are', '8', 'children', 'in', 'the', 'choir.', 'On', 'Tuesday,', '3', 'were',
      'absent', 'so', 'only', '5', 'sang.', 'On', 'Wednesday,', '2', 'were', 'absent.',
      'How', 'many', 'children', 'were', 'absent', 'on', 'Wednesday?',
    ],
    // "On Wednesday, 2 were absent" at indices 16,17,18,19,20
    keyWordIndices: [16, 17, 18, 19, 20],
    options: [
      { text: '2', isEliminatable: false },
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 3 because that is how many were absent, but on Tuesday, not Wednesday.' },
      { text: '5', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 5 because it is a number in the passage, but 5 is how many sang on Tuesday.' },
      { text: '8', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 8 because it is the total number of children in the choir, not how many were absent.' },
      { text: '6', isEliminatable: true, eliminationReason: '6 is the number who sang on Wednesday (8 minus 2), but the question asks how many were absent, not how many sang.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "On Wednesday, 2 were absent." On Tuesday 3 were absent (and 5 sang), but the question asks about Wednesday, when 2 were absent.',
    category: 'comprehension-how-many',
  },

  // vr-2-05: comprehension-why
  {
    id: 'vr-2-05',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The football match was cancelled because the pitch was flooded. However, the tennis match was not cancelled because the courts had a cover. Why was the football match cancelled?',
    questionTokens: [
      'The', 'football', 'match', 'was', 'cancelled', 'because', 'the', 'pitch', 'was',
      'flooded.', 'However,', 'the', 'tennis', 'match', 'was', 'not', 'cancelled', 'because', 'the', 'courts',
      'had', 'a', 'cover.', 'Why', 'was', 'the', 'football', 'match', 'cancelled?',
    ],
    // "because the pitch was flooded" at indices 5,6,7,8,9
    keyWordIndices: [5, 6, 7, 8, 9],
    options: [
      { text: 'The pitch was flooded', isEliminatable: false },
      { text: 'The courts had a cover', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the two reasons. The courts having a cover is why tennis went ahead, not why football was cancelled.' },
      { text: 'The tennis match went ahead', isEliminatable: true, eliminationReason: 'This is about what happened to tennis, not the reason football was cancelled.' },
      { text: 'It was too cold', isEliminatable: true, eliminationReason: 'Cold weather is not mentioned in the passage. The football was cancelled because of flooding.' },
      { text: 'The players were tired', isEliminatable: true, eliminationReason: 'Tired players are not mentioned. The pitch was flooded.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says the football match was cancelled "because the pitch was flooded." The detail about the courts having a cover explains why tennis went ahead, not why football was cancelled.',
    category: 'comprehension-why',
  },

  // vr-2-06: comprehension-what
  {
    id: 'vr-2-06',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'For her birthday, Grace got a book from her aunt but not from her gran. Her gran gave her a bracelet instead. Her best friend Priya gave her a diary. What did Grace\'s aunt give her?',
    questionTokens: [
      'For', 'her', 'birthday,', 'Grace', 'got', 'a', 'book', 'from', 'her', 'aunt', 'but',
      'not', 'from', 'her', 'gran.', 'Her', 'gran', 'gave', 'her', 'a', 'bracelet', 'instead.',
      'Her', 'best', 'friend', 'Priya', 'gave', 'her', 'a', 'diary.', 'What', 'did', "Grace's", 'aunt', 'give', 'her?',
    ],
    // "book from her aunt" at indices 6,7,8,9
    keyWordIndices: [5, 6, 7, 8, 9],
    options: [
      { text: 'A book', isEliminatable: false },
      { text: 'A bracelet', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the bracelet because it is another gift mentioned, but the bracelet was from her gran, not her aunt.' },
      { text: 'A diary', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the diary because it is the last gift mentioned, but Priya gave the diary, not the aunt.' },
      { text: 'A card', isEliminatable: true, eliminationReason: 'A card is not mentioned in the passage at all.' },
      { text: 'A necklace', isEliminatable: true, eliminationReason: 'A necklace is not mentioned in the passage at all.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Grace got "a book from her aunt and a bracelet from her gran." The aunt gave the book. The bracelet was from gran and the diary was from Priya.',
    category: 'comprehension-what',
  },

  // vr-2-07: comprehension-who
  {
    id: 'vr-2-07',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'In the school play, Ethan played the king and Zara played the queen. However, only Finn painted all the scenery. Who painted the scenery for the school play?',
    questionTokens: [
      'In', 'the', 'school', 'play,', 'Ethan', 'played', 'the', 'king', 'and', 'Zara',
      'played', 'the', 'queen.', 'However,', 'only', 'Finn', 'painted', 'all', 'the', 'scenery.',
      'Who', 'painted', 'the', 'scenery', 'for', 'the', 'school', 'play?',
    ],
    // "Finn painted all the scenery" at indices 15,16,17,18,19
    keyWordIndices: [15, 16, 17, 18, 19],
    options: [
      { text: 'Finn', isEliminatable: false },
      { text: 'Ethan', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Ethan because he is the first name mentioned, but Ethan played the king. Finn painted the scenery.' },
      { text: 'Zara', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Zara because she was in the play, but she played the queen. Finn painted the scenery.' },
      { text: 'The king', isEliminatable: true, eliminationReason: 'The king is a character in the play (played by Ethan), not the person who painted the scenery.' },
      { text: 'All three of them', isEliminatable: true, eliminationReason: 'Only Finn painted the scenery. Ethan and Zara were actors in the play.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Finn painted all the scenery." Ethan and Zara were actors in the play, but Finn was the one who painted the scenery.',
    category: 'comprehension-who',
  },

  // vr-2-08: comprehension-when
  {
    id: 'vr-2-08',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The baker makes bread every morning and cakes every afternoon. He delivers everything to the shop at 4 o\'clock. When does the baker make cakes?',
    questionTokens: [
      'The', 'baker', 'makes', 'bread', 'every', 'morning', 'and', 'cakes', 'every',
      'afternoon.', 'He', 'delivers', 'everything', 'to', 'the', 'shop', 'at', '4',
      "o'clock.", 'When', 'does', 'the', 'baker', 'make', 'cakes?',
    ],
    // "cakes every afternoon" at indices 7,8,9
    keyWordIndices: [7, 8, 9],
    options: [
      { text: 'Every afternoon', isEliminatable: false },
      { text: 'Every morning', isEliminatable: true, eliminationReason: 'If you rushed, you might pick morning because it is the first time mentioned, but the baker makes bread in the morning, not cakes.' },
      { text: 'At 4 o\'clock', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 4 o\'clock because it is a time in the passage, but that is when he delivers, not when he makes cakes.' },
      { text: 'Every evening', isEliminatable: true, eliminationReason: 'Evening is not mentioned in the passage. The cakes are made every afternoon.' },
      { text: 'At lunchtime', isEliminatable: true, eliminationReason: 'Lunchtime is not mentioned. The baker makes cakes every afternoon.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says the baker makes "cakes every afternoon." He makes bread in the morning and delivers at 4 o\'clock, but cakes are made in the afternoon.',
    category: 'comprehension-when',
  },

  // vr-2-09: comprehension-how-many
  {
    id: 'vr-2-09',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Class 5 collected 120 tins for the food bank. Class 6 collected 95 tins. The school target was 200 tins altogether. How many tins did Class 6 collect?',
    questionTokens: [
      'Class', '5', 'collected', '120', 'tins', 'for', 'the', 'food', 'bank.', 'Class', '6',
      'collected', '95', 'tins.', 'The', 'school', 'target', 'was', '200', 'tins',
      'altogether.', 'How', 'many', 'tins', 'did', 'Class', '6', 'collect?',
    ],
    // "Class 6 collected 95 tins" at indices 9,10,11,12,13
    keyWordIndices: [9, 10, 11, 12, 13],
    options: [
      { text: '95', isEliminatable: false },
      { text: '120', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 120 because it is the first number mentioned, but 120 was collected by Class 5, not Class 6.' },
      { text: '200', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 200 because it is a large number in the passage, but that is the school target, not what Class 6 collected.' },
      { text: '215', isEliminatable: true, eliminationReason: 'If you rushed, you might add 120 and 95 together, but the question only asks about Class 6, not the total.' },
      { text: '25', isEliminatable: true, eliminationReason: '25 is not a number in the passage. Class 6 collected 95 tins.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Class 6 collected 95 tins." Class 5 collected 120 tins and the target was 200, but the question asks specifically about Class 6.',
    category: 'comprehension-how-many',
  },

  // vr-2-10: comprehension-where
  {
    id: 'vr-2-10',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The football team practises at the park on Saturdays. Their matches are played at the school field. The awards evening is held at the village hall. Where does the team play their matches?',
    questionTokens: [
      'The', 'football', 'team', 'practises', 'at', 'the', 'park', 'on', 'Saturdays.',
      'Their', 'matches', 'are', 'played', 'at', 'the', 'school', 'field.', 'The', 'awards',
      'evening', 'is', 'held', 'at', 'the', 'village', 'hall.',
      'Where', 'does', 'the', 'team', 'play', 'their', 'matches?',
    ],
    // "matches are played at the school field" at indices 10,11,12,13,14,15,16
    keyWordIndices: [10, 11, 12, 13, 14, 15, 16],
    options: [
      { text: 'At the school field', isEliminatable: false },
      { text: 'At the park', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the park because it is the first place mentioned, but the park is where they practise, not where they play matches.' },
      { text: 'At the village hall', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the village hall because it is mentioned, but the village hall is for the awards evening, not matches.' },
      { text: 'At the stadium', isEliminatable: true, eliminationReason: 'A stadium is not mentioned anywhere in the passage.' },
      { text: 'At home', isEliminatable: true, eliminationReason: 'Home is not mentioned. Matches are played at the school field.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Their matches are played at the school field." They practise at the park and hold the awards evening at the village hall, but matches are at the school field.',
    category: 'comprehension-where',
  },

  // ─── DIFFICULTY 3 (Longer passages, multiple confusing details) ──

  // vr-3-01: comprehension-who
  {
    id: 'vr-3-01',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Amara lent her ruler to Deepa but not her pencil. Instead, Deepa lent her pencil to Noah. Noah gave his rubber to Amara. Who lent a pencil to Noah?',
    questionTokens: [
      'Amara', 'lent', 'her', 'ruler', 'to', 'Deepa', 'but', 'not', 'her', 'pencil.', 'Instead,', 'Deepa', 'lent', 'her', 'pencil',
      'to', 'Noah.', 'Noah', 'gave', 'his', 'rubber', 'to', 'Amara.',
      'Who', 'lent', 'a', 'pencil', 'to', 'Noah?',
    ],
    // "Deepa lent her pencil to Noah" at indices 11,12,13,14,15,16
    keyWordIndices: [11, 12, 13, 14, 15, 16],
    options: [
      { text: 'Deepa', isEliminatable: false },
      { text: 'Amara', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Amara because she is the first name in the passage, but Amara lent a ruler, not a pencil.' },
      { text: 'Noah', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Noah because he is in the question, but Noah received the pencil. Deepa lent it to him.' },
      { text: 'The teacher', isEliminatable: true, eliminationReason: 'No teacher is mentioned in the passage at all.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says someone lent a pencil to Noah — it was Deepa.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Deepa lent her pencil to Noah." Amara lent a ruler (not a pencil) and Noah gave a rubber (not a pencil). Deepa is the one who lent the pencil.',
    category: 'comprehension-who',
  },

  // vr-3-02: comprehension-when
  {
    id: 'vr-3-02',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Isla\'s family visited France in July and Spain in August, but not before July. They booked their holiday in March and packed their suitcases on the last day of June. When did Isla\'s family visit Spain?',
    questionTokens: [
      "Isla's", 'family', 'visited', 'France', 'in', 'July', 'and', 'Spain', 'in', 'August,', 'but', 'not', 'before', 'July.',
      'They', 'booked', 'their', 'holiday', 'in', 'March', 'and', 'packed', 'their',
      'suitcases', 'on', 'the', 'last', 'day', 'of', 'June.',
      'When', 'did', "Isla's", 'family', 'visit', 'Spain?',
    ],
    // "Spain in August" at indices 7,8,9
    keyWordIndices: [7, 8, 9],
    options: [
      { text: 'August', isEliminatable: false },
      { text: 'July', isEliminatable: true, eliminationReason: 'If you rushed, you might mix up the two holiday months. July was when they visited France, not Spain.' },
      { text: 'March', isEliminatable: true, eliminationReason: 'If you rushed, you might pick March because it is a month in the passage, but that is when they booked the holiday, not when they visited.' },
      { text: 'June', isEliminatable: true, eliminationReason: 'If you rushed, you might pick June because it is mentioned, but June is when they packed their suitcases, not when they visited Spain.' },
      { text: 'September', isEliminatable: true, eliminationReason: 'September is not mentioned in the passage. Spain was visited in August.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says they visited "Spain in August." France was in July, they booked in March, and they packed in June. Spain was August.',
    category: 'comprehension-when',
  },

  // vr-3-03: comprehension-where
  {
    id: 'vr-3-03',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Oscar left his football boots in the changing room. He left his water bottle on the pitch, not in the changing room. Despite this, his shin pads were in his dad\'s car. His kit bag was at home. Where did Oscar leave his water bottle?',
    questionTokens: [
      'Oscar', 'left', 'his', 'football', 'boots', 'in', 'the', 'changing', 'room.', 'He',
      'left', 'his', 'water', 'bottle', 'on', 'the', 'pitch,', 'not', 'in', 'the', 'changing', 'room.',
      'Despite', 'this,', 'his', 'shin', 'pads', 'were', 'in', 'his', "dad's", 'car.', 'His', 'kit', 'bag', 'was', 'at', 'home.',
      'Where', 'did', 'Oscar', 'leave', 'his', 'water', 'bottle?',
    ],
    // "left his water bottle on the pitch" at indices 10,11,12,13,14,15,16
    keyWordIndices: [10, 11, 12, 13, 14, 15, 16],
    options: [
      { text: 'On the pitch', isEliminatable: false },
      { text: 'In the changing room', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the changing room because it is the first place mentioned, but that is where the football boots were left, not the water bottle.' },
      { text: 'In his dad\'s car', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the car because it is mentioned, but the shin pads were in the car, not the water bottle.' },
      { text: 'At home', isEliminatable: true, eliminationReason: 'If you rushed, you might pick home because it is a place in the passage, but the kit bag was at home, not the water bottle.' },
      { text: 'In his bag', isEliminatable: true, eliminationReason: 'His kit bag was at home. The water bottle was left on the pitch.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage lists four items in four places. The water bottle was left "on the pitch." The boots were in the changing room, shin pads in the car, and the kit bag at home.',
    category: 'comprehension-where',
  },

  // vr-3-04: comprehension-how-many
  {
    id: 'vr-3-04',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Mrs Khan bought 12 exercise books for Year 5 and 15 for Year 6, but not every book was for the same year. She also ordered 8 packs of pencils and 6 packs of pens. How many exercise books did she buy for Year 5?',
    questionTokens: [
      'Mrs', 'Khan', 'bought', '12', 'exercise', 'books', 'for', 'Year', '5', 'and', '15',
      'for', 'Year', '6,', 'but', 'not', 'every', 'book', 'was', 'for', 'the', 'same', 'year.',
      'She', 'also', 'ordered', '8', 'packs', 'of', 'pencils', 'and',
      '6', 'packs', 'of', 'pens.',
      'How', 'many', 'exercise', 'books', 'did', 'she', 'buy', 'for', 'Year', '5?',
    ],
    // "12 exercise books for Year 5" at indices 3,4,5,6,7,8
    keyWordIndices: [3, 4, 5, 6, 7, 8],
    options: [
      { text: '12', isEliminatable: false },
      { text: '15', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 15 because it is also exercise books, but 15 was for Year 6, not Year 5.' },
      { text: '8', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 8 because it is a number in the passage, but 8 is the packs of pencils, not exercise books.' },
      { text: '27', isEliminatable: true, eliminationReason: 'If you rushed, you might add 12 and 15 together, but the question only asks about Year 5, not both years.' },
      { text: '6', isEliminatable: true, eliminationReason: '6 is the packs of pens, not exercise books for Year 5.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Mrs Khan bought "12 exercise books for Year 5." Year 6 got 15. The numbers 8 and 6 are for pencils and pens, which are different items entirely.',
    category: 'comprehension-how-many',
  },

  // vr-3-05: comprehension-why
  {
    id: 'vr-3-05',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The school closed early on Friday because of heavy snow. Although some parents were late because the roads were icy, that was not the reason for closing. The caretaker stayed behind to salt the paths. Why did the school close early?',
    questionTokens: [
      'The', 'school', 'closed', 'early', 'on', 'Friday', 'because', 'of', 'heavy', 'snow.',
      'Although', 'some', 'parents', 'were', 'late', 'because', 'the', 'roads', 'were', 'icy,',
      'that', 'was', 'not', 'the', 'reason', 'for', 'closing.', 'The', 'caretaker', 'stayed', 'behind', 'to', 'salt',
      'the', 'paths.',
      'Why', 'did', 'the', 'school', 'close', 'early?',
    ],
    // "because of heavy snow" at indices 6,7,8,9
    keyWordIndices: [6, 7, 8, 9],
    options: [
      { text: 'Because of heavy snow', isEliminatable: false },
      { text: 'Because the roads were icy', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the two "because" reasons. The icy roads explain why parents were late, not why the school closed.' },
      { text: 'Because the caretaker salted the paths', isEliminatable: true, eliminationReason: 'If you rushed, you might link the caretaker to the closure, but the caretaker salted paths after the school closed. The snow was the reason for closing.' },
      { text: 'Because it was Friday', isEliminatable: true, eliminationReason: 'Friday is when it happened, not why it happened. The school closed because of the heavy snow.' },
      { text: 'Because parents were late', isEliminatable: true, eliminationReason: 'Parents were late because of icy roads. The passage explicitly says this was NOT the reason for closing.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says the school closed early "because of heavy snow." The icy roads explain why parents were late (a different cause-and-effect). The caretaker salting paths happened afterwards.',
    category: 'comprehension-why',
  },

  // vr-3-06: comprehension-what
  {
    id: 'vr-3-06',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'At the school fair, Class 4 ran the tombola stall. Class 5 ran the cake stall. Class 6 ran the lucky dip. The head teacher opened the fair at noon. What stall did Class 5 run?',
    questionTokens: [
      'At', 'the', 'school', 'fair,', 'Class', '4', 'ran', 'the', 'tombola', 'stall.',
      'Class', '5', 'ran', 'the', 'cake', 'stall.', 'Class', '6', 'ran', 'the', 'lucky',
      'dip.', 'The', 'head', 'teacher', 'opened', 'the', 'fair', 'at', 'noon.',
      'What', 'stall', 'did', 'Class', '5', 'run?',
    ],
    // "Class 5 ran the cake stall" at indices 10,11,12,13,14,15
    keyWordIndices: [10, 11, 12, 13, 14, 15],
    options: [
      { text: 'The cake stall', isEliminatable: false },
      { text: 'The tombola stall', isEliminatable: true, eliminationReason: 'If you rushed, you might pick tombola because it is the first stall mentioned, but that was Class 4, not Class 5.' },
      { text: 'The lucky dip', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the lucky dip because it is another stall, but the lucky dip was run by Class 6, not Class 5.' },
      { text: 'The raffle', isEliminatable: true, eliminationReason: 'A raffle is not mentioned in the passage at all.' },
      { text: 'The book stall', isEliminatable: true, eliminationReason: 'A book stall is not mentioned in the passage.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Class 5 ran the cake stall." Class 4 ran the tombola and Class 6 ran the lucky dip. You need to match the right class to the right stall.',
    category: 'comprehension-what',
  },

  // vr-3-07: comprehension-who
  {
    id: 'vr-3-07',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'In the relay race, Leo ran first, then Kai ran second. Maya ran third and Freya ran the final leg. Although Freya crossed the finish line to win, she was not the one who ran every leg. Who ran the second leg of the relay?',
    questionTokens: [
      'In', 'the', 'relay', 'race,', 'Leo', 'ran', 'first,', 'then', 'Kai', 'ran',
      'second.', 'Maya', 'ran', 'third', 'and', 'Freya', 'ran', 'the', 'final', 'leg.',
      'Although', 'Freya', 'crossed', 'the', 'finish', 'line', 'to', 'win,', 'she', 'was', 'not', 'the', 'one', 'who', 'ran', 'every', 'leg.',
      'Who', 'ran', 'the', 'second', 'leg', 'of', 'the', 'relay?',
    ],
    // "Kai ran second" at indices 8,9,10
    keyWordIndices: [7, 8, 9, 10],
    options: [
      { text: 'Kai', isEliminatable: false },
      { text: 'Leo', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Leo because he is the first name mentioned, but Leo ran first, not second.' },
      { text: 'Maya', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Maya because she ran next after Kai, but Maya ran third, not second.' },
      { text: 'Freya', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Freya because she won the race, but she ran the final leg, not the second.' },
      { text: 'All four of them', isEliminatable: true, eliminationReason: 'Only one person ran each leg. Kai ran the second leg.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Kai ran second." Leo ran first, Maya ran third, and Freya ran the final leg. Kai is the answer because he ran the second leg.',
    category: 'comprehension-who',
  },

  // vr-3-08: comprehension-when
  {
    id: 'vr-3-08',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The library opens at 9 o\'clock on weekdays. On Saturdays it opens at 10 o\'clock. It closes at 5 o\'clock every day. On Sundays the library is shut. When does the library open on Saturdays?',
    questionTokens: [
      'The', 'library', 'opens', 'at', '9', "o'clock", 'on', 'weekdays.', 'On', 'Saturdays',
      'it', 'opens', 'at', '10', "o'clock.", 'It', 'closes', 'at', '5', "o'clock", 'every',
      'day.', 'On', 'Sundays', 'the', 'library', 'is', 'shut.',
      'When', 'does', 'the', 'library', 'open', 'on', 'Saturdays?',
    ],
    // "On Saturdays it opens at 10 o'clock" at indices 8,9,10,11,12,13,14
    keyWordIndices: [8, 9, 10, 11, 12, 13, 14],
    options: [
      { text: '10 o\'clock', isEliminatable: false },
      { text: '9 o\'clock', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 9 because it is the first time mentioned, but 9 o\'clock is the weekday opening time, not the Saturday time.' },
      { text: '5 o\'clock', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 5 because it is a time in the passage, but 5 o\'clock is when the library closes, not when it opens.' },
      { text: 'It does not open', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse Saturdays with Sundays. The library is shut on Sundays, but it does open on Saturdays.' },
      { text: '8 o\'clock', isEliminatable: true, eliminationReason: '8 o\'clock is not mentioned in the passage. The library opens at 10 on Saturdays.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "On Saturdays it opens at 10 o\'clock." The weekday opening is 9 o\'clock, closing is 5 o\'clock, and it is shut on Sundays. Saturday opening is 10 o\'clock.',
    category: 'comprehension-when',
  },

  // vr-3-09: comprehension-how-many
  {
    id: 'vr-3-09',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'At the bake sale, Rohan made 24 biscuits and Ava made 18 cupcakes. Lucas made 30 flapjacks. They sold everything and raised 45 pounds in total. How many cupcakes did Ava make?',
    questionTokens: [
      'At', 'the', 'bake', 'sale,', 'Rohan', 'made', '24', 'biscuits', 'and', 'Ava', 'made',
      '18', 'cupcakes.', 'Lucas', 'made', '30', 'flapjacks.', 'They', 'sold', 'everything',
      'and', 'raised', '45', 'pounds', 'in', 'total.',
      'How', 'many', 'cupcakes', 'did', 'Ava', 'make?',
    ],
    // "Ava made 18 cupcakes" at indices 9,10,11,12
    keyWordIndices: [9, 10, 11, 12],
    options: [
      { text: '18', isEliminatable: false },
      { text: '24', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 24 because it is the first number mentioned, but 24 is how many biscuits Rohan made, not Ava\'s cupcakes.' },
      { text: '30', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 30 because it is a number in the passage, but 30 is how many flapjacks Lucas made.' },
      { text: '45', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 45 because it is the biggest number, but 45 is the money raised in pounds, not a number of cakes.' },
      { text: '72', isEliminatable: true, eliminationReason: '72 is the total of all items (24+18+30), but the question only asks about Ava\'s cupcakes, which is 18.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Ava made 18 cupcakes." Rohan made 24 biscuits, Lucas made 30 flapjacks, and 45 pounds was the money raised. You need to match the right person to the right number.',
    category: 'comprehension-how-many',
  },

  // vr-3-10: comprehension-why
  {
    id: 'vr-3-10',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Jess was chosen as team captain because she always encouraged her teammates. Poppy was the fastest runner but sometimes forgot to pass the ball. The coach said teamwork was more important than speed. Why was Jess chosen as team captain?',
    questionTokens: [
      'Jess', 'was', 'chosen', 'as', 'team', 'captain', 'because', 'she', 'always',
      'encouraged', 'her', 'teammates.', 'Poppy', 'was', 'the', 'fastest', 'runner', 'but',
      'sometimes', 'forgot', 'to', 'pass', 'the', 'ball.', 'The', 'coach', 'said', 'teamwork',
      'was', 'more', 'important', 'than', 'speed.',
      'Why', 'was', 'Jess', 'chosen', 'as', 'team', 'captain?',
    ],
    // "because she always encouraged her teammates" at indices 6,7,8,9,10,11
    keyWordIndices: [6, 7, 8, 9, 10, 11],
    options: [
      { text: 'She always encouraged her teammates', isEliminatable: false },
      { text: 'She was the fastest runner', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse Jess with Poppy. Poppy was the fastest runner, not Jess. Jess was chosen for encouraging others.' },
      { text: 'The coach liked speed', isEliminatable: true, eliminationReason: 'If you rushed, you might misread the passage. The coach actually said teamwork was more important than speed.' },
      { text: 'Poppy forgot to pass the ball', isEliminatable: true, eliminationReason: 'If you rushed, you might think Poppy\'s mistake is the reason, but the question asks why Jess was chosen, which is because she encouraged her teammates.' },
      { text: 'Because Poppy passed the ball', isEliminatable: true, eliminationReason: 'Poppy sometimes FORGOT to pass. Jess was chosen for encouraging her teammates.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says Jess was chosen "because she always encouraged her teammates." Poppy was the fastest runner but sometimes forgot to pass. The coach valued teamwork over speed, and Jess showed good teamwork.',
    category: 'comprehension-why',
  },

  // ─── TRICK QUESTIONS ──────────────────────────────────────────────

  // vr-1-11: position-trap
  {
    id: 'vr-1-11',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Emma loves painting. She goes to art club on Mondays. Her best friend Lily goes to drama club. Emma\'s brother Jack plays football on Fridays. Who goes to art club?',
    questionTokens: [
      'Emma', 'loves', 'painting.', 'She', 'goes', 'to', 'art', 'club', 'on', 'Mondays.',
      'Her', 'best', 'friend', 'Lily', 'goes', 'to', 'drama', 'club.', "Emma's", 'brother',
      'Jack', 'plays', 'football', 'on', 'Fridays.', 'Who', 'goes', 'to', 'art', 'club?',
    ],
    // "She goes to art club" at indices 3,4,5,6,7 (She = Emma)
    keyWordIndices: [0, 3, 4, 5, 6, 7],
    options: [
      { text: 'Emma', isEliminatable: false },
      { text: 'Lily', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Lily because she is mentioned as a friend, but Lily goes to drama club, not art club.' },
      { text: 'Jack', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Jack because he is the last name mentioned, but Jack plays football on Fridays.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says someone goes to art club on Mondays.' },
      { text: 'Mum', isEliminatable: true, eliminationReason: 'Mum is not mentioned in the passage. Emma goes to art club.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Emma loves painting. She goes to art club on Mondays." Emma is the one who goes to art club. Lily goes to drama club and Jack plays football.',
    category: 'comprehension-who',
    trickType: 'position-trap',
  },

  // vr-2-11: negation-trap
  {
    id: 'vr-2-11',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The old house was dark and gloomy. Which word is not closest in meaning to \'gloomy\'?',
    questionTokens: [
      'The', 'old', 'house', 'was', 'dark', 'and', 'gloomy.', 'Which', 'word', 'is',
      'not', 'closest', 'in', 'meaning', 'to', "'gloomy'?",
    ],
    // "NOT closest in meaning to 'gloomy'" at indices 10,11,12,13,14,15
    keyWordIndices: [6, 10, 11, 12, 13, 14, 15],
    options: [
      { text: 'Dim', isEliminatable: true, eliminationReason: 'Dim is similar in meaning to gloomy — both describe something dark. The question asks for the word that is NOT closest in meaning.' },
      { text: 'Dreary', isEliminatable: true, eliminationReason: 'Dreary is similar in meaning to gloomy — both describe something dull and sad. The question asks for the word that is NOT closest in meaning.' },
      { text: 'Cheerful', isEliminatable: false },
      { text: 'Dismal', isEliminatable: true, eliminationReason: 'Dismal is similar in meaning to gloomy — both describe something bleak. The question asks for the word that is NOT closest in meaning.' },
      { text: 'Murky', isEliminatable: true, eliminationReason: '"Murky" means dark or unclear, which is similar to gloomy. The question asks for the word NOT closest in meaning.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The question asks which word is NOT closest in meaning to "gloomy." Dim, dreary, and dismal are all similar to gloomy. Cheerful means happy and bright — the opposite of gloomy — so it is NOT closest in meaning.',
    category: 'vocabulary',
    trickType: 'negation-trap',
  },

  // vr-2-12: question-at-end
  {
    id: 'vr-2-12',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The village library is open from Monday to Friday. On Saturdays, only the café section is open. The children\'s reading group meets every Wednesday afternoon. Mrs Chen brings her class from the primary school each Thursday morning. The library is closed on Sundays. On which day does Mrs Chen bring her class to the library?',
    questionTokens: [
      'The', 'village', 'library', 'is', 'open', 'from', 'Monday', 'to', 'Friday.',
      'On', 'Saturdays,', 'only', 'the', 'café', 'section', 'is', 'open.',
      'The', "children's", 'reading', 'group', 'meets', 'every', 'Wednesday', 'afternoon.',
      'Mrs', 'Chen', 'brings', 'her', 'class', 'from', 'the', 'primary', 'school', 'each',
      'Thursday', 'morning.', 'The', 'library', 'is', 'closed', 'on', 'Sundays.',
      'On', 'which', 'day', 'does', 'Mrs', 'Chen', 'bring', 'her', 'class', 'to', 'the', 'library?',
    ],
    // "Mrs Chen brings her class ... each Thursday morning" at indices 25,26,27,28,29,34,35,36
    keyWordIndices: [25, 26, 27, 28, 29, 34, 35, 36],
    options: [
      { text: 'Thursday', isEliminatable: false },
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Wednesday because it is a day mentioned in the passage, but Wednesday is when the children\'s reading group meets, not when Mrs Chen brings her class.' },
      { text: 'Saturday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Saturday because it is mentioned, but on Saturdays only the café section is open.' },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Monday because it is the first day mentioned, but the passage does not say Mrs Chen comes on Mondays.' },
      { text: 'Sunday', isEliminatable: true, eliminationReason: 'The library is closed on Sundays. Mrs Chen brings her class on Thursday.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Mrs Chen brings her class from the primary school each Thursday morning." The question comes at the very end of a long passage, so you need to read carefully. Wednesday is for the reading group, not Mrs Chen\'s class.',
    category: 'comprehension-when',
    trickType: 'question-at-end',
  },

  // vr-2-13: irrelevant-info
  {
    id: 'vr-2-13',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Oliver has a pet dog called Biscuit and a cat called Whiskers. He walks Biscuit every morning before school. On Wednesdays, he takes Biscuit to the vet for a check-up. His sister Maya prefers cats. Where does Oliver take Biscuit on Wednesdays?',
    questionTokens: [
      'Oliver', 'has', 'a', 'pet', 'dog', 'called', 'Biscuit', 'and', 'a', 'cat', 'called',
      'Whiskers.', 'He', 'walks', 'Biscuit', 'every', 'morning', 'before', 'school.',
      'On', 'Wednesdays,', 'he', 'takes', 'Biscuit', 'to', 'the', 'vet', 'for', 'a', 'check-up.',
      'His', 'sister', 'Maya', 'prefers', 'cats.',
      'Where', 'does', 'Oliver', 'take', 'Biscuit', 'on', 'Wednesdays?',
    ],
    // "On Wednesdays, he takes Biscuit to the vet for a check-up" at indices 19,20,21,22,23,24,25,26,27,28,29
    keyWordIndices: [19, 20, 21, 22, 23, 24, 25, 26],
    options: [
      { text: 'To the vet', isEliminatable: false },
      { text: 'To school', isEliminatable: true, eliminationReason: 'If you rushed, you might pick school because it is mentioned in the passage, but Oliver walks Biscuit before school — he does not take Biscuit to school.' },
      { text: 'To Maya\'s house', isEliminatable: true, eliminationReason: 'Maya is Oliver\'s sister who prefers cats. She is irrelevant to where Biscuit goes on Wednesdays.' },
      { text: 'To the park', isEliminatable: true, eliminationReason: 'A park is not mentioned anywhere in the passage. Oliver takes Biscuit to the vet on Wednesdays.' },
      { text: 'To Whiskers', isEliminatable: true, eliminationReason: 'Whiskers is the cat, not a place. Oliver takes Biscuit the dog to the vet on Wednesdays.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "On Wednesdays, he takes Biscuit to the vet for a check-up." The details about Maya preferring cats and Whiskers the cat are irrelevant distractions. The answer is the vet.',
    category: 'comprehension-where',
    trickType: 'irrelevant-info',
  },

  // vr-3-11: negation-trap
  {
    id: 'vr-3-11',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Sam never forgets his homework, unlike his friend Tom who always leaves it at home. Sam\'s sister Amy also never forgets. Who does not always bring their homework?',
    questionTokens: [
      'Sam', 'never', 'forgets', 'his', 'homework,', 'unlike', 'his', 'friend', 'Tom', 'who',
      'always', 'leaves', 'it', 'at', 'home.', "Sam's", 'sister', 'Amy', 'also', 'never',
      'forgets.', 'Who', 'does', 'not', 'always', 'bring', 'their', 'homework?',
    ],
    // "unlike his friend Tom who always leaves it at home" at indices 5,6,7,8,9,10,11,12,13,14
    keyWordIndices: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 23],
    options: [
      { text: 'Tom', isEliminatable: false },
      { text: 'Sam', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Sam because he is the first name mentioned, but Sam never forgets his homework — he always brings it.' },
      { text: 'Amy', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Amy because she is another name in the passage, but Amy also never forgets her homework.' },
      { text: 'All of them', isEliminatable: true, eliminationReason: 'The passage says Sam and Amy never forget, so not all of them fail to bring their homework. Only Tom does.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'Tom does not always bring his homework. He always leaves it at home.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The question asks who does NOT always bring their homework. Sam "never forgets" (so he always brings it) and Amy "also never forgets." Tom "always leaves it at home," meaning he does NOT bring it. The double negatives and the word NOT make this tricky.',
    category: 'comprehension-who',
    trickType: 'negation-trap',
  },

  // vr-3-12: position-trap
  {
    id: 'vr-3-12',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'At the science fair, first place went to Mia for her volcano project. Aiden came second with his solar system model. In third place was Zara with her plant growth experiment. Raj\'s robot didn\'t win a prize but everyone loved it. The judges said Mia\'s project showed the most creativity. Who won second place?',
    questionTokens: [
      'At', 'the', 'science', 'fair,', 'first', 'place', 'went', 'to', 'Mia', 'for', 'her',
      'volcano', 'project.', 'Aiden', 'came', 'second', 'with', 'his', 'solar', 'system',
      'model.', 'In', 'third', 'place', 'was', 'Zara', 'with', 'her', 'plant', 'growth',
      'experiment.', "Raj's", 'robot', "didn't", 'win', 'a', 'prize', 'but', 'everyone', 'loved',
      'it.', 'The', 'judges', 'said', "Mia's", 'project', 'showed', 'the', 'most', 'creativity.',
      'Who', 'won', 'second', 'place?',
    ],
    // "Aiden came second with his solar system model" at indices 13,14,15,16,17,18,19,20
    keyWordIndices: [13, 14, 15, 16, 17, 18, 19, 20],
    options: [
      { text: 'Aiden', isEliminatable: false },
      { text: 'Mia', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Mia because she is the most prominent name — mentioned first and last — but Mia won first place, not second.' },
      { text: 'Zara', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Zara because she is close to second in the list, but Zara came third, not second.' },
      { text: 'Raj', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Raj because he is mentioned in the passage, but Raj didn\'t win a prize at all.' },
      { text: 'No one won second', isEliminatable: true, eliminationReason: 'The passage clearly states that Aiden came second.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Aiden came second with his solar system model." With many names and Mia mentioned both first and last, it is easy to get distracted. But the question asks specifically about second place, which was Aiden.',
    category: 'comprehension-who',
    trickType: 'position-trap',
  },

  // ─── DIFFICULTY 1 (Additional questions) ──────────────────────────

  // vr-1-12: comprehension-where
  {
    id: 'vr-1-12',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Lily put her hat on the shelf, not on the hook. Where did Lily put her hat?',
    questionTokens: [
      'Lily', 'put', 'her', 'hat', 'on', 'the', 'shelf,', 'not', 'on', 'the', 'hook.',
      'Where', 'did', 'Lily', 'put', 'her', 'hat?',
    ],
    keyWordIndices: [0, 1, 2, 3, 4, 5, 6],
    options: [
      { text: 'On the hook', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the hook because it is the last place mentioned, but the passage says NOT on the hook.' },
      { text: 'On the shelf', isEliminatable: false },
      { text: 'On the floor', isEliminatable: true, eliminationReason: 'The floor is not mentioned in the passage at all.' },
      { text: 'In her bag', isEliminatable: true, eliminationReason: 'A bag is not mentioned in the passage at all.' },
      { text: 'On the table', isEliminatable: true, eliminationReason: 'A table is not mentioned. Lily put her hat on the shelf.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says Lily put her hat "on the shelf, not on the hook." The word "not" tells us the hook is wrong. The shelf is the correct answer.',
    category: 'comprehension-where',
  },

  // vr-1-13: comprehension-what
  {
    id: 'vr-1-13',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Ben had a sandwich for lunch but he ate an apple for his snack. What did Ben eat for his snack?',
    questionTokens: [
      'Ben', 'had', 'a', 'sandwich', 'for', 'lunch', 'but', 'he', 'ate', 'an', 'apple', 'for', 'his', 'snack.',
      'What', 'did', 'Ben', 'eat', 'for', 'his', 'snack?',
    ],
    keyWordIndices: [8, 9, 10, 11, 12, 13],
    options: [
      { text: 'A sandwich', isEliminatable: true, eliminationReason: 'If you rushed, you might pick sandwich because it is the first food mentioned, but the sandwich was for lunch, not the snack.' },
      { text: 'A biscuit', isEliminatable: true, eliminationReason: 'A biscuit is not mentioned in the passage at all.' },
      { text: 'An apple', isEliminatable: false },
      { text: 'A banana', isEliminatable: true, eliminationReason: 'A banana is not mentioned in the passage at all.' },
      { text: 'A cake', isEliminatable: true, eliminationReason: 'A cake is not mentioned in the passage. Ben ate an apple for his snack.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says Ben "ate an apple for his snack." The sandwich was for lunch, not the snack. Read carefully to match the right food to the right meal.',
    category: 'comprehension-what',
  },

  // vr-1-14: comprehension-who
  {
    id: 'vr-1-14',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Emma has a dog and a cat. Her brother Max has a rabbit. Who has a rabbit?',
    questionTokens: [
      'Emma', 'has', 'a', 'dog', 'and', 'a', 'cat.', 'Her', 'brother', 'Max', 'has', 'a', 'rabbit.',
      'Who', 'has', 'a', 'rabbit?',
    ],
    keyWordIndices: [8, 9, 10, 11, 12],
    options: [
      { text: 'Emma', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Emma because she is the first name mentioned, but Emma has a dog and a cat, not a rabbit.' },
      { text: 'Max', isEliminatable: false },
      { text: 'Both of them', isEliminatable: true, eliminationReason: 'Only Max has a rabbit. Emma has a dog and a cat.' },
      { text: 'Neither of them', isEliminatable: true, eliminationReason: 'The passage clearly says Max has a rabbit, so this is wrong.' },
      { text: 'Their dad', isEliminatable: true, eliminationReason: 'A dad is not mentioned in the passage. Only Emma and Max are described as having pets.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says "Her brother Max has a rabbit." Emma has a dog and a cat. Max is the one with the rabbit.',
    category: 'comprehension-who',
  },

  // vr-1-15: comprehension-how-many
  {
    id: 'vr-1-15',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'There were 6 red balloons and 4 blue balloons at the party. How many red balloons were there?',
    questionTokens: [
      'There', 'were', '6', 'red', 'balloons', 'and', '4', 'blue', 'balloons', 'at', 'the', 'party.',
      'How', 'many', 'red', 'balloons', 'were', 'there?',
    ],
    keyWordIndices: [2, 3, 4],
    options: [
      { text: '4', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 4 because it is a number in the passage, but 4 is the number of blue balloons, not red.' },
      { text: '10', isEliminatable: true, eliminationReason: 'If you rushed, you might add 6 and 4 together, but the question only asks about red balloons.' },
      { text: '6', isEliminatable: false },
      { text: '2', isEliminatable: true, eliminationReason: 'The number 2 is not mentioned in the passage at all.' },
      { text: '8', isEliminatable: true, eliminationReason: 'If you rushed, you might try adding numbers together, but the question only asks about red balloons, which is 6.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says there were "6 red balloons." The 4 blue balloons are a different colour. The question only asks about red, so the answer is 6.',
    category: 'comprehension-how-many',
  },

  // vr-1-16: comprehension-when
  {
    id: 'vr-1-16',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Swimming club is on Thursday. Football club is on Friday. When is swimming club?',
    questionTokens: [
      'Swimming', 'club', 'is', 'on', 'Thursday.', 'Football', 'club', 'is', 'on', 'Friday.',
      'When', 'is', 'swimming', 'club?',
    ],
    keyWordIndices: [0, 1, 2, 3, 4],
    options: [
      { text: 'Thursday', isEliminatable: false },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Friday because it is the last day mentioned, but Friday is for football club, not swimming.' },
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'Wednesday is not mentioned in the passage at all.' },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'Monday is not mentioned in the passage at all.' },
      { text: 'Saturday', isEliminatable: true, eliminationReason: 'Saturday is not mentioned in the passage. Swimming club is on Thursday.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Swimming club is on Thursday." Football club is on Friday. Make sure you match the right activity to the right day.',
    category: 'comprehension-when',
  },

  // vr-1-17: comprehension-why
  {
    id: 'vr-1-17',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Sophie was late for school because she missed the bus. Her sister walked instead. Why was Sophie late?',
    questionTokens: [
      'Sophie', 'was', 'late', 'for', 'school', 'because', 'she', 'missed', 'the', 'bus.',
      'Her', 'sister', 'walked', 'instead.',
      'Why', 'was', 'Sophie', 'late?',
    ],
    keyWordIndices: [5, 6, 7, 8, 9],
    options: [
      { text: 'She walked to school', isEliminatable: true, eliminationReason: 'If you rushed, you might pick walking because it is mentioned, but it was her sister who walked, not Sophie.' },
      { text: 'She was ill', isEliminatable: true, eliminationReason: 'Being ill is not mentioned in the passage at all.' },
      { text: 'Her sister was late', isEliminatable: true, eliminationReason: 'The passage says Sophie was late, not her sister. Her sister walked instead.' },
      { text: 'She missed the bus', isEliminatable: false },
      { text: 'She overslept', isEliminatable: true, eliminationReason: 'Oversleeping is not mentioned in the passage. Sophie was late because she missed the bus.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says Sophie was late "because she missed the bus." Her sister walked instead, but that is about her sister, not why Sophie was late.',
    category: 'comprehension-why',
  },

  // vr-1-18: comprehension-what
  {
    id: 'vr-1-18',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Jack painted a picture of a tree. His friend Rosie painted a picture of the sea. What did Rosie paint?',
    questionTokens: [
      'Jack', 'painted', 'a', 'picture', 'of', 'a', 'tree.', 'His', 'friend', 'Rosie', 'painted',
      'a', 'picture', 'of', 'the', 'sea.',
      'What', 'did', 'Rosie', 'paint?',
    ],
    keyWordIndices: [9, 10, 11, 12, 13, 14, 15],
    options: [
      { text: 'A tree', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a tree because it is the first painting mentioned, but Jack painted the tree, not Rosie.' },
      { text: 'A flower', isEliminatable: true, eliminationReason: 'A flower is not mentioned in the passage at all.' },
      { text: 'A house', isEliminatable: true, eliminationReason: 'A house is not mentioned in the passage at all.' },
      { text: 'The sea', isEliminatable: false },
      { text: 'A mountain', isEliminatable: true, eliminationReason: 'A mountain is not mentioned in the passage. Rosie painted the sea and Jack painted a tree.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says "Rosie painted a picture of the sea." Jack painted the tree. Make sure you match the right person to the right painting.',
    category: 'comprehension-what',
  },

  // vr-1-19: comprehension-who
  {
    id: 'vr-1-19',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Mum baked a cake. Dad made the sandwiches. Gran brought the drinks. Who made the sandwiches?',
    questionTokens: [
      'Mum', 'baked', 'a', 'cake.', 'Dad', 'made', 'the', 'sandwiches.', 'Gran', 'brought', 'the', 'drinks.',
      'Who', 'made', 'the', 'sandwiches?',
    ],
    keyWordIndices: [4, 5, 6, 7],
    options: [
      { text: 'Gran', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Gran because she is the last person mentioned, but Gran brought the drinks, not the sandwiches.' },
      { text: 'Mum', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Mum because she is the first person mentioned, but Mum baked a cake, not sandwiches.' },
      { text: 'Dad', isEliminatable: false },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says Dad made the sandwiches.' },
      { text: 'Uncle Tom', isEliminatable: true, eliminationReason: 'An uncle is not mentioned in the passage. Dad made the sandwiches.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "Dad made the sandwiches." Mum baked a cake and Gran brought the drinks. Each person did something different.',
    category: 'comprehension-who',
  },

  // vr-1-20: comprehension-where
  {
    id: 'vr-1-20',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'The cat slept on the sofa. The dog slept in its basket. Where did the dog sleep?',
    questionTokens: [
      'The', 'cat', 'slept', 'on', 'the', 'sofa.', 'The', 'dog', 'slept', 'in', 'its', 'basket.',
      'Where', 'did', 'the', 'dog', 'sleep?',
    ],
    keyWordIndices: [6, 7, 8, 9, 10, 11],
    options: [
      { text: 'On the sofa', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the sofa because it is the first place mentioned, but the cat slept on the sofa, not the dog.' },
      { text: 'On the bed', isEliminatable: true, eliminationReason: 'A bed is not mentioned in the passage at all.' },
      { text: 'Under the table', isEliminatable: true, eliminationReason: 'A table is not mentioned in the passage at all.' },
      { text: 'In its basket', isEliminatable: false },
      { text: 'In the garden', isEliminatable: true, eliminationReason: 'A garden is not mentioned in the passage. The dog slept in its basket.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says "The dog slept in its basket." The cat slept on the sofa. Make sure you match the right animal to the right place.',
    category: 'comprehension-where',
  },

  // vr-1-21: comprehension-how-many
  {
    id: 'vr-1-21',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Sam read 3 books in January and 5 books in February. How many books did Sam read in February?',
    questionTokens: [
      'Sam', 'read', '3', 'books', 'in', 'January', 'and', '5', 'books', 'in', 'February.',
      'How', 'many', 'books', 'did', 'Sam', 'read', 'in', 'February?',
    ],
    keyWordIndices: [7, 8, 9, 10],
    options: [
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 3 because it is the first number mentioned, but Sam read 3 books in January, not February.' },
      { text: '5', isEliminatable: false },
      { text: '8', isEliminatable: true, eliminationReason: 'If you rushed, you might add 3 and 5 together, but the question only asks about February.' },
      { text: '2', isEliminatable: true, eliminationReason: 'The number 2 is not mentioned in the passage at all.' },
      { text: '4', isEliminatable: true, eliminationReason: 'The number 4 is not mentioned in the passage. Sam read 5 books in February.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says Sam read "5 books in February." He read 3 in January, but the question asks about February specifically.',
    category: 'comprehension-how-many',
  },

  // vr-1-22: comprehension-inference
  {
    id: 'vr-1-22',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Ella took her umbrella because the sky was grey and cloudy. What was the weather probably going to be like?',
    questionTokens: [
      'Ella', 'took', 'her', 'umbrella', 'because', 'the', 'sky', 'was', 'grey', 'and', 'cloudy.',
      'What', 'was', 'the', 'weather', 'probably', 'going', 'to', 'be', 'like?',
    ],
    keyWordIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    options: [
      { text: 'Sunny', isEliminatable: true, eliminationReason: 'Grey and cloudy skies are the opposite of sunny weather. You would not need an umbrella if it were sunny.' },
      { text: 'Snowy', isEliminatable: true, eliminationReason: 'An umbrella is usually for rain, not snow. The passage does not mention cold or snow.' },
      { text: 'Rainy', isEliminatable: false },
      { text: 'Windy', isEliminatable: true, eliminationReason: 'Wind is not mentioned. An umbrella with grey clouds suggests rain, not just wind.' },
      { text: 'Foggy', isEliminatable: true, eliminationReason: 'Fog is not mentioned. Grey clouds and an umbrella point to rain, not fog.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Ella took an umbrella because the sky was grey and cloudy. This tells us she expected rain. Umbrellas are used for rain, and grey cloudy skies suggest rain is coming.',
    category: 'comprehension-inference',
  },

  // vr-1-23: comprehension-when
  {
    id: 'vr-1-23',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Grandpa visits on Sundays. He does not visit on any other day. When does Grandpa visit?',
    questionTokens: [
      'Grandpa', 'visits', 'on', 'Sundays.', 'He', 'does', 'not', 'visit', 'on', 'any', 'other', 'day.',
      'When', 'does', 'Grandpa', 'visit?',
    ],
    keyWordIndices: [0, 1, 2, 3],
    options: [
      { text: 'Saturdays', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse weekends. Grandpa visits on Sundays, not Saturdays.' },
      { text: 'Every day', isEliminatable: true, eliminationReason: 'The passage says he does NOT visit on any other day, so it is only Sundays.' },
      { text: 'Sundays', isEliminatable: false },
      { text: 'Mondays', isEliminatable: true, eliminationReason: 'Mondays are not mentioned. Grandpa only visits on Sundays.' },
      { text: 'Fridays', isEliminatable: true, eliminationReason: 'Fridays are not mentioned. The passage says Grandpa visits only on Sundays.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "Grandpa visits on Sundays." It also says he does not visit on any other day, making Sundays the only correct answer.',
    category: 'comprehension-when',
  },

  // vr-1-24: comprehension-what
  {
    id: 'vr-1-24',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'For her birthday, Priya got a book from Mum and a toy from Dad. What did Dad give Priya?',
    questionTokens: [
      'For', 'her', 'birthday,', 'Priya', 'got', 'a', 'book', 'from', 'Mum', 'and', 'a', 'toy', 'from', 'Dad.',
      'What', 'did', 'Dad', 'give', 'Priya?',
    ],
    keyWordIndices: [10, 11, 12, 13],
    options: [
      { text: 'A book', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a book because it is the first gift mentioned, but the book was from Mum, not Dad.' },
      { text: 'A card', isEliminatable: true, eliminationReason: 'A card is not mentioned in the passage at all.' },
      { text: 'Money', isEliminatable: true, eliminationReason: 'Money is not mentioned in the passage at all.' },
      { text: 'A toy', isEliminatable: false },
      { text: 'A game', isEliminatable: true, eliminationReason: 'A game is not mentioned in the passage. Dad gave Priya a toy.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says Priya got "a toy from Dad." The book was from Mum. Make sure you match the right gift to the right person.',
    category: 'comprehension-what',
  },

  // vr-1-25: comprehension-who
  {
    id: 'vr-1-25',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'In the race, Ali came first and Beth came second. Charlie did not finish the race. Who won the race?',
    questionTokens: [
      'In', 'the', 'race,', 'Ali', 'came', 'first', 'and', 'Beth', 'came', 'second.',
      'Charlie', 'did', 'not', 'finish', 'the', 'race.',
      'Who', 'won', 'the', 'race?',
    ],
    keyWordIndices: [3, 4, 5],
    options: [
      { text: 'Beth', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Beth because she is mentioned next, but Beth came second, not first.' },
      { text: 'Ali', isEliminatable: false },
      { text: 'Charlie', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Charlie because he is in the passage, but Charlie did not even finish the race.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'Ali came first, so somebody definitely won the race.' },
      { text: 'They all tied', isEliminatable: true, eliminationReason: 'They did not tie. Ali came first, Beth came second, and Charlie did not finish.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says "Ali came first." Coming first means Ali won the race. Beth came second and Charlie did not finish.',
    category: 'comprehension-who',
  },

  // vr-1-26: comprehension-why
  {
    id: 'vr-1-26',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'The flowers died because nobody watered them. The weeds grew tall instead. Why did the flowers die?',
    questionTokens: [
      'The', 'flowers', 'died', 'because', 'nobody', 'watered', 'them.',
      'The', 'weeds', 'grew', 'tall', 'instead.',
      'Why', 'did', 'the', 'flowers', 'die?',
    ],
    keyWordIndices: [3, 4, 5, 6],
    options: [
      { text: 'The weeds grew too tall', isEliminatable: true, eliminationReason: 'If you rushed, you might think the weeds caused it, but the weeds grew because of the same neglect. The flowers died because nobody watered them.' },
      { text: 'Nobody watered them', isEliminatable: false },
      { text: 'It was too cold', isEliminatable: true, eliminationReason: 'Cold weather is not mentioned in the passage at all.' },
      { text: 'There was too much sun', isEliminatable: true, eliminationReason: 'Too much sun is not mentioned in the passage. The reason was lack of watering.' },
      { text: 'Someone picked them', isEliminatable: true, eliminationReason: 'Nobody picking the flowers is mentioned. They died because nobody watered them.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says the flowers died "because nobody watered them." The weeds growing tall is a separate detail, not the reason the flowers died.',
    category: 'comprehension-why',
  },

  // vr-1-27: comprehension-where
  {
    id: 'vr-1-27',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'The children played in the garden. They did not play in the house. Where did the children play?',
    questionTokens: [
      'The', 'children', 'played', 'in', 'the', 'garden.', 'They', 'did', 'not', 'play', 'in', 'the', 'house.',
      'Where', 'did', 'the', 'children', 'play?',
    ],
    keyWordIndices: [0, 1, 2, 3, 4, 5],
    options: [
      { text: 'In the house', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the house because it is the last place mentioned, but the passage says they did NOT play in the house.' },
      { text: 'At the park', isEliminatable: true, eliminationReason: 'The park is not mentioned in the passage at all.' },
      { text: 'In the garden', isEliminatable: false },
      { text: 'At school', isEliminatable: true, eliminationReason: 'School is not mentioned in the passage at all.' },
      { text: 'On the street', isEliminatable: true, eliminationReason: 'A street is not mentioned in the passage. The children played in the garden.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "The children played in the garden." It then says they did NOT play in the house. The garden is the correct answer.',
    category: 'comprehension-where',
  },

  // vr-1-28: comprehension-inference
  {
    id: 'vr-1-28',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Tom put on his coat, scarf and gloves before going outside. What season was it most likely?',
    questionTokens: [
      'Tom', 'put', 'on', 'his', 'coat,', 'scarf', 'and', 'gloves', 'before', 'going', 'outside.',
      'What', 'season', 'was', 'it', 'most', 'likely?',
    ],
    keyWordIndices: [1, 2, 3, 4, 5, 6, 7],
    options: [
      { text: 'Summer', isEliminatable: true, eliminationReason: 'In summer you would not need a coat, scarf and gloves. These are warm clothes for cold weather.' },
      { text: 'Spring', isEliminatable: true, eliminationReason: 'In spring the weather is usually mild. A coat, scarf and gloves suggest much colder weather.' },
      { text: 'Autumn', isEliminatable: true, eliminationReason: 'Autumn can be cool, but a coat, scarf AND gloves together suggest it was very cold, more like winter.' },
      { text: 'Winter', isEliminatable: false },
      { text: 'He was going swimming', isEliminatable: true, eliminationReason: 'You would not wear a coat, scarf and gloves to go swimming. These are warm clothes for cold weather.' },
    ],
    correctOptionIndex: 3,
    explanation: 'Tom wore a coat, scarf and gloves. These are all warm clothes worn in cold weather. Winter is the coldest season, so it was most likely winter.',
    category: 'comprehension-inference',
  },

  // vr-1-29: comprehension-how-many
  {
    id: 'vr-1-29',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Mia has 2 sisters and 1 brother. How many sisters does Mia have?',
    questionTokens: [
      'Mia', 'has', '2', 'sisters', 'and', '1', 'brother.',
      'How', 'many', 'sisters', 'does', 'Mia', 'have?',
    ],
    keyWordIndices: [2, 3],
    options: [
      { text: '1', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 1 because it is a number in the passage, but 1 is the number of brothers, not sisters.' },
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might add 2 and 1 together, but the question only asks about sisters.' },
      { text: '2', isEliminatable: false },
      { text: '4', isEliminatable: true, eliminationReason: 'The number 4 is not mentioned in the passage at all.' },
      { text: '0', isEliminatable: true, eliminationReason: 'The passage clearly says Mia has 2 sisters, so the answer is not zero.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says Mia has "2 sisters." She also has 1 brother, but the question asks about sisters only, so the answer is 2.',
    category: 'comprehension-how-many',
  },

  // vr-1-30: comprehension-what
  {
    id: 'vr-1-30',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'At the pet shop, Zara wanted a hamster but she bought a goldfish instead. What did Zara buy?',
    questionTokens: [
      'At', 'the', 'pet', 'shop,', 'Zara', 'wanted', 'a', 'hamster', 'but', 'she', 'bought', 'a', 'goldfish', 'instead.',
      'What', 'did', 'Zara', 'buy?',
    ],
    keyWordIndices: [9, 10, 11, 12, 13],
    options: [
      { text: 'A hamster', isEliminatable: true, eliminationReason: 'If you rushed, you might pick hamster because it is mentioned first, but Zara only wanted a hamster. She bought a goldfish instead.' },
      { text: 'A goldfish', isEliminatable: false },
      { text: 'A rabbit', isEliminatable: true, eliminationReason: 'A rabbit is not mentioned in the passage at all.' },
      { text: 'A puppy', isEliminatable: true, eliminationReason: 'A puppy is not mentioned in the passage at all.' },
      { text: 'A parrot', isEliminatable: true, eliminationReason: 'A parrot is not mentioned in the passage. Zara bought a goldfish.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says Zara "wanted a hamster but she bought a goldfish instead." The word "instead" tells us she bought the goldfish, not the hamster.',
    category: 'comprehension-what',
  },

  // vr-1-31: comprehension-who
  {
    id: 'vr-1-31',
    subject: 'reasoning',
    difficulty: 1,
    questionText: 'Lucy can swim but she cannot ride a bike. Her friend Olivia can ride a bike but cannot swim. Who can swim?',
    questionTokens: [
      'Lucy', 'can', 'swim', 'but', 'she', 'cannot', 'ride', 'a', 'bike.', 'Her', 'friend',
      'Olivia', 'can', 'ride', 'a', 'bike', 'but', 'cannot', 'swim.',
      'Who', 'can', 'swim?',
    ],
    keyWordIndices: [0, 1, 2],
    options: [
      { text: 'Lucy', isEliminatable: false },
      { text: 'Olivia', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Olivia because she is mentioned second, but the passage says Olivia cannot swim.' },
      { text: 'Both of them', isEliminatable: true, eliminationReason: 'The passage says Olivia cannot swim, so both of them cannot be correct.' },
      { text: 'Neither of them', isEliminatable: true, eliminationReason: 'The passage clearly says Lucy can swim, so this is wrong.' },
      { text: 'Lucy and Olivia', isEliminatable: true, eliminationReason: 'The passage says Olivia cannot swim, so only Lucy can swim, not both of them.' },
    ],
    correctOptionIndex: 0,
    explanation: 'The passage says "Lucy can swim." Olivia can ride a bike but cannot swim. Only Lucy can swim.',
    category: 'comprehension-who',
  },

  // ─── DIFFICULTY 2 (Additional questions) ──────────────────────────

  // vr-2-14: comprehension-who
  {
    id: 'vr-2-14',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'In the spelling test, Ethan got 8 out of 10 but Isla got 10 out of 10. James got 7. The teacher praised Isla for getting them all right. Who scored the lowest?',
    questionTokens: [
      'In', 'the', 'spelling', 'test,', 'Ethan', 'got', '8', 'out', 'of', '10', 'but', 'Isla',
      'got', '10', 'out', 'of', '10.', 'James', 'got', '7.', 'The', 'teacher', 'praised', 'Isla',
      'for', 'getting', 'them', 'all', 'right.',
      'Who', 'scored', 'the', 'lowest?',
    ],
    keyWordIndices: [17, 18, 19],
    options: [
      { text: 'Ethan', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Ethan because his score is mentioned first, but Ethan got 8 which is more than James who got 7.' },
      { text: 'Isla', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Isla because she is mentioned often, but Isla got the highest score of 10 out of 10.' },
      { text: 'James', isEliminatable: false },
      { text: 'The teacher', isEliminatable: true, eliminationReason: 'The teacher did not take the test. She praised Isla.' },
      { text: 'Nobody scored lowest', isEliminatable: true, eliminationReason: 'Someone must have the lowest score. James got 7, which is less than Ethan (8) and Isla (10).' },
    ],
    correctOptionIndex: 2,
    explanation: 'Ethan got 8, Isla got 10, and James got 7. The lowest score is 7, which belongs to James. Isla is mentioned most but had the highest score.',
    category: 'comprehension-who',
  },

  // vr-2-15: comprehension-what
  {
    id: 'vr-2-15',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'At the tuck shop, Ruby bought crisps and a drink. She wanted chocolate but it had sold out. Instead, she got a cereal bar. What did Ruby buy instead of chocolate?',
    questionTokens: [
      'At', 'the', 'tuck', 'shop,', 'Ruby', 'bought', 'crisps', 'and', 'a', 'drink.', 'She', 'wanted',
      'chocolate', 'but', 'it', 'had', 'sold', 'out.', 'Instead,', 'she', 'got', 'a', 'cereal', 'bar.',
      'What', 'did', 'Ruby', 'buy', 'instead', 'of', 'chocolate?',
    ],
    keyWordIndices: [18, 19, 20, 21, 22, 23],
    options: [
      { text: 'Crisps', isEliminatable: true, eliminationReason: 'If you rushed, you might pick crisps because they are mentioned first, but Ruby already bought crisps separately. The question asks what replaced the chocolate.' },
      { text: 'A drink', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a drink because it is in the passage, but the drink was a separate purchase, not a replacement for chocolate.' },
      { text: 'Chocolate', isEliminatable: true, eliminationReason: 'If you rushed, you might pick chocolate itself, but the passage says chocolate had sold out. She could not buy it.' },
      { text: 'A cereal bar', isEliminatable: false },
      { text: 'A biscuit', isEliminatable: true, eliminationReason: 'A biscuit is not mentioned in the passage. Ruby got a cereal bar instead of chocolate.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says chocolate had sold out. "Instead, she got a cereal bar." The cereal bar replaced the chocolate. Crisps and a drink were separate purchases.',
    category: 'comprehension-what',
  },

  // vr-2-16: comprehension-where
  {
    id: 'vr-2-16',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The art lesson was moved from the classroom to the hall. However, the music lesson stayed in the music room as usual. The drama lesson was in the playground. Where was the art lesson held?',
    questionTokens: [
      'The', 'art', 'lesson', 'was', 'moved', 'from', 'the', 'classroom', 'to', 'the', 'hall.',
      'However,', 'the', 'music', 'lesson', 'stayed', 'in', 'the', 'music', 'room', 'as', 'usual.',
      'The', 'drama', 'lesson', 'was', 'in', 'the', 'playground.',
      'Where', 'was', 'the', 'art', 'lesson', 'held?',
    ],
    keyWordIndices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    options: [
      { text: 'In the classroom', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the classroom because it is mentioned with the art lesson, but the art lesson was MOVED from the classroom to the hall.' },
      { text: 'In the music room', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the music room, but that is where the music lesson was held, not art.' },
      { text: 'In the playground', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the playground, but that is where the drama lesson was, not art.' },
      { text: 'In the hall', isEliminatable: false },
      { text: 'In the library', isEliminatable: true, eliminationReason: 'A library is not mentioned in the passage. The art lesson was held in the hall.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says the art lesson "was moved from the classroom to the hall." The key word is "moved" - it started in the classroom but was held in the hall. The classroom is where it used to be.',
    category: 'comprehension-where',
  },

  // vr-2-17: comprehension-when
  {
    id: 'vr-2-17',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The maths test was on Wednesday. The English test was on Thursday, not Wednesday. The results came out on Friday. When was the English test?',
    questionTokens: [
      'The', 'maths', 'test', 'was', 'on', 'Wednesday.', 'The', 'English', 'test', 'was', 'on',
      'Thursday,', 'not', 'Wednesday.', 'The', 'results', 'came', 'out', 'on', 'Friday.',
      'When', 'was', 'the', 'English', 'test?',
    ],
    keyWordIndices: [6, 7, 8, 9, 10, 11],
    options: [
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Wednesday because it is mentioned twice, but the passage says the English test was NOT on Wednesday. Wednesday was for maths.' },
      { text: 'Thursday', isEliminatable: false },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Friday because it is in the passage, but Friday was when the results came out, not when the English test was held.' },
      { text: 'Tuesday', isEliminatable: true, eliminationReason: 'Tuesday is not mentioned in the passage at all.' },
      { text: 'Monday', isEliminatable: true, eliminationReason: 'Monday is not mentioned in the passage. The English test was on Thursday.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says "The English test was on Thursday, not Wednesday." The maths test was on Wednesday and results came out on Friday. Thursday is correct for English.',
    category: 'comprehension-when',
  },

  // vr-2-18: comprehension-how-many
  {
    id: 'vr-2-18',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Year 4 collected 50 tins for the food bank. Year 5 collected 75 tins. Year 6 collected 60 tins but then added 10 more. How many tins did Year 5 collect?',
    questionTokens: [
      'Year', '4', 'collected', '50', 'tins', 'for', 'the', 'food', 'bank.', 'Year', '5', 'collected',
      '75', 'tins.', 'Year', '6', 'collected', '60', 'tins', 'but', 'then', 'added', '10', 'more.',
      'How', 'many', 'tins', 'did', 'Year', '5', 'collect?',
    ],
    keyWordIndices: [9, 10, 11, 12, 13],
    options: [
      { text: '50', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 50 because it is the first number, but 50 tins were collected by Year 4, not Year 5.' },
      { text: '60', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 60, but that was Year 6, not Year 5.' },
      { text: '70', isEliminatable: true, eliminationReason: 'If you rushed, you might try to add Year 6 numbers (60 + 10), but this is about Year 5, not Year 6.' },
      { text: '75', isEliminatable: false },
      { text: '10', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 10 because it appears in the passage, but 10 is the extra tins Year 6 added, not Year 5\'s total.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says "Year 5 collected 75 tins." Year 4 collected 50 and Year 6 collected 60 plus 10 more. The question asks specifically about Year 5.',
    category: 'comprehension-how-many',
  },

  // vr-2-19: comprehension-why
  {
    id: 'vr-2-19',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The school trip to the zoo was postponed because the coach broke down. Some children were upset because they had been looking forward to it. The trip was rescheduled for the following week. Why was the trip postponed?',
    questionTokens: [
      'The', 'school', 'trip', 'to', 'the', 'zoo', 'was', 'postponed', 'because', 'the', 'coach',
      'broke', 'down.', 'Some', 'children', 'were', 'upset', 'because', 'they', 'had', 'been', 'looking',
      'forward', 'to', 'it.', 'The', 'trip', 'was', 'rescheduled', 'for', 'the', 'following', 'week.',
      'Why', 'was', 'the', 'trip', 'postponed?',
    ],
    keyWordIndices: [8, 9, 10, 11, 12],
    options: [
      { text: 'The children were upset', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the two "because" reasons. The children were upset AS A RESULT of the postponement, not the cause of it.' },
      { text: 'The coach broke down', isEliminatable: false },
      { text: 'The zoo was closed', isEliminatable: true, eliminationReason: 'The zoo being closed is not mentioned in the passage. The coach broke down.' },
      { text: 'It was rescheduled', isEliminatable: true, eliminationReason: 'Being rescheduled is what happened after the postponement, not the reason for it.' },
      { text: 'It was raining', isEliminatable: true, eliminationReason: 'Rain is not mentioned in the passage. The trip was postponed because the coach broke down.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says the trip was postponed "because the coach broke down." The children being upset was a reaction to the postponement, not the reason for it. There are two "because" clauses and you must match the right one.',
    category: 'comprehension-why',
  },

  // vr-2-20: comprehension-inference
  {
    id: 'vr-2-20',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Nadia packed her swimming costume, towel and goggles into her bag. She told her mum she would be back by four o\'clock. Where was Nadia most likely going?',
    questionTokens: [
      'Nadia', 'packed', 'her', 'swimming', 'costume,', 'towel', 'and', 'goggles', 'into', 'her', 'bag.',
      'She', 'told', 'her', 'mum', 'she', 'would', 'be', 'back', 'by', 'four', "o'clock.",
      'Where', 'was', 'Nadia', 'most', 'likely', 'going?',
    ],
    keyWordIndices: [1, 2, 3, 4, 5, 6, 7],
    options: [
      { text: 'To school', isEliminatable: true, eliminationReason: 'You would not usually pack a swimming costume, towel and goggles just for school.' },
      { text: 'To the shops', isEliminatable: true, eliminationReason: 'You do not need swimming goggles and a costume to go shopping.' },
      { text: 'To the swimming pool', isEliminatable: false },
      { text: 'To a friend\'s house', isEliminatable: true, eliminationReason: 'While possible, packing a swimming costume, towel and goggles strongly suggests she was going swimming, not just visiting a friend.' },
      { text: 'To the beach', isEliminatable: true, eliminationReason: 'A beach is possible for swimming, but goggles and a costume packed in a bag more typically point to a swimming pool visit.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Nadia packed a swimming costume, towel and goggles. These are all things you need for swimming. She was most likely going to the swimming pool.',
    category: 'comprehension-inference',
  },

  // vr-2-21: comprehension-who
  {
    id: 'vr-2-21',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'In the cooking class, Amir made pasta, but it was Lily who made the best pizza. Oliver made soup. The teacher said the pizza was the tastiest dish. Who made the tastiest dish?',
    questionTokens: [
      'In', 'the', 'cooking', 'class,', 'Amir', 'made', 'pasta,', 'but', 'it', 'was', 'Lily',
      'who', 'made', 'the', 'best', 'pizza.', 'Oliver', 'made', 'soup.', 'The', 'teacher', 'said',
      'the', 'pizza', 'was', 'the', 'tastiest', 'dish.',
      'Who', 'made', 'the', 'tastiest', 'dish?',
    ],
    keyWordIndices: [10, 11, 12, 13, 14, 15],
    options: [
      { text: 'Amir', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Amir because he is the first name, but Amir made pasta. The tastiest dish was the pizza, which Lily made.' },
      { text: 'Oliver', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Oliver because he is mentioned, but Oliver made soup, not the pizza.' },
      { text: 'The teacher', isEliminatable: true, eliminationReason: 'The teacher judged the food but did not make any dish.' },
      { text: 'Lily', isEliminatable: false },
      { text: 'All three of them', isEliminatable: true, eliminationReason: 'Only one dish was the tastiest. The teacher said the pizza was the tastiest, and Lily made it.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The teacher said the pizza was the tastiest dish. Lily made the pizza. Therefore, Lily made the tastiest dish.',
    category: 'comprehension-who',
  },

  // vr-2-22: comprehension-what
  {
    id: 'vr-2-22',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Harry plays the violin on Mondays and the piano on Wednesdays. He used to play the drums but stopped last year. What instrument does Harry play on Wednesdays?',
    questionTokens: [
      'Harry', 'plays', 'the', 'violin', 'on', 'Mondays', 'and', 'the', 'piano', 'on', 'Wednesdays.',
      'He', 'used', 'to', 'play', 'the', 'drums', 'but', 'stopped', 'last', 'year.',
      'What', 'instrument', 'does', 'Harry', 'play', 'on', 'Wednesdays?',
    ],
    keyWordIndices: [7, 8, 9, 10],
    options: [
      { text: 'The violin', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the violin because it is the first instrument mentioned, but the violin is on Mondays, not Wednesdays.' },
      { text: 'The drums', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the drums because they are in the passage, but Harry stopped playing the drums last year.' },
      { text: 'The piano', isEliminatable: false },
      { text: 'The guitar', isEliminatable: true, eliminationReason: 'A guitar is not mentioned in the passage at all.' },
      { text: 'The trumpet', isEliminatable: true, eliminationReason: 'A trumpet is not mentioned in the passage. Harry plays the piano on Wednesdays.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says Harry plays "the piano on Wednesdays." The violin is on Mondays and the drums are no longer played. Match the right day to the right instrument.',
    category: 'comprehension-what',
  },

  // vr-2-23: comprehension-where
  {
    id: 'vr-2-23',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Mum left her phone at the restaurant. She thought it was in the car, so she looked there first. Then she remembered it was on the table at the restaurant. Where was the phone actually left?',
    questionTokens: [
      'Mum', 'left', 'her', 'phone', 'at', 'the', 'restaurant.', 'She', 'thought', 'it', 'was',
      'in', 'the', 'car,', 'so', 'she', 'looked', 'there', 'first.', 'Then', 'she', 'remembered',
      'it', 'was', 'on', 'the', 'table', 'at', 'the', 'restaurant.',
      'Where', 'was', 'the', 'phone', 'actually', 'left?',
    ],
    keyWordIndices: [1, 2, 3, 4, 5, 6],
    options: [
      { text: 'In the car', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the car because Mum looked there, but she only THOUGHT it was in the car. It was actually at the restaurant.' },
      { text: 'At the restaurant', isEliminatable: false },
      { text: 'At home', isEliminatable: true, eliminationReason: 'Home is not mentioned in the passage at all.' },
      { text: 'In her bag', isEliminatable: true, eliminationReason: 'A bag is not mentioned in the passage at all.' },
      { text: 'At the office', isEliminatable: true, eliminationReason: 'An office is not mentioned in the passage. The phone was left at the restaurant.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The very first sentence says "Mum left her phone at the restaurant." She thought it was in the car, but that was wrong. It was at the restaurant all along.',
    category: 'comprehension-where',
  },

  // vr-2-24: comprehension-how-many
  {
    id: 'vr-2-24',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'There are 5 boys and 7 girls in the chess club. On Friday, 2 boys were absent. The teacher brought 3 new chess sets. How many girls are in the chess club?',
    questionTokens: [
      'There', 'are', '5', 'boys', 'and', '7', 'girls', 'in', 'the', 'chess', 'club.',
      'On', 'Friday,', '2', 'boys', 'were', 'absent.', 'The', 'teacher', 'brought', '3', 'new', 'chess', 'sets.',
      'How', 'many', 'girls', 'are', 'in', 'the', 'chess', 'club?',
    ],
    keyWordIndices: [5, 6],
    options: [
      { text: '5', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 5, but that is the number of boys, not girls.' },
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 3, but that is the number of new chess sets, not girls.' },
      { text: '2', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 2, but that is the number of absent boys, not girls.' },
      { text: '7', isEliminatable: false },
      { text: '12', isEliminatable: true, eliminationReason: 'If you rushed, you might add 5 and 7 together, but the question asks only about girls, not the total number of members.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says there are "7 girls in the chess club." The other numbers (5 boys, 2 absent, 3 chess sets) are all distractions. The question asks about girls.',
    category: 'comprehension-how-many',
  },

  // vr-2-25: comprehension-why
  {
    id: 'vr-2-25',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The park was crowded because it was a sunny bank holiday. Although the ice cream van arrived late because it got stuck in traffic, everyone was happy. Why was the park crowded?',
    questionTokens: [
      'The', 'park', 'was', 'crowded', 'because', 'it', 'was', 'a', 'sunny', 'bank', 'holiday.',
      'Although', 'the', 'ice', 'cream', 'van', 'arrived', 'late', 'because', 'it', 'got', 'stuck',
      'in', 'traffic,', 'everyone', 'was', 'happy.',
      'Why', 'was', 'the', 'park', 'crowded?',
    ],
    keyWordIndices: [4, 5, 6, 7, 8, 9, 10],
    options: [
      { text: 'The ice cream van arrived', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the ice cream van, but the van arrived late AFTER the park was already crowded.' },
      { text: 'There was traffic', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the two "because" reasons. Traffic delayed the ice cream van, not the reason the park was crowded.' },
      { text: 'It was a sunny bank holiday', isEliminatable: false },
      { text: 'Everyone was happy', isEliminatable: true, eliminationReason: 'Everyone being happy is the result of the day, not the reason the park was crowded.' },
      { text: 'There was a festival', isEliminatable: true, eliminationReason: 'A festival is not mentioned in the passage. The park was crowded because it was a sunny bank holiday.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says the park was crowded "because it was a sunny bank holiday." The ice cream van being late and the traffic are separate details. Match the right "because" to the right event.',
    category: 'comprehension-why',
  },

  // vr-2-26: comprehension-when
  {
    id: 'vr-2-26',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Grace practises gymnastics on Tuesdays and Thursdays. She has dance on Saturdays. She does not do any clubs on Mondays or Wednesdays. When does Grace have dance?',
    questionTokens: [
      'Grace', 'practises', 'gymnastics', 'on', 'Tuesdays', 'and', 'Thursdays.', 'She', 'has',
      'dance', 'on', 'Saturdays.', 'She', 'does', 'not', 'do', 'any', 'clubs', 'on', 'Mondays',
      'or', 'Wednesdays.',
      'When', 'does', 'Grace', 'have', 'dance?',
    ],
    keyWordIndices: [7, 8, 9, 10, 11],
    options: [
      { text: 'Tuesdays', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Tuesday because it is the first day mentioned, but Grace does gymnastics on Tuesdays, not dance.' },
      { text: 'Thursdays', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Thursday because it is also a gymnastics day, not a dance day.' },
      { text: 'Mondays', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Monday, but the passage says Grace does NOT do any clubs on Mondays.' },
      { text: 'Saturdays', isEliminatable: false },
      { text: 'Sundays', isEliminatable: true, eliminationReason: 'Sundays are not mentioned in the passage. Grace has dance on Saturdays.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says Grace has "dance on Saturdays." Gymnastics is on Tuesdays and Thursdays. She has no clubs on Mondays or Wednesdays.',
    category: 'comprehension-when',
  },

  // vr-2-27: comprehension-inference
  {
    id: 'vr-2-27',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The classroom lights were off and all the chairs were on the desks. The bins had been emptied and the floor had been mopped. What had most likely just happened in the classroom?',
    questionTokens: [
      'The', 'classroom', 'lights', 'were', 'off', 'and', 'all', 'the', 'chairs', 'were', 'on',
      'the', 'desks.', 'The', 'bins', 'had', 'been', 'emptied', 'and', 'the', 'floor', 'had',
      'been', 'mopped.',
      'What', 'had', 'most', 'likely', 'just', 'happened', 'in', 'the', 'classroom?',
    ],
    keyWordIndices: [2, 3, 4, 8, 9, 10, 11, 12, 14, 15, 16, 17, 20, 21, 22, 23],
    options: [
      { text: 'A lesson had just started', isEliminatable: true, eliminationReason: 'If a lesson had started, the lights would be on and the chairs would be down for pupils to sit on.' },
      { text: 'It had been cleaned', isEliminatable: false },
      { text: 'The children were having lunch', isEliminatable: true, eliminationReason: 'If children were having lunch, they would not mop the floor or turn off the lights in the classroom.' },
      { text: 'There was a power cut', isEliminatable: true, eliminationReason: 'A power cut would explain the lights being off, but not the chairs on desks, bins emptied, and floor mopped.' },
      { text: 'The children were on a trip', isEliminatable: true, eliminationReason: 'A school trip might explain empty chairs, but not chairs stacked on desks, bins emptied and a mopped floor. These are signs of cleaning.' },
    ],
    correctOptionIndex: 1,
    explanation: 'Chairs on desks, bins emptied, floor mopped, and lights off are all signs that the classroom has been cleaned, usually at the end of the school day.',
    category: 'comprehension-inference',
  },

  // vr-2-28: comprehension-who
  {
    id: 'vr-2-28',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Zoe, Alfie and Poppy each brought a pet to school. Zoe brought a hamster. Alfie did not bring a dog; he brought a guinea pig. Poppy brought the dog. Who brought the guinea pig?',
    questionTokens: [
      'Zoe,', 'Alfie', 'and', 'Poppy', 'each', 'brought', 'a', 'pet', 'to', 'school.', 'Zoe',
      'brought', 'a', 'hamster.', 'Alfie', 'did', 'not', 'bring', 'a', 'dog;', 'he', 'brought',
      'a', 'guinea', 'pig.', 'Poppy', 'brought', 'the', 'dog.',
      'Who', 'brought', 'the', 'guinea', 'pig?',
    ],
    keyWordIndices: [14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
    options: [
      { text: 'Zoe', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Zoe because she is the first name, but Zoe brought a hamster, not a guinea pig.' },
      { text: 'Poppy', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Poppy because she is mentioned near the end, but Poppy brought the dog.' },
      { text: 'Alfie', isEliminatable: false },
      { text: 'The teacher', isEliminatable: true, eliminationReason: 'No teacher is mentioned as bringing a pet in the passage.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage clearly says Alfie brought a guinea pig, so someone did bring one.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "Alfie did not bring a dog; he brought a guinea pig." The tricky part is the mention of dog near Alfie, but it says he did NOT bring a dog. He brought the guinea pig.',
    category: 'comprehension-who',
  },

  // vr-2-29: comprehension-what
  {
    id: 'vr-2-29',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'For the school play, Year 3 performed a song. Year 4 performed a dance. Year 5 did a poem reading, not a play, even though it was called the school play. What did Year 4 perform?',
    questionTokens: [
      'For', 'the', 'school', 'play,', 'Year', '3', 'performed', 'a', 'song.', 'Year', '4', 'performed',
      'a', 'dance.', 'Year', '5', 'did', 'a', 'poem', 'reading,', 'not', 'a', 'play,', 'even',
      'though', 'it', 'was', 'called', 'the', 'school', 'play.',
      'What', 'did', 'Year', '4', 'perform?',
    ],
    keyWordIndices: [9, 10, 11, 12, 13],
    options: [
      { text: 'A song', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a song because it is the first performance mentioned, but the song was performed by Year 3, not Year 4.' },
      { text: 'A poem reading', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a poem reading, but that was Year 5, not Year 4.' },
      { text: 'A play', isEliminatable: true, eliminationReason: 'If you rushed, you might pick a play because of the name "school play," but no year group actually performed a play.' },
      { text: 'A dance', isEliminatable: false },
      { text: 'A comedy sketch', isEliminatable: true, eliminationReason: 'A comedy sketch is not mentioned in the passage. Year 4 performed a dance.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says "Year 4 performed a dance." Year 3 did a song and Year 5 did a poem reading. The mention of "school play" is misleading because none of them actually did a play.',
    category: 'comprehension-what',
  },

  // vr-2-30: comprehension-where
  {
    id: 'vr-2-30',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'After school, Finn went to the library to return his book. Then he walked to the park to meet his friends. His mum picked him up from the park at five o\'clock. Where did Finn go first after school?',
    questionTokens: [
      'After', 'school,', 'Finn', 'went', 'to', 'the', 'library', 'to', 'return', 'his', 'book.',
      'Then', 'he', 'walked', 'to', 'the', 'park', 'to', 'meet', 'his', 'friends.', 'His', 'mum',
      'picked', 'him', 'up', 'from', 'the', 'park', 'at', 'five', "o'clock.",
      'Where', 'did', 'Finn', 'go', 'first', 'after', 'school?',
    ],
    keyWordIndices: [2, 3, 4, 5, 6],
    options: [
      { text: 'To the park', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the park because it is mentioned more often, but Finn went to the library FIRST, then the park.' },
      { text: 'Home', isEliminatable: true, eliminationReason: 'Home is not mentioned as a place Finn went in the passage.' },
      { text: 'To the library', isEliminatable: false },
      { text: 'To school', isEliminatable: true, eliminationReason: 'School is where Finn came from, not where he went after school.' },
      { text: 'To the shops', isEliminatable: true, eliminationReason: 'Shops are not mentioned in the passage. Finn went to the library first.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "After school, Finn went to the library." The word "Then" tells us the park came second. The question asks about FIRST, which was the library.',
    category: 'comprehension-where',
  },

  // vr-2-31: comprehension-how-many
  {
    id: 'vr-2-31',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The farmer has 12 cows, 20 sheep and 6 pigs. He sold 4 sheep last week but bought 2 more pigs. How many cows does the farmer have?',
    questionTokens: [
      'The', 'farmer', 'has', '12', 'cows,', '20', 'sheep', 'and', '6', 'pigs.', 'He', 'sold',
      '4', 'sheep', 'last', 'week', 'but', 'bought', '2', 'more', 'pigs.',
      'How', 'many', 'cows', 'does', 'the', 'farmer', 'have?',
    ],
    keyWordIndices: [3, 4],
    options: [
      { text: '20', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 20 because it is the biggest number, but 20 is the number of sheep, not cows.' },
      { text: '12', isEliminatable: false },
      { text: '6', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 6, but that is the number of pigs before he bought more.' },
      { text: '8', isEliminatable: true, eliminationReason: 'If you rushed, you might try some calculation, but the question simply asks about cows, which is 12 and unchanged.' },
      { text: '4', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 4 because it appears in the passage, but 4 is the number of sheep sold, not the number of cows.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The farmer has "12 cows." The selling and buying only affected sheep and pigs, not cows. The number of cows stayed at 12.',
    category: 'comprehension-how-many',
  },

  // vr-2-32: comprehension-inference
  {
    id: 'vr-2-32',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'Jake\'s mum put candles on the cake and hung up balloons. She wrapped presents and made party bags for all his friends. What event was Jake\'s mum preparing for?',
    questionTokens: [
      "Jake's", 'mum', 'put', 'candles', 'on', 'the', 'cake', 'and', 'hung', 'up', 'balloons.',
      'She', 'wrapped', 'presents', 'and', 'made', 'party', 'bags', 'for', 'all', 'his', 'friends.',
      'What', 'event', 'was', "Jake's", 'mum', 'preparing', 'for?',
    ],
    keyWordIndices: [3, 4, 5, 6, 8, 9, 10, 12, 13, 16, 17],
    options: [
      { text: 'A school fete', isEliminatable: true, eliminationReason: 'A school fete would not usually have candles on a cake and party bags for friends.' },
      { text: 'Christmas', isEliminatable: true, eliminationReason: 'Christmas might have presents but cake with candles and party bags for friends suggest a birthday.' },
      { text: 'A birthday party', isEliminatable: false },
      { text: 'A wedding', isEliminatable: true, eliminationReason: 'A wedding would not involve party bags for friends and candles on a cake in this way.' },
      { text: 'A barbecue', isEliminatable: true, eliminationReason: 'A barbecue would not usually have candles on a cake, wrapped presents and party bags. These clues point to a birthday party.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Candles on a cake, balloons, presents, and party bags for friends are all clues that point to a birthday party.',
    category: 'comprehension-inference',
  },

  // vr-2-33: comprehension-when
  {
    id: 'vr-2-33',
    subject: 'reasoning',
    difficulty: 2,
    questionText: 'The film starts at half past six. The doors open at six o\'clock. The film finishes at eight o\'clock. Adverts play for fifteen minutes before the film. When does the film start?',
    questionTokens: [
      'The', 'film', 'starts', 'at', 'half', 'past', 'six.', 'The', 'doors', 'open', 'at', 'six',
      "o'clock.", 'The', 'film', 'finishes', 'at', 'eight', "o'clock.", 'Adverts', 'play', 'for',
      'fifteen', 'minutes', 'before', 'the', 'film.',
      'When', 'does', 'the', 'film', 'start?',
    ],
    keyWordIndices: [0, 1, 2, 3, 4, 5, 6],
    options: [
      { text: 'Six o\'clock', isEliminatable: true, eliminationReason: 'If you rushed, you might pick six because it sounds close, but the doors open at six. The film itself starts at half past six.' },
      { text: 'Half past six', isEliminatable: false },
      { text: 'Eight o\'clock', isEliminatable: true, eliminationReason: 'If you rushed, you might pick eight because it is a time in the passage, but eight is when the film finishes, not starts.' },
      { text: 'Quarter past six', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the adverts timing, but the passage says the film starts at half past six.' },
      { text: 'Seven o\'clock', isEliminatable: true, eliminationReason: 'Seven o\'clock is not mentioned in the passage. The film starts at half past six.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says "The film starts at half past six." The doors open at six, adverts play before the film, and the film finishes at eight. The start time is half past six.',
    category: 'comprehension-when',
  },

  // ─── DIFFICULTY 3 (Additional questions) ──────────────────────────

  // vr-3-13: comprehension-who
  {
    id: 'vr-3-13',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'In the school orchestra, Sana plays the flute and not the clarinet, although her twin sister Meera plays the clarinet. Their friend Jaya plays the violin, not the flute. The conductor, Mr Davis, does not play any instrument during the concert. Who plays the clarinet?',
    questionTokens: [
      'In', 'the', 'school', 'orchestra,', 'Sana', 'plays', 'the', 'flute', 'and', 'not', 'the',
      'clarinet,', 'although', 'her', 'twin', 'sister', 'Meera', 'plays', 'the', 'clarinet.',
      'Their', 'friend', 'Jaya', 'plays', 'the', 'violin,', 'not', 'the', 'flute.', 'The',
      'conductor,', 'Mr', 'Davis,', 'does', 'not', 'play', 'any', 'instrument', 'during', 'the', 'concert.',
      'Who', 'plays', 'the', 'clarinet?',
    ],
    keyWordIndices: [16, 17, 18, 19],
    options: [
      { text: 'Sana', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Sana because clarinet is mentioned right after her name, but the passage says Sana does NOT play the clarinet.' },
      { text: 'Meera', isEliminatable: false },
      { text: 'Jaya', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Jaya, but Jaya plays the violin, not the clarinet.' },
      { text: 'Mr Davis', isEliminatable: true, eliminationReason: 'Mr Davis is the conductor and does not play any instrument during the concert.' },
      { text: 'Sana and Meera', isEliminatable: true, eliminationReason: 'Only one of them plays the clarinet. Sana plays the flute, not the clarinet. Meera alone plays the clarinet.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says Sana plays the flute "and not the clarinet, although her twin sister Meera plays the clarinet." Meera is the clarinet player. The negation "not" after Sana is a trap.',
    category: 'comprehension-who',
    trickType: 'negation-trap',
  },

  // vr-3-14: comprehension-what
  {
    id: 'vr-3-14',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The museum had four exhibits: dinosaurs, space, ancient Egypt and the ocean. The dinosaur exhibit was closed for repairs. The space exhibit was the most popular. The children visited ancient Egypt first and the ocean last. Which exhibit was closed?',
    questionTokens: [
      'The', 'museum', 'had', 'four', 'exhibits:', 'dinosaurs,', 'space,', 'ancient', 'Egypt', 'and',
      'the', 'ocean.', 'The', 'dinosaur', 'exhibit', 'was', 'closed', 'for', 'repairs.', 'The',
      'space', 'exhibit', 'was', 'the', 'most', 'popular.', 'The', 'children', 'visited', 'ancient',
      'Egypt', 'first', 'and', 'the', 'ocean', 'last.',
      'Which', 'exhibit', 'was', 'closed?',
    ],
    keyWordIndices: [12, 13, 14, 15, 16, 17, 18],
    options: [
      { text: 'Space', isEliminatable: true, eliminationReason: 'If you rushed, you might pick space because it is described as the most popular, but popular does not mean closed. The dinosaur exhibit was closed.' },
      { text: 'Ancient Egypt', isEliminatable: true, eliminationReason: 'If you rushed, you might pick ancient Egypt because it is mentioned often, but the children visited it first. It was open.' },
      { text: 'The ocean', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the ocean because it was visited last, but being last does not mean it was closed.' },
      { text: 'Dinosaurs', isEliminatable: false },
      { text: 'All of them', isEliminatable: true, eliminationReason: 'The children visited ancient Egypt and the ocean, so those were open. Only the dinosaur exhibit was closed.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says "The dinosaur exhibit was closed for repairs." Space was popular, ancient Egypt was visited first, and ocean was visited last, but only dinosaurs were closed.',
    category: 'comprehension-what',
    trickType: 'irrelevant-info',
  },

  // vr-3-15: comprehension-when
  {
    id: 'vr-3-15',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Sports day was originally planned for Wednesday but was moved to Thursday because of rain. The practice session was on Tuesday. Friday was the backup day but it was not needed. When did sports day actually take place?',
    questionTokens: [
      'Sports', 'day', 'was', 'originally', 'planned', 'for', 'Wednesday', 'but', 'was', 'moved',
      'to', 'Thursday', 'because', 'of', 'rain.', 'The', 'practice', 'session', 'was', 'on', 'Tuesday.',
      'Friday', 'was', 'the', 'backup', 'day', 'but', 'it', 'was', 'not', 'needed.',
      'When', 'did', 'sports', 'day', 'actually', 'take', 'place?',
    ],
    keyWordIndices: [7, 8, 9, 10, 11],
    options: [
      { text: 'Wednesday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Wednesday because it was the original plan, but sports day was MOVED from Wednesday to Thursday.' },
      { text: 'Tuesday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Tuesday, but Tuesday was only the practice session, not sports day itself.' },
      { text: 'Friday', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Friday because it is a backup day, but the passage says it was NOT needed.' },
      { text: 'Thursday', isEliminatable: false },
      { text: 'Saturday', isEliminatable: true, eliminationReason: 'Saturday is not mentioned in the passage. Sports day was moved to Thursday.' },
    ],
    correctOptionIndex: 3,
    explanation: 'Sports day was moved from Wednesday to Thursday because of rain. The word "actually" in the question is a clue to look for what really happened, not the original plan.',
    category: 'comprehension-when',
    trickType: 'position-trap',
  },

  // vr-3-16: comprehension-where
  {
    id: 'vr-3-16',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The treasure hunt had clues hidden in five places: the playground, the library, the hall, the office and the garden. The first clue was in the playground. The final clue was not in the garden but in the office. The garden had the third clue. Where was the final clue hidden?',
    questionTokens: [
      'The', 'treasure', 'hunt', 'had', 'clues', 'hidden', 'in', 'five', 'places:', 'the', 'playground,',
      'the', 'library,', 'the', 'hall,', 'the', 'office', 'and', 'the', 'garden.', 'The', 'first',
      'clue', 'was', 'in', 'the', 'playground.', 'The', 'final', 'clue', 'was', 'not', 'in', 'the',
      'garden', 'but', 'in', 'the', 'office.', 'The', 'garden', 'had', 'the', 'third', 'clue.',
      'Where', 'was', 'the', 'final', 'clue', 'hidden?',
    ],
    keyWordIndices: [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38],
    options: [
      { text: 'In the garden', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the garden because it is mentioned near "final clue," but the passage says the final clue was NOT in the garden.' },
      { text: 'In the playground', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the playground, but the playground had the first clue, not the final one.' },
      { text: 'In the office', isEliminatable: false },
      { text: 'In the library', isEliminatable: true, eliminationReason: 'The library is listed as one of the five places but is not identified as the location of the final clue.' },
      { text: 'In the hall', isEliminatable: true, eliminationReason: 'The hall is listed as one of the five places, but it is not identified as where the final clue was hidden. The final clue was in the office.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "The final clue was not in the garden but in the office." The word "not" before "garden" and "but" before "office" make this tricky. The office is correct.',
    category: 'comprehension-where',
    trickType: 'negation-trap',
  },

  // vr-3-17: comprehension-how-many
  {
    id: 'vr-3-17',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'For the cake sale, Amina baked 15 brownies and 20 cookies. She gave 5 brownies to her neighbour before the sale. At the sale, she sold all the remaining brownies and 18 cookies. How many brownies did Amina sell at the sale?',
    questionTokens: [
      'For', 'the', 'cake', 'sale,', 'Amina', 'baked', '15', 'brownies', 'and', '20', 'cookies.',
      'She', 'gave', '5', 'brownies', 'to', 'her', 'neighbour', 'before', 'the', 'sale.', 'At', 'the',
      'sale,', 'she', 'sold', 'all', 'the', 'remaining', 'brownies', 'and', '18', 'cookies.',
      'How', 'many', 'brownies', 'did', 'Amina', 'sell', 'at', 'the', 'sale?',
    ],
    keyWordIndices: [6, 7, 13, 14, 26, 27, 28, 29],
    options: [
      { text: '15', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 15 because that is how many she baked, but she gave 5 away before the sale, so she only sold 10.' },
      { text: '20', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 20, but that is the number of cookies, not brownies.' },
      { text: '18', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 18, but that is the number of cookies she sold, not brownies.' },
      { text: '10', isEliminatable: false },
      { text: '5', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 5, but that is how many brownies Amina gave to her neighbour, not how many she sold at the sale.' },
    ],
    correctOptionIndex: 3,
    explanation: 'Amina baked 15 brownies but gave 5 to her neighbour before the sale. 15 minus 5 equals 10 remaining brownies. She sold all of those, so she sold 10 brownies.',
    category: 'comprehension-how-many',
    trickType: 'two-step',
  },

  // vr-3-18: comprehension-why
  {
    id: 'vr-3-18',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The school play was moved indoors because the stage outside was too wet. Although some parents complained because there were not enough seats inside, the head teacher said it was safer. Why was the play moved indoors?',
    questionTokens: [
      'The', 'school', 'play', 'was', 'moved', 'indoors', 'because', 'the', 'stage', 'outside',
      'was', 'too', 'wet.', 'Although', 'some', 'parents', 'complained', 'because', 'there', 'were',
      'not', 'enough', 'seats', 'inside,', 'the', 'head', 'teacher', 'said', 'it', 'was', 'safer.',
      'Why', 'was', 'the', 'play', 'moved', 'indoors?',
    ],
    keyWordIndices: [6, 7, 8, 9, 10, 11, 12],
    options: [
      { text: 'There were not enough seats', isEliminatable: true, eliminationReason: 'If you rushed, you might confuse the two "because" reasons. Not enough seats was why parents complained, not why the play moved.' },
      { text: 'The stage outside was too wet', isEliminatable: false },
      { text: 'The head teacher said so', isEliminatable: true, eliminationReason: 'The head teacher commented on safety, but the actual reason for moving was the wet stage.' },
      { text: 'It was safer inside', isEliminatable: true, eliminationReason: 'Being safer inside was a comment by the head teacher, not the stated reason for the move. The wet stage was the reason.' },
      { text: 'The parents asked for it', isEliminatable: true, eliminationReason: 'The parents complained about seats inside, but they did not cause the move. The play was moved because the stage was too wet.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The passage says the play was moved "because the stage outside was too wet." The complaints about seats and the head teacher saying it was safer are separate details.',
    category: 'comprehension-why',
    trickType: 'irrelevant-info',
  },

  // vr-3-19: vocabulary
  {
    id: 'vr-3-19',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The ancient castle was in a state of decay after centuries of neglect. Which word is closest in meaning to "decay"?',
    questionTokens: [
      'The', 'ancient', 'castle', 'was', 'in', 'a', 'state', 'of', 'decay', 'after', 'centuries',
      'of', 'neglect.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"decay"?',
    ],
    keyWordIndices: [8],
    options: [
      { text: 'Beauty', isEliminatable: true, eliminationReason: 'Beauty is the opposite of decay. Something in decay is falling apart, not becoming beautiful.' },
      { text: 'Growth', isEliminatable: true, eliminationReason: 'Growth means getting bigger or stronger, which is the opposite of decay. Decay means breaking down.' },
      { text: 'Decline', isEliminatable: false },
      { text: 'Strength', isEliminatable: true, eliminationReason: 'Strength suggests something solid and powerful, but decay means something is weakening and falling apart.' },
      { text: 'Repair', isEliminatable: true, eliminationReason: 'Repair means to fix something, which is the opposite of decay. The castle was falling apart, not being fixed.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Decay means to rot, deteriorate, or fall apart over time. Decline is the closest word, meaning to gradually become worse or weaker. The other options are all positive qualities.',
    category: 'vocabulary',
  },

  // vr-3-20: vocabulary
  {
    id: 'vr-3-20',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The teacher commended the pupil for her excellent work. Which word is closest in meaning to "commended"?',
    questionTokens: [
      'The', 'teacher', 'commended', 'the', 'pupil', 'for', 'her', 'excellent', 'work.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"commended"?',
    ],
    keyWordIndices: [2],
    options: [
      { text: 'Criticised', isEliminatable: true, eliminationReason: 'Criticised means to find fault with someone. The teacher praised the pupil for excellent work, not found fault.' },
      { text: 'Praised', isEliminatable: false },
      { text: 'Ignored', isEliminatable: true, eliminationReason: 'Ignored means to pay no attention. The teacher clearly paid attention to the pupil by commending her.' },
      { text: 'Punished', isEliminatable: true, eliminationReason: 'Punished means to discipline someone. The context shows the teacher was pleased, not disciplining.' },
      { text: 'Questioned', isEliminatable: true, eliminationReason: 'Questioned means to ask or challenge. The teacher was expressing approval for excellent work, not asking questions.' },
    ],
    correctOptionIndex: 1,
    explanation: 'Commended means to express approval or admiration. Praised is the closest synonym. The context confirms this: commending someone for excellent work means praising them.',
    category: 'vocabulary',
  },

  // vr-3-21: vocabulary
  {
    id: 'vr-3-21',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The fox was cunning enough to outwit the farmer every time. Which word is closest in meaning to "cunning"?',
    questionTokens: [
      'The', 'fox', 'was', 'cunning', 'enough', 'to', 'outwit', 'the', 'farmer', 'every', 'time.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"cunning"?',
    ],
    keyWordIndices: [3],
    options: [
      { text: 'Friendly', isEliminatable: true, eliminationReason: 'Friendly means kind and welcoming. The fox was outsmarting the farmer, not being friendly to him.' },
      { text: 'Slow', isEliminatable: true, eliminationReason: 'Slow is the opposite of what you need to outwit someone. Cunning suggests being quick-thinking and clever.' },
      { text: 'Shy', isEliminatable: true, eliminationReason: 'Shy means timid or nervous. A shy fox would hide, not repeatedly outwit a farmer.' },
      { text: 'Clever', isEliminatable: false },
      { text: 'Brave', isEliminatable: true, eliminationReason: 'Brave means courageous. The fox was outsmarting the farmer, not being courageous. Cunning is about cleverness, not bravery.' },
    ],
    correctOptionIndex: 3,
    explanation: 'Cunning means clever in a sly or crafty way. The fox outwitted the farmer, meaning it was smarter than him. Clever is the closest synonym.',
    category: 'vocabulary',
  },

  // vr-3-22: comprehension-inference
  {
    id: 'vr-3-22',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The old man sat on the bench feeding the pigeons, as he did every afternoon. He wore the same brown coat he had worn for years. The pigeons landed on his shoulders without fear. What can you infer about the old man and the pigeons?',
    questionTokens: [
      'The', 'old', 'man', 'sat', 'on', 'the', 'bench', 'feeding', 'the', 'pigeons,', 'as', 'he',
      'did', 'every', 'afternoon.', 'He', 'wore', 'the', 'same', 'brown', 'coat', 'he', 'had',
      'worn', 'for', 'years.', 'The', 'pigeons', 'landed', 'on', 'his', 'shoulders', 'without', 'fear.',
      'What', 'can', 'you', 'infer', 'about', 'the', 'old', 'man', 'and', 'the', 'pigeons?',
    ],
    keyWordIndices: [10, 11, 12, 13, 14, 28, 29, 30, 31, 32, 33],
    options: [
      { text: 'He had never fed the pigeons before', isEliminatable: true, eliminationReason: 'The passage says he did this "every afternoon" and the pigeons landed "without fear," which means they were used to him.' },
      { text: 'The pigeons were afraid of him', isEliminatable: true, eliminationReason: 'The passage says the pigeons landed on his shoulders "without fear," so they were clearly not afraid.' },
      { text: 'The pigeons were used to him because he fed them regularly', isEliminatable: false },
      { text: 'He only started feeding them recently', isEliminatable: true, eliminationReason: 'The passage says he did this "every afternoon" and had worn the same coat "for years," suggesting this has been happening for a long time.' },
      { text: 'The pigeons were wild and dangerous', isEliminatable: true, eliminationReason: 'The pigeons landed on his shoulders without fear, showing they were tame around him, not wild or dangerous.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The clues "every afternoon," "the same brown coat he had worn for years," and "without fear" all suggest this is a daily routine. The pigeons are used to him because he feeds them regularly.',
    category: 'comprehension-inference',
  },

  // vr-3-23: comprehension-who
  {
    id: 'vr-3-23',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Five friends ran a race. Kayla finished before Liam but after Tyrone. Ben finished last. Sophie finished between Liam and Ben. Who finished the race first?',
    questionTokens: [
      'Five', 'friends', 'ran', 'a', 'race.', 'Kayla', 'finished', 'before', 'Liam', 'but', 'after',
      'Tyrone.', 'Ben', 'finished', 'last.', 'Sophie', 'finished', 'between', 'Liam', 'and', 'Ben.',
      'Who', 'finished', 'the', 'race', 'first?',
    ],
    keyWordIndices: [5, 6, 7, 8, 9, 10, 11],
    options: [
      { text: 'Kayla', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Kayla because she is the first name mentioned, but Kayla finished AFTER Tyrone, so Tyrone was ahead of her.' },
      { text: 'Liam', isEliminatable: true, eliminationReason: 'Liam finished after Kayla, who finished after Tyrone, so Liam was not first.' },
      { text: 'Tyrone', isEliminatable: false },
      { text: 'Sophie', isEliminatable: true, eliminationReason: 'Sophie finished between Liam and Ben, which means she was near the back, not first.' },
      { text: 'Ben', isEliminatable: true, eliminationReason: 'The passage says Ben finished last, so he certainly did not finish first.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Kayla finished after Tyrone, meaning Tyrone was ahead of Kayla. Since no one is mentioned as being ahead of Tyrone, the order is: Tyrone, Kayla, Liam, Sophie, Ben.',
    category: 'comprehension-who',
    trickType: 'position-trap',
  },

  // vr-3-24: vocabulary
  {
    id: 'vr-3-24',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The mountain path was treacherous in winter due to ice and loose rocks. Which word is closest in meaning to "treacherous"?',
    questionTokens: [
      'The', 'mountain', 'path', 'was', 'treacherous', 'in', 'winter', 'due', 'to', 'ice', 'and',
      'loose', 'rocks.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"treacherous"?',
    ],
    keyWordIndices: [4],
    options: [
      { text: 'Dangerous', isEliminatable: false },
      { text: 'Beautiful', isEliminatable: true, eliminationReason: 'Beautiful means attractive. A path with ice and loose rocks is described negatively, not as something beautiful.' },
      { text: 'Exciting', isEliminatable: true, eliminationReason: 'Exciting suggests fun and thrill. Treacherous means something is hazardous, not exciting in a fun way.' },
      { text: 'Flat', isEliminatable: true, eliminationReason: 'Flat means level and even. A treacherous mountain path with ice and rocks is neither flat nor even.' },
      { text: 'Popular', isEliminatable: true, eliminationReason: 'Popular means well-liked. A path with ice and loose rocks is described as hazardous, not well-liked.' },
    ],
    correctOptionIndex: 0,
    explanation: 'Treacherous means presenting hidden or unpredictable dangers. Dangerous is the closest word in meaning. The context of ice and loose rocks confirms something hazardous.',
    category: 'vocabulary',
  },

  // vr-3-25: comprehension-what
  {
    id: 'vr-3-25',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'At the school concert, the choir sang three songs. The first was about the sea, the second was about friendship, and the third was about winter. The audience clapped loudest after the friendship song but gave a standing ovation after the winter song. Which song received a standing ovation?',
    questionTokens: [
      'At', 'the', 'school', 'concert,', 'the', 'choir', 'sang', 'three', 'songs.', 'The', 'first',
      'was', 'about', 'the', 'sea,', 'the', 'second', 'was', 'about', 'friendship,', 'and', 'the',
      'third', 'was', 'about', 'winter.', 'The', 'audience', 'clapped', 'loudest', 'after', 'the',
      'friendship', 'song', 'but', 'gave', 'a', 'standing', 'ovation', 'after', 'the', 'winter', 'song.',
      'Which', 'song', 'received', 'a', 'standing', 'ovation?',
    ],
    keyWordIndices: [34, 35, 36, 37, 38, 39, 40, 41, 42],
    options: [
      { text: 'The sea song', isEliminatable: true, eliminationReason: 'The sea song is mentioned first but no special reaction to it is described.' },
      { text: 'The friendship song', isEliminatable: true, eliminationReason: 'If you rushed, you might pick friendship because the audience clapped loudest, but clapping loudest is different from a standing ovation. The standing ovation was for the winter song.' },
      { text: 'The winter song', isEliminatable: false },
      { text: 'All three songs', isEliminatable: true, eliminationReason: 'The standing ovation was specifically after the winter song, not after all three songs.' },
      { text: 'None of the songs', isEliminatable: true, eliminationReason: 'The passage clearly states a standing ovation was given after the winter song, so one song did receive it.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says the audience "gave a standing ovation after the winter song." The friendship song got the loudest clapping, which is different from a standing ovation. Read precisely.',
    category: 'comprehension-what',
    trickType: 'position-trap',
  },

  // vr-3-26: comprehension-how-many
  {
    id: 'vr-3-26',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'There are 30 children in the class. On Monday, everyone was present. On Tuesday, 4 children were absent. On Wednesday, 2 of those 4 returned but 3 different children went home ill. How many children were absent on Wednesday?',
    questionTokens: [
      'There', 'are', '30', 'children', 'in', 'the', 'class.', 'On', 'Monday,', 'everyone', 'was',
      'present.', 'On', 'Tuesday,', '4', 'children', 'were', 'absent.', 'On', 'Wednesday,', '2',
      'of', 'those', '4', 'returned', 'but', '3', 'different', 'children', 'went', 'home', 'ill.',
      'How', 'many', 'children', 'were', 'absent', 'on', 'Wednesday?',
    ],
    keyWordIndices: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    options: [
      { text: '4', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 4 because that was Tuesday\'s number, but on Wednesday 2 of those 4 returned and 3 new ones left.' },
      { text: '2', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 2 because 2 children returned, but 2 returned means 2 from the original 4 were still absent, plus 3 new ones.' },
      { text: '3', isEliminatable: true, eliminationReason: 'If you rushed, you might pick 3 because 3 new children went home, but you must also count the 2 who were still absent from Tuesday.' },
      { text: '5', isEliminatable: false },
      { text: '7', isEliminatable: true, eliminationReason: 'If you rushed, you might add 4 and 3 together, but 2 of the original 4 returned. So it is 4 minus 2 plus 3, which equals 5.' },
    ],
    correctOptionIndex: 3,
    explanation: 'On Tuesday, 4 were absent. On Wednesday, 2 of those 4 returned (so 2 were still absent) and 3 different children went home ill. That is 2 plus 3 equals 5 children absent on Wednesday.',
    category: 'comprehension-how-many',
    trickType: 'two-step',
  },

  // vr-3-27: vocabulary
  {
    id: 'vr-3-27',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The boy was reluctant to jump into the cold swimming pool. Which word is closest in meaning to "reluctant"?',
    questionTokens: [
      'The', 'boy', 'was', 'reluctant', 'to', 'jump', 'into', 'the', 'cold', 'swimming', 'pool.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"reluctant"?',
    ],
    keyWordIndices: [3],
    options: [
      { text: 'Eager', isEliminatable: true, eliminationReason: 'Eager means keen and enthusiastic, which is the opposite of reluctant. Someone reluctant does not want to do something.' },
      { text: 'Happy', isEliminatable: true, eliminationReason: 'Happy means pleased or content. Being reluctant means being unwilling, not happy.' },
      { text: 'Unwilling', isEliminatable: false },
      { text: 'Excited', isEliminatable: true, eliminationReason: 'Excited means thrilled and looking forward to something. Reluctant means the opposite.' },
      { text: 'Brave', isEliminatable: true, eliminationReason: 'Brave means willing to face danger. Reluctant means hesitant and unwilling, which is the opposite of brave.' },
    ],
    correctOptionIndex: 2,
    explanation: 'Reluctant means not willing or hesitant. Unwilling is the closest synonym. The context of a cold pool helps confirm that the boy did not want to jump in.',
    category: 'vocabulary',
  },

  // vr-3-28: comprehension-where
  {
    id: 'vr-3-28',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The family went on holiday to Cornwall, not Devon. They had planned to go to Devon originally but changed their minds. They stayed in a cottage near the beach. Their friends went to Wales instead. Where did the family go on holiday?',
    questionTokens: [
      'The', 'family', 'went', 'on', 'holiday', 'to', 'Cornwall,', 'not', 'Devon.', 'They', 'had',
      'planned', 'to', 'go', 'to', 'Devon', 'originally', 'but', 'changed', 'their', 'minds.',
      'They', 'stayed', 'in', 'a', 'cottage', 'near', 'the', 'beach.', 'Their', 'friends', 'went',
      'to', 'Wales', 'instead.',
      'Where', 'did', 'the', 'family', 'go', 'on', 'holiday?',
    ],
    keyWordIndices: [2, 3, 4, 5, 6, 7, 8],
    options: [
      { text: 'Devon', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Devon because it is mentioned twice, but the passage says NOT Devon. They changed their minds from Devon to Cornwall.' },
      { text: 'Wales', isEliminatable: true, eliminationReason: 'If you rushed, you might pick Wales because it is a place in the passage, but Wales is where their friends went, not the family.' },
      { text: 'The beach', isEliminatable: true, eliminationReason: 'The beach is where the cottage was near, but the question asks which place they went to, which is Cornwall.' },
      { text: 'Cornwall', isEliminatable: false },
      { text: 'Scotland', isEliminatable: true, eliminationReason: 'Scotland is not mentioned in the passage. The family went to Cornwall.' },
    ],
    correctOptionIndex: 3,
    explanation: 'The passage says the family went to "Cornwall, not Devon." Devon was the original plan but they changed their minds. Wales is where the friends went. Cornwall is correct.',
    category: 'comprehension-where',
    trickType: 'negation-trap',
  },

  // vr-3-29: comprehension-inference
  {
    id: 'vr-3-29',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The shopkeeper sighed and began stacking the chairs on the tables. She turned off the coffee machine, wiped down the counter, and flipped the sign on the door from "Open" to "Closed." What was the shopkeeper most likely doing?',
    questionTokens: [
      'The', 'shopkeeper', 'sighed', 'and', 'began', 'stacking', 'the', 'chairs', 'on', 'the',
      'tables.', 'She', 'turned', 'off', 'the', 'coffee', 'machine,', 'wiped', 'down', 'the',
      'counter,', 'and', 'flipped', 'the', 'sign', 'on', 'the', 'door', 'from', '"Open"', 'to', '"Closed."',
      'What', 'was', 'the', 'shopkeeper', 'most', 'likely', 'doing?',
    ],
    keyWordIndices: [4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 22, 23, 24, 29, 30, 31],
    options: [
      { text: 'Opening the shop for the day', isEliminatable: true, eliminationReason: 'If you rushed, you might think about opening, but she flipped the sign FROM "Open" TO "Closed," which means she was shutting, not opening.' },
      { text: 'Closing the shop for the day', isEliminatable: false },
      { text: 'Cleaning up after a spill', isEliminatable: true, eliminationReason: 'She is cleaning, but the combination of stacking chairs, turning off the machine, and changing the sign to Closed shows she is closing up entirely.' },
      { text: 'Preparing for a busy day', isEliminatable: true, eliminationReason: 'Preparing for a busy day would mean the sign should go to Open, not Closed. She is winding down, not preparing.' },
      { text: 'Rearranging the furniture', isEliminatable: true, eliminationReason: 'Stacking chairs on tables plus turning off the machine and changing the sign to Closed all show she is closing up, not rearranging.' },
    ],
    correctOptionIndex: 1,
    explanation: 'The clues are: stacking chairs on tables, turning off the coffee machine, wiping down, and flipping the sign to "Closed." All of these are things you do when closing a shop for the day.',
    category: 'comprehension-inference',
  },

  // vr-3-30: vocabulary
  {
    id: 'vr-3-30',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The expedition was arduous, with steep climbs and freezing temperatures. Which word is closest in meaning to "arduous"?',
    questionTokens: [
      'The', 'expedition', 'was', 'arduous,', 'with', 'steep', 'climbs', 'and', 'freezing', 'temperatures.',
      'Which', 'word', 'is', 'closest', 'in', 'meaning', 'to', '"arduous"?',
    ],
    keyWordIndices: [3],
    options: [
      { text: 'Easy', isEliminatable: true, eliminationReason: 'Easy is the opposite of arduous. Steep climbs and freezing temperatures suggest something very difficult, not easy.' },
      { text: 'Short', isEliminatable: true, eliminationReason: 'Short describes length, not difficulty. The passage describes how hard the expedition was, not how long it took.' },
      { text: 'Enjoyable', isEliminatable: true, eliminationReason: 'Enjoyable means pleasant and fun. Steep climbs and freezing temperatures do not sound enjoyable.' },
      { text: 'Difficult', isEliminatable: false },
      { text: 'Boring', isEliminatable: true, eliminationReason: 'Boring means dull and uninteresting. Arduous means hard and exhausting, which is not the same as boring.' },
    ],
    correctOptionIndex: 3,
    explanation: 'Arduous means requiring great effort and endurance. Difficult is the closest synonym. The context of steep climbs and freezing temperatures confirms the expedition was very hard.',
    category: 'vocabulary',
  },

  // vr-3-31: comprehension-who
  {
    id: 'vr-3-31',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'Ella, Freya and Grace all entered the art competition. The winner was not Ella, even though her painting was displayed first. Freya did not win either. The judges chose Grace\'s painting of a sunset. Who did not win the competition?',
    questionTokens: [
      'Ella,', 'Freya', 'and', 'Grace', 'all', 'entered', 'the', 'art', 'competition.', 'The', 'winner',
      'was', 'not', 'Ella,', 'even', 'though', 'her', 'painting', 'was', 'displayed', 'first.',
      'Freya', 'did', 'not', 'win', 'either.', 'The', 'judges', 'chose', "Grace's", 'painting',
      'of', 'a', 'sunset.',
      'Who', 'did', 'not', 'win', 'the', 'competition?',
    ],
    keyWordIndices: [9, 10, 11, 12, 13, 21, 22, 23, 24, 25],
    options: [
      { text: 'Grace', isEliminatable: true, eliminationReason: 'If you rushed, you might miss that the question asks who did NOT win. Grace DID win, so she is the wrong answer here.' },
      { text: 'The judges', isEliminatable: true, eliminationReason: 'The judges chose the winner but were not contestants in the competition.' },
      { text: 'Ella and Freya', isEliminatable: false },
      { text: 'All three girls', isEliminatable: true, eliminationReason: 'Grace won, so it is not true that all three lost. Only Ella and Freya did not win.' },
      { text: 'Nobody', isEliminatable: true, eliminationReason: 'The passage says the judges chose Grace\'s painting, so Grace did win. Ella and Freya are the ones who did not win.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The question asks who did NOT win. The passage says Ella was not the winner and Freya did not win either. Grace won. So Ella and Freya did not win.',
    category: 'comprehension-who',
    trickType: 'negation-trap',
  },

  // vr-3-32: comprehension-when
  {
    id: 'vr-3-32',
    subject: 'reasoning',
    difficulty: 3,
    questionText: 'The school disco is always in December, not November. Last year it was on the 15th of December. This year it has been moved to the 20th of December because the hall is being painted on the 15th. When is the school disco this year?',
    questionTokens: [
      'The', 'school', 'disco', 'is', 'always', 'in', 'December,', 'not', 'November.', 'Last', 'year',
      'it', 'was', 'on', 'the', '15th', 'of', 'December.', 'This', 'year', 'it', 'has', 'been',
      'moved', 'to', 'the', '20th', 'of', 'December', 'because', 'the', 'hall', 'is', 'being',
      'painted', 'on', 'the', '15th.',
      'When', 'is', 'the', 'school', 'disco', 'this', 'year?',
    ],
    keyWordIndices: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28],
    options: [
      { text: '15th of November', isEliminatable: true, eliminationReason: 'If you rushed, you might combine the wrong month and date. The disco is in December, not November, and it is no longer on the 15th.' },
      { text: '15th of December', isEliminatable: true, eliminationReason: 'If you rushed, you might pick the 15th because it was last year\'s date, but the disco was moved from the 15th to the 20th this year.' },
      { text: '20th of December', isEliminatable: false },
      { text: '20th of November', isEliminatable: true, eliminationReason: 'If you rushed, you might pick November, but the passage says the disco is in December, not November.' },
      { text: '1st of December', isEliminatable: true, eliminationReason: 'The 1st of December is not mentioned in the passage. The disco this year is on the 20th of December.' },
    ],
    correctOptionIndex: 2,
    explanation: 'The passage says "This year it has been moved to the 20th of December." Last year it was the 15th, but the hall is being painted on the 15th this year, so it moved to the 20th.',
    category: 'comprehension-when',
    trickType: 'position-trap',
  },
];
