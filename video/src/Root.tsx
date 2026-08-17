import React from 'react';
import { Composition } from 'remotion';
import { VocabShort } from './VocabShort';
import { CategoryShort } from './CategoryShort';
import type { CategoryQuestion, ShortQuestion } from './schema';
import { FPS, HEIGHT, SCENE, WIDTH } from './schema';

/** 스튜디오에서 미리 볼 때 쓰는 예시. 실제 렌더는 queue.json 이 프롭을 덮어쓴다. */
const VOCAB_SAMPLE: ShortQuestion = {
  id: 'vocab-안전모',
  word: '안전모',
  choices: ['safety helmet', 'safety shoes', 'work gloves', 'ear plugs'],
  answerIndex: 0,
  topic: 'Safety Equipment',
  cta: 'pass-korea.com',
};

const CATEGORY_SAMPLE: CategoryQuestion = {
  id: 'cat-의자',
  question: "다음 중 '가구와 전자제품'에 해당하는 단어는?",
  questionEn: "Which word belongs to 'Furniture and Electronics'?",
  choices: ['우유', '의자', '시장', '씻다'],
  answerIndex: 1,
  answerEn: 'chair',
  word: '의자',
  topic: 'Furniture and Electronics',
  cta: 'pass-korea.com',
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="VocabShort"
      component={VocabShort}
      durationInFrames={SCENE.end}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={VOCAB_SAMPLE}
    />
    <Composition
      id="CategoryShort"
      component={CategoryShort}
      durationInFrames={SCENE.end}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={CATEGORY_SAMPLE}
    />
  </>
);
