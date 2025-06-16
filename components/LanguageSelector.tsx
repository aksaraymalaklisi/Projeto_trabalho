import React from 'react';

interface LanguageSelectorProps {
  onSelectLanguage: (langCode: string) => void;
}

const flagMap: { [key: string]: string } = {
  pt: "/images/flags/br.png",
  en: "/images/flags/us.png",
  es: "/images/flags/es.png",
  fr: "/images/flags/fr.png",
  nl: "/images/flags/nl.png",
  de: "/images/flags/de.png",
  it: "/images/flags/it.png",
};

const languages = [
  { code: 'pt', name: 'Português' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'nl', name: 'Holandês' },
  { code: 'de', name: 'Alemão' },
  { code: 'it', name: 'Italiano' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
  return (
    <div className="relative inline-block text-left">
      <select
        onChange={(e) => onSelectLanguage(e.target.value)}
        className="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
        style={{ backgroundImage: 'none', paddingRight: '1rem' }} // Remove default arrow
      >
        <option value="">Selecione o idioma</option>
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
};

export default LanguageSelector;


