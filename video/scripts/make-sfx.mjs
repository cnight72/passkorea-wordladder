/**
 * 효과음을 직접 만든다. 남의 음원을 받아 쓰면 출처·라이선스를 계속 관리해야 하는데,
 * 틱과 딩 정도는 사인파로 충분해서 그럴 이유가 없다.
 *
 *   node scripts/make-sfx.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const RATE = 44100;
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sfx');

/** 16bit 모노 PCM 으로 감싼다 */
function toWav(samples) {
  const data = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    data.writeInt16LE(Math.round(clamped * 32767), i * 2);
  }

  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + data.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // 모노
  header.writeUInt32LE(RATE, 24);
  header.writeUInt32LE(RATE * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(data.length, 40);

  return Buffer.concat([header, data]);
}

/** 여러 주파수를 겹치고 지수적으로 감쇠시킨다 */
function tone(seconds, freqs, decay) {
  const n = Math.round(seconds * RATE);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const envelope = Math.exp(-decay * t);
    let v = 0;
    for (const f of freqs) v += Math.sin(2 * Math.PI * f * t);
    out[i] = (v / freqs.length) * envelope * 0.6;
  }
  return out;
}

mkdirSync(OUT, { recursive: true });

// 카운트다운 틱 — 짧고 건조하게
writeFileSync(join(OUT, 'tick.wav'), toWav(tone(0.06, [1800], 60)));

// 정답 딩 — 도·미·솔을 얹은 밝은 화음
writeFileSync(join(OUT, 'ding.wav'), toWav(tone(0.9, [1046.5, 1318.5, 1568.0], 5)));

console.log('효과음 2개 → public/sfx/ (tick.wav, ding.wav)');
