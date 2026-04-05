import type { Question } from '../../types/question';
import { englishQuestions } from './english';
import { mathsQuestions } from './maths';
import { verbalReasoningQuestions } from './verbal-reasoning';
import { nonVerbalReasoningQuestions } from './non-verbal-reasoning';
import { newEnglishQuestions } from './new-english';
import { newMathsQuestions } from './new-maths';
import { newVerbalReasoningQuestions } from './new-verbal-reasoning';
import { newNonVerbalReasoningQuestions } from './new-non-verbal-reasoning';
import { batch2EnglishQuestions } from './batch2-english';
import { batch2MathsQuestions } from './batch2-maths';
import { batch2VerbalReasoningQuestions } from './batch2-verbal-reasoning';
import { batch2NonVerbalReasoningQuestions } from './batch2-non-verbal-reasoning';
import { batch3MathsQuestions } from './batch3-maths';
import { batch3EnglishQuestions } from './batch3-english';

export { englishQuestions } from './english';
export { mathsQuestions } from './maths';
export { verbalReasoningQuestions } from './verbal-reasoning';
export { nonVerbalReasoningQuestions } from './non-verbal-reasoning';
export { newEnglishQuestions } from './new-english';
export { newMathsQuestions } from './new-maths';
export { newVerbalReasoningQuestions } from './new-verbal-reasoning';
export { newNonVerbalReasoningQuestions } from './new-non-verbal-reasoning';
export { batch2EnglishQuestions } from './batch2-english';
export { batch2MathsQuestions } from './batch2-maths';
export { batch2VerbalReasoningQuestions } from './batch2-verbal-reasoning';
export { batch2NonVerbalReasoningQuestions } from './batch2-non-verbal-reasoning';
export { batch3MathsQuestions } from './batch3-maths';
export { batch3EnglishQuestions } from './batch3-english';

export const allQuestions: Question[] = [
  ...englishQuestions,
  ...newEnglishQuestions,
  ...batch2EnglishQuestions,
  ...mathsQuestions,
  ...newMathsQuestions,
  ...batch2MathsQuestions,
  ...verbalReasoningQuestions,
  ...newVerbalReasoningQuestions,
  ...batch2VerbalReasoningQuestions,
  ...nonVerbalReasoningQuestions,
  ...newNonVerbalReasoningQuestions,
  ...batch2NonVerbalReasoningQuestions,
  ...batch3MathsQuestions,
  ...batch3EnglishQuestions,
];
