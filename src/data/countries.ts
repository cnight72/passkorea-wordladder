export interface Country {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

export const COUNTRIES: Country[] = [
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', nativeName: 'नेपाल' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', nativeName: 'Indonesia' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', nativeName: 'Pilipinas' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', nativeName: 'Việt Nam' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', nativeName: 'မြန်မာ' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', nativeName: 'ไทย' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', nativeName: 'ລາວ' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', nativeName: 'កម្ពុជា' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', nativeName: 'বাংলাদেশ' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', nativeName: 'پاکستان' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', nativeName: 'ශ්‍රී ලංකා' },
  { code: 'CN', name: 'China', flag: '🇨🇳', nativeName: '中国' },
  { code: 'IN', name: 'India', flag: '🇮🇳', nativeName: 'भारत' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', nativeName: 'Oʻzbekiston' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', nativeName: 'Кыргызстан' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', nativeName: 'Тоҷикистон' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', nativeName: 'Türkmenistan' },
];
