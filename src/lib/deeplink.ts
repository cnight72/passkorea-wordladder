/**
 * 쇼츠·틱톡 설명란에서 특정 문항으로 바로 들어오게 하는 링크 규칙.
 *
 *   ?q=vocab:안전모        어휘 한 문항
 *   ?q=exam:machinery-12   직무 한 문항
 *   ?theme=safety          해당 주제로 어휘 퀴즈 시작
 *   ?industry=machinery    해당 업종으로 직무 퀴즈 시작
 */
export type DeepLink =
  | { kind: 'vocabWord'; word: string }
  | { kind: 'examQuestion'; id: string }
  | { kind: 'vocabTheme'; theme: string }
  | { kind: 'examIndustry'; industry: string };

export function parseDeepLink(search: string): DeepLink | null {
  const params = new URLSearchParams(search);

  const q = params.get('q');
  if (q) {
    const [kind, ...rest] = q.split(':');
    const value = rest.join(':').trim();
    if (!value) return null;
    if (kind === 'vocab') return { kind: 'vocabWord', word: value };
    if (kind === 'exam') return { kind: 'examQuestion', id: value };
    return null;
  }

  const theme = params.get('theme');
  if (theme) return { kind: 'vocabTheme', theme };

  const industry = params.get('industry');
  if (industry) return { kind: 'examIndustry', industry };

  return null;
}

/** 쇼츠 설명란에 넣을 링크를 만든다. */
export function buildShareUrl(link: DeepLink, origin = window.location.origin): string {
  const url = new URL(origin);

  switch (link.kind) {
    case 'vocabWord':
      url.searchParams.set('q', `vocab:${link.word}`);
      break;
    case 'examQuestion':
      url.searchParams.set('q', `exam:${link.id}`);
      break;
    case 'vocabTheme':
      url.searchParams.set('theme', link.theme);
      break;
    case 'examIndustry':
      url.searchParams.set('industry', link.industry);
      break;
  }

  return url.toString();
}

/**
 * 링크로 들어온 뒤 주소창을 정리한다.
 * 사용자가 새로고침했을 때 같은 문항으로 되돌아가지 않도록.
 */
export function clearDeepLink(): void {
  if (typeof window === 'undefined') return;
  window.history.replaceState(null, '', window.location.pathname);
}
