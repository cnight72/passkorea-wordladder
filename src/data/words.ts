export type CategoryId = 'safety' | 'work' | 'official' | 'health' | 'life';

export interface Category {
  id: CategoryId;
  english: string;
  korean: string;
  emoji: string;
}

/** EPS-TOPIK 출제 영역에 맞춘 어휘 분류 */
export const CATEGORIES: Category[] = [
  { id: 'safety', english: 'Safety & Work Site', korean: '안전·작업', emoji: '🦺' },
  { id: 'work', english: 'Employment', korean: '근로 조건', emoji: '📋' },
  { id: 'official', english: 'Documents & Public', korean: '서류·공공기관', emoji: '🏛️' },
  { id: 'health', english: 'Health & Hospital', korean: '병원·건강', emoji: '🏥' },
  { id: 'life', english: 'Daily Life', korean: '생활', emoji: '🏠' },
];

export interface WordEntry {
  /** 한국어 단어 */
  word: string;
  /** 영어 뜻 */
  english: string;
  /** 한국어 설명 */
  meaning: string;
  /** 출제 영역 */
  category: CategoryId;
}

type RawWord = Omit<WordEntry, 'category'>;

const SAFETY: RawWord[] = [
  { word: '안전', english: 'Safety', meaning: '다치지 않고 무사한 상태' },
  { word: '안전모', english: 'Safety helmet', meaning: '머리를 보호하는 작업용 모자' },
  { word: '위험', english: 'Danger', meaning: '다칠 수 있는 상태' },
  { word: '작업', english: 'Work, task', meaning: '일터에서 하는 일' },
  { word: '업무', english: 'Duty, business', meaning: '맡아서 하는 일' },
  { word: '공장', english: 'Factory', meaning: '물건을 만드는 곳' },
  { word: '장갑', english: 'Gloves', meaning: '손을 보호하는 물건' },
  { word: '장비', english: 'Equipment', meaning: '일할 때 쓰는 기구' },
  { word: '기계', english: 'Machine', meaning: '동력으로 움직이는 장치' },
  { word: '고장', english: 'Breakdown', meaning: '기계가 작동하지 않음' },
  { word: '사고', english: 'Accident', meaning: '뜻밖에 일어난 나쁜 일' },
  { word: '용접', english: 'Welding', meaning: '금속을 녹여 붙이는 작업' },
  { word: '접수', english: 'Reception', meaning: '서류나 신청을 받는 일' },
  { word: '소화기', english: 'Fire extinguisher', meaning: '불을 끄는 기구' },
  { word: '화재', english: 'Fire', meaning: '불이 나는 사고' },
  { word: '재해', english: 'Disaster', meaning: '큰 피해를 주는 사고' },
  { word: '비상구', english: 'Emergency exit', meaning: '위급할 때 나가는 문' },
  { word: '조심', english: 'Caution', meaning: '잘못되지 않게 주의함' },
  { word: '제조', english: 'Manufacturing', meaning: '물건을 만들어 냄' },
  { word: '제품', english: 'Product', meaning: '만들어 낸 물건' },
  { word: '품질', english: 'Quality', meaning: '물건의 좋고 나쁜 정도' },
  { word: '검사', english: 'Inspection', meaning: '이상이 없는지 살펴봄' },
  { word: '지시', english: 'Instruction', meaning: '무엇을 하라고 시킴' },
  { word: '금지', english: 'Prohibition', meaning: '하지 못하게 함' },
  { word: '경비', english: 'Security guard', meaning: '건물을 지키는 일이나 사람' },
  { word: '보호', english: 'Protection', meaning: '위험에서 지켜 줌' },
  { word: '자재', english: 'Materials', meaning: '물건을 만드는 데 쓰는 재료' },
  { word: '재고', english: 'Inventory', meaning: '창고에 남아 있는 물건' },
  { word: '화물', english: 'Freight, cargo', meaning: '차나 배로 나르는 짐' },
  { word: '사용', english: 'Use', meaning: '물건을 씀' },
  { word: '기온', english: 'Air temperature', meaning: '공기의 따뜻한 정도' },
  { word: '온도', english: 'Temperature', meaning: '덥고 찬 정도' },
];

