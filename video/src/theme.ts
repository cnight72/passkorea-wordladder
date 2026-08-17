/**
 * 앱(Tailwind blue-600 계열)과 같은 색을 쓴다.
 * 쇼츠를 보고 앱에 들어온 사람이 같은 브랜드로 느끼게 하려는 것.
 */
export const COLOR = {
  brand: '#2563eb',
  brandDark: '#1e40af',
  correct: '#16a34a',
  correctBg: '#dcfce7',
  ink: '#0f172a',
  muted: '#64748b',
  card: '#ffffff',
} as const;

/** 한글이 깨지지 않는 순서로. Windows 는 맑은 고딕, mac 은 애플 고딕이 잡힌다. */
export const FONT =
  "Pretendard, 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', system-ui, sans-serif";
