import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { SCENE, THINK_SECONDS } from './schema';
import { COLOR } from './theme';

const LETTERS = ['A', 'B', 'C', 'D'];

/** 배경 사진 위에 어두운 막을 덮는다. 사진이 없으면 브랜드 그라데이션. */
export const Background: React.FC<{ background?: string }> = ({ background }) => {
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
      <AbsoluteFill style={{ background: 'rgba(15,23,42,0.55)' }} />
    </AbsoluteFill>
  );
};

export const ChoiceRow: React.FC<{
  index: number;
  text: string;
  /** 정답을 공개할 때만 함께 보여줄 보조 설명 (영어 뜻 등) */
  sub?: string;
  isAnswer: boolean;
  revealed: boolean;
}> = ({ index, text, sub, isAnswer, revealed }) => {
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
  const pop =
    revealed && isAnswer ? spring({ frame: frame - SCENE.reveal, fps, config: { damping: 12 } }) : 0;
  const won = revealed && isAnswer;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 28,
        padding: '30px 40px',
        marginBottom: 22,
        borderRadius: 28,
        background: won ? COLOR.correctBg : COLOR.card,
        border: `6px solid ${won ? COLOR.correct : 'transparent'}`,
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
          background: won ? COLOR.correct : '#e2e8f0',
          color: won ? '#ffffff' : COLOR.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 40,
          fontWeight: 800,
        }}
      >
        {won ? '✓' : LETTERS[index]}
      </div>
      <div>
        <div
          style={{
            fontSize: 46,
            fontWeight: 700,
            color: won ? COLOR.correct : COLOR.ink,
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>
        {won && sub ? (
          <div style={{ fontSize: 32, fontWeight: 600, color: COLOR.correct, opacity: 0.8, marginTop: 6 }}>
            {sub}
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** 남은 시간을 도는 링으로 보여준다. 숫자만 있는 것보다 시선을 오래 붙든다. */
export const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const left = Math.max(0, THINK_SECONDS - (frame - SCENE.countdown) / fps);
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

/**
 * 소리는 세 겹이다.
 * 발음 — 문제를 읽어 주고(있으면), 정답 단어를 다시 들려준다.
 * 틱   — 마지막 3초에만. 처음부터 깔면 피로하다.
 * 딩   — 정답 공개.
 */
export const Sound: React.FC<{ voice?: string; voiceQuestion?: string }> = ({
  voice,
  voiceQuestion,
}) => (
  <>
    {voiceQuestion ? (
      <Sequence from={SCENE.hook + 15} name="발음(문제)">
        <Audio src={staticFile(`tts/${voiceQuestion}`)} />
      </Sequence>
    ) : null}

    {voice ? (
      <>
        {!voiceQuestion ? (
          <Sequence from={SCENE.hook + 20} name="발음(단어)">
            <Audio src={staticFile(`tts/${voice}`)} />
          </Sequence>
        ) : null}
        <Sequence from={SCENE.reveal + 25} name="발음(정답)">
          <Audio src={staticFile(`tts/${voice}`)} />
        </Sequence>
      </>
    ) : null}

    {[90, 60, 30].map((before) => (
      <Sequence key={before} from={SCENE.reveal - before} durationInFrames={10} name="틱">
        <Audio src={staticFile('sfx/tick.wav')} volume={0.3} />
      </Sequence>
    ))}

    <Sequence from={SCENE.reveal} name="딩">
      <Audio src={staticFile('sfx/ding.wav')} volume={0.45} />
    </Sequence>
  </>
);

/** 상단 브랜드 배지 + 소단원 이름 */
export const Header: React.FC<{ topic: string; showCountdown: boolean }> = ({
  topic,
  showCountdown,
}) => (
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
    {showCountdown ? <Countdown /> : null}
  </div>
);

/** 하단 CTA */
export const Cta: React.FC<{ cta: string }> = ({ cta }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - SCENE.cta, fps, config: { damping: 200 } });

  return (
    <div
      style={{
        marginTop: 20,
        textAlign: 'center',
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px)`,
      }}
    >
      <div style={{ color: '#ffffff', fontSize: 44, fontWeight: 800 }}>{cta}</div>
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 30, marginTop: 8 }}>
        2,101 words · free · no sign-up
      </div>
    </div>
  );
};
