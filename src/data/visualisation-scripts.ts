export interface VisualisationSection {
  id: string;
  type: 'text' | 'pause';
  content?: string;
  /** Optional path to a pre-recorded audio file for this section */
  audioSrc?: string;
  displayDurationMs: number;
}

export interface VisualisationScript {
  id: string;
  title: string;
  description: string;
  emoji: string;
  durationMinutes: number;
  /** Optional path to a single pre-recorded audio file for the whole script */
  audioSrc?: string;
  sections: VisualisationSection[];
}

export interface BoxBreathingConfig {
  inhaleSeconds: number;
  holdInSeconds: number;
  exhaleSeconds: number;
  holdOutSeconds: number;
}

/** Box breathing: 4-4-4-4 pattern */
export const boxBreathingConfig: BoxBreathingConfig = {
  inhaleSeconds: 4,
  holdInSeconds: 4,
  exhaleSeconds: 4,
  holdOutSeconds: 4,
};

export const visualisationScripts: VisualisationScript[] = [
  {
    id: 'vis-exam-day',
    title: 'Your Exam Day',
    description: 'A calming journey through your exam day — building confidence and calm.',
    emoji: '🌅',
    durationMinutes: 5,
    audioSrc: '/audio/exam-day-visualisation.mp3',
    sections: [
      {
        id: 'v1-intro',
        type: 'text',
        content:
          'Sit comfortably and close your eyes. Let your shoulders drop. Unclench your jaw. Let everything relax. Take a big, slow breath in\u2026 and let it out gently.',
        displayDurationMs: 14_000,
      },
      {
        id: 'v1-morning',
        type: 'text',
        content:
          'Imagine it is the morning of your exam. You wake up feeling rested. You have had a good breakfast. Your bag is packed. You feel ready.',
        displayDurationMs: 14_000,
      },
      {
        id: 'v1-arriving',
        type: 'text',
        content:
          'You arrive at the exam hall. You see other children. Some look nervous, but you feel calm. You have practised your technique. You know what to do. You find your place and sit down at your desk.',
        displayDurationMs: 16_000,
      },
      {
        id: 'v1-settling',
        type: 'text',
        content:
          'You take a deep breath. You glance at the clock. You know how much time you have. You are ready to use it well.',
        displayDurationMs: 12_000,
      },
      {
        id: 'v1-paper',
        type: 'text',
        content:
          'The exam paper is in front of you. You turn it over and forget about all of the other children and what they are doing. You focus on what you need to do now.',
        displayDurationMs: 14_000,
      },
      {
        id: 'v1-first-question',
        type: 'text',
        content:
          'You see the first question. You take a breath, bring your focus in, and read it carefully. You read it again.',
        displayDurationMs: 12_000,
      },
      {
        id: 'v1-technique',
        type: 'text',
        content:
          'You spot the key words. You know exactly what the question is asking. You know what it is telling you. Now you look at the answers with purpose. You cross out the ones that cannot be right. Then you choose your best answer. You double check and feel confident. You move swiftly onto the next.',
        displayDurationMs: 20_000,
      },
      {
        id: 'v1-tricky',
        type: 'text',
        content:
          'You come to a tricky question. You feel a little wave of worry. But you remember what to do and feel calm again. You take a breath and bring your attention back to the question. You find the key words. Even if you are not sure, you can still eliminate wrong answers and make your best choice. You make a note of the question number to come back and check at the end then move on swiftly to the next. That is all anyone can do.',
        displayDurationMs: 24_000,
      },
      {
        id: 'v1-working',
        type: 'text',
        content:
          'You work through the paper, question by question, using your technique each time. Read. Re-read. Underline key words. Eliminate wrong words. Choose the right one. Every so often you glance at the clock \u2014 you are keeping pace, moving steadily through. You are doing brilliantly.',
        displayDurationMs: 18_000,
      },
      {
        id: 'v1-checking',
        type: 'text',
        content:
          'You have worked through the questions. You check the time. There is still time left \u2014 you use it well. You go back to the beginning. You read each answer again with fresh eyes. Some feel solid. Good. Some you want to reconsider. You change an answer only if something clearer comes to you. Only if you could explain your reason for changing it. You trust yourself.',
        displayDurationMs: 22_000,
      },
      {
        id: 'v1-end',
        type: 'text',
        content:
          'The exam finishes. You put your pen down and take a deep breath. You feel proud of yourself. Not because you got every answer right \u2014 nobody does \u2014 but because you tried your best and used your technique. That is what matters most. Well done, you.',
        displayDurationMs: 18_000,
      },
      {
        id: 'v1-return',
        type: 'text',
        content:
          'Now, gently bring your attention back to the room. Wiggle your fingers and toes. When you are ready, open your eyes. You are ready to read the question and do your best.',
        displayDurationMs: 14_000,
      },
    ],
  },
];
