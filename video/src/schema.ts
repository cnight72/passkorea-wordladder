/**
 * 쇼츠 한 편을 만드는 데 필요한 전부. scripts/build-queue.ts 가 이 모양으로 뽑는다.
 *
 * interface 가 아니라 type 인 이유가 있다. Remotion 의 Composition 은 프롭이
 * Record<string, unknown> 을 만족하길 요구하는데, interface 는 암묵적 인덱스
 * 시그니처를 갖지 않아 통과하지 못한다. type 별칭은 통과한다.
 */
export type ShortQuestion = {
  /** 파일명이자 딥링크 키 (예: 'vocab-안전모') */
  id: string;
  /** 화면 가운데 크게 나오는 한국어 표제어 */
  word: string;
  /** 영어 뜻 보기 4개 */
  choices: string[];
  /** choices 안에서 정답 위치 */
  answerIndex: number;
  /** 상단 배지에 쓸 소단원 이름 (예: 'Safety Equipment') */
  topic: string;
  /** video/public/backgrounds/ 안의 파일명. 없으면 그라데이션 배경. */
  background?: string;
  /** 영상 끝 CTA 에 넣을 주소 */
  cta: string;
  /** video/public/tts/ 안의 발음 파일명. render.mjs 가 파일 유무를 보고 채운다. */
  voice?: string;
}

/**
 * 문제도 보기도 한국어인 형식. 기존 쇼츠('학교와 관계있는 단어는?')와 같은 결이다.
 * 소단원 이름을 그대로 문제로 쓰기 때문에 어휘 데이터만으로 만들어진다.
 */
export type CategoryQuestion = {
  id: string;
  /** 한국어 질문 문장 */
  question: string;
  /** 아래에 작게 깔 영어 질문 */
  questionEn: string;
  /** 한국어 보기 4개 */
  choices: string[];
  answerIndex: number;
  /** 정답의 영어 뜻. 공개할 때만 보인다. */
  answerEn: string;
  /** TTS 로 읽을 정답 단어 = choices[answerIndex] */
  word: string;
  topic: string;
  background?: string;
  cta: string;
  voice?: string;
  /** 질문 문장을 읽은 파일 */
  voiceQuestion?: string;
}

/** 30fps · 24초 = 720프레임. 씬 경계는 컴포지션과 자막 생성이 함께 쓴다. */
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SCENE = {
  /** 단어가 튀어나오는 구간 */
  hook: 0,
  /** 보기 4개가 차례로 등장 */
  choices: 90,
  /** 카운트다운 시작 */
  countdown: 150,
  /** 정답 공개 */
  reveal: 510,
  /** 하단 CTA 바 등장 */
  cta: 630,
  end: 720,
} as const;

/** 카운트다운 길이(초) — 시청자가 답을 고르는 시간 */
export const THINK_SECONDS = (SCENE.reveal - SCENE.countdown) / FPS;
