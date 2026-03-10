import type { Question } from '../../types/question';
import { englishQuestions } from './english';
import { mathsQuestions } from './maths';
import { verbalReasoningQuestions } from './verbal-reasoning';
import { nonVerbalReasoningQuestions } from './non-verbal-reasoning';

export { englishQuestions } from './english';
export { mathsQuestions } from './maths';
export { verbalReasoningQuestions } from './verbal-reasoning';
export { nonVerbalReasoningQuestions } from './non-verbal-reasoning';

export const allQuestions: Question[] = [
  ...englishQuestions,
  ...mathsQuestions,
  ...verbalReasoningQuestions,
  ...nonVerbalReasoningQuestions,
];
