/**
 * 퀴즈 앱에서 마케팅 사이트의 모의고사로 보내는 유일한 통로.
 *
 * 쇼츠 → 채널 프로필 링크 → 이 앱으로 바로 들어오는 사람은 40문항 모의고사가
 * 있다는 것을 알 방법이 없다(앱은 무한 모드라 문제만 계속 나온다).
 * `?from=quiz` 는 마케팅 사이트 GA 에서 이 경로로 온 사람을 세기 위한 것이다.
 */
const MOCK_TEST_URL = 'https://pass-korea.com/?from=quiz';

const MockTestCta: React.FC = () => (
  <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-5 text-center">
    <p className="text-3xl mb-2">📝</p>
    <p className="text-sm font-bold text-indigo-900">Ready for the real exam?</p>
    <p className="text-xs text-gray-600 mb-1">실제 시험도 풀어보세요</p>
    <p className="text-xs text-gray-600 mb-4">
      40 questions with English explanations. Free, no sign-up.
      <span className="block text-gray-500">영어 해설이 있는 40문항 모의고사. 무료, 가입 불필요.</span>
    </p>
    <a
      href={MOCK_TEST_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition"
    >
      TAKE THE MOCK TEST →
      <span className="block text-xs font-normal text-indigo-100">모의고사 풀기</span>
    </a>
  </div>
);

export default MockTestCta;
