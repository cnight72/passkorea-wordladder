/** 복습 대상 한 건. 어휘와 직무 문항을 같은 형태로 담는다. */
export interface ReviewItem {
  /** 문항 식별자. 어휘는 'vocab:단어', 직무는 'exam:machinery-12' */
  id: string;
  kind: 'vocab' | 'exam';
  /** 화면에 크게 보여줄 것 (어휘는 단어, 직무는 지문) */
  prompt: string;
  /** 정답 */
  answer: string;
  /** 출처 표기 (어휘는 '40-1 혼합 및 측정', 직무는 '기계·금형 제조업') */
  source: string;
  /** 마지막으로 틀린 시각 */
  missedAt: number;
  /** 누적 오답 횟수 */
  missCount: number;
}

const STORAGE_KEY = 'passkorea.review';
/** 너무 많이 쌓이면 복습이 부담스러워지므로 상한을 둔다 */
const MAX_ITEMS = 200;

function read(): ReviewItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (i): i is ReviewItem =>
        i &&
        typeof i.id === 'string' &&
        typeof i.prompt === 'string' &&
        typeof i.answer === 'string'
    );
  } catch {
    return [];
  }
}

function write(items: ReviewItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // 저장이 막힌 환경에서는 복습 목록 없이 동작한다
  }
}

export function loadReviewItems(): ReviewItem[] {
  // 자주 틀린 것, 최근에 틀린 것 순
  return read().sort((a, b) => b.missCount - a.missCount || b.missedAt - a.missedAt);
}

export function reviewCount(): number {
  return read().length;
}

/** 틀린 문항을 복습 목록에 넣는다. 이미 있으면 횟수만 올린다. */
export function addMissed(entries: Omit<ReviewItem, 'missedAt' | 'missCount'>[]): void {
  if (entries.length === 0) return;

  const items = read();
  const byId = new Map(items.map((i) => [i.id, i]));
  const now = Date.now();

  for (const entry of entries) {
    const existing = byId.get(entry.id);
    if (existing) {
      existing.missCount += 1;
      existing.missedAt = now;
    } else {
      byId.set(entry.id, { ...entry, missedAt: now, missCount: 1 });
    }
  }

  const next = [...byId.values()]
    .sort((a, b) => b.missedAt - a.missedAt)
    .slice(0, MAX_ITEMS);

  write(next);
}

/** 복습에서 맞히면 목록에서 뺀다. */
export function clearMissed(id: string): void {
  write(read().filter((i) => i.id !== id));
}

export function clearAllMissed(): void {
  write([]);
}
