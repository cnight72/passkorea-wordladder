/** 쇼츠 한 편을 만드는 데 필요한 전부. scripts/build-queue.ts 가 이 모양으로 뽑는다. */
export interface ShortQuestion {
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
