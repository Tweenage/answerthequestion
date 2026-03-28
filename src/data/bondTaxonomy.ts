export interface BondCategory {
  bondName: string;
  subject: 'english' | 'maths' | 'verbal-reasoning' | 'non-verbal-reasoning';
  description: string;
}

export const BOND_TAXONOMY: Record<string, BondCategory> = {
  // English
  'comprehension-what':   { bondName: 'Comprehension — Facts',       subject: 'english', description: 'Retrieving specific facts from a passage' },
  'comprehension-who':    { bondName: 'Comprehension — Characters',  subject: 'english', description: 'Identifying characters and their roles' },
  'comprehension-where':  { bondName: 'Comprehension — Setting',     subject: 'english', description: 'Identifying where events take place' },
  'comprehension-when':   { bondName: 'Comprehension — Time',        subject: 'english', description: 'Identifying when events occur' },
  'comprehension-why':    { bondName: 'Comprehension — Reasons',     subject: 'english', description: 'Explaining causes and motivations' },
  'comprehension-how-many': { bondName: 'Comprehension — Numbers',   subject: 'english', description: 'Identifying numerical information' },
  'comprehension-inference': { bondName: 'Inference',                subject: 'english', description: 'Reading between the lines' },
  'vocabulary':           { bondName: 'Vocabulary — Meaning',        subject: 'english', description: 'Understanding word meanings in context' },
  'vocabulary-synonyms':  { bondName: 'Vocabulary — Synonyms',       subject: 'english', description: 'Words with similar meanings' },
  'vocabulary-antonyms':  { bondName: 'Vocabulary — Antonyms',       subject: 'english', description: 'Words with opposite meanings' },
  'vocabulary-in-context': { bondName: 'Vocabulary in Context',      subject: 'english', description: 'Meaning from surrounding text' },
  'summarising':          { bondName: 'Summarising',                  subject: 'english', description: 'Identifying the main idea' },
  'figurative-language':  { bondName: 'Figurative Language',         subject: 'english', description: 'Metaphor, simile, personification' },
  'authors-purpose':      { bondName: "Author's Purpose",            subject: 'english', description: 'Why the author wrote this' },

  // Maths
  'word-problems':        { bondName: 'Problem Solving',             subject: 'maths', description: 'Multi-step real-world problems' },
  'fractions':            { bondName: 'Fractions',                    subject: 'maths', description: 'Working with fractions' },
  'percentages':          { bondName: 'Percentages',                  subject: 'maths', description: 'Percentages and their applications' },
  'ratio':                { bondName: 'Ratio & Proportion',           subject: 'maths', description: 'Comparing quantities' },
  'algebra':              { bondName: 'Algebra',                      subject: 'maths', description: 'Unknown values and equations' },
  'geometry':             { bondName: 'Shape & Space',                subject: 'maths', description: 'Properties of 2D and 3D shapes' },
  'averages':             { bondName: 'Averages',                     subject: 'maths', description: 'Mean, median, mode, range' },
  'sequences':            { bondName: 'Number Sequences',             subject: 'maths', description: 'Patterns in number lists' },
  'place-value':          { bondName: 'Place Value',                  subject: 'maths', description: 'Understanding number place value' },
  'number-properties':    { bondName: 'Number Properties',            subject: 'maths', description: 'Factors, multiples, primes, squares' },
  'arithmetic':           { bondName: 'Mental Arithmetic',            subject: 'maths', description: 'Fast calculation skills' },
  'decimals':             { bondName: 'Decimals',                     subject: 'maths', description: 'Working with decimal numbers' },
  'negative-numbers':     { bondName: 'Negative Numbers',             subject: 'maths', description: 'Numbers below zero' },
  'missing-digits':       { bondName: 'Missing Digits',               subject: 'maths', description: 'Find the hidden number in a calculation' },
  'measurement':          { bondName: 'Measures',                     subject: 'maths', description: 'Length, mass, capacity' },
  'time':                 { bondName: 'Time',                         subject: 'maths', description: 'Clocks, calendars, duration' },
  'money':                { bondName: 'Money',                        subject: 'maths', description: 'Currency calculations' },
  'data':                 { bondName: 'Data Handling',                subject: 'maths', description: 'Charts, graphs, tables' },
  'symmetry':             { bondName: 'Symmetry',                     subject: 'maths', description: 'Lines of symmetry, reflection' },
  'coordinates':          { bondName: 'Coordinates',                  subject: 'maths', description: 'Grid positions' },
  'bodmas':               { bondName: 'Order of Operations',          subject: 'maths', description: 'BODMAS / BIDMAS rules' },
  'probability':          { bondName: 'Probability',                  subject: 'maths', description: 'Likelihood and chance' },
  'invented-operations':  { bondName: 'Non-Standard Operations',      subject: 'maths', description: 'Made-up rules applied to numbers' },
  'venn-diagrams':        { bondName: 'Venn Diagrams',                subject: 'maths', description: 'Set membership and overlap' },

  // Verbal Reasoning
  'logic-sequence':       { bondName: 'VR — Letter/Number Series',   subject: 'verbal-reasoning', description: 'Complete the pattern in a sequence' },
  'logic-code':           { bondName: 'VR — Codes',                  subject: 'verbal-reasoning', description: 'Crack the letter or number code' },
  'logic-direction':      { bondName: 'VR — Directions',             subject: 'verbal-reasoning', description: 'Follow directional instructions' },
  'logic-venn':           { bondName: 'VR — Logic Problems',         subject: 'verbal-reasoning', description: 'Work out who/what fits where' },
  'logic-grid':           { bondName: 'VR — Grid Logic',             subject: 'verbal-reasoning', description: 'Deduce from a grid of clues' },
  'logic-pattern':        { bondName: 'VR — Pattern Recognition',    subject: 'verbal-reasoning', description: 'Identify the rule in a pattern' },
  'logic-deduction':      { bondName: 'VR — Deduction',              subject: 'verbal-reasoning', description: 'Reach a conclusion from given facts' },
  'compass':              { bondName: 'VR — Directions',             subject: 'verbal-reasoning', description: 'Compass and map-based questions' },
};

export function getBondName(category: string): string {
  return BOND_TAXONOMY[category]?.bondName ?? category;
}
