import React, { useEffect, useState } from 'react';
import type { DeepLink } from '../lib/deeplink';
import { buildQuestionForWord, getSection } from '../data/vocab';
import { loadQuestionById, getIndustry } from '../data/exams';
import { addMissed } from '../lib/review';

interface SharedQuestionProps {
  link: DeepLink;
  /** 이어서 전체 퀴즈로 넘어간다 */
  onContinue: () => void;
  onHome: () => void;
}

interface Loaded {
  prompt: string;
  choices: string[];
  answerIndex: number;
  source: string;
  /** 어휘는 단어가 짧아 크게, 직무는 지문이 길어 작게 */
  large: boolean;
  reviewId: string;
  kind: 'vocab' | 'exam';
}

/**
 * 쇼츠·틱톡에서 링크를 타고 들어온 사람에게 그 문항 하나만 먼저 보여준다.
 * 방금 본 영상의 문제를 바로 풀게 해서 앱으로 자연스럽게 넘어오도록 하는 화면.
 */
const SharedQuestion: React.FC<SharedQuestionProps> = ({ link, onContinue, onHome }) => {
  const [item, setItem] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<Loaded | null> => {
      if (link.kind === 'vocabWord') {
        const q = await buildQuestionForWord(link.word);
        if (!q) return null;
        const section = getSection(q.entry.section);
        return {
          prompt: q.entry.word,
          choices: q.choices,
          answerIndex: q.answerIndex,
          source: `${q.entry.section} ${section?.korean ?? ''}`.trim(),
          large: true,
          reviewId: `vocab:${q.entry.word}`,
          kind: 'vocab',
        };
      }

      if (link.kind === 'examQuestion') {
        const q = await loadQuestionById(link.id);
        if (!q) return null;
        return {
          prompt: q.question,
          choices: q.choices,
          answerIndex: q.answer,
          source: getIndustry(q.industry)?.korean ?? q.industry,
          large: false,
          reviewId: `exam:${q.id}`,
          kind: 'exam',
        };
      }

      return null;
    };

    load()
      .then((result) => {
        if (cancelled) return;
        if (result) setItem(result);
        else setFailed(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [link]);

  const answered = selected !== null;

  const handleAnswer = (index: number) => {
    if (answered || !item) return;
    setSelected(index);

    if (index !== item.answerIndex) {
      addMissed([
        {
          id: item.reviewId,
          kind: item.kind,
          prompt: item.prompt,
          answer: item.choices[item.answerIndex],
          source: item.source,
        },
      ]);
    }
  };

  if (failed) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center px-6">
          <p className="text-xl font-semibold text-gray-700">Question not found</p>
          <p className="text-sm text-gray-500 mb-5">문항을 찾을 수 없습니다</p>
          <button
            onClick={onHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            START STUDYING / 학습 시작
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Loading...</p>
          <p className="text-sm text-gray-500">불러오는 중</p>
        </div>
      </div>
    );
  }

  const isCorrect = selected === item.answerIndex;

  const choiceStyle = (index: number) => {
    if (!answered) return 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50';
    if (index === item.answerIndex) return 'bg-green-50 border-green-500 text-green-800';
    if (index === selected) return 'bg-red-50 border-red-500 text-red-800';
    return 'bg-white border-gray-200 text-gray-400';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-blue-100 to-white">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-5 px-4 text-center">
        <p className="text-sm opacity-90">📱 From the video</p>
        <p className="text-xs opacity-75">영상에서 본 문제</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-5 text-center">
          <span className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-4">
            {item.kind === 'vocab' ? '📖' : '🏭'} {item.source}
          </span>

          <p
            className={`font-bold text-blue-600 ${
              item.large ? 'text-5xl' : 'text-lg leading-relaxed text-left text-gray-800'
            }`}
          >
            {item.prompt}
          </p>
        </div>

        <div className="space-y-3 mb-5">
          {item.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={answered}
              className={`w-full text-left px-5 py-4 rounded-lg border-2 font-semibold transition ${choiceStyle(index)}`}
            >
              <span className="text-gray-500 mr-2">{'①②③④'[index]}</span>
              {choice}
            </button>
          ))}
        </div>

        {answered && (
          <>
            <div
              className={`rounded-lg p-4 mb-5 text-center ${
                isCorrect
                  ? 'bg-green-100 border-2 border-green-400'
                  : 'bg-red-100 border-2 border-red-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <p className="font-bold text-green-800">🎉 Correct!</p>
                  <p className="text-xs text-green-700">정답입니다</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-800">❌ Incorrect</p>
                  <p className="text-xs text-red-700">
                    Answer / 정답: {item.choices[item.answerIndex]}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={onContinue}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              MORE QUESTIONS →
              <span className="block text-xs font-normal text-blue-100">
                문제 더 풀기 — 무료, 설치 없이
              </span>
            </button>
          </>
        )}

        {!answered && (
          <p className="text-center text-sm text-gray-500">
            Choose the correct answer
            <span className="block text-xs text-gray-400">알맞은 답을 고르세요</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default SharedQuestion;