const WORK: RawWord[] = [
  { word: '계약', english: 'Contract', meaning: '일할 조건을 정한 약속' },
  { word: '근무', english: 'Work duty', meaning: '직장에서 일함' },
  { word: '근처', english: 'Nearby', meaning: '가까운 곳' },
  { word: '출근', english: 'Going to work', meaning: '일하러 나감' },
  { word: '퇴근', english: 'Leaving work', meaning: '일을 마치고 돌아감' },
  { word: '야근', english: 'Overtime work', meaning: '밤늦게까지 일함' },
  { word: '조퇴', english: 'Early leave', meaning: '정한 시간보다 일찍 퇴근함' },
  { word: '월급', english: 'Monthly salary', meaning: '한 달마다 받는 돈' },
  { word: '급여', english: 'Pay, wages', meaning: '일한 대가로 받는 돈' },
  { word: '임금', english: 'Wages', meaning: '노동의 대가로 받는 돈' },
  { word: '수당', english: 'Allowance', meaning: '기본급 외에 더 받는 돈' },
  { word: '세금', english: 'Tax', meaning: '나라에 내는 돈' },
  { word: '휴가', english: 'Vacation', meaning: '쉬는 기간' },
  { word: '휴일', english: 'Holiday', meaning: '일하지 않고 쉬는 날' },
  { word: '노동', english: 'Labor', meaning: '몸을 써서 일함' },
  { word: '직업', english: 'Occupation', meaning: '생계를 위해 하는 일' },
  { word: '면접', english: 'Job interview', meaning: '만나서 평가받는 일' },
  { word: '해고', english: 'Dismissal', meaning: '회사에서 일을 그만두게 함' },
  { word: '고용', english: 'Employment', meaning: '사람을 일하게 함' },
  { word: '회사', english: 'Company', meaning: '일하는 곳' },
  { word: '회의', english: 'Meeting', meaning: '모여서 의논함' },
  { word: '사장', english: 'Boss, CEO', meaning: '회사를 대표하는 사람' },
  { word: '사원', english: 'Employee', meaning: '회사에서 일하는 사람' },
  { word: '사무실', english: 'Office', meaning: '일을 보는 방' },
  { word: '감독', english: 'Supervisor', meaning: '일을 살피고 지휘하는 사람' },
];

const OFFICIAL: RawWord[] = [
  { word: '서류', english: 'Documents', meaning: '글로 적은 문서' },
  { word: '문서', english: 'Document', meaning: '내용을 적어 놓은 종이' },
  { word: '서점', english: 'Bookstore', meaning: '책을 파는 가게' },
  { word: '증명서', english: 'Certificate', meaning: '사실을 증명하는 서류' },
  { word: '자격증', english: 'License', meaning: '자격을 인정하는 증서' },
  { word: '신분증', english: 'ID card', meaning: '신분을 확인하는 증서' },
  { word: '영수증', english: 'Receipt', meaning: '돈을 받았다는 증서' },
  { word: '신청', english: 'Application', meaning: '해 달라고 요청함' },
  { word: '확인', english: 'Confirmation', meaning: '틀림없는지 알아봄' },
  { word: '인사', english: 'Greeting', meaning: '만났을 때 하는 예의' },
  { word: '입국', english: 'Entry to a country', meaning: '나라 안으로 들어옴' },
  { word: '출입', english: 'Entering and leaving', meaning: '드나듦' },
  { word: '한국', english: 'Korea', meaning: '우리가 사는 나라' },
  { word: '통역', english: 'Interpretation', meaning: '말을 옮겨 전해 줌' },
  { word: '역사', english: 'History', meaning: '지나온 일의 기록' },
  { word: '무역', english: 'Trade', meaning: '나라 사이의 물건 거래' },
  { word: '은행', english: 'Bank', meaning: '돈을 맡기고 찾는 곳' },
  { word: '통장', english: 'Bankbook', meaning: '돈의 출입을 적는 장부' },
  { word: '주소', english: 'Address', meaning: '사는 곳의 위치' },
  { word: '시청', english: 'City hall', meaning: '시의 행정을 보는 곳' },
  { word: '문의', english: 'Inquiry', meaning: '궁금한 것을 물음' },
  { word: '소방서', english: 'Fire station', meaning: '불을 끄는 기관' },
  { word: '경찰', english: 'Police', meaning: '질서를 지키는 사람' },
  { word: '우편', english: 'Mail', meaning: '편지나 물건을 보내는 일' },
  { word: '편지', english: 'Letter', meaning: '소식을 적어 보내는 글' },
];

