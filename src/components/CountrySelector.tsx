import React from 'react';

const COUNTRIES = [
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

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelect }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-800">
        🌍 국가 선택 (17개)
      </label>

      <div className="bg-white rounded-lg border-2 border-blue-300 p-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect(country.code)}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center justify-between ${
                selectedCountry === country.code
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{country.flag}</span>
                <div>
                  <p className="font-semibold">{country.name}</p>
                  <p className="text-xs opacity-75">{country.nativeName}</p>
                </div>
              </div>
              {selectedCountry === country.code && (
                <span className="text-xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-gray-600 text-center">
        국가를 선택하면 리더보드에서 국가대항전에 참여합니다! 🏆
      </p>
    </div>
  );
};

export default CountrySelector;
