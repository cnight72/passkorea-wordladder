import React from 'react';
import { COUNTRIES } from '../data/countries';

interface CountrySelectorProps {
  selectedCountry: string;
  onSelect: (countryCode: string) => void;
}

const CountrySelector: React.FC<CountrySelectorProps> = ({ selectedCountry, onSelect }) => {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-800">
        🌍 Select Country ({COUNTRIES.length})
      </label>
      <p className="text-xs text-gray-500 mb-3">국가 선택</p>

      <div className="bg-white rounded-lg border-2 border-blue-300 p-2 max-h-80 overflow-y-auto">
        <div className="grid grid-cols-1 gap-2">
          {COUNTRIES.map((country) => (
            <button
              key={country.code}
              onClick={() => onSelect(country.code)}
              className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center justify-between ${
                selectedCountry === country.code
                  ? 'bg-blue-500 text-white font-semibold'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{country.flag}</span>
                <div>
                  <p className="font-semibold text-sm">{country.name}</p>
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

      <p className="text-xs text-gray-600 text-center mt-3">
        Join your country&apos;s team on the leaderboard! 🏆
      </p>
      <p className="text-xs text-gray-400 text-center">
        국가를 선택하면 국가대항전에 참여합니다
      </p>
    </div>
  );
};

export default CountrySelector;
