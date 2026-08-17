import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { CategoryQuestion } from './schema';
import { SCENE } from './schema';
import { Background, ChoiceRow, Cta, Header, Sound } from './parts';
import { FONT } from './theme';

/**
 * 문제와 보기가 모두 한국어인 형식.
 * 단어 뜻 맞히기(VocabShort)와 달리 영어를 읽을 줄 몰라도 풀 수 있고,
 * 실제 시험이 한국어로만 나오는 것과도 맞는다.
 */
export const CategoryShort: React.FC<CategoryQuestion> = ({
  question,
  questionEn,
  choices,
  answerIndex,
  answerEn,
  topic,
  background,
  cta,
  voice,
  voiceQuestion,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const questionIn = spring({ frame, fps, config: { damping: 16 } });
  const revealed = frame >= SCENE.reveal;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sound voice={voice} voiceQuestion={voiceQuestion} />
      <Background background={background} />

      <AbsoluteFill style={{ padding: '110px 64px 64px', display: 'flex', flexDirection: 'column' }}>
        <Header topic={topic} showCountdown={frame >= SCENE.countdown && !revealed} />

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            opacity: questionIn,
            transform: `translateY(${interpolate(questionIn, [0, 1], [40, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.3,
              textShadow: '0 8px 40px rgba(0,0,0,0.45)',
            }}
          >
            {question}
          </div>
          <div
            style={{ marginTop: 24, color: 'rgba(255,255,255,0.78)', fontSize: 36, fontWeight: 600 }}
          >
            {questionEn}
          </div>
        </div>

        <div>
          {choices.map((choice, i) => (
            <ChoiceRow
              key={choice}
              index={i}
              text={choice}
              sub={answerEn}
              isAnswer={i === answerIndex}
              revealed={revealed}
            />
          ))}
        </div>

        <Cta cta={cta} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