const HEALTH: RawWord[] = [
  { word: '병원', english: 'Hospital', meaning: '아픈 사람을 치료하는 곳' },
  { word: '원인', english: 'Cause', meaning: '일이 생긴 까닭' },
  { word: '의사', english: 'Doctor', meaning: '병을 고치는 사람' },
  { word: '간호사', english: 'Nurse', meaning: '환자를 돌보는 사람' },
  { word: '치과', english: 'Dental clinic', meaning: '이를 치료하는 병원' },
  { word: '약국', english: 'Pharmacy', meaning: '약을 파는 곳' },
  { word: '진통제', english: 'Painkiller', meaning: '아픔을 줄이는 약' },
  { word: '감기', english: 'A cold', meaning: '기침과 열이 나는 병' },
  { word: '독감', english: 'Influenza', meaning: '심한 감기' },
  { word: '두통', english: 'Headache', meaning: '머리가 아픈 증상' },
  { word: '건강', english: 'Health', meaning: '몸에 병이 없는 상태' },
  { word: '강사', english: 'Instructor', meaning: '가르치는 사람' },
  { word: '수술', english: 'Surgery', meaning: '몸을 째서 치료함' },
  { word: '처방', english: 'Prescription', meaning: '의사가 약을 정해 줌' },
  { word: '보험', english: 'Insurance', meaning: '사고에 대비하는 제도' },
  { word: '진료', english: 'Medical treatment', meaning: '의사가 병을 살핌' },
];

