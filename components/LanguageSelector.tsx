import React, { useState } from 'react';
import Image from 'next/image';

const languages = [
  { code: 'en', name: 'English', flag: '/images/flags/us.png' },
  { code: 'es', name: 'Español', flag: '/images/flags/es.png' },
  { code: 'fr', name: 'Français', flag: '/images/flags/fr.png' },
  { code: 'de', name: 'Deutsch', flag: '/images/flags/de.png' },
  { code: 'it', name: 'Italiano', flag: '/images/flags/it.png' },
  { code: 'pt', name: 'Português', flag: '/images/flags/br.png' },
  { code: 'nl', name: 'Holandês', flag: '/images/flags/nl.png' },
];

interface LanguageSelectorProps {
  onSelectLanguage: (langCode: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelectLanguage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]); // Default to English

  const handleSelect = (language: typeof languages[0]) => {
    setSelectedLanguage(language);
    onSelectLanguage(language.code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image src={selectedLanguage.flag} alt={selectedLanguage.name} width={20} height={15} className="mr-2" />
          {selectedLanguage.name}
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {languages.map((language) => (
              <a
                key={language.code}
                href="#"
                className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100"
                role="menuitem"
                tabIndex={-1}
                id={`menu-item-${language.code}`}
                onClick={() => handleSelect(language)}
              >
                <Image src={language.flag} alt={language.name} width={20} height={15} className="inline-block mr-2" />
                {language.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;


