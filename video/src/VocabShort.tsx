import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { ShortQuestion } from './schema';
import { SCENE, THINK_SECONDS } from './schema';
import { COLOR, FONT } from './theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** 배경 사진 위에 흰 카드를 올린다. 사진이 없으면 브랜드 그라데이션. */
const Background: React.FC<{ background?: string }> = ({ background }) => {
  const frame = useCurrentFrame();
  // 24초 내내 아주 천천히 확대해 정지 이미지처럼 보이지 않게 한다
  const scale = interpolate(frame, [0, SCENE.end], [1.06, 1.16]);

  if (!background) {
    return (
      <AbsoluteFill
        style={{ background: `linear-gradient(160deg, ${COLOR.brand}, ${COLOR.brandDark})` }}
      />
    );
  }

  return (
    <AbsoluteFill>
      <Img
        src={staticFile(`backgrounds/${background}`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
      {/* 글자 대비를 확보하는 어두운 막 */}
      <AbsoluteFill style={{ background: 'rgba(15,23,42,0.55)' }} />
    </AbsoluteFill>
  );
};

const ChoiceRow: React.FC<{
  index: number;
  text: string;
  isAnswer: boolean;
  revealed: boolean;
}> = ({ index, text, isAnswer, revealed }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 보기 하나씩 4프레임 간격으로 밀어 넣는다
  const enter = spring({
    frame: frame - (SCENE.choices + index * 4),
    fps,
    config: { damping: 200 },
  });

  // 공개 후 오답은 흐려지고 정답만 남는다
  const dim = revealed && !isAnswer ? 0.28 : 1;
  const pop = revealed && isAnswer ? spring({ frame: frame - SCENE.reveal, fps, config: { damping: 12 } }) : 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '34px 40px',
        marginBottom: 24,
        borderRadius: 28,
        background: revealed && isAnswer ? COLOR.correctBg : COLOR.card,
        border: `6px solid ${revealed && isAnswer ? COLOR.correct : 'transparent'}`,
        opacity: enter * dim,
        transform: `translateX(${interpolate(enter, [0, 1], [80, 0])}px) scale(${1 + pop * 0.04})`,
        boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
      }}
    >
      <div
        style={{
          width: 76,
          height: 76,
          flexShrink: 0,
          borderRadius: '50%',
          background: revealed && isAnswer ? COLOR.correct : '#e2e8f0',
          color: revealed && isAnswer ? '#ffffff' : COLOR.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 800,
        }}
      >
        {revealed && isAnswer ? '✓' : LETTERS[index]}
      </div>
      <div
        style={{
          fontSize: 46,
          fontWeight: 700,
          color: revealed && isAnswer ? COLOR.correct : COLOR.ink,
          lineHeight: 1.2,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** 남은 시간을 도는 링으로 보여준다. 숫자만 있는 것보다 시선을 오래 붙든다. */
const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = (frame - SCENE.countdown) / fps;
  const left = Math.max(0, THINK_SECONDS - elapsed);
  const ratio = Math.min(1, Math.max(0, left / THINK_SECONDS));

  const r = 62;
  const circumference = 2 * Math.PI * r;
  const urgent = left <= 3;

  return (
    <div style={{ position: 'relative', width: 150, height: 150 }}>
      <svg width={150} height={150} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={75} cy={75} r={r} stroke="rgba(255,255,255,0.25)" strokeWidth={12} fill="none" />
        <circle
          cx={75}
          cy={75}
          r={r}
          stroke={urgent ? '#fbbf24' : '#ffffff'}
          strokeWidth={12}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 56,
          fontWeight: 800,
          color: urgent ? '#fbbf24' : '#ffffff',
        }}
      >
        {Math.ceil(left)}
      </div>
    </div>
  );
};

export const VocabShort: React.FC<ShortQuestion> = ({
  word,
  choices,
  answerIndex,
  topic,
  background,
  cta,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wordIn = spring({ frame, fps, config: { damping: 14 } });
  const revealed = frame >= SCENE.reveal;
  const ctaIn = spring({ frame: frame - SCENE.cta, fps, config: { damping: 200 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <Background background={background} />

      <AbsoluteFill style={{ padding: '110px 64px 64px', display: 'flex', flexDirection: 'column' }}>
        {/* 상단: 브랜드 배지 + 카운트다운 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div
              style={{
                display: 'inline-block',
                padding: '14px 30px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.95)',
                color: COLOR.brand,
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              EPS-TOPIK
            </div>
            <div style={{ marginTop: 18, color: 'rgba(255,255,255,0.85)', fontSize: 32, fontWeight: 600 }}>
              {topic}
            </div>
          </div>
          {frame >= SCENE.countdown && !revealed ? <Countdown /> : null}
        </div>

        {/* 가운데: 표제어 */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 40, fontWeight: 600, marginBottom: 20 }}>
            What does this word mean?
          </div>
          <div
            style={{
              fontSize: 150,
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 1.05,
              textShadow: '0 8px 40px rgba(0,0,0,0.45)',
              transform: `scale(${interpolate(wordIn, [0, 1], [0.7, 1])})`,
              transformOrigin: 'left center',
              opacity: wordIn,
            }}
          >
            {word}
          </div>
        </div>

        {/* 아래: 보기 4개 */}
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

        {/* 맨 아래: CTA */}
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            opacity: ctaIn,
            transform: `translateY(${interpolate(ctaIn, [0, 1], [40, 0])}px)`,
          }}
        >
          <div style={{ color: '#ffffff', fontSize: 44, fontWeight: 800 }}>{cta}</div>
          <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 30, marginTop: 8 }}>
            2,101 words · free · no sign-up
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
