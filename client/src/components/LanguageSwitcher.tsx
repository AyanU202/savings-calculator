import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ml', label: 'മലയാളം' },
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };
  
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={i18n.language === language.code ? "secondary" : "outline"}
          size="sm"
          className="px-3 py-1 rounded-md bg-white/20 hover:bg-white/30 text-white font-medium text-xs"
          onClick={() => changeLanguage(language.code)}
        >
          {language.label}
        </Button>
      ))}
    </div>
  );
}