const LIFE: RawWord[] = [
  { word: '식당', english: 'Restaurant', meaning: '음식을 파는 곳' },
  { word: '식사', english: 'Meal', meaning: '끼니를 먹는 일' },
  { word: '음식', english: 'Food', meaning: '먹는 것' },
  { word: '음료수', english: 'Beverage', meaning: '마시는 것' },
  { word: '점심', english: 'Lunch', meaning: '낮에 먹는 밥' },
  { word: '심장', english: 'Heart', meaning: '피를 돌게 하는 기관' },
  { word: '편의점', english: 'Convenience store', meaning: '24시간 여는 작은 가게' },
  { word: '시장', english: 'Market', meaning: '물건을 사고파는 곳' },
  { word: '시간', english: 'Time', meaning: '흘러가는 때' },
  { word: '시계', english: 'Clock, watch', meaning: '시간을 알려 주는 물건' },
  { word: '계단', english: 'Stairs', meaning: '오르내리는 층계' },
  { word: '단추', english: 'Button', meaning: '옷을 채우는 물건' },
  { word: '추위', english: 'Cold weather', meaning: '기온이 낮아 추운 것' },
  { word: '위치', english: 'Location', meaning: '자리나 장소' },
  { word: '과일', english: 'Fruit', meaning: '나무에서 나는 먹을거리' },
  { word: '채소', english: 'Vegetable', meaning: '밭에서 기르는 먹을거리' },
  { word: '소금', english: 'Salt', meaning: '짠맛을 내는 조미료' },
  { word: '고기', english: 'Meat', meaning: '먹는 동물의 살' },
  { word: '당근', english: 'Carrot', meaning: '주황색 뿌리채소' },
  { word: '국수', english: 'Noodles', meaning: '밀가루로 만든 면 음식' },
  { word: '숙소', english: 'Lodging', meaning: '잠을 자는 곳' },
  { word: '기숙사', english: 'Dormitory', meaning: '함께 지내는 숙소' },
  { word: '학교', english: 'School', meaning: '공부하는 곳' },
  { word: '교통', english: 'Traffic', meaning: '사람과 차의 이동' },
  { word: '도시', english: 'City', meaning: '사람이 많이 사는 곳' },
  { word: '지도', english: 'Map', meaning: '땅의 모습을 그린 그림' },
  { word: '속도', english: 'Speed', meaning: '빠르기의 정도' },
  { word: '미용실', english: 'Hair salon', meaning: '머리를 손질하는 곳' },
  { word: '화장실', english: 'Restroom', meaning: '용변을 보는 곳' },
  { word: '실내', english: 'Indoors', meaning: '건물 안' },
  { word: '실수', english: 'Mistake', meaning: '잘못하여 그르침' },
  { word: '내용', english: 'Content', meaning: '안에 담긴 것' },
  { word: '내일', english: 'Tomorrow', meaning: '오늘의 다음 날' },
  { word: '청소', english: 'Cleaning', meaning: '깨끗하게 치움' },
  { word: '소식', english: 'News', meaning: '전해 오는 이야기' },
  { word: '건물', english: 'Building', meaning: '사람이 쓰는 구조물' },
  { word: '물건', english: 'Goods, thing', meaning: '쓰거나 파는 것' },
  { word: '방문', english: 'Visit', meaning: '찾아가 만남' },
  { word: '문제', english: 'Problem', meaning: '풀어야 할 일' },
  { word: '질문', english: 'Question', meaning: '모르는 것을 물음' },
  { word: '창문', english: 'Window', meaning: '빛과 바람이 드나드는 문' },
  { word: '난방', english: 'Heating', meaning: '실내를 따뜻하게 함' },
  { word: '주차장', english: 'Parking lot', meaning: '차를 세워 두는 곳' },
  { word: '정류장', english: 'Bus stop', meaning: '버스가 서는 곳' },
  { word: '자동차', english: 'Car', meaning: '스스로 달리는 탈것' },
  { word: '차비', english: 'Fare', meaning: '차를 타는 데 드는 돈' },
  { word: '기차', english: 'Train', meaning: '철길을 달리는 탈것' },
  { word: '택시', english: 'Taxi', meaning: '돈을 내고 타는 승용차' },
  { word: '지하철', english: 'Subway', meaning: '땅속을 달리는 전철' },
  { word: '비행기', english: 'Airplane', meaning: '하늘을 나는 탈것' },
  { word: '여행', english: 'Travel', meaning: '다른 곳에 다녀오는 일' },
  { word: '행복', english: 'Happiness', meaning: '기쁘고 만족한 상태' },
  { word: '복지', english: 'Welfare', meaning: '삶을 낫게 하는 제도' },
  { word: '운동', english: 'Exercise', meaning: '몸을 움직이는 활동' },
  { word: '동전', english: 'Coin', meaning: '쇠로 만든 돈' },
  { word: '전기', english: 'Electricity', meaning: '기계를 움직이는 힘' },
  { word: '전화', english: 'Telephone', meaning: '말로 연락하는 기계' },
  { word: '대화', english: 'Conversation', meaning: '서로 주고받는 말' },
  { word: '초대', english: 'Invitation', meaning: '오라고 청함' },
  { word: '침대', english: 'Bed', meaning: '누워 자는 가구' },
  { word: '책상', english: 'Desk', meaning: '앉아서 일하는 가구' },
  { word: '상자', english: 'Box', meaning: '물건을 담는 통' },
  { word: '모자', english: 'Hat', meaning: '머리에 쓰는 것' },
  { word: '자리', english: 'Seat', meaning: '앉는 곳' },
  { word: '가방', english: 'Bag', meaning: '물건을 넣어 드는 것' },
  { word: '지갑', english: 'Wallet', meaning: '돈을 넣는 물건' },
  { word: '갑자기', english: 'Suddenly', meaning: '생각할 새 없이 빠르게' },
  { word: '일기', english: 'Diary', meaning: '날마다 쓰는 기록' },
  { word: '수건', english: 'Towel', meaning: '물기를 닦는 천' },
  { word: '신발', english: 'Shoes', meaning: '발에 신는 것' },
  { word: '발음', english: 'Pronunciation', meaning: '소리를 내는 방법' },
  { word: '구두', english: 'Dress shoes', meaning: '가죽으로 만든 신발' },
  { word: '안경', english: 'Glasses', meaning: '눈에 쓰는 도구' },
  { word: '우산', english: 'Umbrella', meaning: '비를 막는 물건' },
  { word: '산책', english: 'Walk, stroll', meaning: '천천히 걷는 일' },
  { word: '선물', english: 'Gift', meaning: '남에게 주는 물건' },
  { word: '이불', english: 'Blanket', meaning: '덮고 자는 것' },
  { word: '불편', english: 'Inconvenience', meaning: '편하지 않음' },
  { word: '친구', english: 'Friend', meaning: '가깝게 지내는 사람' },
  { word: '누나', english: 'Older sister', meaning: '남자가 부르는 손위 여자 형제' },
  { word: '나이', english: 'Age', meaning: '살아온 햇수' },
  { word: '이사', english: 'Moving house', meaning: '사는 곳을 옮김' },
  { word: '사진', english: 'Photograph', meaning: '찍어서 남긴 모습' },
  { word: '세탁기', english: 'Washing machine', meaning: '빨래하는 기계' },
  { word: '냉장고', english: 'Refrigerator', meaning: '음식을 차게 보관하는 기계' },
  { word: '호수', english: 'Lake', meaning: '땅에 고인 큰 물' },
  { word: '번호', english: 'Number', meaning: '차례를 나타내는 수' },
  { word: '신호', english: 'Signal', meaning: '뜻을 전하는 표시' },
  { word: '남편', english: 'Husband', meaning: '결혼한 남자 배우자' },
  { word: '예약', english: 'Reservation', meaning: '미리 정해 두는 일' },
  { word: '약속', english: 'Promise', meaning: '미리 정한 다짐' },
  { word: '안내', english: 'Guidance', meaning: '길이나 방법을 알려 줌' },
  { word: '일요일', english: 'Sunday', meaning: '한 주의 첫날' },
  { word: '월요일', english: 'Monday', meaning: '일요일 다음 날' },
  { word: '화요일', english: 'Tuesday', meaning: '월요일 다음 날' },
  { word: '수요일', english: 'Wednesday', meaning: '화요일 다음 날' },
  { word: '목요일', english: 'Thursday', meaning: '수요일 다음 날' },
  { word: '금요일', english: 'Friday', meaning: '목요일 다음 날' },
  { word: '토요일', english: 'Saturday', meaning: '금요일 다음 날' },
  { word: '일주일', english: 'One week', meaning: '이레 동안' },
];

