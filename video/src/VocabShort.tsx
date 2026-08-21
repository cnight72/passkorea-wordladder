import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { ShortQuestion } from './schema';
import { SCENE } from './schema';
import { Background, ChoiceRow, CommentPrompt, Cta, Header, Sound } from './parts';
import { FONT } from './theme';

/**
 * 표제어 글자 크기. '권' 같은 한 글자와 '절연용 보호구' 같은 긴 말이
 * 같은 크기면 짧은 쪽이 화면에서 사라져 보인다.
 */
function wordSize(word: string): number {
  const n = [...word].length;
  if (n <= 2) return 230;
  if (n === 3) return 180;
  if (n === 4) return 150;
  if (n <= 6) return 120;
  return 96;
}

/** 한국어 단어를 보여주고 영어 뜻을 고르게 한다. 한국어를 아직 못 읽는 입문자용. */
export const VocabShort: React.FC<ShortQuestion> = ({
  word,
  choices,
  answerIndex,
  topic,
  background,
  cta,
  voice,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordIn = spring({ frame, fps, config: { damping: 14 } });
  const revealed = frame >= SCENE.reveal;

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Sound voice={voice} />
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
          }}
        >
          <div
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: 40, fontWeight: 600, marginBottom: 20 }}
          >
            What does this word mean?
          </div>
          <div
            style={{
              fontSize: wordSize(word),
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.1,
              textShadow: '0 8px 40px rgba(0,0,0,0.45)',
              transform: `scale(${interpolate(wordIn, [0, 1], [0.7, 1])})`,
              opacity: wordIn,
            }}
          >
            {word}
          </div>
        </div>

        <div>
          {choices.map((choice, i) => (
            <ChoiceRow
              key={choice}
              index={i}
              text={choice}
              isAnswer={i === answerIndex}
              revealed={revealed}
            />
          ))}
        </div>

        <CommentPrompt />
        <Cta cta={cta} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
