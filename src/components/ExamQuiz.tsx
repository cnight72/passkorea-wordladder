import React, { useState, useEffect, useRef } from 'react';
import type { ExamQuestion, IndustryId } from '../data/exams';
import { getIndustry, loadQuestions } from '../data/exams';
import { addMissed } from '../lib/review';

/** 직무 문항은 지문이 길어 어휘 퀴즈보다 넉넉하게 준다 */
const TIME_LIMIT = 40;

interface ExamQuizProps {
  industry: IndustryId;
  /** 푼 만큼 점수를 남기고 끝낸다 */
  onGameEnd: (score: number, correctLabels: string[]) => void;
  onCancel: () => void;
  onSettings: () => void;
}

function shuffle(pool: ExamQuestion[]): ExamQuestion[] {
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const ExamQuiz: React.FC<ExamQuizProps> = ({ industry, onGameEnd, onCancel, onSettings }) => {
  const [questions, setQuestions] = useState<ExamQuestion[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [correctLabels, setCorrectLabels] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  const info = getIndustry(industry);
  const question = questions?.[index];
  const isAnswered = selected !== null;

  // 같은 문항을 두 번 기록하지 않도록 (StrictMode 이중 실행 포함) 방어한다
  const recorded = useRef<Set<number>>(new Set());

  // 틀린 문항은 즉시 복습 목록에 넣는다. 중간에 그만둬도 남는다.
  useEffect(() => {
    if (selected === null || !question) return;
    if (selected === question.answer) return;
    if (recorded.current.has(index)) return;

    recorded.current.add(index);
    addMissed([
      {
        id: `exam:${question.id}`,
        kind: 'exam',
        prompt: question.question,
        answer: question.choices[question.answer],
        source: info?.korean ?? industry,
      },
    ]);
  }, [selected, question, index, info, industry]);

  // 업종별 문항은 별도 번들이라 비동기로 받아온다. 전부 섞어두고 끝까지 이어서 푼다.
  useEffect(() => {
    let cancelled = false;

    loadQuestions(industry)
      .then((all) => {
        if (cancelled) return;
        setQuestions(shuffle(all));
        setIndex(0);
        setSelected(null);
        setTimeLeft(TIME_LIMIT);
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [industry]);

  useEffect(() => {
    if (isAnswered || !question) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          setSelected(-1); // 시간 초과 = 오답
          return 0;
        }
        return Math.round((prev - 0.1) * 10) / 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isAnswered, question]);

  const handleAnswer = (choiceIndex: number) => {
    if (isAnswered || !question) return;
    setSelected(choiceIndex);
    setAnswered((prev) => prev + 1);

    if (choiceIndex === question.answer) {
      const timeBonus = timeLeft >= 30 ? 30 : timeLeft >= 20 ? 20 : timeLeft >= 10 ? 10 : 0;
      setScore((prev) => prev + 50 + timeBonus);
      setCorrectLabels((prev) => [...prev, `${info?.emoji ?? ''}${question.number}`]);
    }
  };

  /** 업종의 문항을 다 풀면 다시 섞어 이어간다 */
  const handleNext = () => {
    if (questions && index + 1 >= questions.length) {
      setQuestions(shuffle(questions));
      recorded.current.clear();
      setIndex(0);
    } else {
      setIndex((prev) => prev + 1);
    }
    setSelected(null);
    setTimeLeft(TIME_LIMIT);
  };

  /** 언제 그만둬도 그때까지 푼 만큼 점수가 남는다 */
  const handleStop = () => {
    if (answered > 0) onGameEnd(score, correctLabels);
    else onCancel();
  };

  if (loadFailed) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center px-6">
          <p className="text-xl font-semibold text-gray-700">Failed to load questions</p>
          <p className="text-sm text-gray-500 mb-4">문항을 불러오지 못했습니다</p>
          <button
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition"
          >
            HOME / 홈으로
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-full flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">Loading questions...</p>
          <p className="text-sm text-gray-500">문항을 불러오는 중</p>
        </div>
      </div>
    );
  }

  const isCorrect = selected === question.answer;

  const choiceStyle = (choiceIndex: number) => {
    if (!isAnswered) return 'bg-white border-gray-300 hover:border-indigo-500 hover:bg-indigo-50';
    if (choiceIndex === question.answer) return 'bg-green-50 border-green-500 text-green-800';
    if (choiceIndex === selected) return 'bg-red-50 border-red-500 text-red-800';
    return 'bg-white border-gray-200 text-gray-400';
  };

  return (
    <div className="min-h-full bg-gradient-to-b from-indigo-100 to-white">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-4">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <button
            onClick={onSettings}
            className="text-2xl leading-none opacity-90 hover:opacity-100 transition"
            aria-label="Settings"
          >
            ⚙
          </button>
          <div className="text-center">
            <p className="text-xs opacity-90">📊 Score</p>
            <p className="text-xl font-bold">{score.toLocaleString()}</p>
          </div>
          <div className="text-center">
            <p className="text-xs opacity-90">Solved</p>
            <p className="text-xl font-bold">{answered}</p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-90">⏱️</p>
            <p className={`text-xl font-bold ${timeLeft <= 10 ? 'text-yellow-300' : ''}`}>
              {Math.ceil(timeLeft)}s
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-lg p-5 mb-5">
          {info && (
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              {info.emoji} {info.english}
            </span>
          )}
          <p className="text-lg font-semibold text-gray-800 leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-3 mb-5">
          {question.choices.map((choice, choiceIndex) => (
            <button
              key={choiceIndex}
              onClick={() => handleAnswer(choiceIndex)}
              disabled={isAnswered}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 font-medium transition ${choiceStyle(choiceIndex)}`}
            >
              <span className="text-gray-500 mr-2">{'①②③④'[choiceIndex]}</span>
              {choice}
            </button>
          ))}
        </div>

        {isAnswered && (
          <>
            <div
              className={`rounded-lg p-4 mb-4 text-center ${
                isCorrect ? 'bg-green-100 border-2 border-green-400' : 'bg-red-100 border-2 border-red-400'
              }`}
            >
              {isCorrect ? (
                <>
                  <p className="font-bold text-green-800">🎉 Correct!</p>
                  <p className="text-xs text-green-700">정답입니다</p>
                </>
              ) : (
                <>
                  <p className="font-bold text-red-800">
                    {selected === -1 ? "⏰ Time's up!" : '❌ Incorrect'}
                  </p>
                  <p className="text-xs text-red-700">
                    정답: {'①②③④'[question.answer]} {question.choices[question.answer]}
                  </p>
                </>
              )}
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
            >
              NEXT →
              <span className="block text-xs font-normal text-indigo-100">다음 문제</span>
            </button>
          </>
        )}

        <button
          onClick={handleStop}
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 px-4 rounded-lg transition"
        >
          {answered > 0 ? 'STOP & SAVE' : 'BACK'}
          <span className="block text-xs font-normal text-gray-500">
            {answered > 0 ? '그만하기 — 여기까지 점수가 저장됩니다' : '뒤로'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ExamQuiz;
