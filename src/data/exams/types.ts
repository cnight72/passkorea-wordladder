/** 생성 파일에 담기는 압축 형태 (n=문항번호, q=지문, c=보기, a=정답 인덱스) */
export interface RawExamQuestion {
  n: number;
  q: string;
  c: string[];
  a: number;
}
