import React from 'react';
import { TOTAL_WORDS } from '../data/vocab';
import { TOTAL_QUESTIONS } from '../data/exams';

interface AboutScreenProps {
  onBack: () => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-full bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-slate-800 text-white py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">About PassKorea</h1>
          <p className="text-slate-300 text-sm">앱 정보 및 출처</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        <section className="bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-gray-800 mb-1">What this is</h2>
          <p className="text-xs text-gray-500 mb-3">이 앱은</p>
          <p className="text-sm text-gray-700">
            A free study tool for people preparing for the EPS-TOPIK
            (Employment Permit System — Test of Proficiency in Korean).
          </p>
          <p className="text-xs text-gray-500 mt-2">
            고용허가제 한국어능력시험(EPS-TOPIK)을 준비하는 분들을 위한 무료 학습 도구입니다.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-gray-800 mb-1">Sources</h2>
          <p className="text-xs text-gray-500 mb-3">자료 출처</p>

          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold text-gray-800">
                📖 Vocabulary — {TOTAL_WORDS.toLocaleString()} words
              </p>
              <p className="text-xs text-gray-600 mt-1">
                고용허가제 한국어능력시험(EPS-TOPIK) NEW 한국어 표준교재
              </p>
              <p className="text-xs text-gray-500">
                한국산업인력공단 발행 (2024. 11. 30.)
              </p>
              <p className="text-xs text-gray-500">
                1권 일상생활 한국어 ISBN 979-11-5799-622-3
              </p>
              <p className="text-xs text-gray-500">
                2권 직장생활 한국어 ISBN 979-11-5799-623-0
              </p>
            </div>

            <div>
              <p className="font-semibold text-gray-800">
                🏭 Job Skills — {TOTAL_QUESTIONS.toLocaleString()} questions
              </p>
              <p className="text-xs text-gray-600 mt-1">
                특별 한국어능력시험 직무문항 공개문제 (2025)
              </p>
              <p className="text-xs text-gray-500">한국산업인력공단 공개 자료</p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-700 font-semibold">
              Copyright of these materials belongs to HRD Korea.
            </p>
            <p className="text-xs text-gray-600">
              위 자료의 저작권은 한국산업인력공단에 있습니다.
            </p>
            <a
              href="https://eps.hrdkorea.or.kr"
              target="_blank"
              rel="noreferrer"
              className="inline-block text-xs text-blue-600 underline mt-2"
            >
              eps.hrdkorea.or.kr — official EPS site
            </a>
          </div>
        </section>

        <section className="bg-amber-50 border-2 border-amber-300 rounded-lg p-5">
          <h2 className="font-bold text-amber-900 mb-1">Not an official service</h2>
          <p className="text-xs text-amber-800 mb-3">공식 서비스가 아닙니다</p>
          <p className="text-sm text-gray-800">
            This app is not affiliated with, endorsed by, or operated by HRD Korea
            or the Ministry of Employment and Labor. Always check the official site
            for exam schedules and rules.
          </p>
          <p className="text-xs text-gray-600 mt-2">
            이 앱은 한국산업인력공단·고용노동부와 무관한 개인 학습 도구입니다.
            시험 일정과 규정은 반드시 공식 사이트에서 확인하세요.
          </p>
        </section>

        <section className="bg-white rounded-lg shadow p-5">
          <h2 className="font-bold text-gray-800 mb-1">Your data</h2>
          <p className="text-xs text-gray-500 mb-3">저장되는 정보</p>

          <ul className="text-sm text-gray-700 space-y-2">
            <li>
              Your name, country, scores and review list are kept
              <strong> on this device only</strong>.
              <span className="block text-xs text-gray-500">
                이름·국가·점수·복습 목록은 이 기기에만 저장됩니다.
              </span>
            </li>
            <li>
              For the leaderboard, only your name, country and best score are sent,
              with an anonymous ID. No sign-in, no email, no personal details.
              <span className="block text-xs text-gray-500">
                리더보드를 위해 이름·국가·최고 점수만 익명 ID와 함께 전송됩니다.
                로그인·이메일·개인정보는 수집하지 않습니다.
              </span>
            </li>
            <li>
              Clearing your browser data removes everything.
              <span className="block text-xs text-gray-500">
                브라우저 데이터를 지우면 기록도 함께 사라집니다.
              </span>
            </li>
          </ul>
        </section>

        <button
          onClick={onBack}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          ← BACK
          <span className="block text-xs font-normal text-gray-200">뒤로가기</span>
        </button>
      </div>
    </div>
  );
};

export default AboutScreen;