const withCategory = (words: RawWord[], category: CategoryId): WordEntry[] =>
  words.map((entry) => ({ ...entry, category }));

/** EPS-TOPIK 빈출 어휘 전체 */
export const WORDS: WordEntry[] = [
  ...withCategory(SAFETY, 'safety'),
  ...withCategory(WORK, 'work'),
  ...withCategory(OFFICIAL, 'official'),
  ...withCategory(HEALTH, 'health'),
  ...withCategory(LIFE, 'life'),
];

export function getWordsByCategory(category: CategoryId | 'all'): WordEntry[] {
  return category === 'all' ? WORDS : WORDS.filter((entry) => entry.category === category);
}

export function getCategory(id: CategoryId): Category | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export interface QuizQuestion {
  /** 문제로 낼 단어 */
  entry: WordEntry;
  /** 영어 뜻 보기 4개 */
  choices: string[];
  /** choices 안에서 정답 위치 */
  answerIndex: number;
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * 사지선다 문제를 만든다.
 * 오답 보기는 우선 같은 영역에서 뽑아 난이도를 유지하고,
 * 부족하면 전체 어휘에서 채운다.
 */
export function buildQuiz(count: number, category: CategoryId | 'all'): QuizQuestion[] {
  const pool = getWordsByCategory(category);
  const selected = shuffle(pool).slice(0, Math.min(count, pool.length));

  return selected.map((entry) => {
    const sameCategory = WORDS.filter(
      (w) => w.category === entry.category && w.english !== entry.english
    );
    const others = WORDS.filter(
      (w) => w.category !== entry.category && w.english !== entry.english
    );

    const distractors = [...shuffle(sameCategory), ...shuffle(others)]
      .reduce<string[]>((acc, w) => {
        if (acc.length < 3 && !acc.includes(w.english)) acc.push(w.english);
        return acc;
      }, []);

    const choices = shuffle([entry.english, ...distractors]);
    return { entry, choices, answerIndex: choices.indexOf(entry.english) };
  });
}
