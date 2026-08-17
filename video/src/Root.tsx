import React from 'react';
import { Composition } from 'remotion';
import { VocabShort } from './VocabShort';
import type { ShortQuestion } from './schema';
import { FPS, HEIGHT, SCENE, WIDTH } from './schema';

/** 스튜디오에서 미리 볼 때 쓰는 예시. 실제 렌더는 queue.json 이 프롭을 덮어쓴다. */
const SAMPLE: ShortQuestion = {
  id: 'vocab-안전모',
  word: '안전모',
  choices: ['safety helmet', 'safety shoes', 'work gloves', 'ear plugs'],
  answerIndex: 0,
  topic: 'Safety Equipment',
  cta: 'pass-korea.com',
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="VocabShort"
    component={VocabShort}
    durationInFrames={SCENE.end}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={SAMPLE}
  />
);
